import React from 'react';
import { GitBranch, AlertOctagon, Info } from 'lucide-react';
import TreeNode from './TreeNode';

export default function DiagnosticTree({ treeData, onFeedbackSubmit }) {
  if (!treeData) {
    return (
      <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading diagnostic analysis...
      </div>
    );
  }

  // Handle Abstention
  if (treeData.status === 'ABSTAIN') {
    return (
      <div className="glass-panel" style={{ padding: '24px', borderColor: 'var(--status-yellow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--status-yellow)', marginBottom: '10px' }}>
          <AlertOctagon size={24} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Statistical Analysis Suspended (Abstention)</h3>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
          {treeData.message}
        </p>
      </div>
    );
  }

  const rootNode = treeData.tree;

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <GitBranch size={20} color="var(--primary-accent)" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Diagnostic Causal Tree — {treeData.title} ({treeData.target_month})
          </h2>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Sample size: <strong style={{ color: '#fff' }}>{treeData.sample_size}</strong> orders
        </div>
      </div>

      {rootNode ? (
        <TreeNode node={rootNode} level={0} onFeedbackSubmit={onFeedbackSubmit} />
      ) : (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No causal tree branch available for this metric.</div>
      )}
    </div>
  );
}
