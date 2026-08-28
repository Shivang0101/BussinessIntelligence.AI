from app.kpi_registry import KPI_DEFINITIONS, KPI_DRIVER_GRAPH
from app.personas import is_metric_allowed
from app.engine.anomaly_detector import detect_metric_anomalies
from app.engine.evidence_collector import collect_evidence_for_metric
from app.engine.hypothesis_tester import run_hypothesis_test
from app.engine.driver_ranker import compute_driver_contributions
from app.engine.confidence_scorer import calculate_confidence_score

def build_diagnostic_tree(target_month: str, monthly_data: list, target_kpi: str = "revenue", persona_id: str = "coo") -> dict:
    """
    Builds a hierarchical diagnostic tree for the target month and target KPI.
    Supports recursive sub-driver expansion and persona column filtering.
    """
    sorted_data = sorted(monthly_data, key=lambda x: x['month'])
    target_row = next((r for r in sorted_data if r['month'] == target_month), None)
    
    if not target_row:
        return {"error": f"No data found for month {target_month}"}
        
    all_anomalies = detect_metric_anomalies(monthly_data, target_month)
    kpi_meta = KPI_DEFINITIONS.get(target_kpi, {
        "title": target_kpi.replace("_", " ").title(),
        "format": "number",
        "unit": ""
    })
    
    kpi_stats = all_anomalies.get(target_kpi, {
        "current_value": target_row.get(target_kpi, 0),
        "previous_value": 0,
        "mom_delta_pct": 0.0,
        "z_score": 0.0,
        "is_anomaly": False,
        "is_abstain": False,
        "is_sparse": False
    })
    
    # Check sample size abstention
    orders_cnt = target_row.get("orders", 0) or 0
    if orders_cnt < 500:
        return {
            "kpi": target_kpi,
            "title": kpi_meta["title"],
            "target_month": target_month,
            "status": "ABSTAIN",
            "message": f"⛔ ABSTAIN — Sample size of {orders_cnt} orders is below minimum statistical threshold (500 orders). Statistical analysis suspended to prevent false positives.",
            "current_value": kpi_stats["current_value"],
            "mom_delta_pct": kpi_stats["mom_delta_pct"],
            "z_score": kpi_stats["z_score"],
            "tree": None
        }

    def expand_node(metric: str, current_depth: int = 1, max_depth: int = 3) -> dict:
        meta = KPI_DEFINITIONS.get(metric, {
            "title": metric.replace("_", " ").title(),
            "format": "number",
            "unit": ""
        })
        m_stats = all_anomalies.get(metric, {
            "current_value": target_row.get(metric, 0),
            "previous_value": None,
            "mom_delta_pct": 0.0,
            "z_score": 0.0,
            "is_anomaly": False
        })
        
        evidence = collect_evidence_for_metric(metric, target_month, m_stats, target_row)
        
        graph_entry = KPI_DRIVER_GRAPH.get(metric, {})
        raw_drivers = graph_entry.get("drivers", [])
        
        # Filter drivers based on persona entitlements
        allowed_drivers = [d for d in raw_drivers if is_metric_allowed(d, persona_id)]
        
        child_nodes = []
        if allowed_drivers and current_depth < max_depth:
            contributions, dont_know_residual = compute_driver_contributions(
                metric, allowed_drivers, target_month, monthly_data, m_stats
            )
            
            for driver in allowed_drivers:
                driver_meta = KPI_DEFINITIONS.get(driver, {"title": driver})
                driver_stats = all_anomalies.get(driver, {"mom_delta_pct": 0, "current_value": 0, "z_score": 0})
                driver_evidence = collect_evidence_for_metric(driver, target_month, driver_stats, target_row)
                
                exp_dir = graph_entry.get("direction", {}).get(driver, "+")
                test_results = run_hypothesis_test(
                    metric, driver, exp_dir, target_month, monthly_data, driver_evidence
                )
                
                conf = calculate_confidence_score(test_results, orders_cnt)
                contrib = contributions.get(driver, 0.0)
                
                # Recursive sub-tree branch
                sub_tree = expand_node(driver, current_depth + 1, max_depth)
                
                # Format hypothesis text
                dir_str = "increased" if driver_stats["mom_delta_pct"] > 0 else "decreased"
                hypothesis_text = f"{meta['title']} was impacted because {driver_meta['title']} {dir_str} by {abs(driver_stats['mom_delta_pct']):.1f}% MoM."
                
                child_nodes.append({
                    "id": f"node_{metric}_{driver}",
                    "metric": driver,
                    "title": driver_meta.get("title", driver),
                    "current_value": driver_stats.get("current_value"),
                    "mom_delta_pct": driver_stats.get("mom_delta_pct"),
                    "z_score": driver_stats.get("z_score"),
                    "format": driver_meta.get("format", "number"),
                    "unit": driver_meta.get("unit", ""),
                    "contribution_pct": contrib,
                    "confidence_score": conf,
                    "hypothesis": hypothesis_text,
                    "test_results": test_results,
                    "evidence": driver_evidence,
                    "children": sub_tree.get("children", []),
                    "node_type": "DRIVER"
                })
                
            # Add Don't-Know Residual Node if residual > 0
            if dont_know_residual > 0:
                child_nodes.append({
                    "id": f"node_{metric}_dont_know",
                    "metric": "dont_know_residual",
                    "title": "Don't-Know Residual",
                    "contribution_pct": dont_know_residual,
                    "confidence_score": 100.0,
                    "hypothesis": f"{dont_know_residual}% of {meta['title']} movement cannot be explained by measured internal drivers. Potential unmeasured factors include external macro shifts, unrecorded promotion tags, or market anomalies.",
                    "test_results": None,
                    "evidence": [{
                        "id": "E_RESIDUAL",
                        "type": "STATISTICAL_RESIDUAL",
                        "title": "Unexplained Statistical Variance",
                        "description": f"{dont_know_residual}% residual model variance.",
                        "confidence_level": "MODEL_RESIDUAL"
                    }],
                    "children": [],
                    "node_type": "RESIDUAL"
                })
                
        return {
            "id": f"root_{metric}",
            "metric": metric,
            "title": meta.get("title", metric),
            "current_value": m_stats.get("current_value"),
            "mom_delta_pct": m_stats.get("mom_delta_pct"),
            "z_score": m_stats.get("z_score"),
            "format": meta.get("format", "number"),
            "unit": meta.get("unit", ""),
            "evidence": evidence,
            "children": child_nodes
        }

    tree_data = expand_node(target_kpi, 1, 3)
    
    return {
        "kpi": target_kpi,
        "title": kpi_meta["title"],
        "target_month": target_month,
        "persona": persona_id,
        "status": "ANOMALY_DETECTED" if kpi_stats.get("is_anomaly") else "NORMAL",
        "current_value": kpi_stats["current_value"],
        "mom_delta_pct": kpi_stats["mom_delta_pct"],
        "z_score": kpi_stats["z_score"],
        "sample_size": orders_cnt,
        "tree": tree_data
    }
