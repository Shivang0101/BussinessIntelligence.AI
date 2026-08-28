def check_counterfactual(driver_metric: str, kpi_metric: str, target_month: str, monthly_data: list) -> dict:
    """
    Test 4: Counterfactual Falsification
    Searches for historical months where driver had a similar value, but KPI remained normal (|z| < 1.0).
    """
    sorted_data = sorted(monthly_data, key=lambda x: x['month'])
    target_row = next((r for r in sorted_data if r['month'] == target_month), None)
    
    if not target_row or driver_metric not in target_row or kpi_metric not in target_row:
        return {"passed": True, "counterexamples": [], "weakened": False, "note": "No counterfactual exceptions found."}
        
    current_driver_val = target_row.get(driver_metric)
    if current_driver_val is None:
        return {"passed": True, "counterexamples": [], "weakened": False, "note": "No counterfactual exceptions found."}
        
    try:
        driver_val_float = float(current_driver_val)
    except (ValueError, TypeError):
        return {"passed": True, "counterexamples": [], "weakened": False, "note": "No counterfactual exceptions found."}
        
    counterexamples = []
    
    # Check other months in history
    for row in sorted_data:
        m = row['month']
        if m == target_month:
            continue
            
        d_val = row.get(driver_metric)
        k_val = row.get(kpi_metric)
        if d_val is None or k_val is None:
            continue
            
        try:
            d_float = float(d_val)
            k_float = float(k_val)
        except (ValueError, TypeError):
            continue
            
        # If driver value within ±15% of target driver value
        if abs(d_float - driver_val_float) <= (0.15 * abs(driver_val_float) + 1e-5):
            # Check if KPI was relatively normal in that month (mean of all history)
            all_kpi = [float(r[kpi_metric]) for r in sorted_data if r.get(kpi_metric) is not None]
            kpi_mean = sum(all_kpi) / len(all_kpi) if all_kpi else k_float
            kpi_std = (sum((x - kpi_mean)**2 for x in all_kpi) / len(all_kpi))**0.5 if len(all_kpi) > 1 else 1.0
            
            kpi_z = (k_float - kpi_mean) / kpi_std if kpi_std > 1e-5 else 0.0
            
            if abs(kpi_z) < 1.0:
                counterexamples.append({
                    "month": m,
                    "driver_val": d_float,
                    "kpi_val": k_float,
                    "kpi_z_score": round(float(kpi_z), 2)
                })
                
    passed = bool(len(counterexamples) == 0)
    weakened = bool(len(counterexamples) > 0 and len(counterexamples) <= 2)
    
    return {
        "passed": passed,
        "counterexamples": counterexamples,
        "weakened": weakened,
        "note": f"Found {len(counterexamples)} counterfactual historical months." if counterexamples else "No counterfactual exceptions found."
    }
