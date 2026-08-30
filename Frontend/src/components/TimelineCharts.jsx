import React from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TimelineCharts({ timelineData, selectedMonth, selectedKPI }) {
  if (!timelineData || timelineData.length === 0) return null;

  const kpiColors = {
    revenue: 'var(--primary-accent)',
    orders: 'var(--status-green)',
    avg_order_value: 'var(--status-yellow)',
    avg_delivery_days: 'var(--status-red)',
    avg_rating: '#8b5cf6',
    late_delivery_pct: '#ec4899',
    website_conversion_rate: '#06b6d4',
    inventory_gap_pct: 'var(--status-yellow)'
  };

  const color = kpiColors[selectedKPI] || 'var(--primary-accent)';
  const kpiTitle = selectedKPI.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
        <div style={{ padding: '0.6rem', borderRadius: '12px', display: 'flex', background: 'var(--bg-app)', border: `1px solid ${color}40`, color: color, boxShadow: `0 4px 12px ${color}15` }}>
          <TrendingUp size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Historical Series — {kpiTitle}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>{timelineData.length} months tracked seamlessly</p>
        </div>
      </div>

      <div style={{ width: '100%', flex: 1, minHeight: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timelineData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <XAxis 
              dataKey="month" 
              stroke="var(--text-muted)" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: 'var(--border-color)', strokeWidth: 1.5 }}
              interval={Math.floor(timelineData.length / 6)}
              dy={12}
            />
            <YAxis 
              stroke="var(--text-muted)" 
              fontSize={11} 
              tickLine={false}
              axisLine={false}
              width={60}
              tickFormatter={(val) => {
                if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
                return val;
              }}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '12px', 
                color: 'var(--text-primary)', 
                fontSize: '0.85rem',
                boxShadow: 'var(--shadow-panel)',
                padding: '10px 14px'
              }}
              itemStyle={{ color: 'var(--text-primary)', fontWeight: 700, marginTop: '4px' }}
              labelStyle={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              cursor={{ stroke: 'var(--border-color)', strokeWidth: 1.5, strokeDasharray: '4 4' }}
            />
            <Area 
              type="monotone" 
              dataKey={selectedKPI} 
              stroke={color} 
              strokeWidth={3}
              fill="url(#areaGradient)"
              dot={{ r: 0 }}
              activeDot={{ r: 6, fill: 'var(--bg-card)', stroke: color, strokeWidth: 3 }}
              style={{ filter: 'url(#glow)' }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
            {selectedMonth && (
              <ReferenceLine 
                x={selectedMonth} 
                stroke={color}
                strokeOpacity={0.8}
                strokeDasharray="4 4" 
                strokeWidth={1.5}
                label={{ value: 'Target', fill: color, fontSize: 11, position: 'top', fontWeight: 600 }} 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
