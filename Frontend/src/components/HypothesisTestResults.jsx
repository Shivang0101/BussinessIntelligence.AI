import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function HypothesisTestResults({ testResults }) {
  if (!testResults) return null;

  const tests = [
    { key: 'temporal', label: '1. Temporal Co-occurrence', data: testResults.temporal },
    { key: 'direction', label: '2. Direction Consistency', data: testResults.direction },
    { key: 'magnitude', label: '3. Magnitude Proportionality', data: testResults.magnitude },
    { key: 'counterfactual', label: '4. Counterfactual Check', data: testResults.counterfactual },
    { key: 'evidence', label: '5. Evidence Density', data: testResults.evidence },
  ];

  return (
    <div style={{ marginTop: '10px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
        5-Point Hypothesis Validation Battery
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {tests.map(({ key, label, data }) => {
          if (!data) return null;
          const passed = data.passed;
          const weakened = data.weakened;

          return (
            <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.75rem' }}>
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
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
    </div>
  );
}
