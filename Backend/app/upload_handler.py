import os
import io
import zipfile
import csv
import pandas as pd
from app.db import execute_query, fetch_all

KNOWN_TABLE_PATTERNS = {
    "orders": "olist_orders",
    "items": "olist_order_items",
    "reviews": "olist_order_reviews",
    "real_metrics": "olist_monthly_real_metrics",
    "synthetic": "synthetic_monthly_business_context",
    "context": "bi_ai_monthly_context"
}

TABLE_SCHEMAS = {
    "olist_orders": ["order_id", "customer_id", "order_status", "order_purchase_timestamp"],
    "olist_order_items": ["order_id", "order_item_id", "product_id", "price"],
    "olist_order_reviews": ["review_id", "order_id", "review_score"],
    "bi_ai_monthly_context": ["month", "orders", "revenue", "avg_order_value"]
}

def auto_detect_table(filename: str, columns: list) -> str:
    fn_lower = filename.lower()
    for pattern, table_name in KNOWN_TABLE_PATTERNS.items():
        if pattern in fn_lower:
            return table_name
            
    cols_set = set(c.lower() for c in columns)
    for table_name, req_cols in TABLE_SCHEMAS.items():
        if set(req_cols).issubset(cols_set):
            return table_name
            
    return "bi_ai_monthly_context"

def process_uploaded_file(file_bytes: bytes, filename: str, explicit_table: str = None) -> dict:
    tables_processed = []
    rows_upserted = {}
    new_months_detected = set()
    errors = []
    
    fn_lower = filename.lower()
    
    # 1. Process ZIP File
    if fn_lower.endswith(".zip"):
        try:
            with zipfile.ZipFile(io.BytesIO(file_bytes)) as z:
                for z_info in z.infolist():
                    if z_info.filename.startswith("__MACOSX") or not z_info.filename.endswith(".csv"):
                        continue
                    with z.open(z_info) as csv_file:
                        df = pd.read_csv(csv_file)
                        t_name = auto_detect_table(z_info.filename, df.columns.tolist())
                        
                        res = upsert_dataframe_to_table(df, t_name)
                        tables_processed.append(t_name)
                        rows_upserted[t_name] = res["rows"]
                        if "month" in df.columns:
                            new_months_detected.update(df["month"].astype(str).unique())
        except Exception as e:
            errors.append(f"ZIP processing error: {str(e)}")
            
    # 2. Process CSV File
    elif fn_lower.endswith(".csv"):
        try:
            df = pd.read_csv(io.BytesIO(file_bytes))
            t_name = explicit_table or auto_detect_table(filename, df.columns.tolist())
            res = upsert_dataframe_to_table(df, t_name)
            tables_processed.append(t_name)
            rows_upserted[t_name] = res["rows"]
            if "month" in df.columns:
                new_months_detected.update(df["month"].astype(str).unique())
        except Exception as e:
            errors.append(f"CSV processing error: {str(e)}")
            
    # 3. Auto-compute aggregates if raw orders were upserted
    aggregates_computed = False
    if "olist_orders" in tables_processed or "olist_order_items" in tables_processed:
        try:
            recompute_monthly_context()
            aggregates_computed = True
        except Exception as e:
            errors.append(f"Aggregate re-computation notice: {str(e)}")
            
    return {
        "status": "success" if not errors else "partial_success",
        "tables_processed": tables_processed,
        "rows_upserted": rows_upserted,
        "new_months_detected": sorted(list(new_months_detected)),
        "aggregates_computed": aggregates_computed,
        "errors": errors
    }

def upsert_dataframe_to_table(df: pd.DataFrame, table_name: str) -> dict:
    if df.empty:
        return {"rows": 0}
        
    cols = [c for c in df.columns if not c.startswith("Unnamed")]
    rows_count = 0
    
    # Batch upsert logic into Supabase PostgreSQL
    for _, row in df.iterrows():
        values = [None if pd.isna(row[c]) else row[c] for c in cols]
        placeholders = ", ".join(["%s"] * len(cols))
        cols_str = ", ".join([f'"{c}"' for c in cols])
        
        # Determine primary key conflict target
        pk = "month" if table_name in ["bi_ai_monthly_context", "olist_monthly_real_metrics", "synthetic_monthly_business_context"] else cols[0]
        update_set = ", ".join([f'"{c}" = EXCLUDED."{c}"' for c in cols if c != pk])
        
        query = f"""
            INSERT INTO {table_name} ({cols_str})
            VALUES ({placeholders})
            ON CONFLICT ("{pk}") DO UPDATE SET {update_set};
        """
        try:
            execute_query(query, tuple(values))
            rows_count += 1
        except Exception:
            pass
            
    return {"rows": rows_count}

def recompute_monthly_context():
    """
    Re-aggregates bi_ai_monthly_context table from raw olist tables.
    """
    sql = """
    INSERT INTO bi_ai_monthly_context (month, orders, revenue, avg_order_value, avg_item_price)
    SELECT 
        to_char(o.order_purchase_timestamp::timestamp, 'YYYY-MM') as month,
        count(DISTINCT o.order_id) as orders,
        coalesce(sum(i.price), 0) as revenue,
        coalesce(sum(i.price)/nullif(count(DISTINCT o.order_id), 0), 0) as avg_order_value,
        coalesce(avg(i.price), 0) as avg_item_price
    FROM olist_orders o
    LEFT JOIN olist_order_items i ON o.order_id = i.order_id
    WHERE o.order_purchase_timestamp IS NOT NULL
    GROUP BY month
    ON CONFLICT (month) DO UPDATE SET
        orders = EXCLUDED.orders,
        revenue = EXCLUDED.revenue,
        avg_order_value = EXCLUDED.avg_order_value,
        avg_item_price = EXCLUDED.avg_item_price;
    """
    execute_query(sql)
