import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Shield, ChevronDown, ChevronUp } from 'lucide-react';

export default function HypothesisTestResults({ testResults }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!testResults) return null;

  const tests = [
    { key: 'temporal', label: 'Temporal Alignment', data: testResults.temporal },
    { key: 'direction', label: 'Direction Consistency', data: testResults.direction },
    { key: 'magnitude', label: 'Magnitude Proportionality', data: testResults.magnitude },
    { key: 'counterfactual', label: 'Counterfactual Falsification', data: testResults.counterfactual },
    { key: 'evidence', label: 'Evidence Density', data: testResults.evidence },
  ];

  const passedCount = tests.filter(t => t.data && t.data.passed).length;
  const totalCount = tests.length;

  return (
    <div style={{ marginTop: '10px', background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={15} color="var(--primary-accent)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Statistical Validation: <strong style={{ color: 'var(--status-green)' }}>{passedCount}/{totalCount} Tests Passed</strong>
          </span>
        </div>

        <button 
          onClick={() => setShowDetails(!showDetails)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}
        >
          <span>{showDetails ? 'Hide Tests' : 'View Audit Details'}</span>
          {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {showDetails && (
        <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {tests.map(({ key, label, data }) => {
            if (!data) return null;
            const passed = data.passed;
            const weakened = data.weakened;

            return (
              <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.75rem' }}>
                <div style={{ marginTop: '1px', flexShrink: 0 }}>
                  {passed ? (
                    <CheckCircle2 size={14} color="var(--status-green)" />
                  ) : weakened ? (
                    <AlertTriangle size={14} color="var(--status-yellow)" />
                  ) : (
                    <XCircle size={14} color="var(--status-red)" />
                  )}
                </div>
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{label}: </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{data.detail}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
