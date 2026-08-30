import React, { useState } from 'react';
import { Database, Code, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export default function EvidenceCard({ evidence }) {
  const [showQuery, setShowQuery] = useState(false);

  if (!evidence) return null;

  return (
    <div 
      style={{ 
        background: 'rgba(0, 0, 0, 0.25)', 
        border: '1px solid rgba(255, 255, 255, 0.05)', 
        borderRadius: '10px', 
        padding: '10px 14px', 
        marginBottom: '8px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', padding: '2px 7px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            {evidence.id}
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {evidence.title}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-green" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
            <ShieldCheck size={12} /> {evidence.confidence_level || 'SQL FACT'}
          </span>

          {evidence.query && (
            <button 
              onClick={() => setShowQuery(!showQuery)}
              style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-secondary)', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}
            >
              <Code size={12} />
              <span>SQL</span>
              {showQuery ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
        {evidence.description}
      </p>

      {evidence.source && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          <Database size={12} />
          <span>Source Table: <code style={{ color: '#cbd5e1' }}>{evidence.source}</code></span>
        </div>
      )}

      {showQuery && evidence.query && (
        <div style={{ marginTop: '8px', background: '#05070e', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(99, 102, 241, 0.2)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#a5b4fc', overflowX: 'auto' }}>
          <code>{evidence.query}</code>
        </div>
      )}
    </div>
  );
}
