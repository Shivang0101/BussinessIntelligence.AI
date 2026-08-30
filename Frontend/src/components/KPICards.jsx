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

  const container = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const item = {
    initial: { opacity: 0, scale: 0.95, y: 15 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={container}
      initial="initial"
      animate="animate"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}
    >
      {cards.map((card) => {
        const isSelected = selectedKPI === card.metric;
        const isAnomaly = card.is_anomaly;
        const momDelta = card.mom_delta_pct;
        const isNegative = momDelta < 0;

        return (
          <motion.div
            key={card.metric}
            variants={item}
            onClick={() => setSelectedKPI(card.metric)}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            className={`glass-card ${isSelected ? 'selected' : ''}`}
            style={{
              padding: '1.25rem',
              cursor: 'pointer',
              position: 'relative',
              borderColor: isSelected 
                ? 'var(--primary-accent)' 
                : isAnomaly 
                ? 'var(--status-red-border)' 
                : 'var(--border-color)',
              boxShadow: isSelected 
                ? '0 0 0 1px var(--primary-accent), var(--shadow-card)' 
                : isAnomaly 
                ? '0 0 0 1px var(--status-red-border), var(--shadow-card)' 
                : 'var(--shadow-card)',
              background: isSelected 
                ? 'var(--primary-light)' 
                : 'var(--bg-card)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.title}
              </span>

              {isAnomaly ? (
                <span className="badge badge-red" style={{ padding: '4px 8px' }}>
                  <AlertTriangle size={12} /> Anomaly
                </span>
              ) : (
                <span className="badge badge-green" style={{ padding: '4px 8px' }}>
                  <CheckCircle2 size={12} /> Normal
                </span>
              )}
            </div>

            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              {formatVal(card.current_value, card.format, card.unit)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: isNegative ? 'var(--status-red)' : 'var(--status-green)' }}>
                {isNegative ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                <span>{momDelta >= 0 ? `+${momDelta.toFixed(1)}%` : `${momDelta.toFixed(1)}%`} MoM</span>
              </div>

              {isSelected && (
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-accent)', fontWeight: 600 }}>
                  Analyzing &rarr;
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
