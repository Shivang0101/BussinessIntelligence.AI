import React from 'react';
import { FileText, Bot } from 'lucide-react';

export default function NarrativePanel({ narrative, persona }) {
  if (!narrative) return null;

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bot size={20} color="var(--primary-accent)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            AI Executive Narrative ({persona.toUpperCase()})
          </h3>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
          Gemini 2.5 Flash Polish
        </span>
      </div>

      <div 
        style={{ 
          fontSize: '0.88rem', 
          color: 'var(--text-primary)', 
          lineHeight: 1.6, 
          whiteSpace: 'pre-line',
          background: 'rgba(0,0,0,0.2)',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        {narrative}
      </div>
    </div>
  );
}
