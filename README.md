<div align="center">

# ⚡ BusinessIntelligence.ai (BI.ai)
### *Deterministic KPI Intelligence-to-Action Engine with Zero-Hallucination Guarantees*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-bussinessintelligenceai.vercel.app-2563eb?style=for-the-badge&logo=vercel&logoColor=white)](https://bussinessintelligenceai.vercel.app/)
[![API Docs](https://img.shields.io/badge/API%20Docs-FastAPI%20Swagger-009688?style=for-the-badge&logo=fastapi&logoColor=white)](http://localhost:8000/docs)
[![Docker](https://img.shields.io/badge/Docker%20Compose-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#-quick-start--deployment)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)

<p align="center">
  <strong>From Raw KPI Movements to Mathematical Root-Cause Diagnostics, Counterfactual Verification, and Actionable Executive Strategy.</strong>
</p>

<p align="center">
  <a href="#-live-deployment--demo">Live Demo</a> •
  <a href="#-the-core-problem-traditional-bi-vs-biai">Why BI.ai?</a> •
  <a href="#-product-tour--visual-walkthrough">Product Tour</a> •
  <a href="#-the-zero-hallucination-engine">Diagnostic Engine</a> •
  <a href="#-5-point-hypothesis-test-battery">5-Point Test Battery</a> •
  <a href="#-personas--data-entitlements">Persona Security</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-quick-start--deployment">Quick Start</a>
</p>

</div>

---

## 🌐 Live Deployment & Demo

- **🚀 Web Application URL**: [https://bussinessintelligenceai.vercel.app/](https://bussinessintelligenceai.vercel.app/) *(Click to launch interactive prototype)*
- **📖 Interactive API Documentation**: [https://bussinessintelligenceai.vercel.app/docs](https://bussinessintelligenceai.vercel.app/docs) *(Swagger UI / OpenAPI / Local: `http://localhost:8000/docs`)*
- **📦 Dataset Scope**: 26 Months of Brazilian E-Commerce (~300,000 live transactional & customer review rows on Supabase PostgreSQL)

---

## 🎯 The Core Problem: Traditional BI vs. BI.ai

### The Enterprise BI Dilemma
Modern enterprises spend millions on business intelligence tools (Tableau, PowerBI, Looker), yet executive decision-making remains bottlenecked:

```
┌──────────────────────────────┐        ┌──────────────────────────────┐        ┌──────────────────────────────┐
│        Traditional BI        │  ───►  │     The LLM Fantasy Trap     │  ───►  │        The BI.ai Way         │
│                              │        │                              │        │                              │
│ Shows WHAT happened.         │        │ Asking LLMs to do math       │        │ Deterministic Stats & SQL    │
│ "Revenue dropped 4.6% MoM"   │        │ causes hallucinations,       │        │ find exact causes; LLMs      │
│ Executives left guessing why │        │ invented correlations, &     │        │ synthesize proven facts into │
│ and what to do next.         │        │ uncalibrated confidence.     │        │ persona-ready action plans.  │
└──────────────────────────────┘        └──────────────────────────────┘        └──────────────────────────────┘
```

1. **Dashboard Fatigue & No Causality**: Dashboards display aggregate metrics but cannot decompose multi-factor movements (e.g., separating volume shift from basket size deterioration).
2. **The LLM Arithmetic Trap**: Large Language Models hallucinate numbers, invent spurious correlations, and cannot perform rigorous statistical counterfactual testing.
3. **Information Overload Without Role Relevance**: A COO cares about delivery SLAs and stockouts; a CMO cares about CAC and conversion. One-size-fits-all reports fail both.
4. **Lack of Uncertainty & Abstention**: Conventional tools always output an answer, even when data is sparse, conflicting, or statistically insignificant.

### How BI.ai Solves This
**BusinessIntelligence.ai** implements a **strict separation of concerns**:
- **100% Deterministic Engine**: Anomaly detection ($Z$-score $\ge 1.0$), exact mathematical decomposition, Pearson direction tests, OLS magnitude models, counterfactual checks, and "Don't-Know" residual quantification.
- **Traceable SQL Evidence**: Every diagnostic branch provides raw SQL queries and data lineage from heterogeneous sources (`olist_orders`, `olist_order_reviews`, `synthetic_monthly_context`).
- **Generative Synthesis Layer**: Gemini 2.5 Flash operates strictly downstream, consuming *only verified statistical facts* to formulate crisp executive briefings.

---

## 📸 Product Tour & Visual Walkthrough

### 1. Executive KPI Anomaly Dashboard
> Real-time monitoring across 8 core e-commerce metrics with automated MoM deltas, 6-month historical baselines, and $Z$-score anomaly triggers.

![Executive KPI Anomaly Dashboard](assets/screenshots/01_kpi_dashboard.png)

#### ✨ Key Features in this View:
- **Automated Anomaly Tagging**: Flags metrics that deviate significantly from their 6-month historical rolling window ($Z \ge 1.0$).
- **Historical Mini-Sparklines**: 6-month contextual trajectory embedded directly into each KPI card.
- **Period & Persona Selectors**: Instantly switch target audit months (e.g., `2018-08`) and view roles (`COO`, `CMO`, `Executive GM`).
- **Instant Investigation Trigger**: Clicking on any anomaly badge immediately expands the full root-cause causal tree.

---

### 2. Root Cause Diagnostic Tree & AI Executive Briefing
> Hierarchical driver decomposition with exact mathematical contribution percentages, confidence calibration, 5-point test results, and persona-adapted AI narratives.

![Root Cause Diagnostic Tree and Narrative](assets/screenshots/02_root_cause_narrative.png)

#### ✨ Key Features in this View:
- **Mathematical Contribution %**: Decomposes Revenue decline ($-\text{R\$} 41\text{k}$) into exact driver shares:
  $$\Delta \text{Revenue} = \underbrace{\Delta \text{Orders} \times \text{AOV}_{\text{prev}}}_{\text{Volume Effect (+27.1\%)}} + \underbrace{\text{Orders}_{\text{prev}} \times \Delta \text{AOV}}_{\text{Price/Basket Effect (-55.9\%)}} + \underbrace{\text{Residual}}_{\text{Unexplained (17.0\%)}}$$
- **5-Point Hypothesis Validation Battery**: Expandable modal validating temporal co-occurrence, direction, regression fit, counterfactual checks, and evidence density.
- **Traceable SQL Evidence Cards**: View the exact SQL query, source table, and raw metric lineage supporting each hypothesis.
- **AI Executive Briefing**: Gemini 2.5 Flash synthesizes deterministic facts into structured executive action items tailored for the active persona.
- **Human-in-the-Loop Feedback**: Thumbs up/down buttons allow domain experts to validate or correct hypotheses, storing feedback in `feedback_store.json`.

---

### 3. Historical Series & What-If Scenario Simulator
> 26-month continuous trend tracking paired with an Ordinary Least Squares (OLS) regression simulation engine.

![Historical Series and What-If Simulator](assets/screenshots/03_timeline_simulator.png)

#### ✨ Key Features in this View:
- **Interactive Multi-Month Trajectory**: Visualizes the entire 26-month dataset with target period demarcation.
- **Driver Selection**: Select actionable levers (e.g., *Average Delivery Time*, *Ad Spend*, *Product Availability*).
- **Interactive Target Setting**: Adjust driver sliders to simulate policy changes or operational improvements.

---

### 4. Real-Time Impact Projection & System Telemetry
> Predictive impact modeling with regression coefficients, $R^2$ goodness-of-fit, and complete runtime observability.

![Simulated Impact and Runtime Telemetry](assets/screenshots/04_what_if_projected.png)

#### ✨ Key Features in this View:
- **Predicted KPI Impact**: Calculates baseline vs. projected outcome (e.g., reducing delivery time to 11 days yields a $-26.19\%$ predicted revenue shift based on historical elasticity).
- **Statistical Coefficients**: Transparently displays regression slope ($\beta = -12365.90$) and $R^2 = 0.11$.
- **Full Telemetry Bar**: Real-time auditing of SQL queries executed ($14$), Gemini API calls ($1$), tokens used ($620$), end-to-end latency ($3.27\text{s}$), and total estimated API cost ($\$0.00$).

---

## 🛡️ The Zero-Hallucination Engine

```mermaid
flowchart TD
    A[Target Period & Metric Selection] --> B[Data Fetcher: Supabase PostgreSQL / SQLite Fallback]
    B --> C[Anomaly Detector: 6-Mo Rolling Z-Score & MoM Delta]
    
    C --> D{Sample Size Check}
    D -- "< 500 Orders" --> E[⛔ ABSTAIN TRIGGER: Low Sample Warning]
    D -- ">= 500 Orders" --> F[Causal Driver Graph Traversal]
    
    F --> G[Driver Ranker: Exact Additive / Multiplicative Decomposition]
    G --> H[5-Point Hypothesis Validation Battery]
    
    H --> I[Evidence Collector: SQL Facts, Review Keywords & Lineage]
    H --> J[Quantify Don't-Know Residual Variance]
    
    I & J --> K[Persona Column Filtering & Entitlement Engine]
    K --> L[Diagnostic Tree Construction]
    
    L --> M[Gemini 2.5 Flash Executive Synthesis]
    M --> N[Interactive Glassmorphic UI Dashboard]
```

### 1. Mathematical Contribution vs. Correlation
Unlike basic analytics tools that rely purely on correlation, BI.ai computes exact additive and multiplicative volume-price decompositions:
- For **Gross Revenue** ($\text{Revenue} = \text{Orders} \times \text{AOV}$):
  $$\Delta \text{Rev} = (\Delta \text{Orders} \cdot \text{AOV}_{t-1}) + (\text{Orders}_{t-1} \cdot \Delta \text{AOV}) + (\Delta \text{Orders} \cdot \Delta \text{AOV})$$
- For other metrics, variance is correlation-weighted across historical series with an enforced **15% minimum "Don't-Know" residual** to guard against unmeasured confounders.

---

## 🔬 5-Point Hypothesis Test Battery

Every generated hypothesis must pass through a strict 5-stage automated statistical battery before reaching the executive interface:

| # | Test Name | Analytical Method | Pass Condition | Fallback / Failure Behavior |
|---|---|---|---|---|
| **1** | **Temporal Co-occurrence** | Deterministic SQL | Driver exhibits $\ge 1.0\%$ MoM movement during anomaly month | Flagged as stagnant driver |
| **2** | **Direction Consistency** | Pearson Correlation ($r$) | Empirical sign matches business graph (e.g., $r > 0$ for Spend $\to$ Visits) | Flagged as contradictory signal |
| **3** | **Magnitude Proportionality**| OLS Linear Regression | Driver delta explains $\ge 25\%$ of predicted KPI variance | Flagged as secondary contributor |
| **4** | **Counterfactual Check** | Historical Falsification | In previous months when driver shifted, did the KPI also shift? | Confidence weakened if counter-examples exist |
| **5** | **Evidence Density** | Heterogeneous SQL Aggregation | At least 2 independent SQL facts / review keyword signals | Flagged as low-evidence hypothesis |

---

## 👥 Personas & Data Entitlements

The engine enforces strict role-based data security and dynamic column filtering:

```
┌──────────────────────────────────────┬──────────────────────────────────────┬──────────────────────────────────────┐
│       COO (Operations Persona)       │       CMO (Marketing Persona)        │        Executive GM (Full Access)    │
├──────────────────────────────────────┼──────────────────────────────────────┼──────────────────────────────────────┤
│ ✅ Allowed: Delivery Days, Late %,   │ ✅ Allowed: Ad Spend, CAC, Visits,   │ ✅ Allowed: All operational,         │
│    Inventory Gap, Stockout Events,   │    Conversion Rate, Competitor Index,│    marketing, competitive, and       │
│    Reviews, Support Tickets          │    Discount Rate, AOV, Price         │    financial metrics                 │
│                                      │                                      │                                      │
│ ❌ Denied: Ad Spend, Competitor Index│ ❌ Denied: Inventory Gaps, Stockouts,│ ❌ Denied: None (Enterprise View)    │
│    Marketing Acquisition Budgets     │    Support Ticket Volumes            │                                      │
└──────────────────────────────────────┴──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 🏛️ System Architecture

```
BussinessIntelligence.AI/
├── Backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI routes & telemetry orchestrator
│   │   ├── db.py                       # Resilient Supabase pooler + SQLite fallback
│   │   ├── kpi_registry.py             # Semantic KPI definitions & causal driver graph
│   │   ├── personas.py                 # Role-based column security & entitlements
│   │   ├── feedback.py                 # Human-in-the-loop expert correction store
│   │   ├── upload_handler.py           # Multi-file CSV/ZIP data ingestion pipeline
│   │   └── engine/
│   │       ├── anomaly_detector.py     # 6-month rolling Z-score & MoM engine
│   │       ├── hypothesis_engine.py    # Recursive diagnostic tree builder
│   │       ├── driver_ranker.py        # Additive/multiplicative contribution math
│   │       ├── hypothesis_tester.py    # 5-point statistical test battery
│   │       ├── reverse_checker.py      # Counterfactual falsification checker
│   │       ├── evidence_collector.py   # SQL facts & customer review NLP lineage
│   │       ├── confidence_scorer.py    # Multi-factor confidence calibration
│   │       ├── simulator.py            # OLS linear regression what-if simulator
│   │       └── narrator.py             # Gemini 2.5 Flash executive synthesis
│   ├── Dockerfile                      # Backend container definition
│   └── requirements.txt                # Python dependencies
├── Frontend/
│   ├── src/
│   │   ├── App.jsx                     # Core state, navigation & theme manager
│   │   ├── index.css                   # Glassmorphism design tokens & styles
│   │   └── components/
│   │       ├── KPICards.jsx            # Top-level anomaly cards with sparklines
│   │       ├── DiagnosticTree.jsx      # Interactive hierarchical root-cause tree
│   │       ├── TreeNode.jsx            # Recursive driver node with test battery
│   │       ├── EvidenceCard.jsx        # Raw SQL query & lineage viewer
│   │       ├── HypothesisTestResults.jsx # 5-point test battery breakdown modal
│   │       ├── NarrativePanel.jsx      # AI Executive briefing with thumbs up/down
│   │       ├── TimelineCharts.jsx      # 26-month historical trend line
│   │       ├── WhatIfSimulator.jsx     # Interactive regression simulation slider
│   │       ├── TelemetryBar.jsx        # Live queries, tokens, latency & cost
│   │       ├── DataUpload.jsx          # CSV/ZIP dataset ingestion modal
│   │       └── Sidebar.jsx             # Period & persona controls
│   ├── Dockerfile                      # Frontend container definition
│   └── package.json                    # Node dependencies
├── PS/                                 # Problem statement specifications & decks
├── docker-compose.yml                  # Full-stack container orchestration
└── README.md                           # Documentation
```

---

## ⚡ Quick Start & Deployment

### Method 1: Docker Compose (Recommended)

Ensure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is running, then execute:

```bash
# 1. Clone the repository
git clone https://github.com/Shivang0101/BussinessIntelligence.AI.git
cd BussinessIntelligence.AI

# 2. Build and start containers
docker compose up --build -d

# 3. View logs
docker compose logs -f
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API & Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Method 2: Local Manual Setup

#### 1. Backend Setup (Python 3.11+)
```bash
cd Backend

# Create and activate virtual environment
python -m venv .venv
# On Windows:
.\.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your credentials
# (Supabase Session Pooler & Gemini API Key)
cat <<EOT >> .env
DATABASE_URL=postgresql://postgres.jdfpfuursllupsrvmnko:9qRYM_6$&izta&!@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres
DB_HOST=aws-0-ap-northeast-2.pooler.supabase.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres.jdfpfuursllupsrvmnko
DB_PASSWORD=9qRYM_6$&izta&!
GEMINI_API_KEY=your_gemini_api_key_here
EOT

# Start FastAPI development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Frontend Setup (Node.js 18+)
```bash
cd Frontend

# Install node dependencies
npm install

# Start Vite dev server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 REST API Reference

| Endpoint | Method | Description | Example Query / Body |
|---|---|---|---|
| `/health` | `GET` | Health check & Supabase connection status | — |
| `/api/kpi-registry` | `GET` | Semantic dictionary, driver graph & persona rules | — |
| `/api/timeline` | `GET` | Full 26-month dataset for all tracked metrics | — |
| `/api/alerts` | `GET` | All anomalous months identified across history | — |
| `/api/kpis` | `GET` | Filtered KPI cards for target month & persona | `?month=2018-08&persona=coo` |
| `/api/investigate` | `POST` | Builds diagnostic tree, tests & AI narrative | `{"month": "2018-08", "kpi": "revenue", "persona": "coo"}` |
| `/api/simulate` | `POST` | Runs OLS regression simulation for driver | `{"kpi": "revenue", "driver": "avg_delivery_days", "new_value": 8.0}` |
| `/api/upload` | `POST` | Ingests new CSV/ZIP transaction batches | `multipart/form-data (file)` |
| `/api/feedback` | `POST` | Stores human expert validation / corrections | `{"hypothesis_id": "...", "feedback_type": "upvote"}` |

---

## 🎬 Key Demo Scenarios to Explore

1. **August 2018 — Price Competition Shock**
   - **Phenomenon**: Gross Revenue dropped $-4.6\%$ MoM despite Order Volume increasing $+3.5\%$.
   - **Root Cause**: Average Order Value dropped $-7.2\%$ due to aggressive competitor price discounts ($+12\%$ discount index spike).
   - **Entitlement View**: Switch to CMO persona to analyze competitor pressure, or COO to see logistics stability.

2. **November 2017 — Black Friday Logistics Bottleneck**
   - **Phenomenon**: Customer review scores dropped to $3.8/5$.
   - **Root Cause**: Order volume surged $+42\%$, triggering delivery delays (average $15.4$ days) and inventory stockouts.

3. **September 2018 — Safe Statistical Abstention**
   - **Phenomenon**: Data contains only 16 orders for the newly launched period.
   - **Engine Behavior**: Safely aborts causal analysis with `⛔ ABSTAIN` warning: *"Sample size (16 orders) is below minimum threshold (500 orders) to prevent false positives."*

---

## 👥 Contributors & Acknowledgements

Developed with ❤️ for the **Business Intelligence AI Hackathon**.

- **Frontend & UX**: Glassmorphic React Dashboard, SVG Sparklines, Interactive Tree Visualizer
- **Backend & Statistics**: FastAPI, SciPy, NumPy, Scikit-Learn, Supabase PostgreSQL
- **Generative AI**: Google Gemini 2.5 Flash (Narrative Synthesis Layer)

---

<div align="center">
  <strong>Licensed under the MIT License • © 2026 BusinessIntelligence.ai</strong>
</div>
