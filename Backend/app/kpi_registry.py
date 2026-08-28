"""
KPI Semantic Registry & Causal Driver Graph
Defines the metrics, expected causal relationships, mathematical decomposition rules, and baseline thresholds.
"""

KPI_DEFINITIONS = {
    "revenue": {
        "title": "Gross Revenue",
        "format": "currency",
        "unit": "BRL",
        "desired_direction": "up",
        "description": "Total order sales revenue in the month",
        "column": "revenue"
    },
    "orders": {
        "title": "Order Volume",
        "format": "number",
        "unit": "orders",
        "desired_direction": "up",
        "description": "Total number of completed orders",
        "column": "orders"
    },
    "avg_order_value": {
        "title": "Average Order Value (AOV)",
        "format": "currency",
        "unit": "BRL",
        "desired_direction": "up",
        "description": "Average revenue generated per order",
        "column": "avg_order_value"
    },
    "avg_item_price": {
        "title": "Average Item Price",
        "format": "currency",
        "unit": "BRL",
        "desired_direction": "up",
        "description": "Average listing price across items sold",
        "column": "avg_item_price"
    },
    "avg_delivery_days": {
        "title": "Average Delivery Time",
        "format": "number",
        "unit": "days",
        "desired_direction": "down",
        "description": "Mean days from purchase to customer delivery",
        "column": "avg_delivery_days"
    },
    "late_delivery_pct": {
        "title": "Late Delivery Rate",
        "format": "percent",
        "unit": "%",
        "desired_direction": "down",
        "description": "Percentage of orders delivered past estimated date",
        "column": "late_delivery_pct"
    },
    "avg_rating": {
        "title": "Customer Review Score",
        "format": "number",
        "unit": "/5",
        "desired_direction": "up",
        "description": "Average review rating from 1 to 5",
        "column": "avg_rating"
    },
    "return_rate": {
        "title": "Order Cancellation / Return Rate",
        "format": "percent",
        "unit": "%",
        "desired_direction": "down",
        "description": "Percentage of orders cancelled or returned",
        "column": "return_rate"
    },
    "product_availability_pct": {
        "title": "Product Availability",
        "format": "percent",
        "unit": "%",
        "desired_direction": "up",
        "description": "Percentage of listed catalog in stock",
        "column": "product_availability_pct"
    },
    "inventory_gap_pct": {
        "title": "Inventory Gap",
        "format": "percent",
        "unit": "%",
        "desired_direction": "down",
        "description": "Percentage deficit between safety stock and inventory",
        "column": "inventory_gap_pct"
    },
    "competitor_pressure_index": {
        "title": "Competitor Pressure Index",
        "format": "number",
        "unit": "pts",
        "desired_direction": "down",
        "description": "Composite index measuring competitor aggressiveness",
        "column": "competitor_pressure_index"
    },
    "competitor_discount_pct": {
        "title": "Competitor Discount Rate",
        "format": "percent",
        "unit": "%",
        "desired_direction": "down",
        "description": "Average competitor discount percentage",
        "column": "competitor_discount_pct"
    },
    "website_visits": {
        "title": "Website Visits",
        "format": "number",
        "unit": "sessions",
        "desired_direction": "up",
        "description": "Total monthly web visits",
        "column": "website_visits"
    },
    "website_conversion_rate": {
        "title": "Website Conversion Rate",
        "format": "percent",
        "unit": "%",
        "desired_direction": "up",
        "description": "Percentage of site visitors who placed an order",
        "column": "website_conversion_rate"
    },
    "ad_spend": {
        "title": "Advertising Spend",
        "format": "currency",
        "unit": "BRL",
        "desired_direction": "up",
        "description": "Total marketing acquisition expenditure",
        "column": "ad_spend"
    },
    "support_ticket_volume": {
        "title": "Support Ticket Volume",
        "format": "number",
        "unit": "tickets",
        "desired_direction": "down",
        "description": "Total customer support inquiries",
        "column": "support_ticket_volume"
    },
    "stockout_event_count": {
        "title": "Stockout Events",
        "format": "number",
        "unit": "events",
        "desired_direction": "down",
        "description": "Number of catalog items out of stock during the month",
        "column": "stockout_event_count"
    }
}

KPI_DRIVER_GRAPH = {
    "revenue": {
        "formula": "orders * avg_order_value",
        "decomposition": "additive",  # ΔRev = ΔOrders * AOV_prev + Orders_prev * ΔAOV
        "drivers": ["orders", "avg_order_value"]
    },
    "orders": {
        "formula": "website_visits * website_conversion_rate",
        "decomposition": "multiplicative",
        "drivers": ["website_visits", "website_conversion_rate"]
    },
    "website_visits": {
        "drivers": ["ad_spend", "market_demand_index"],
        "direction": {"ad_spend": "+", "market_demand_index": "+"}
    },
    "website_conversion_rate": {
        "drivers": ["product_availability_pct", "stockout_event_count"],
        "direction": {"product_availability_pct": "+", "stockout_event_count": "-"}
    },
    "avg_order_value": {
        "drivers": ["avg_item_price", "competitor_discount_pct", "competitor_pressure_index"],
        "direction": {"avg_item_price": "+", "competitor_discount_pct": "-", "competitor_pressure_index": "-"}
    },
    "avg_delivery_days": {
        "drivers": ["orders", "stockout_event_count", "inventory_gap_pct"],
        "direction": {"orders": "+", "stockout_event_count": "+", "inventory_gap_pct": "+"}
    },
    "avg_rating": {
        "drivers": ["avg_delivery_days", "late_delivery_pct", "return_rate", "product_availability_pct"],
        "direction": {"avg_delivery_days": "-", "late_delivery_pct": "-", "return_rate": "-", "product_availability_pct": "+"}
    },
    "return_rate": {
        "drivers": ["avg_delivery_days", "late_delivery_pct", "support_ticket_volume"],
        "direction": {"avg_delivery_days": "+", "late_delivery_pct": "+", "support_ticket_volume": "+"}
    },
    "inventory_gap_pct": {
        "drivers": ["product_availability_pct", "stockout_event_count"],
        "direction": {"product_availability_pct": "-", "stockout_event_count": "+"}
    }
}
