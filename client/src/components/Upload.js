import React, { useState, useRef } from 'react';

const Upload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSuccess(false);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setSuccess(false);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      setSuccess(true);
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setSuccess(false);
      setError('');
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  // Set page background color
  React.useEffect(() => {
    document.body.style.background = 'linear-gradient(0deg,rgb(18, 19, 18) 55%, #64b5f6 100%)';
    return () => { document.body.style.background = ''; };
  }, []);

  return (
    <div style={{
      maxWidth: 420,
      margin: '48px auto',
      padding: 36,
      borderRadius: 20,
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      background: ' rgba(0,0,0,0.18)',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      textAlign: 'center',
      transition: 'box-shadow 0.2s',
    }}>
      <h2 style={{ fontWeight: 800, marginBottom: 28, color: '#ececf1', letterSpacing: 1 }}>Upload PDF</h2>
      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '2.5px solid #19c37d' : '2.5px dashed #565869',
          borderRadius: 14,
          padding: '44px 0',
          marginBottom: 24,
          background: dragActive ? '#343541' : '#40414f',
          color: '#ececf1',
          fontWeight: 500,
          fontSize: 17,
          cursor: 'pointer',
          boxShadow: dragActive ? '0 0 0 4px #19c37d22' : 'none',
          transition: 'border 0.2s, background 0.2s, box-shadow 0.2s',
        }}
      >
        {file ? (
          <div style={{ fontWeight: 600, color: '#19c37d' }}>{file.name}</div>
        ) : (
          <div style={{ fontSize: 17 }}>
            Drag & drop your PDF here<br />
            <span style={{ fontSize: 14, color: '#b4bcd0' }}>or click to select</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{
          width: '100%',
          padding: '14px 0',
          borderRadius: 10,
          border: 'none',
          background: !file || uploading ? '#565869' : 'linear-gradient(90deg, #19c37d 0%, #00b87a 100%)',
          color: '#ececf1',
          fontWeight: 700,
          fontSize: 17,
          boxShadow: '0 2px 12px rgba(25, 118, 210, 0.10)',
          cursor: !file || uploading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseOver={e => {
          if (file && !uploading) e.target.style.background = 'linear-gradient(90deg, #00b87a 0%, #19c37d 100%)';
        }}
        onMouseOut={e => {
          if (file && !uploading) e.target.style.background = 'linear-gradient(90deg, #19c37d 0%, #00b87a 100%)';
        }}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {success && <div style={{ color: '#19c37d', marginTop: 18, fontWeight: 600, fontSize: 15 }}>Upload successful!</div>}
      {error && <div style={{ color: '#ef4146', marginTop: 18, fontWeight: 600, fontSize: 15 }}>{error}</div>}
    </div>
  );
};

export default Upload; 