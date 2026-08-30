import React from 'react';
import { GitBranch, AlertTriangle, CheckCircle2, Users } from 'lucide-react';
import TreeNode from './TreeNode';

export default function DiagnosticTree({ treeData, onFeedbackSubmit }) {
  if (!treeData) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Building diagnostic causal tree...
      </div>
    );
  }

  // Handle Abstention
  if (treeData.status === 'ABSTAIN') {
    return (
      <div className="glass-panel" style={{ padding: '1.5rem', borderColor: 'var(--status-yellow-border)', background: 'var(--status-yellow-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--status-yellow)', marginBottom: '0.5rem' }}>
          <AlertTriangle size={24} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Statistical Analysis Suspended (Abstention)</h3>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
          {treeData.message}
        </p>
      </div>
    );
  }

  const rootNode = treeData.tree;
  const isAnomaly = treeData.status === 'ANOMALY_DETECTED';

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Tree Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '0.5rem', borderRadius: '10px', display: 'flex', color: '#fff' }}>
            <GitBranch size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Root Cause Tree — {treeData.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span className={isAnomaly ? "badge badge-red" : "badge badge-green"} style={{ fontSize: '0.72rem' }}>
                {isAnomaly ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                {isAnomaly ? 'Anomaly Flagged' : 'Within Normal Baseline'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Period: <strong style={{ color: 'var(--text-primary)' }}>{treeData.target_month}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Legend & Sample size */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-red)' }} /> High Impact
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-yellow)' }} /> Medium Impact
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <Users size={14} color="var(--primary-accent)" />
            <span>Sample: <strong style={{ color: 'var(--text-primary)' }}>{treeData.sample_size}</strong> orders</span>
          </div>
        </div>
      </div>

      {/* Tree Visualization Container */}
      <div style={{ position: 'relative', padding: '0.25rem 0' }}>
        {rootNode ? (
          <TreeNode node={rootNode} level={0} isLast={true} onFeedbackSubmit={onFeedbackSubmit} />
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No causal drivers detected for this metric.</div>
        )}
      </div>
    </div>
  );
}
