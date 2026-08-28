import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Award, HelpCircle, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import EvidenceCard from './EvidenceCard';
import HypothesisTestResults from './HypothesisTestResults';

export default function TreeNode({ node, level = 0, onFeedbackSubmit }) {
  const [expanded, setExpanded] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [userComment, setUserComment] = useState('');

  if (!node) return null;

  const isResidual = node.node_type === 'RESIDUAL';
  const hasChildren = node.children && node.children.length > 0;
  const contrib = node.contribution_pct || 0;
  const conf = node.confidence_score || 0;

  const getContribColor = (c) => {
    if (c >= 25) return 'var(--status-red)';
    if (c >= 12) return 'var(--status-yellow)';
    return 'var(--text-muted)';
  };

  return (
    <div style={{ marginLeft: level > 0 ? '24px' : '0px', marginTop: '12px', borderLeft: level > 0 ? '2px solid rgba(255,255,255,0.08)' : 'none', paddingLeft: level > 0 ? '16px' : '0px' }}>
      <div 
        className="glass-card"
        style={{
          padding: '14px 18px',
          borderColor: isResidual ? 'rgba(245, 158, 11, 0.3)' : level === 0 ? 'var(--primary-accent)' : 'rgba(255,255,255,0.08)',
          background: isResidual ? 'rgba(245, 158, 11, 0.04)' : level === 0 ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.02)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {hasChildren && (
              <button 
                onClick={() => setExpanded(!expanded)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
              >
                {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: isResidual ? 'var(--status-yellow)' : 'var(--text-primary)' }}>
                  {node.title}
                </span>
                {contrib > 0 && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: getContribColor(contrib), background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                    {contrib}% contribution
                  </span>
                )}
                {conf > 0 && !isResidual && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary-accent)', background: 'rgba(99, 102, 241, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                    {conf}% conf.
                  </span>
                )}
              </div>

              {node.hypothesis && (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                  {node.hypothesis}
                </p>
              )}
            </div>
          </div>

          {/* Feedback buttons */}
          {!isResidual && level > 0 && (
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                onClick={() => onFeedbackSubmit(node.id, 'agree', 'Agreed with automated cause ranking')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                title="Agree with hypothesis"
              >
                <ThumbsUp size={14} />
              </button>
              <button 
                onClick={() => onFeedbackSubmit(node.id, 'disagree', 'Disagreed with automated cause ranking')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                title="Disagree with hypothesis"
              >
                <ThumbsDown size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Evidence & Test Battery Details */}
        {expanded && (
          <div style={{ marginTop: '12px' }}>
            {node.evidence && node.evidence.length > 0 && (
              <div>
                {node.evidence.map((ev) => (
                  <EvidenceCard key={ev.id} evidence={ev} />
                ))}
              </div>
            )}

            {node.test_results && (
              <HypothesisTestResults testResults={node.test_results} />
            )}
          </div>
        )}
      </div>

      {/* Recursive Children Rendering */}
      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} onFeedbackSubmit={onFeedbackSubmit} />
          ))}
        </div>
      )}
    </div>
  );
}
