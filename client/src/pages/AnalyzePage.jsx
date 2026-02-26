import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, ChevronRight, Loader, ArrowLeft, Briefcase } from 'lucide-react';
import { parsePdf, analyzeResume, matchJob } from '../utils/api.js';

const TABS = ['upload', 'paste'];

export default function AnalyzePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('upload');
  const [pdfFile, setPdfFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [includeJob, setIncludeJob] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted) => {
    if (accepted.length) { setPdfFile(accepted[0]); setError(''); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1,
  });

  const handleSubmit = async () => {
    setError('');
    try {
      setLoading(true);
      let text = resumeText.trim();

      if (tab === 'upload') {
        if (!pdfFile) { setError('Please upload a PDF file.'); setLoading(false); return; }
        setLoadingStep('Extracting text from PDF…');
        const parsed = await parsePdf(pdfFile);
        text = parsed.text;
      } else {
        if (text.length < 50) { setError('Please paste your resume text (at least 50 characters).'); setLoading(false); return; }
      }

      setLoadingStep('Analyzing your resume with AI…');
      const analysis = await analyzeResume(text);

      let matchData = null;
      if (includeJob && jobDescription.trim()) {
        setLoadingStep('Matching against job description…');
        matchData = await matchJob(text, jobDescription.trim());
      }

      navigate('/results', { state: { analysis, matchData, resumeText: text } });
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Back */}
        <button style={s.back} onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back
        </button>

        <h1 style={s.title}>Analyze Your Resume</h1>
        <p style={s.subtitle}>Upload a PDF or paste your resume text to get started.</p>

        {/* Tab Toggle */}
        <div style={s.tabs}>
          {TABS.map(t => (
            <button key={t} style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }} onClick={() => setTab(t)}>
              {t === 'upload' ? <><Upload size={14} /> Upload PDF</> : <><FileText size={14} /> Paste Text</>}
            </button>
          ))}
        </div>

        {/* Upload Panel */}
        {tab === 'upload' && (
          <div style={s.card}>
            <div {...getRootProps()} style={{ ...s.dropzone, ...(isDragActive ? s.dropzoneActive : {}), ...(pdfFile ? s.dropzoneFilled : {}) }}>
              <input {...getInputProps()} />
              {pdfFile ? (
                <div style={s.fileInfo}>
                  <FileText size={28} color="var(--accent)" />
                  <div>
                    <div style={s.fileName}>{pdfFile.name}</div>
                    <div style={s.fileSize}>{(pdfFile.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <button style={s.removeBtn} onClick={e => { e.stopPropagation(); setPdfFile(null); }}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div style={s.dropzoneContent}>
                  <Upload size={32} color="var(--ink-faint)" />
                  <p style={s.dropzoneText}>{isDragActive ? 'Drop it here!' : 'Drag & drop your PDF'}</p>
                  <p style={s.dropzoneHint}>or click to browse — max 10MB</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Paste Panel */}
        {tab === 'paste' && (
          <div style={s.card}>
            <textarea
              style={s.textarea}
              placeholder="Paste your full resume text here…"
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              rows={14}
            />
            <div style={s.charCount}>{resumeText.length} characters</div>
          </div>
        )}

        {/* Job Description Toggle */}
        <div style={s.card}>
          <div style={s.jobToggleRow}>
            <div>
              <div style={s.jobToggleTitle}><Briefcase size={16} /> Match with Job Description</div>
              <div style={s.jobToggleSubtitle}>Get ATS score and tailoring tips for a specific role</div>
            </div>
            <label style={s.toggle}>
              <input type="checkbox" checked={includeJob} onChange={e => setIncludeJob(e.target.checked)} style={{ display: 'none' }} />
              <div style={{ ...s.toggleTrack, ...(includeJob ? s.toggleTrackOn : {}) }}>
                <div style={{ ...s.toggleThumb, ...(includeJob ? s.toggleThumbOn : {}) }} />
              </div>
            </label>
          </div>
          {includeJob && (
            <textarea
              style={{ ...s.textarea, marginTop: 16 }}
              placeholder="Paste the full job description here…"
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              rows={8}
            />
          )}
        </div>

        {/* Error */}
        {error && <div style={s.error}>{error}</div>}

        {/* Submit */}
        <button style={s.submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> {loadingStep}</>
          ) : (
            <>Analyze Resume <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: 'var(--paper)', padding: '40px 24px' },
  container: { maxWidth: 680, margin: '0 auto' },
  back: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--ink-muted)', fontSize: 14, marginBottom: 32, padding: 0,
  },
  title: { fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, letterSpacing: '-0.02em' },
  subtitle: { color: 'var(--ink-muted)', marginBottom: 32, fontSize: 15 },
  tabs: {
    display: 'flex', gap: 4, background: 'var(--paper-warm)',
    borderRadius: 10, padding: 4, marginBottom: 20, width: 'fit-content',
  },
  tab: {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '10px 20px', borderRadius: 8, border: 'none',
    cursor: 'pointer', fontSize: 14, fontWeight: 500,
    background: 'transparent', color: 'var(--ink-muted)',
    transition: 'all 0.2s', fontFamily: 'var(--font-body)',
  },
  tabActive: { background: 'var(--paper-card)', color: 'var(--ink)', boxShadow: 'var(--shadow-sm)' },
  card: {
    background: 'var(--paper-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: 24, marginBottom: 16,
    boxShadow: 'var(--shadow-sm)',
  },
  dropzone: {
    border: '2px dashed var(--border-strong)', borderRadius: 10,
    padding: 48, cursor: 'pointer', transition: 'all 0.2s',
    textAlign: 'center',
  },
  dropzoneActive: { borderColor: 'var(--accent)', background: 'var(--accent-light)' },
  dropzoneFilled: { borderStyle: 'solid', borderColor: 'var(--accent)' },
  dropzoneContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 },
  dropzoneText: { fontWeight: 500, color: 'var(--ink)', fontSize: 16 },
  dropzoneHint: { fontSize: 13, color: 'var(--ink-faint)' },
  fileInfo: { display: 'flex', alignItems: 'center', gap: 16 },
  fileName: { fontWeight: 600, fontSize: 15 },
  fileSize: { fontSize: 12, color: 'var(--ink-faint)' },
  removeBtn: {
    marginLeft: 'auto', background: 'var(--paper-warm)', border: 'none',
    borderRadius: 6, padding: 6, cursor: 'pointer', display: 'flex',
    color: 'var(--ink-muted)',
  },
  textarea: {
    width: '100%', border: '1px solid var(--border)', borderRadius: 8,
    padding: '14px 16px', fontSize: 14, fontFamily: 'var(--font-body)',
    color: 'var(--ink)', background: 'var(--paper)', resize: 'vertical',
    outline: 'none', lineHeight: 1.6, transition: 'border-color 0.2s',
  },
  charCount: { textAlign: 'right', fontSize: 12, color: 'var(--ink-faint)', marginTop: 8 },
  jobToggleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  jobToggleTitle: { display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, marginBottom: 4 },
  jobToggleSubtitle: { fontSize: 13, color: 'var(--ink-muted)' },
  toggle: { cursor: 'pointer' },
  toggleTrack: {
    width: 44, height: 24, borderRadius: 12, background: 'var(--border-strong)',
    position: 'relative', transition: 'background 0.2s',
  },
  toggleTrackOn: { background: 'var(--accent)' },
  toggleThumb: {
    position: 'absolute', top: 3, left: 3, width: 18, height: 18,
    borderRadius: '50%', background: 'white',
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s',
  },
  toggleThumbOn: { left: 23 },
  error: {
    background: '#fef2f0', border: '1px solid var(--accent-light)',
    color: 'var(--accent-dark)', borderRadius: 8, padding: '12px 16px',
    fontSize: 14, marginBottom: 16,
  },
  submitBtn: {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: '16px 32px', background: 'var(--accent)', color: 'white',
    border: 'none', borderRadius: 12, cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600,
    boxShadow: '0 4px 20px rgba(200,75,47,0.3)',
    transition: 'opacity 0.2s',
  },
};