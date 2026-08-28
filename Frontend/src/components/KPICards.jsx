import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function KPICards({ cards, selectedKPI, setSelectedKPI }) {
  const formatVal = (val, format, unit) => {
    if (val === null || val === undefined) return 'N/A';
    if (format === 'currency') return `R$${val.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    if (format === 'percent') return `${val.toFixed(1)}%`;
    if (format === 'number') return `${val.toLocaleString()} ${unit}`.trim();
    return `${val} ${unit}`.trim();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
      {cards.map((card) => {
        const isSelected = selectedKPI === card.metric;
        const isAnomaly = card.is_anomaly;
        const momDelta = card.mom_delta_pct;
        const isNegative = momDelta < 0;

        return (
          <div
            key={card.metric}
            onClick={() => setSelectedKPI(card.metric)}
            className="glass-card"
            style={{
              padding: '16px',
              cursor: 'pointer',
              position: 'relative',
              borderColor: isSelected 
                ? 'var(--primary-accent)' 
                : isAnomaly 
                ? 'rgba(239, 68, 68, 0.4)' 
                : 'rgba(255, 255, 255, 0.08)',
              boxShadow: isSelected 
                ? '0 0 20px var(--primary-glow)' 
                : isAnomaly 
                ? '0 0 15px rgba(239, 68, 68, 0.15)' 
                : 'none',
              background: isSelected 
                ? 'rgba(99, 102, 241, 0.08)' 
                : 'rgba(255, 255, 255, 0.02)'
            }}
          >
            {isAnomaly && (
              <div style={{ position: 'absolute', top: '10px', right: '10px' }} title={`Anomaly detected (z=${card.z_score})`}>
                <AlertTriangle size={16} color="var(--status-red)" />
              </div>
            )}

            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {card.title}
            </div>

            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              {formatVal(card.current_value, card.format, card.unit)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: isNegative ? 'var(--status-red)' : 'var(--status-green)' }}>
                {isNegative ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                <span>{momDelta >= 0 ? `+${momDelta.toFixed(1)}%` : `${momDelta.toFixed(1)}%`} MoM</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                z={card.z_score > 0 ? `+${card.z_score}` : card.z_score}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
