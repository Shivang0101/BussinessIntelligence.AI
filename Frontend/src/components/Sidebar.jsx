import React from 'react';
import { UserCheck, Calendar, UploadCloud, Zap, Sun, Moon } from 'lucide-react';

const MONTH_OPTIONS = [
  "2016-09", "2016-10", "2016-12", "2017-01", "2017-02", "2017-03", "2017-04",
  "2017-05", "2017-06", "2017-07", "2017-08", "2017-09", "2017-10", "2017-11",
  "2017-12", "2018-01", "2018-02", "2018-03", "2018-04", "2018-05", "2018-06",
  "2018-07", "2018-08", "2018-09", "2018-10"
];

const MONTH_LABELS = {
  "2017-11": " ⚡ Multi-Factor",
  "2018-08": " ★ Last Full",
  "2018-09": " ⛔ Abstain"
};

export default function Sidebar({ selectedMonth, setSelectedMonth, selectedPersona, setSelectedPersona, onOpenUpload, isDarkMode, setIsDarkMode }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <Zap size={22} color="#fff" />
        </div>
        <div className="sidebar-brand">
          <h1>BI<span className="ai">.ai</span></h1>
          <p>Deterministic Engine</p>
        </div>
      </div>

      <div className="sidebar-controls">
        <div className="control-group">
          <label><Calendar size={14} color="var(--primary-accent)" /> Period Target</label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {MONTH_OPTIONS.map(m => (
              <option key={m} value={m}>
                {m}{MONTH_LABELS[m] || ''}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label><UserCheck size={14} color="var(--primary-accent)" /> Persona View</label>
          <select value={selectedPersona} onChange={(e) => setSelectedPersona(e.target.value)}>
            <option value="coo">COO (Operations)</option>
            <option value="cmo">CMO (Marketing)</option>
            <option value="exec">Exec GM (Full)</option>
          </select>
        </div>

        <button className="btn-upload" onClick={onOpenUpload}>
          <UploadCloud size={16} />
          Upload Data
        </button>
      </div>

      <div className="sidebar-footer">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Theme</span>
        <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)} aria-label="Toggle theme">
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </aside>
  );
}
