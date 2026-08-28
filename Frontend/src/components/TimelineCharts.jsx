import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { LineChart as ChartIcon } from 'lucide-react';

export default function TimelineCharts({ timelineData, selectedMonth, selectedKPI }) {
  if (!timelineData || timelineData.length === 0) return null;

  const kpiColors = {
    revenue: '#6366f1',
    orders: '#10b981',
    avg_order_value: '#f59e0b',
    avg_delivery_days: '#ef4444',
    avg_rating: '#8b5cf6'
  };

  const currentColor = kpiColors[selectedKPI] || '#6366f1';

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <ChartIcon size={20} color="var(--primary-accent)" />
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          26-Month Historical Series — {selectedKPI.replace(/_/g, ' ').toUpperCase()}
        </h3>
      </div>

      <div style={{ width: '100%', height: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timelineData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
            <YAxis stroke="var(--text-muted)" fontSize={11} />
            <Tooltip 
              contentStyle={{ background: '#121826', border: '1px solid var(--bg-card-border)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem' }}
            />
            <Line 
              type="monotone" 
              dataKey={selectedKPI} 
              stroke={currentColor} 
              strokeWidth={2}
              dot={{ r: 3, fill: currentColor }}
              activeDot={{ r: 6 }}
            />
            {selectedMonth && (
              <ReferenceLine x={selectedMonth} stroke="var(--status-red)" strokeDasharray="3 3" label={{ value: ' Selected', fill: 'var(--status-red)', fontSize: 10 }} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
