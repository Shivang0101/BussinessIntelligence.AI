import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Calendar, UploadCloud, Zap } from 'lucide-react';

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

export default function TopBar({ selectedMonth, setSelectedMonth, selectedPersona, setSelectedPersona, onOpenUpload }) {
  return (
    <motion.header 
      className="topbar"
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="topbar-logo">
        <div className="topbar-logo-icon">
          <Zap size={22} color="#fff" />
        </div>
        <div className="topbar-brand">
          <h1>BusinessIntelligence<span className="ai">.ai</span></h1>
          <p>Deterministic KPI Causal Engine • Olist Real-Time Stack</p>
        </div>
      </div>

      <div className="topbar-controls">
        <div className="control-group">
          <UserCheck size={15} color="#818cf8" />
          <label>Persona:</label>
          <select value={selectedPersona} onChange={(e) => setSelectedPersona(e.target.value)}>
            <option value="coo">COO (Operations & Logistics)</option>
            <option value="cmo">CMO (Marketing & Pricing)</option>
            <option value="exec">Executive GM (Unrestricted)</option>
          </select>
        </div>

        <div className="control-group">
          <Calendar size={15} color="#818cf8" />
          <label>Period:</label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {MONTH_OPTIONS.map(m => (
              <option key={m} value={m}>
                {m}{MONTH_LABELS[m] || ''}
              </option>
            ))}
          </select>
        </div>

        <button className="btn-upload" onClick={onOpenUpload}>
          <UploadCloud size={16} />
          Upload Data
        </button>
      </div>
    </motion.header>
  );
}
