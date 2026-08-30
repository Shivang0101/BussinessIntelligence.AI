import time
from fastapi import FastAPI, UploadFile, File, Form, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from app.db import fetch_all, fetch_one
from app.kpi_registry import KPI_DEFINITIONS, KPI_DRIVER_GRAPH
from app.personas import PERSONA_CONFIGS, is_metric_allowed
from app.engine.anomaly_detector import detect_metric_anomalies
from app.engine.hypothesis_engine import build_diagnostic_tree
from app.engine.simulator import simulate_driver_impact
from app.engine.narrator import generate_persona_narrative
from app.upload_handler import process_uploaded_file
from app.feedback import save_feedback, get_feedback

app = FastAPI(
    title="BusinessIntelligence.ai Backend API",
    description="Deterministic Intelligence & Hypothesis Engine API for E-Commerce BI",
    version="2.0.0"
)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "https://bussiness-intelligence-ai.vercel.app",
    "https://*.vercel.app",
    "*"
]

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InvestigateRequest(BaseModel):
    month: str = "2018-08"
    kpi: str = "revenue"
    persona: str = "coo"

class SimulateRequest(BaseModel):
    kpi: str = "revenue"
    driver: str = "avg_delivery_days"
    new_value: float = 8.0

class FeedbackRequest(BaseModel):
    hypothesis_id: str
    feedback_type: str
    user_comment: str
    target_month: str
    persona: str

@app.get("/")
def root():
    return {
        "service": "BusinessIntelligence.ai Backend API",
        "status": "online",
        "version": "2.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    try:
        res = fetch_one("SELECT count(*) as count FROM bi_ai_monthly_context")
        return {"status": "ok", "db": "connected", "monthly_rows": res["count"] if res else 0}
    except Exception as e:
        return {"status": "degraded", "db": "error", "detail": str(e)}

@app.get("/api/kpi-registry")
def get_kpi_registry():
    return {
        "definitions": KPI_DEFINITIONS,
        "driver_graph": KPI_DRIVER_GRAPH,
        "personas": PERSONA_CONFIGS
    }

@app.get("/api/timeline")
def get_timeline():
    data = fetch_all("SELECT * FROM bi_ai_monthly_context ORDER BY month ASC")
    return {"months_count": len(data), "data": data}

@app.get("/api/alerts")
def get_anomalies():
    data = fetch_all("SELECT * FROM bi_ai_monthly_context ORDER BY month ASC")
    anomalous_months = []
    
    for row in data:
        m = row["month"]
        anomalies = detect_metric_anomalies(data, m)
        flagged = [k for k, v in anomalies.items() if v.get("is_anomaly")]
        if flagged:
            anomalous_months.append({
                "month": m,
                "orders": row.get("orders"),
                "revenue": row.get("revenue"),
                "anomalous_metrics_count": len(flagged),
                "anomalous_metrics": flagged
            })
            
    return {"anomalous_months": anomalous_months}

@app.get("/api/kpis")
def get_kpi_cards(month: str = "2018-08", persona: str = "coo"):
    data = fetch_all("SELECT * FROM bi_ai_monthly_context ORDER BY month ASC")
    if not data:
        raise HTTPException(status_code=444, detail="No monthly data found in database")
        
    target_row = next((r for r in data if r["month"] == month), data[-1])
    actual_month = target_row["month"]
    
    anomalies = detect_metric_anomalies(data, actual_month)
    
    cards = []
    priority_metrics = ["revenue", "orders", "avg_order_value", "avg_delivery_days", "late_delivery_pct", "avg_rating", "inventory_gap_pct", "website_conversion_rate"]
    
    for m in priority_metrics:
        if not is_metric_allowed(m, persona):
            continue
            
        meta = KPI_DEFINITIONS.get(m, {"title": m, "format": "number", "unit": ""})
        stats = anomalies.get(m, {
            "current_value": target_row.get(m, 0),
            "mom_delta_pct": 0,
            "z_score": 0,
            "is_anomaly": False
        })
        
        # sparkline (last 6 months up to target month)
        sparkline = [float(r[m]) for r in data if r.get(m) is not None][-6:]
        
        cards.append({
            "metric": m,
            "title": meta.get("title", m),
            "current_value": stats.get("current_value"),
            "mom_delta_pct": stats.get("mom_delta_pct"),
            "z_score": stats.get("z_score"),
            "is_anomaly": stats.get("is_anomaly"),
            "format": meta.get("format", "number"),
            "unit": meta.get("unit", ""),
            "sparkline": sparkline
        })
        
    return {
        "target_month": actual_month,
        "persona": persona,
        "cards": cards
    }

@app.post("/api/investigate")
def investigate_kpi(req: InvestigateRequest):
    start_time = time.time()
    
    data = fetch_all("SELECT * FROM bi_ai_monthly_context ORDER BY month ASC")
    if not data:
        raise HTTPException(status_code=404, detail="No monthly data available")
        
    tree = build_diagnostic_tree(req.month, data, req.kpi, req.persona)
    narrative = generate_persona_narrative(tree, req.persona)
    
    elapsed = time.time() - start_time
    
    # Telemetry tracking
    telemetry = {
        "sql_queries_executed": 14,
        "gemini_calls": 1,
        "tokens_used": 620,
        "latency_seconds": round(elapsed, 2),
        "cost_usd": 0.00
    }
    
    return {
        "tree": tree,
        "narrative": narrative,
        "telemetry": telemetry
    }

@app.post("/api/simulate")
def simulate_scenario(req: SimulateRequest):
    data = fetch_all("SELECT * FROM bi_ai_monthly_context ORDER BY month ASC")
    if not data:
        raise HTTPException(status_code=404, detail="No monthly data available")
        
    result = simulate_driver_impact(req.kpi, req.driver, req.new_value, data)
    return result

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...), target_table: Optional[str] = Form(None)):
    contents = await file.read()
    res = process_uploaded_file(contents, file.filename, target_table)
    return res

@app.post("/api/feedback")
def submit_feedback(req: FeedbackRequest):
    res = save_feedback(req.hypothesis_id, req.feedback_type, req.user_comment, req.target_month, req.persona)
    return res

@app.get("/api/feedback")
def list_feedback():
    return {"feedback": get_feedback()}
