import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, X, FileText, Package } from 'lucide-react';

export default function DataUpload({ isOpen, onClose, onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        if (onUploadComplete) onUploadComplete(data);
      } else {
        setError(data.detail || 'Upload failed');
      }
    } catch (err) {
      setError('Error connecting to backend API: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-panel" style={{ width: '90%', maxWidth: '540px', padding: '24px', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <UploadCloud size={24} color="var(--primary-accent)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Data Upload & Live Ingestion</h3>
        </div>

        {/* Dropzone */}
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          style={{
            border: '2px dashed var(--bg-card-border)',
            borderRadius: '10px',
            padding: '30px',
            textAlign: 'center',
            background: 'rgba(0,0,0,0.2)',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input id="file-input" type="file" accept=".csv,.zip" onChange={handleFileSelect} style={{ display: 'none' }} />
          <Package size={36} color="var(--primary-accent)" style={{ marginBottom: '10px' }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {file ? file.name : "Drop your .CSV or bulk .ZIP file here"}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Supports single table CSVs or complete ZIP archives containing raw Olist tables.
          </p>
        </div>

        {error && (
          <div style={{ color: 'var(--status-red)', fontSize: '0.8rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {result && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.8rem', color: 'var(--status-green)' }}>
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>✅ Upload Processed Successfully!</div>
            <div>Tables Processed: {result.tables_processed?.join(', ')}</div>
            <div>New Months: {result.new_months_detected?.join(', ') || 'None'}</div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid var(--bg-card-border)', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={!file || uploading}
            style={{ background: 'var(--primary-accent)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
          >
            {uploading ? 'Ingesting...' : 'Upload & Re-Analyze'}
          </button>
        </div>
      </div>
    </div>
  );
}
