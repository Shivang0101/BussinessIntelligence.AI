import numpy as np

def detect_metric_anomalies(monthly_data: list, target_month: str, alert_threshold: float = 1.0):
    """
    Computes MoM change, 6-month rolling mean/std, and z-score for all metrics in target_month.
    """
    sorted_data = sorted(monthly_data, key=lambda x: x['month'])
    target_idx = next((i for i, row in enumerate(sorted_data) if row['month'] == target_month), None)
    
    if target_idx is None:
        return {}
    
    current_row = sorted_data[target_idx]
    prev_row = sorted_data[target_idx - 1] if target_idx > 0 else None
    
    # 6-month baseline prior to target month
    start_idx = max(0, target_idx - 6)
    history_window = sorted_data[start_idx:target_idx]
    
    results = {}
    
    # Sample size check for abstention
    orders_count = current_row.get("orders", 0)
    is_abstain = orders_count is not None and orders_count < 500
    is_sparse = len(history_window) < 3
    
    for key, current_val in current_row.items():
        if key == 'month' or current_val is None:
            continue
        
        try:
            val_float = float(current_val)
        except (ValueError, TypeError):
            continue
            
        prev_val = float(prev_row[key]) if (prev_row and prev_row.get(key) is not None) else None
        
        # Calculate MoM Delta
        if prev_val and prev_val != 0:
            mom_delta_pct = ((val_float - prev_val) / abs(prev_val)) * 100.0
            mom_delta_abs = val_float - prev_val
        else:
            mom_delta_pct = 0.0
            mom_delta_abs = 0.0
            
        # Calculate 6-mo historical mean and std
        hist_vals = [float(r[key]) for r in history_window if r.get(key) is not None]
        if len(hist_vals) > 0:
            hist_mean = float(np.mean(hist_vals))
            hist_std = float(np.std(hist_vals))
        else:
            hist_mean = val_float
            hist_std = 0.0
            
        if hist_std > 1e-6:
            z_score = (val_float - hist_mean) / hist_std
        else:
            z_score = 0.0
            
        is_anomaly = abs(z_score) >= alert_threshold
        
        results[key] = {
            "current_value": val_float,
            "previous_value": prev_val,
            "mom_delta_pct": round(mom_delta_pct, 2),
            "mom_delta_abs": round(mom_delta_abs, 2),
            "baseline_mean": round(hist_mean, 2),
            "baseline_std": round(hist_std, 2),
            "z_score": round(z_score, 2),
            "is_anomaly": is_anomaly,
            "is_abstain": is_abstain,
            "is_sparse": is_sparse
        }
        
    return results
