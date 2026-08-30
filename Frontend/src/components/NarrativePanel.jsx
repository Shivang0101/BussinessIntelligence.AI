import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export default function NarrativePanel({ narrative, persona }) {
  if (!narrative) return null;

  // Helper to parse simple markdown formatting into structured JSX
  const renderFormattedText = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();

      // Heading ###
      if (trimmed.startsWith && trimmed.startsWith('###')) {
        return (
          <h4 key={idx} style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '1.25rem', marginBottom: '0.5rem' }}>
            {trimmed.replace(/^###\s*/, '')}
          </h4>
        );
      }

      // Heading **Title**
      if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
        return (
          <h3 key={idx} style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-accent)', marginBottom: '0.75rem', marginTop: '1rem' }}>
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
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
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

      if (!trimmed) return <div key={idx} style={{ height: '0.5rem' }} />;

      // Normal paragraph with **bold** replacements
      const parts = trimmed.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.6 }}>
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
    <div style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '0.5rem', borderRadius: '10px', display: 'flex', color: '#fff' }}>
            <Bot size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Executive Briefing ({persona.toUpperCase()})
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deterministic Facts + AI Synthesis</span>
          </div>
        </div>

        <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
          <Sparkles size={12} /> AI Narrative
        </span>
      </div>

      <div 
        style={{ 
          background: 'var(--bg-app)', 
          padding: '1.25rem', 
          borderRadius: '12px', 
          border: '1px solid var(--border-color)',
          flex: 1,
          overflowY: 'auto'
        }}
      >
        {renderFormattedText(narrative)}
      </div>
    </div>
  );
}
