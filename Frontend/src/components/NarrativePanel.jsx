import React from 'react';
import { Bot, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function NarrativePanel({ narrative, persona }) {
  if (!narrative) return null;

  // Helper to parse simple markdown formatting into structured JSX
  const renderFormattedText = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();

      // Heading ###
      if (trimmed.startswith && trimmed.startswith('###')) {
        return (
          <h4 key={idx} style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '14px', marginBottom: '6px' }}>
            {trimmed.replace(/^###\s*/, '')}
          </h4>
        );
      }

      // Heading **Title**
      if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
        return (
          <h3 key={idx} style={{ fontSize: '1rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '8px' }}>
            {trimmed.replace(/\*\*/g, '')}
          </h3>
        );
      }

      // Bullet items -
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const content = trimmed.replace(/^[-*]\s*/, '');
        // Replace bold **text** inside bullet
        const parts = content.split(/(\*\*.*?\*\*)/g);
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--primary-accent)', fontWeight: 'bold' }}>•</span>
            <div>
              {parts.map((p, pIdx) => {
                if (p.startsWith('**') && p.endsWith('**')) {
                  return <strong key={pIdx} style={{ color: 'var(--text-primary)' }}>{p.replace(/\*\*/g, '')}</strong>;
                }
                return p;
              })}
            </div>
          </div>
        );
      }

      if (!trimmed) return <div key={idx} style={{ height: '6px' }} />;

      // Normal paragraph with **bold** replacements
      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.5 }}>
          {parts.map((p, pIdx) => {
            if (p.startsWith('**') && p.endsWith('**')) {
              return <strong key={pIdx} style={{ color: 'var(--text-primary)' }}>{p.replace(/\*\*/g, '')}</strong>;
            }
            return p;
          })}
        </p>
      );
    });
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Background ambient glow */}
      <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', pb: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '7px', borderRadius: '10px', display: 'flex', color: '#fff' }}>
            <Bot size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Executive Briefing ({persona.toUpperCase()})
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Deterministic Facts + Gemini Narrative Polish</span>
          </div>
        </div>

        <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
          <Sparkles size={12} /> AI Narrative
        </span>
      </div>

      <div 
        style={{ 
          background: 'rgba(0,0,0,0.25)', 
          padding: '16px 18px', 
          borderRadius: '12px', 
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        {renderFormattedText(narrative)}
      </div>
    </div>
  );
}
