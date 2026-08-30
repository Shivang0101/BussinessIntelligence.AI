import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function KPICards({ cards, selectedKPI, setSelectedKPI }) {
  const formatVal = (val, format, unit) => {
    if (val === null || val === undefined) return 'N/A';
    if (format === 'currency') return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    if (format === 'percent') return `${val.toFixed(1)}%`;
    return `${val.toLocaleString()} ${unit}`.trim();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
      {cards.map((card) => {
        const isSelected = selectedKPI === card.metric;
        const isAnomaly = card.is_anomaly;
        const momDelta = card.mom_delta_pct;
        const isNegative = momDelta < 0;

        return (
          <motion.div
            key={card.metric}
            onClick={() => setSelectedKPI(card.metric)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card"
            style={{
              padding: '18px 20px',
              cursor: 'pointer',
              position: 'relative',
              borderRadius: '14px',
              borderColor: isSelected 
                ? 'var(--primary-accent)' 
                : isAnomaly 
                ? 'var(--status-red-border)' 
                : 'rgba(255, 255, 255, 0.08)',
              boxShadow: isSelected 
                ? '0 0 25px var(--primary-glow)' 
                : isAnomaly 
                ? '0 0 15px rgba(244, 63, 94, 0.12)' 
                : 'none',
              background: isSelected 
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 22, 38, 0.9) 100%)' 
                : 'rgba(255, 255, 255, 0.025)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.title}
              </span>

              {isAnomaly ? (
                <span className="badge badge-red" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
                  <AlertTriangle size={12} /> Anomaly
                </span>
              ) : (
                <span className="badge badge-green" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
                  <CheckCircle2 size={12} /> Normal
                </span>
              )}
            </div>

            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
              {formatVal(card.current_value, card.format, card.unit)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700, color: isNegative ? 'var(--status-red)' : 'var(--status-green)' }}>
                {isNegative ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                <span>{momDelta >= 0 ? `+${momDelta.toFixed(1)}%` : `${momDelta.toFixed(1)}%`} MoM</span>
              </div>

              {isSelected && (
                <span style={{ fontSize: '0.7rem', color: 'var(--primary-accent)', fontWeight: 600 }}>
                  Analyzing →
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
