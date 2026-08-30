import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, ThumbsUp, ThumbsDown, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import EvidenceCard from './EvidenceCard';
import HypothesisTestResults from './HypothesisTestResults';

export default function TreeNode({ node, level = 0, isLast = false, onFeedbackSubmit }) {
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'evidence', 'validation'

  if (!node) return null;

  const isResidual = node.node_type === 'RESIDUAL';
  const hasChildren = node.children && node.children.length > 0;
  const contrib = node.contribution_pct || 0;
  const conf = node.confidence_score || 0;
  const isNegative = (node.mom_delta_pct || 0) < 0;

  const getImpactColor = (c) => {
    if (c >= 30) return 'var(--status-red)';
    if (c >= 15) return 'var(--status-yellow)';
    return 'var(--text-muted)';
  };

  const formatVal = (val, format, unit) => {
    if (val === null || val === undefined) return 'N/A';
    if (format === 'currency') return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    if (format === 'percent') return `${val.toFixed(1)}%`;
    return `${val.toLocaleString()} ${unit}`.trim();
  };

  return (
    <div style={{ position: 'relative', marginTop: level > 0 ? '14px' : '0px', paddingLeft: level > 0 ? '36px' : '0px' }}>
      {/* Branch connecting lines */}
      {level > 0 && (
        <>
          <div className="tree-branch-line" style={{ bottom: isLast ? 'calc(100% - 24px)' : '0px' }} />
          <div className="tree-node-connector" />
        </>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="glass-card"
        style={{
          padding: '16px 20px',
          borderRadius: '14px',
          borderColor: isResidual 
            ? 'var(--status-yellow-border)' 
            : level === 0 
            ? 'var(--primary-accent)' 
            : 'var(--border-color)',
          boxShadow: level === 0 
            ? '0 0 0 1px var(--primary-accent), var(--shadow-panel)' 
            : 'var(--shadow-card)',
          background: isResidual 
            ? 'var(--status-yellow-bg)' 
            : level === 0 
            ? 'var(--primary-light)' 
            : 'var(--bg-card)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
            {hasChildren && (
              <button 
                onClick={() => setExpanded(!expanded)} 
                style={{ 
                  background: 'var(--bg-app)', 
                  border: '1px solid var(--border-color)', 
                  color: 'var(--text-primary)', 
                  padding: '4px', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  display: 'flex',
                  marginTop: '2px'
                }}
              >
                {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
            )}

            <div style={{ flex: 1 }}>
              {/* Title & Value Badges */}
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: level === 0 ? '1.1rem' : '0.95rem', fontWeight: 700, color: isResidual ? 'var(--status-yellow)' : 'var(--text-primary)' }}>
                  {node.title}
                </span>

                {node.current_value !== undefined && (
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', background: 'var(--bg-app)', border: '1px solid var(--border-color)', padding: '2px 8px', borderRadius: '6px' }}>
                    {formatVal(node.current_value, node.format, node.unit)}
                  </span>
                )}

                {node.mom_delta_pct !== undefined && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '0.75rem', fontWeight: 700, color: isNegative ? 'var(--status-red)' : 'var(--status-green)' }}>
                    {isNegative ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                    {node.mom_delta_pct > 0 ? `+${node.mom_delta_pct.toFixed(1)}%` : `${node.mom_delta_pct.toFixed(1)}%`} MoM
                  </span>
                )}
              </div>

              {/* Driver Contribution & Confidence Pills */}
              {contrib > 0 && !isResidual && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', marginBottom: '8px' }}>
                  <span 
                    style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: 700, 
                      color: '#fff', 
                      background: getImpactColor(contrib), 
                      padding: '2px 9px', 
                      borderRadius: '9999px' 
                    }}
                  >
                    {contrib}% Impact Contribution
                  </span>

                  {conf > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Confidence:</span>
                      <div style={{ width: '60px', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${conf}%`, height: '100%', background: 'var(--primary-accent)', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-accent)' }}>{conf}%</span>
                    </div>
                  )}
                </div>
              )}

              {/* Clear Human Statement */}
              {node.hypothesis && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.45 }}>
                  {node.hypothesis}
                </p>
              )}
            </div>
          </div>

          {/* Feedback buttons */}
          {!isResidual && level > 0 && (
            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', padding: '2px', borderRadius: '8px' }}>
              <button 
                onClick={() => onFeedbackSubmit(node.id, 'agree', 'Agreed with automated root cause')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                title="Agree with hypothesis"
              >
                <ThumbsUp size={14} />
              </button>
              <button 
                onClick={() => onFeedbackSubmit(node.id, 'disagree', 'Disagreed with automated root cause')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                title="Disagree with hypothesis"
              >
                <ThumbsDown size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Tab Navigation for Evidence & Validation */}
        {!isResidual && (node.evidence?.length > 0 || node.test_results) && (
          <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              {node.evidence?.length > 0 && (
                <button 
                  onClick={() => setActiveTab(activeTab === 'evidence' ? 'summary' : 'evidence')}
                  style={{ 
                    background: activeTab === 'evidence' ? 'var(--primary-light)' : 'var(--bg-app)',
                    border: '1px solid',
                    borderColor: activeTab === 'evidence' ? 'var(--primary-accent)' : 'var(--border-color)',
                    color: activeTab === 'evidence' ? 'var(--primary-accent)' : 'var(--text-muted)', 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    fontSize: '0.72rem', 
                    fontWeight: 600, 
                    cursor: 'pointer' 
                  }}
                >
                  Evidence ({node.evidence.length})
                </button>
              )}

              {node.test_results && (
                <button 
                  onClick={() => setActiveTab(activeTab === 'validation' ? 'summary' : 'validation')}
                  style={{ 
                    background: activeTab === 'validation' ? 'var(--status-green-bg)' : 'var(--bg-app)',
                    border: '1px solid',
                    borderColor: activeTab === 'validation' ? 'var(--status-green)' : 'var(--border-color)', 
                    color: activeTab === 'validation' ? 'var(--status-green)' : 'var(--text-muted)', 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    fontSize: '0.72rem', 
                    fontWeight: 600, 
                    cursor: 'pointer' 
                  }}
                >
                  Statistical Validation
                </button>
              )}
            </div>

            {/* Tab Panels */}
            {activeTab === 'evidence' && (
              <div style={{ marginTop: '10px' }}>
                {node.evidence.map((ev) => (
                  <EvidenceCard key={ev.id} evidence={ev} />
                ))}
              </div>
            )}

            {activeTab === 'validation' && node.test_results && (
              <div style={{ marginTop: '10px' }}>
                <HypothesisTestResults testResults={node.test_results} />
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Recursive Children Rendering */}
      <AnimatePresence>
        {expanded && hasChildren && (
          <div>
            {node.children.map((child, index) => (
              <TreeNode 
                key={child.id} 
                node={child} 
                level={level + 1} 
                isLast={index === node.children.length - 1} 
                onFeedbackSubmit={onFeedbackSubmit} 
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
