import numpy as np
from sklearn.linear_model import LinearRegression
from app.kpi_registry import KPI_DEFINITIONS

def simulate_driver_impact(kpi_metric: str, driver_metric: str, new_driver_val: float, monthly_data: list) -> dict:
    """
    Predicts impact on kpi_metric when driver_metric is adjusted to new_driver_val.
    Uses OLS linear regression across history.
    """
    sorted_data = sorted(monthly_data, key=lambda x: x['month'])
    
    kpi_series = []
    driver_series = []
    
    for r in sorted_data:
        k_val = r.get(kpi_metric)
        d_val = r.get(driver_metric)
        if k_val is not None and d_val is not None:
            try:
                kpi_series.append(float(k_val))
                driver_series.append(float(d_val))
            except (ValueError, TypeError):
                pass
                
    if len(kpi_series) < 3:
        return {"error": "Insufficient history for regression simulation"}
        
    X = np.array(driver_series).reshape(-1, 1)
    y = np.array(kpi_series)
    
    model = LinearRegression().fit(X, y)
    
    current_driver_val = driver_series[-1] if driver_series else 0.0
    current_kpi_val = kpi_series[-1] if kpi_series else 0.0
    
    predicted_kpi_val = float(model.predict(np.array([[new_driver_val]]))[0])
    
    delta_kpi_abs = predicted_kpi_val - current_kpi_val
    delta_kpi_pct = (delta_kpi_abs / current_kpi_val * 100.0) if current_kpi_val != 0 else 0.0
    
    driver_meta = KPI_DEFINITIONS.get(driver_metric, {"title": driver_metric})
    kpi_meta = KPI_DEFINITIONS.get(kpi_metric, {"title": kpi_metric})
    
    return {
        "kpi_metric": kpi_metric,
        "kpi_title": kpi_meta.get("title", kpi_metric),
        "driver_metric": driver_metric,
        "driver_title": driver_meta.get("title", driver_metric),
        "current_driver_value": current_driver_val,
        "simulated_driver_value": new_driver_val,
        "current_kpi_value": round(current_kpi_val, 2),
        "simulated_kpi_value": round(predicted_kpi_val, 2),
        "delta_kpi_abs": round(delta_kpi_abs, 2),
        "delta_kpi_pct": round(delta_kpi_pct, 2),
        "regression_coefficient": round(float(model.coef_[0]), 4),
        "r2_score": round(float(model.score(X, y)), 2)
    }
