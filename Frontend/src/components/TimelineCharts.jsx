import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function TimelineCharts({ timelineData, selectedMonth, selectedKPI }) {
  if (!timelineData || timelineData.length === 0) return null;

  const kpiColors = {
    revenue: '#818cf8',
    orders: '#34d399',
    avg_order_value: '#fbbf24',
    avg_delivery_days: '#f87171',
    avg_rating: '#a78bfa',
    late_delivery_pct: '#fb7185',
    website_conversion_rate: '#22d3ee',
    inventory_gap_pct: '#f59e0b'
  };

  const color = kpiColors[selectedKPI] || '#818cf8';

  const kpiTitle = selectedKPI.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="glass-panel timeline-panel">
      <div className="section-header">
        <div className="section-header-icon" style={{ background: `${color}18` }}>
          <TrendingUp size={20} color={color} />
        </div>
        <div>
          <h3>Historical Series — {kpiTitle}</h3>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{timelineData.length} months tracked</p>
        </div>
      </div>

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timelineData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              interval={Math.floor(timelineData.length / 6)}
            />
            <YAxis 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(14,19,35,0.95)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '10px', 
                color: '#fff', 
                fontSize: '0.78rem',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey={selectedKPI} 
              stroke={color} 
              strokeWidth={2.5}
              fill="url(#areaGradient)"
              dot={false}
              activeDot={{ r: 5, fill: color, stroke: '#fff', strokeWidth: 2 }}
            />
            {selectedMonth && (
              <ReferenceLine 
                x={selectedMonth} 
                stroke={color}
                strokeOpacity={0.5}
                strokeDasharray="4 4" 
                label={{ value: '▼', fill: color, fontSize: 12, position: 'top' }} 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
