import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import KPICards from './components/KPICards';
import DiagnosticTree from './components/DiagnosticTree';
import NarrativePanel from './components/NarrativePanel';
import WhatIfSimulator from './components/WhatIfSimulator';
import TimelineCharts from './components/TimelineCharts';
import DataUpload from './components/DataUpload';
import TelemetryBar from './components/TelemetryBar';

const API_BASE = 'http://localhost:8000';

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

  // 1. Fetch Timeline Series
  useEffect(() => {
    fetch(`${API_BASE}/api/timeline`)
      .then(res => res.json())
      .then(data => setTimelineData(data.data || []))
      .catch(err => console.error('Timeline fetch error:', err));
  }, []);

  // 2. Fetch KPI Summary Cards when month or persona changes
  useEffect(() => {
    fetch(`${API_BASE}/api/kpis?month=${selectedMonth}&persona=${selectedPersona}`)
      .then(res => res.json())
      .then(data => setKpiCards(data.cards || []))
      .catch(err => console.error('KPI Cards fetch error:', err));
  }, [selectedMonth, selectedPersona]);

  // 3. Fetch Diagnostic Tree & AI Narrative when KPI, month, or persona changes
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

  // 4. Handle What-If simulation call
  const handleSimulate = async (kpi, driver, newValue) => {
    const res = await fetch(`${API_BASE}/api/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kpi, driver, new_value: newValue })
    });
    return await res.json();
  };

  // 5. Handle Feedback Submission
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
      alert(`Feedback recorded for ${hypothesisId}`);
    } catch (err) {
      console.error('Feedback error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <TopBar 
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedPersona={selectedPersona}
        setSelectedPersona={setSelectedPersona}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      <KPICards 
        cards={kpiCards}
        selectedKPI={selectedKPI}
        setSelectedKPI={setSelectedKPI}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        <div>
          <DiagnosticTree 
            treeData={treeData}
            onFeedbackSubmit={handleFeedbackSubmit}
          />
          <WhatIfSimulator selectedKPI={selectedKPI} onSimulate={handleSimulate} />
        </div>

        <div>
          <NarrativePanel 
            narrative={narrative}
            persona={selectedPersona}
          />
          <TimelineCharts 
            timelineData={timelineData}
            selectedMonth={selectedMonth}
            selectedKPI={selectedKPI}
          />
        </div>
      </div>

      <TelemetryBar telemetry={telemetry} />

      <DataUpload 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadComplete={() => {
          setIsUploadOpen(false);
          // Refresh timeline and KPI cards
          fetch(`${API_BASE}/api/timeline`).then(res => res.json()).then(d => setTimelineData(d.data || []));
          fetch(`${API_BASE}/api/kpis?month=${selectedMonth}&persona=${selectedPersona}`).then(res => res.json()).then(d => setKpiCards(d.cards || []));
        }}
      />
    </div>
  );
}
