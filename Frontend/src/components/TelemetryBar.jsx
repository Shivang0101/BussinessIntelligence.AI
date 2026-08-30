import React from 'react';
import { Database, Cpu, Zap, Clock, DollarSign } from 'lucide-react';

export default function TelemetryBar({ telemetry }) {
  if (!telemetry) return null;

  const items = [
    { icon: <Database size={13} color="#818cf8" />, label: 'SQL Queries', value: telemetry.sql_queries_executed },
    { icon: <Cpu size={13} color="#fbbf24" />, label: 'Gemini Calls', value: telemetry.gemini_calls },
    { icon: <Zap size={13} color="#34d399" />, label: 'Tokens', value: telemetry.tokens_used },
    { icon: <Clock size={13} />, label: 'Latency', value: `${telemetry.latency_seconds}s` },
    { icon: <DollarSign size={13} color="#34d399" />, label: 'Cost', value: `$${telemetry.cost_usd.toFixed(2)}` },
  ];

  return (
    <div className="telemetry-bar">
      {items.map(({ icon, label, value }) => (
        <div key={label} className="telemetry-item">
          {icon}
          <span>{label}: <strong>{value}</strong></span>
        </div>
      ))}
    </div>
  );
}
