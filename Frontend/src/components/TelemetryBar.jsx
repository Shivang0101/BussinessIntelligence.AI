import React from 'react';
import { Database, Cpu, Zap, Clock, DollarSign } from 'lucide-react';

export default function TelemetryBar({ telemetry }) {
  if (!telemetry) return null;

  return (
    <div 
      className="glass-panel" 
      style={{ 
        padding: '10px 20px', 
        marginTop: '24px', 
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={14} color="var(--primary-accent)" />
          <span>SQL Queries: <strong style={{ color: '#fff' }}>{telemetry.sql_queries_executed}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={14} color="var(--status-yellow)" />
          <span>Gemini Calls: <strong style={{ color: '#fff' }}>{telemetry.gemini_calls}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={14} color="var(--status-green)" />
          <span>Tokens: <strong style={{ color: '#fff' }}>{telemetry.tokens_used}</strong></span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} />
          <span>Latency: <strong style={{ color: '#fff' }}>{telemetry.latency_seconds}s</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <DollarSign size={14} color="var(--status-green)" />
          <span>Cost: <strong style={{ color: '#fff' }}>${telemetry.cost_usd.toFixed(2)}</strong></span>
        </div>
      </div>
    </div>
  );
}
