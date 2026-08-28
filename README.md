# BusinessIntelligence.ai — KPI Intelligence & Action Engine (v2)

> **From Raw Metrics to Deterministic Root-Cause Action**  
> A production-ready enterprise BI diagnostic platform that connects to live transactional databases (~300K rows), runs a 100% deterministic statistical engine to detect anomalies, traverses causal driver graphs, tests hypotheses via a 5-point test battery, and renders an interactive **Diagnostic Tree** with persona-tailored executive summaries.

---

## 🚀 Why BusinessIntelligence.ai?

Traditional BI dashboards show **what** changed (e.g., *"Revenue dropped 4.6%"*), but leave business leaders guessing **why** it happened and **what to do next**. 

**BusinessIntelligence.ai** bridges the gap from **intelligence to action**:
1. **Zero Hallucination Guarantee**: All anomaly detection, causal ranking, contribution math, and hypothesis testing are executed by a **pure Python/SQL statistical engine** (no LLMs used for logic).
2. **Generative Polish**: LLM (Gemini 2.5 Flash) is used **only at the final layer** to synthesize proven quantitative facts into executive briefing narratives.
3. **Interactive Diagnostic Tree**: Decomposes top-level KPI failures into sub-driver branches with exact mathematical contribution %, confidence scores, and raw SQL evidence cards.
4. **Live Data Ingestion**: Drag-and-drop CSV or ZIP archives to upsert raw order transactions and re-analyze newly added months in real-time.

---

## 📊 Enterprise Benchmark Baseline (Live Supabase Dataset)

Connected to live PostgreSQL on Supabase storing **~300,000 records** of Brazilian E-Commerce (Olist) data spanning 26 months (Sep 2016 → Oct 2018).

| Table | Rows | Grain | Type |
|-------|------|-------|------|
| `olist_orders` | 99,441 | Per-order purchase & shipping status | Real Transactional |
| `olist_order_items` | 112,650 | Per-item price, freight, seller | Real Transactional |
| `olist_order_reviews` | 99,224 | Customer ratings (1-5) & unstructured text | Real Text / Feedback |
| `olist_monthly_real_metrics` | 26 | Monthly order counts, revenue, delivery times | Real Aggregated |
| `synthetic_monthly_business_context` | 26 | Ad spend, visits, competitor discounts | Synthetic Benchmark |
| `bi_ai_monthly_context` | 26 | Joined 25-column metric context dataset | Combined Model |

### 🎯 Target Month Benchmark Case: August 2018 (Last Full Operational Month)

When August 2018 is evaluated against historical rolling 6-month baselines, the engine produces the following exact measurements:

```
📊 August 2018 Operational Performance Snapshot:
├── 🔴 Gross Revenue: R$854,686.33 (↓ 4.56% MoM, z = -1.18 ⚠️ Anomaly Flagged)
├── 🟢 Order Volume: 6,512 orders (↑ 3.50% MoM, z = -0.52 — Healthy Demand)
├── 🔴 Average Order Value (AOV): R$132.47 (↓ 7.21% MoM, z = -1.04 ⚠️ Main Driver of Revenue Drop)
├── 🟢 Average Delivery Time: 7.73 days (↓ 13.68% MoM improvement, z = -1.48)
├── 🟡 Late Delivery Rate: 10.39% (↑ 5.9pp MoM spike vs 4.48% in July 2018)
├── 🔴 Inventory Gap: 27.90% (↑ 2.20% MoM, z = +2.27 ⚠️ High Inventory Stress)
└── 🟢 Customer Review Rating: 4.26 / 5.0 (Stable)
```

---

## 🌳 Diagnostic Causal Tree Breakdown (August 2018 Analysis)

Selecting **August 2018** in the dashboard generates the following hierarchical diagnostic tree:

```text
📊 August 2018 Diagnostic Report
│
├── 🔴 Revenue R$854,686 (↓ 4.6% MoM, z = -1.18)
│   ├── 📈 Volume Effect: Orders 6,512 (+3.5% MoM) → +R$31,000 offsetting revenue
│   │   ├── ✅ Website Visits: 311,148 (↓ 1.5%) — 8.0% contribution
│   │   │   └── 📎 E1: Marketing ad spend R$323K → R$311K (↓ 3.7%) [SQL FACT]
│   │   └── ✅ Conversion Rate: 2.40% (↓ 0.30pp) — 12.0% contribution
│   │       └── 📎 E2: Product availability dropped to 50.8% [SQL FACT]
│   │
│   ├── 🔴 Price Effect: AOV R$132.47 (↓ 7.2% MoM) → −R$72,000 ⚠️ MAIN DRIVER
│   │   ├── 🔴 Avg Item Price: ↓ 7.6% MoM — 34.0% contribution (78.0% Confidence)
│   │   │   ├── 📎 E3: avg_item_price dropped from R$142.76 → R$132.47 [SQL FACT]
│   │   │   ├── 📎 E4: competitor_discount_pct spiked to 26.1% (+3.2pp) [SQL FACT]
│   │   │   ├── 📎 E5: competitor_pressure_index rose to 69.0 pts (+9.6pts) [SQL FACT]
│   │   │   HYPOTHESIS: "AOV declined because competitive pressure forced price matching. 
│   │   │   Competitor discounts rose 3.2pp in the same period."
│   │   │   VALIDATION: temporal✅ direction✅ magnitude✅ counterfactual⚠️ evidence density✅
│   │   │   CONFIDENCE: 78% (counterfactual weakened: Jul 2017 had similar pressure but AOV held)
│   │   │
│   │   └── 🟡 Product Mix Shift: 14.0% contribution (55.0% Confidence)
│   │       └── 📎 E6: Lower average price point across top categories [SQL INFERENCE]
│   │
│   ├── 🟡 Delivery Quality Degradation: 18.0% contribution (72.0% Confidence)
│   │   ├── 📎 E7: late_delivery_pct 10.39% (↑ 5.9pp MoM spike!) [SQL FACT]
│   │   ├── 📎 E8: Customer reviews contained 412 explicit delivery delay keywords [SQL TEXT AGG]
│   │   └── 📎 E9: Support ticket volume reached 1,091 tickets [SQL FACT]
│   │   HYPOTHESIS: "Late delivery spikes damaged customer repeat purchase frequency."
│   │
│   └── ❓ Don't-Know Residual: 14.0%
│       └── "14.0% of revenue decline is attributed to unmeasured factors (macro shifts, 
│           unrecorded promotion tags, or market anomalies)."
```

---

## 🔬 The 5-Point Deterministic Test Battery

Every candidate hypothesis is automatically tested against a **5-point statistical validation battery**:

1. **Temporal Co-occurrence (SQL)**: Verifies driver shift occurred within the anomaly timeframe ($\Delta \ge 1\%$).
2. **Direction Consistency (Stats)**: Computes Pearson correlation ($r$) across historical series and checks sign alignment ($+$ or $-$) against domain graph rules.
3. **Magnitude Proportionality (Regression)**: Fits an OLS linear regression model ($\hat{y} = \beta X + \alpha$) to verify driver movement explains $\ge 25\%$ of KPI delta.
4. **Counterfactual Check (Falsification)**: Queries history for months where driver was similarly shifted but KPI remained normal ($|z| < 1.0$) to penalize false positives.
5. **Evidence Density (SQL + Keyword)**: Verifies presence of $\ge 2$ independent SQL facts, review keyword counts (`atraso`, `demora`, `entrega`), or ticket logs.

### 🛡️ Sample-Size Abstention Safeguard
If a selected month has **fewer than 500 orders** (e.g., September 2018 with 16 orders or September 2016 with 4 orders), the engine **suspends statistical analysis** and emits an abstention warning:
> `⛔ ABSTAIN — Sample size of 16 orders is below minimum statistical threshold (500 orders). Statistical analysis suspended to prevent false positives.`

---

## 🛠️ Tech Stack & Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                  FRONTEND (Vite + React)                      │
│  Port 5173 • Dark Glassmorphic Theme                         │
│                                                              │
│  ├── TopBar (Persona Switcher, Period Selector, CSV Upload)  │
│  ├── KPICards (7 Metric Summary Cards with Sparklines)       │
│  ├── DiagnosticTree (Interactive Collapsible Tree & Nodes)   │
│  ├── EvidenceCard (SQL Lineage & Fact Badges)               │
│  ├── HypothesisTestResults (5-Point Test Battery Visualization)│
│  ├── WhatIfSimulator (Interactive OLS Slider Simulator)       │
│  ├── NarrativePanel (Gemini 2.5 Executive Briefing)           │
│  ├── TimelineCharts (26-Month Recharts Series)                │
│  └── TelemetryBar (SQL Queries, Latency, Tokens, Cost)       │
└─────────────────────────┬────────────────────────────────────┘
                          │ REST HTTP
┌─────────────────────────▼────────────────────────────────────┐
│                  BACKEND (FastAPI) Port 8000                  │
│                                                              │
│  Endpoints:                                                  │
│  ├── GET  /health                      Database healthcheck  │
│  ├── GET  /api/kpis                    Metric summary cards  │
│  ├── GET  /api/alerts                  All anomalous months  │
│  ├── POST /api/investigate             Full Diagnostic Tree  │
│  ├── POST /api/simulate                OLS What-If scenario  │
│  ├── GET  /api/timeline                26-month time series  │
│  ├── POST /api/upload                  CSV/ZIP ingestion     │
│  └── POST /api/feedback                Analyst feedback log  │
│                                                              │
│  Engine Modules:                                             │
│  ├── anomaly_detector.py    Z-score rolling 6mo baseline     │
│  ├── hypothesis_engine.py   Recursive tree traversal        │
│  ├── hypothesis_tester.py   5-point test battery             │
│  ├── driver_ranker.py       Additive/Multiplicative math     │
│  ├── evidence_collector.py  SQL queries & review keywords    │
│  ├── reverse_checker.py     Counterfactual falsification     │
│  ├── simulator.py           OLS linear regression engine     │
│  └── narrator.py            Gemini API executive polish      │
└─────────────────────────┬────────────────────────────────────┘
                          │ psycopg2
┌─────────────────────────▼────────────────────────────────────┐
│              SUPABASE POSTGRESQL (Live)                       │
│  6 Tables, ~300,000 Records of E-Commerce Data               │
└──────────────────────────────────────────────────────────────┘
```

---

## 💻 Quick Start & Deployment Guide

### Option 1: Docker Compose (1-Command Startup)

```bash
# Clone repository
git clone https://github.com/your-username/BusinessIntelligence.ai.git
cd BusinessIntelligence.ai

# Build and launch backend + frontend containers
docker compose up --build
```
- **Frontend Dashboard**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000`
- **API Interactive Documentation**: `http://localhost:8000/docs`

---

### Option 2: Manual Local Development

#### 1. Backend Setup (FastAPI)
```bash
cd Backend

# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI dev server
uvicorn app.main:app --port 8000 --reload
```

#### 2. Frontend Setup (React + Vite)
```bash
cd Frontend

# Install node dependencies
npm install

# Start Vite dev server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🎭 Persona Column Entitlements Security

The platform dynamically enforces **column-level entitlements** based on user role:

| Feature / Metric | COO (Operations) | CMO (Marketing) | Executive GM |
|------------------|------------------|-----------------|--------------|
| **Delivery Time & Late %** | ✅ Allowed | ❌ Hidden | ✅ Allowed |
| **Inventory Gap & Stockouts** | ✅ Allowed | ❌ Hidden | ✅ Allowed |
| **Ad Spend & Web Visits** | ❌ Hidden | ✅ Allowed | ✅ Allowed |
| **Competitor Pressure & Discounts** | ❌ Hidden | ✅ Allowed | ✅ Allowed |
| **Review Keyword Aggregates** | ✅ Logistics Keywords | ✅ Price Keywords | ✅ All Keywords |

---

## 📈 Demo Scenarios for Hackathon Evaluation

1. **Scenario 1: Price Competition Pressure (August 2018)**
   - Select `2018-08`. Diagnostic tree breaks down Revenue drop into Volume (+R$31K) vs Price (-R$72K). Shows competitor discount spike (26.1%) and competitor pressure index (69.0 pts).
2. **Scenario 2: Logistics Bottleneck (November 2017)**
   - Select `2017-11`. Orders spike +67% (Black Friday demand) causing late deliveries to triple to 14.25% and inventory gap to jump to 40.6%.
3. **Scenario 3: Sample-Size Abstention (September 2018)**
   - Select `2018-09`. Only 16 orders exist. Engine displays statistical abstention banner preventing hallucinated conclusions.
4. **Scenario 4: Persona Security Switching**
   - Switch persona COO → CMO. Operational metrics (freight cost, stockouts) instantly disappear from tree and narrative.
5. **Scenario 5: Live CSV / ZIP Data Upload**
   - Drop a `.csv` or `.zip` file into the uploader. System auto-detects tables, upserts into Supabase, re-computes monthly aggregates, and updates the tree in real-time.

---

## 📄 License
MIT License © 2026 BusinessIntelligence.ai Team
