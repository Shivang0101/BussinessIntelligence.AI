def collect_evidence_for_metric(metric: str, target_month: str, metric_analysis: dict, db_row: dict):
    """
    Generates structured SQL facts & evidence items with source lineage (E1, E2...).
    """
    evidence_list = []
    e_counter = 1
    
    current_val = metric_analysis.get("current_value")
    prev_val = metric_analysis.get("previous_value")
    mom_pct = metric_analysis.get("mom_delta_pct", 0)
    z_score = metric_analysis.get("z_score", 0)
    
    # Generic Metric Fact
    evidence_list.append({
        "id": f"E{e_counter}",
        "type": "SQL_FACT",
        "title": f"{metric} SQL Measurement",
        "description": f"{metric} moved from {prev_val} to {current_val} ({mom_pct:+.1f}% MoM, z={z_score:+.2f}).",
        "source": "bi_ai_monthly_context",
        "query": f"SELECT {metric} FROM bi_ai_monthly_context WHERE month='{target_month}'",
        "confidence_level": "FACT"
    })
    e_counter += 1
    
    # Specific metric evidence collectors
    if metric in ["avg_delivery_days", "late_delivery_pct"]:
        kw_del = db_row.get("kw_delivery_count", 0)
        tickets = db_row.get("support_ticket_volume", 0)
        evidence_list.append({
            "id": f"E{e_counter}",
            "type": "SQL_AGGREGATE",
            "title": "Delivery Delay Review Keywords",
            "description": f"Customer review text contained {kw_del} explicit delivery delay keywords in {target_month}.",
            "source": "olist_order_reviews",
            "query": f"SELECT count(*) FROM olist_order_reviews WHERE review_comment_message ILIKE '%atraso%' AND month='{target_month}'",
            "confidence_level": "FACT"
        })
        e_counter += 1
        evidence_list.append({
            "id": f"E{e_counter}",
            "type": "SQL_AGGREGATE",
            "title": "Customer Support Tickets",
            "description": f"Logistics support ticket volume reached {tickets} tickets in {target_month}.",
            "source": "synthetic_monthly_business_context",
            "query": f"SELECT support_ticket_volume FROM synthetic_monthly_business_context WHERE month='{target_month}'",
            "confidence_level": "FACT"
        })
        e_counter += 1

    elif metric in ["avg_order_value", "avg_item_price"]:
        comp_pres = db_row.get("competitor_pressure_index", 0)
        comp_disc = db_row.get("competitor_discount_pct", 0)
        evidence_list.append({
            "id": f"E{e_counter}",
            "type": "SQL_FACT",
            "title": "Competitor Price Index Spike",
            "description": f"Competitor pressure index rose to {comp_pres} pts with average competitor discount of {comp_disc}%.",
            "source": "synthetic_monthly_business_context",
            "query": f"SELECT competitor_pressure_index, competitor_discount_pct FROM bi_ai_monthly_context WHERE month='{target_month}'",
            "confidence_level": "FACT"
        })
        e_counter += 1

    elif metric in ["product_availability_pct", "inventory_gap_pct", "stockout_event_count"]:
        stockouts = db_row.get("stockout_event_count", 0)
        inv_gap = db_row.get("inventory_gap_pct", 0)
        evidence_list.append({
            "id": f"E{e_counter}",
            "type": "SQL_FACT",
            "title": "Inventory Stress Events",
            "description": f"Recorded {stockouts} stockout events and {inv_gap}% inventory deficit gap in {target_month}.",
            "source": "bi_ai_monthly_context",
            "query": f"SELECT stockout_event_count, inventory_gap_pct FROM bi_ai_monthly_context WHERE month='{target_month}'",
            "confidence_level": "FACT"
        })
        e_counter += 1

    elif metric in ["website_visits", "website_conversion_rate", "orders"]:
        ad_spend = db_row.get("ad_spend", 0)
        visits = db_row.get("website_visits", 0)
        evidence_list.append({
            "id": f"E{e_counter}",
            "type": "SQL_FACT",
            "title": "Acquisition Spend & Traffic",
            "description": f"Marketing ad spend of R${ad_spend:,.0f} generated {visits:,} site sessions.",
            "source": "bi_ai_monthly_context",
            "query": f"SELECT ad_spend, website_visits FROM bi_ai_monthly_context WHERE month='{target_month}'",
            "confidence_level": "FACT"
        })
        e_counter += 1

    return evidence_list
