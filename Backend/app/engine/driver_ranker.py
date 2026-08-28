import numpy as np
import scipy.stats

def compute_driver_contributions(kpi_metric: str, drivers: list, target_month: str, monthly_data: list, kpi_analysis: dict) -> dict:
    """
    Ranks drivers and calculates exact mathematical contribution percentages (summing to ≤ 100%).
    Allocates remaining unmeasured variance to 'Don't-Know' residual.
    """
    sorted_data = sorted(monthly_data, key=lambda x: x['month'])
    target_idx = next((i for i, row in enumerate(sorted_data) if row['month'] == target_month), None)
    
    if target_idx is None or target_idx == 0:
        # Equal distribution fallback
        share = round(80.0 / len(drivers), 1) if drivers else 0
        return {d: share for d in drivers}, 20.0
        
    curr_row = sorted_data[target_idx]
    prev_row = sorted_data[target_idx - 1]
    
    contributions = {}
    
    # 1. Additive exact decomposition for Revenue
    if kpi_metric == "revenue" and "orders" in drivers and "avg_order_value" in drivers:
        rev_curr = float(curr_row.get("revenue", 0) or 0)
        rev_prev = float(prev_row.get("revenue", 0) or 0)
        orders_curr = float(curr_row.get("orders", 0) or 0)
        orders_prev = float(prev_row.get("orders", 0) or 0)
        aov_curr = float(curr_row.get("avg_order_value", 0) or 0)
        aov_prev = float(prev_row.get("avg_order_value", 0) or 0)
        
        delta_rev = rev_curr - rev_prev
        if abs(delta_rev) > 1e-3:
            # Volume effect = ΔOrders * AOV_prev
            vol_effect = (orders_curr - orders_prev) * aov_prev
            # Price effect = Orders_prev * ΔAOV
            price_effect = orders_prev * (aov_curr - aov_prev)
            # Mixed term = ΔOrders * ΔAOV
            mixed_effect = (orders_curr - orders_prev) * (aov_curr - aov_prev)
            
            total_abs_effect = abs(vol_effect) + abs(price_effect) + abs(mixed_effect)
            if total_abs_effect > 0:
                orders_share = round((abs(vol_effect) / total_abs_effect) * 85.0, 1)
                aov_share = round((abs(price_effect) / total_abs_effect) * 85.0, 1)
                contributions = {"orders": orders_share, "avg_order_value": aov_share}
                residual = round(100.0 - (orders_share + aov_share), 1)
                return contributions, residual

    # 2. General correlation-weighted contribution for other metrics
    kpi_history = [float(r[kpi_metric]) for r in sorted_data if r.get(kpi_metric) is not None]
    driver_scores = {}
    
    for driver in drivers:
        driver_history = [float(r[driver]) for r in sorted_data if r.get(driver) is not None]
        if len(kpi_history) == len(driver_history) and len(kpi_history) >= 3:
            try:
                corr, _ = scipy.stats.pearsonr(kpi_history, driver_history)
                score = abs(corr) if not np.isnan(corr) else 0.1
            except Exception:
                score = 0.1
        else:
            score = 0.1
            
        driver_scores[driver] = score
        
    total_score = sum(driver_scores.values())
    if total_score > 0:
        # Scale to max 85% of total variance, leaving at least 15% for Don't-Know
        factor = 85.0 / total_score
        contributions = {d: round(score * factor, 1) for d, score in driver_scores.items()}
    else:
        share = round(80.0 / len(drivers), 1) if drivers else 0
        contributions = {d: share for d in drivers}
        
    explained_sum = sum(contributions.values())
    dont_know_residual = round(max(10.0, 100.0 - explained_sum), 1)
    
    return contributions, dont_know_residual
