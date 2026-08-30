import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from './components/TopBar';
import KPICards from './components/KPICards';
import DiagnosticTree from './components/DiagnosticTree';
import NarrativePanel from './components/NarrativePanel';
import WhatIfSimulator from './components/WhatIfSimulator';
import TimelineCharts from './components/TimelineCharts';
import DataUpload from './components/DataUpload';
import TelemetryBar from './components/TelemetryBar';

const API_BASE = 'http://localhost:8000';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
};

export default function App() {
  const [selectedMonth, setSelectedMonth] = useState('2018-08');
  const [selectedPersona, setSelectedPersona] = useState('coo');
  const [selectedKPI, setSelectedKPI] = useState('revenue');
  
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
      <TopBar 
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedPersona={selectedPersona}
        setSelectedPersona={setSelectedPersona}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      <motion.div variants={pageVariants} initial="initial" animate="animate">
        <KPICards 
          cards={kpiCards}
          selectedKPI={selectedKPI}
          setSelectedKPI={setSelectedKPI}
        />
      </motion.div>

      <div className="main-grid">
        <motion.div 
          initial={{ opacity: 0, x: -16 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          <DiagnosticTree 
            treeData={treeData}
            loading={loading}
            onFeedbackSubmit={handleFeedbackSubmit}
          />
          <WhatIfSimulator selectedKPI={selectedKPI} onSimulate={handleSimulate} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 16 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.25, duration: 0.45 }}
        >
          <NarrativePanel 
            narrative={narrative}
            persona={selectedPersona}
          />
          <TimelineCharts 
            timelineData={timelineData}
            selectedMonth={selectedMonth}
            selectedKPI={selectedKPI}
          />
        </motion.div>
      </div>

      <TelemetryBar telemetry={telemetry} />

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
