import psycopg2, sys
sys.stdout.reconfigure(encoding='utf-8')

conn = psycopg2.connect(
    host='db.jdfpfuursllupsrvmnko.supabase.co',
    port=5432,
    dbname='postgres',
    user='postgres',
    password='9qRYM_6$&izta&!'
)
cur = conn.cursor()

# 1. Full monthly metrics time series
print('=== FULL bi_ai_monthly_context (ALL 26 ROWS) ===')
cur.execute('SELECT month, orders, revenue, avg_order_value, avg_item_price, avg_delivery_days, late_delivery_pct, avg_rating, return_rate, active_sellers, cancelled_count, kw_delivery_count, kw_product_count, kw_price_count, kw_service_count, inventory_gap_pct, product_availability_pct, competitor_pressure_index, competitor_discount_pct, market_demand_index, ad_spend, website_visits, website_conversion_rate, support_ticket_volume, stockout_event_count FROM bi_ai_monthly_context ORDER BY month')
rows = cur.fetchall()
cols = [desc[0] for desc in cur.description]
for row in rows:
    d = dict(zip(cols, row))
    print(f"  {d['month']}: orders={d['orders']} rev={d['revenue']} aov={d['avg_order_value']} del_days={d['avg_delivery_days']} late%={d['late_delivery_pct']} rating={d['avg_rating']} ret%={d['return_rate']} sellers={d['active_sellers']} cancel={d['cancelled_count']} inv_gap={d['inventory_gap_pct']} avail={d['product_availability_pct']} comp_pres={d['competitor_pressure_index']} comp_disc={d['competitor_discount_pct']} mkt_dem={d['market_demand_index']} ad_spend={d['ad_spend']} visits={d['website_visits']} conv%={d['website_conversion_rate']} tickets={d['support_ticket_volume']} stockout={d['stockout_event_count']}")

# 2. Order status distribution
print('\n=== ORDER STATUS DISTRIBUTION ===')
cur.execute("SELECT order_status, count(*) FROM olist_orders GROUP BY order_status ORDER BY count(*) DESC")
for row in cur.fetchall():
    print(f'  {row[0]}: {row[1]}')

# 3. Date range of orders
print('\n=== ORDER DATE RANGE ===')
cur.execute("SELECT min(order_purchase_timestamp), max(order_purchase_timestamp) FROM olist_orders")
print(f'  {cur.fetchone()}')

# 4. Review score distribution
print('\n=== REVIEW SCORE DISTRIBUTION ===')
cur.execute("SELECT review_score, count(*) FROM olist_order_reviews GROUP BY review_score ORDER BY review_score")
for row in cur.fetchall():
    print(f'  Score {row[0]}: {row[1]}')

# 5. Sample review comments (non-null ones)
print('\n=== SAMPLE REVIEW COMMENTS (first 10 non-null) ===')
cur.execute("SELECT review_score, review_comment_message FROM olist_order_reviews WHERE review_comment_message IS NOT NULL AND review_comment_message != '' LIMIT 10")
for row in cur.fetchall():
    msg = str(row[1])[:150]
    print(f'  Score {row[0]}: {msg}')

# 6. Monthly order counts from raw data
print('\n=== MONTHLY ORDERS FROM RAW DATA ===')
cur.execute("""
    SELECT to_char(order_purchase_timestamp, 'YYYY-MM') as m, count(*) as cnt,
           sum(1) FILTER (WHERE order_status='cancelled') as cancelled
    FROM olist_orders 
    GROUP BY m ORDER BY m
""")
for row in cur.fetchall():
    print(f'  {row[0]}: {row[1]} orders, {row[2]} cancelled')

conn.close()
