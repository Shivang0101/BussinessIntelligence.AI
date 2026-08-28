import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["ok", "degraded"]

def test_kpi_registry_endpoint():
    response = client.get("/api/kpi-registry")
    assert response.status_code == 200
    data = response.json()
    assert "definitions" in data
    assert "driver_graph" in data

def test_kpis_endpoint():
    response = client.get("/api/kpis?month=2018-08&persona=coo")
    assert response.status_code == 200
    data = response.json()
    assert "cards" in data
    assert len(data["cards"]) > 0

def test_investigate_endpoint():
    payload = {
        "month": "2018-08",
        "kpi": "revenue",
        "persona": "coo"
    }
    response = client.post("/api/investigate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "tree" in data
    assert "narrative" in data
    assert "telemetry" in data

def test_simulate_endpoint():
    payload = {
        "kpi": "revenue",
        "driver": "avg_delivery_days",
        "new_value": 8.0
    }
    response = client.post("/api/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "simulated_kpi_value" in data
    assert "delta_kpi_pct" in data
