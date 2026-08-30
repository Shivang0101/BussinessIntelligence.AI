import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle2, AlertCircle, X, Package } from 'lucide-react';

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
      setResult(null);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
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
      setError('Error connecting to backend: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const isZip = file && file.name.endsWith('.zip');

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="modal-container"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <button className="modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="section-header" style={{ marginBottom: 6 }}>
          <div className="section-header-icon" style={{ background: 'rgba(99,102,241,0.12)' }}>
            <UploadCloud size={20} color="#818cf8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem' }}>Data Upload & Live Ingestion</h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Drop CSV or ZIP • Auto-detect tables</p>
          </div>
        </div>

        <div
          className={`dropzone ${file ? 'has-file' : ''}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input id="file-input" type="file" accept=".csv,.zip" onChange={handleFileSelect} style={{ display: 'none' }} />
          <Package size={38} color={file ? 'var(--status-green)' : '#818cf8'} style={{ marginBottom: 6 }} />
          <p className="primary">
            {file ? (
              <>
                {isZip ? '📦' : '📄'} {file.name}
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: 8 }}>
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </>
            ) : (
              'Drop your .CSV or bulk .ZIP file here'
            )}
          </p>
          <p className="hint">
            Supports individual table CSVs or complete ZIP archives with all 6 Olist tables.
          </p>
        </div>

        {error && (
          <div className="upload-error">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {result && (
          <div className="upload-result">
            <div className="title">✅ Upload Processed Successfully!</div>
            <div>Tables: {result.tables_processed?.join(', ')}</div>
            <div>Rows: {JSON.stringify(result.rows_upserted || result.rows_inserted || {})}</div>
            <div>New Months: {result.new_months_detected?.join(', ') || 'None'}</div>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button 
            className="btn-primary"
            onClick={handleSubmit} 
            disabled={!file || uploading}
          >
            {uploading ? 'Ingesting...' : 'Upload & Re-Analyze'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
