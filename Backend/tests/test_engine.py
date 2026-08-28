import pytest
from app.engine.anomaly_detector import detect_metric_anomalies
from app.engine.hypothesis_tester import run_hypothesis_test
from app.engine.driver_ranker import compute_driver_contributions
from app.engine.confidence_scorer import calculate_confidence_score
from app.engine.simulator import simulate_driver_impact
from app.engine.reverse_checker import check_counterfactual

# Mock monthly dataset for testing
MOCK_MONTHLY_DATA = [
    {
        "month": "2018-05", "orders": 6000, "revenue": 800000.0, "avg_order_value": 133.33,
        "avg_delivery_days": 10.0, "late_delivery_pct": 5.0, "avg_rating": 4.2,
        "product_availability_pct": 65.0, "inventory_gap_pct": 20.0, "competitor_pressure_index": 50.0,
        "competitor_discount_pct": 15.0, "ad_spend": 300000.0, "website_visits": 300000,
        "website_conversion_rate": 2.0, "support_ticket_volume": 800, "stockout_event_count": 2
    },
    {
        "month": "2018-06", "orders": 6100, "revenue": 810000.0, "avg_order_value": 132.78,
        "avg_delivery_days": 9.5, "late_delivery_pct": 4.8, "avg_rating": 4.25,
        "product_availability_pct": 66.0, "inventory_gap_pct": 19.5, "competitor_pressure_index": 51.0,
        "competitor_discount_pct": 15.5, "ad_spend": 305000.0, "website_visits": 305000,
        "website_conversion_rate": 2.0, "support_ticket_volume": 790, "stockout_event_count": 2
    },
    {
        "month": "2018-07", "orders": 6292, "revenue": 895507.0, "avg_order_value": 142.75,
        "avg_delivery_days": 8.9, "late_delivery_pct": 4.48, "avg_rating": 4.26,
        "product_availability_pct": 57.0, "inventory_gap_pct": 27.3, "competitor_pressure_index": 59.4,
        "competitor_discount_pct": 22.9, "ad_spend": 323000.0, "website_visits": 315000,
        "website_conversion_rate": 2.0, "support_ticket_volume": 742, "stockout_event_count": 3
    },
    {
        "month": "2018-08", "orders": 6512, "revenue": 854686.0, "avg_order_value": 132.47,
        "avg_delivery_days": 7.73, "late_delivery_pct": 10.39, "avg_rating": 4.26,
        "product_availability_pct": 50.8, "inventory_gap_pct": 27.9, "competitor_pressure_index": 69.0,
        "competitor_discount_pct": 26.1, "ad_spend": 311000.0, "website_visits": 311000,
        "website_conversion_rate": 2.1, "support_ticket_volume": 1091, "stockout_event_count": 3
    }
]

def test_anomaly_detector():
    anomalies = detect_metric_anomalies(MOCK_MONTHLY_DATA, "2018-08")
    assert "revenue" in anomalies
    assert "orders" in anomalies
    assert anomalies["revenue"]["current_value"] == 854686.0
    assert anomalies["revenue"]["mom_delta_pct"] < 0  # Revenue dropped MoM

def test_driver_ranker():
    kpi_analysis = {"current_value": 854686.0, "previous_value": 895507.0}
    contributions, dont_know = compute_driver_contributions("revenue", ["orders", "avg_order_value"], "2018-08", MOCK_MONTHLY_DATA, kpi_analysis)
    assert "orders" in contributions
    assert "avg_order_value" in contributions
    assert contributions["avg_order_value"] > contributions["orders"]  # Price drop was main driver
    assert dont_know >= 0.0

def test_hypothesis_tester():
    evidence = [{"id": "E1", "description": "Competitor discount spiked", "type": "SQL_FACT"}]
    res = run_hypothesis_test("revenue", "avg_order_value", "+", "2018-08", MOCK_MONTHLY_DATA, evidence)
    assert "temporal" in res
    assert "direction" in res
    assert "counterfactual" in res
    assert "evidence" in res

def test_confidence_scorer():
    dummy_test_results = {
        "temporal": {"passed": True},
        "direction": {"passed": True},
        "magnitude": {"passed": True},
        "counterfactual": {"passed": True},
        "evidence": {"passed": True}
    }
    score = calculate_confidence_score(dummy_test_results, sample_size=6500)
    assert score >= 80.0

def test_simulator():
    sim = simulate_driver_impact("revenue", "avg_delivery_days", 8.0, MOCK_MONTHLY_DATA)
    assert sim["kpi_metric"] == "revenue"
    assert "simulated_kpi_value" in sim
    assert "delta_kpi_pct" in sim

def test_counterfactual():
    cf = check_counterfactual("avg_delivery_days", "revenue", "2018-08", MOCK_MONTHLY_DATA)
    assert "passed" in cf
