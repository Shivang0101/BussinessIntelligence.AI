import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import KPICards from './components/KPICards';
import DiagnosticTree from './components/DiagnosticTree';
import NarrativePanel from './components/NarrativePanel';
import WhatIfSimulator from './components/WhatIfSimulator';
import TimelineCharts from './components/TimelineCharts';
import DataUpload from './components/DataUpload';
import TelemetryBar from './components/TelemetryBar';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const containerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.1 } 
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function App() {
  const [selectedMonth, setSelectedMonth] = useState('2018-08');
  const [selectedPersona, setSelectedPersona] = useState('coo');
  const [selectedKPI, setSelectedKPI] = useState('revenue');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [kpiCards, setKpiCards] = useState([]);
  const [treeData, setTreeData] = useState(null);
  const [narrative, setNarrative] = useState('');
  const [telemetry, setTelemetry] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/timeline`)
      .then(res => res.json())
      .then(data => setTimelineData(data.data || []))
      .catch(err => console.error('Timeline fetch error:', err));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/kpis?month=${selectedMonth}&persona=${selectedPersona}`)
      .then(res => res.json())
      .then(data => setKpiCards(data.cards || []))
      .catch(err => console.error('KPI Cards fetch error:', err));
  }, [selectedMonth, selectedPersona]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/investigate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        month: selectedMonth,
        kpi: selectedKPI,
        persona: selectedPersona
      })
    })
      .then(res => res.json())
      .then(data => {
        setTreeData(data.tree);
        setNarrative(data.narrative);
        setTelemetry(data.telemetry);
      })
      .catch(err => console.error('Investigate fetch error:', err))
      .finally(() => setLoading(false));
  }, [selectedMonth, selectedKPI, selectedPersona]);

  const handleSimulate = async (kpi, driver, newValue) => {
    const res = await fetch(`${API_BASE}/api/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kpi, driver, new_value: newValue })
    });
    return await res.json();
  };

  const handleFeedbackSubmit = async (hypothesisId, type, comment) => {
    try {
      await fetch(`${API_BASE}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hypothesis_id: hypothesisId,
          feedback_type: type,
          user_comment: comment,
          target_month: selectedMonth,
          persona: selectedPersona
        })
      });
    } catch (err) {
      console.error('Feedback error:', err);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar 
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedPersona={selectedPersona}
        setSelectedPersona={setSelectedPersona}
        onOpenUpload={() => setIsUploadOpen(true)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <main className="dashboard-content">
        <header className="dashboard-header">
          <h2>Diagnostic Dashboard</h2>
          <p>Analyzing key performance indicators for {selectedMonth}</p>
        </header>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <KPICards 
            cards={kpiCards}
            selectedKPI={selectedKPI}
            setSelectedKPI={setSelectedKPI}
          />
        </motion.div>

        <motion.div 
          className="bento-grid"
          variants={containerVariants} 
          initial="initial" 
          animate="animate"
        >
          {/* Main Large Component */}
          <motion.div variants={itemVariants} className="bento-item span-8">
            <DiagnosticTree 
              treeData={treeData}
              loading={loading}
              onFeedbackSubmit={handleFeedbackSubmit}
            />
          </motion.div>

          {/* AI Narrative Panel */}
          <motion.div variants={itemVariants} className="bento-item span-4">
            <NarrativePanel 
              narrative={narrative}
              persona={selectedPersona}
            />
          </motion.div>

          {/* Secondary Data Blocks */}
          <motion.div variants={itemVariants} className="bento-item span-6">
            <TimelineCharts 
              timelineData={timelineData}
              selectedMonth={selectedMonth}
              selectedKPI={selectedKPI}
            />
          </motion.div>
          <motion.div variants={itemVariants} className="bento-item span-6">
            <WhatIfSimulator 
              selectedKPI={selectedKPI} 
              onSimulate={handleSimulate} 
            />
          </motion.div>
        </motion.div>

        <TelemetryBar telemetry={telemetry} />
      </main>

      <AnimatePresence>
        {isUploadOpen && (
          <DataUpload 
            isOpen={isUploadOpen}
            onClose={() => setIsUploadOpen(false)}
            onUploadComplete={() => {
              setIsUploadOpen(false);
              fetch(`${API_BASE}/api/timeline`).then(res => res.json()).then(d => setTimelineData(d.data || []));
              fetch(`${API_BASE}/api/kpis?month=${selectedMonth}&persona=${selectedPersona}`).then(res => res.json()).then(d => setKpiCards(d.cards || []));
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
