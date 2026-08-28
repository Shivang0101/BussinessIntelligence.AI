import React from 'react';
import { UserCheck, Calendar, UploadCloud, Activity, Zap } from 'lucide-react';

const MONTH_OPTIONS = [
  "2016-09", "2016-10", "2016-12", "2017-01", "2017-02", "2017-03", "2017-04",
  "2017-05", "2017-06", "2017-07", "2017-08", "2017-09", "2017-10", "2017-11",
  "2017-12", "2018-01", "2018-02", "2018-03", "2018-04", "2018-05", "2018-06",
  "2018-07", "2018-08", "2018-09", "2018-10"
];

export default function TopBar({ selectedMonth, setSelectedMonth, selectedPersona, setSelectedPersona, onOpenUpload }) {
  return (
    <header className="glass-panel" style={{ padding: '14px 24px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'var(--primary-accent)', color: '#fff', padding: '8px', borderRadius: '10px', display: 'flex' }}>
          <Zap size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            BusinessIntelligence<span style={{ color: 'var(--primary-accent)', WebkitTextFillColor: 'var(--primary-accent)' }}>.ai</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deterministic KPI Causal Engine • Olist Real-Time Stack</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Persona Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--bg-card-border)' }}>
          <UserCheck size={16} color="var(--primary-accent)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Persona:</span>
          <select 
            value={selectedPersona} 
            onChange={(e) => setSelectedPersona(e.target.value)}
            style={{ background: 'transparent', color: '#fff', border: 'none', fontSize: '0.85rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
          >
            <option value="coo" style={{ background: '#121826' }}>COO (Operations & Logistics)</option>
            <option value="cmo" style={{ background: '#121826' }}>CMO (Marketing & Pricing)</option>
            <option value="exec" style={{ background: '#121826' }}>Executive GM (Unrestricted)</option>
          </select>
        </div>

        {/* Month Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--bg-card-border)' }}>
          <Calendar size={16} color="var(--primary-accent)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Period:</span>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ background: 'transparent', color: '#fff', border: 'none', fontSize: '0.85rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
          >
            {MONTH_OPTIONS.map(m => (
              <option key={m} value={m} style={{ background: '#121826' }}>
                {m} {m === "2018-08" ? " (Last Full)" : m === "2017-11" ? " (Multi-Factor)" : m === "2018-09" ? " (Abstain)" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Trigger Button */}
        <button 
          onClick={onOpenUpload}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: 'var(--primary-accent)', 
            color: '#fff', 
            border: 'none', 
            padding: '8px 16px', 
            borderRadius: '8px', 
            fontWeight: 600, 
            fontSize: '0.85rem', 
            cursor: 'pointer',
            boxShadow: '0 4px 14px var(--primary-glow)'
          }}
        >
          <UploadCloud size={16} />
          Upload Data
        </button>
      </div>
    </header>
  );
}
