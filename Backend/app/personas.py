"""
Persona Access Control & Column Entitlements
Defines persona-specific column access and narrative priorities.
"""

PERSONA_CONFIGS = {
    "coo": {
        "id": "coo",
        "title": "Chief Operating Officer (COO)",
        "role": "Focuses on logistics, delivery speed, inventory stability, rating retention, and operational bottlenecks.",
        "allowed_metrics": [
            "revenue", "orders", "avg_order_value", "avg_delivery_days", "late_delivery_pct",
            "avg_rating", "return_rate", "product_availability_pct", "inventory_gap_pct",
            "stockout_event_count", "support_ticket_volume", "kw_delivery_count", "kw_product_count"
        ],
        "denied_metrics": [
            "ad_spend", "competitor_pressure_index", "competitor_discount_pct", "market_demand_index"
        ],
        "priority_drivers": ["avg_delivery_days", "late_delivery_pct", "product_availability_pct", "inventory_gap_pct"]
    },
    "cmo": {
        "id": "cmo",
        "title": "Chief Marketing Officer (CMO)",
        "role": "Focuses on acquisition, conversion rates, competitive pricing, ad spend efficiency, and top-of-funnel volume.",
        "allowed_metrics": [
            "revenue", "orders", "avg_order_value", "avg_item_price", "website_visits",
            "website_conversion_rate", "ad_spend", "competitor_pressure_index",
            "competitor_discount_pct", "market_demand_index", "kw_price_count"
        ],
        "denied_metrics": [
            "inventory_gap_pct", "stockout_event_count", "support_ticket_volume", "kw_delivery_count"
        ],
        "priority_drivers": ["website_visits", "website_conversion_rate", "avg_item_price", "competitor_pressure_index"]
    },
    "exec": {
        "id": "exec",
        "title": "Executive / General Manager",
        "role": "Unrestricted full-stack visibility across operations, marketing, finance, and customer sentiment.",
        "allowed_metrics": [
            "revenue", "orders", "avg_order_value", "avg_item_price", "avg_delivery_days",
            "late_delivery_pct", "avg_rating", "return_rate", "product_availability_pct",
            "inventory_gap_pct", "competitor_pressure_index", "competitor_discount_pct",
            "website_visits", "website_conversion_rate", "ad_spend", "support_ticket_volume",
            "stockout_event_count"
        ],
        "denied_metrics": [],
        "priority_drivers": ["revenue", "orders", "avg_order_value"]
    }
}

def get_allowed_metrics(persona_id: str):
    config = PERSONA_CONFIGS.get(persona_id.lower(), PERSONA_CONFIGS["exec"])
    return config["allowed_metrics"]

def is_metric_allowed(metric: str, persona_id: str) -> bool:
    config = PERSONA_CONFIGS.get(persona_id.lower(), PERSONA_CONFIGS["exec"])
    if config["denied_metrics"] and metric in config["denied_metrics"]:
        return False
    if config["allowed_metrics"] and metric not in config["allowed_metrics"]:
        return False
    return True
