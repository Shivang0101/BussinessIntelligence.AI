import React, { useState } from 'react';
import { Database, Code, CheckCircle, FileText } from 'lucide-react';

export default function EvidenceCard({ evidence }) {
  const [showQuery, setShowQuery] = useState(false);

  return (
    <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '10px 14px', marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary-accent)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            {evidence.id}
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {evidence.title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="badge-green" style={{ fontSize: '0.68rem' }}>
            {evidence.confidence_level || 'SQL FACT'}
          </span>
          {evidence.query && (
            <button 
              onClick={() => setShowQuery(!showQuery)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
              title="Toggle SQL Query Lineage"
            >
              <Code size={14} />
            </button>
          )}
        </div>
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
        {evidence.description}
      </p>

      {evidence.source && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          <Database size={12} />
          <span>Source: {evidence.source}</span>
        </div>
      )}

      {showQuery && evidence.query && (
        <div style={{ marginTop: '8px', background: '#070a12', padding: '8px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#a5b4fc', overflowX: 'auto' }}>
          <code>{evidence.query}</code>
        </div>
      )}
    </div>
  );
}
