import React from 'react';
import { GitBranch, AlertTriangle, CheckCircle2, ShieldCheck, Users } from 'lucide-react';
import TreeNode from './TreeNode';

export default function DiagnosticTree({ treeData, onFeedbackSubmit }) {
  if (!treeData) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Building diagnostic causal tree...
      </div>
    );
  }

  // Handle Abstention
  if (treeData.status === 'ABSTAIN') {
    return (
      <div className="glass-panel" style={{ padding: '24px', borderColor: 'var(--status-yellow-border)', background: 'var(--status-yellow-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--status-yellow)', marginBottom: '10px' }}>
          <AlertTriangle size={24} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Statistical Analysis Suspended (Abstention)</h3>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
          {treeData.message}
        </p>
      </div>
    );
  }

  const rootNode = treeData.tree;
  const isAnomaly = treeData.status === 'ANOMALY_DETECTED';

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      {/* Tree Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', pb: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '8px', borderRadius: '10px', display: 'flex', color: '#fff' }}>
            <GitBranch size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Root Cause Tree — {treeData.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span className={isAnomaly ? "badge badge-red" : "badge badge-green"} style={{ fontSize: '0.72rem' }}>
                {isAnomaly ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                {isAnomaly ? 'Anomaly Flagged' : 'Within Normal Baseline'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Period: <strong style={{ color: '#f1f5f9' }}>{treeData.target_month}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Legend & Sample size */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e' }} /> High Impact
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} /> Medium Impact
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <Users size={14} color="var(--primary-accent)" />
            <span>Sample: <strong style={{ color: '#fff' }}>{treeData.sample_size}</strong> orders</span>
          </div>
        </div>
      </div>

      {/* Tree Visualization Container */}
      <div style={{ position: 'relative', padding: '4px 0' }}>
        {rootNode ? (
          <TreeNode node={rootNode} level={0} isLast={true} onFeedbackSubmit={onFeedbackSubmit} />
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No causal drivers detected for this metric.</div>
        )}
      </div>
    </div>
  );
}
