import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, ChevronRight, Loader, ArrowLeft, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
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
      <Header showCTA={false} />

      <div style={s.container}>
        {/* Header Section */}
        <div style={s.headerSection}>
          <button style={s.backBtn} onClick={() => navigate('/')}>
            <ArrowLeft size={18} strokeWidth={2} /> Back Home
          </button>

          <div style={s.titleBlock}>
            <h1 style={s.title}>Analyze Your Resume</h1>
            <p style={s.subtitle}>Get instant AI-powered insights to improve your resume and land your dream job</p>
          </div>
        </div>

        <div style={s.content}>
          {/* Left Column - Upload/Paste */}
          <div style={s.mainForm}>
            {/* Tab Toggle */}
            <div style={s.tabsContainer}>
              {TABS.map(t => (
                <button
                  key={t}
                  style={{
                    ...s.tab,
                    ...(tab === t ? s.tabActive : {}),
                  }}
                  onClick={() => { setTab(t); setError(''); }}
                >
                  {t === 'upload' ? (
                    <>
                      <Upload size={18} strokeWidth={2} />
                      Upload PDF
                    </>
                  ) : (
                    <>
                      <FileText size={18} strokeWidth={2} />
                      Paste Text
                    </>
                  )}
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
                  <div style={s.fileIcon}>
                    <FileText size={28} color="white" strokeWidth={2} />
                  </div>
                  <div style={s.fileDetails}>
                    <div style={s.fileName}>{pdfFile.name}</div>
                    <div style={s.fileSize}>{(pdfFile.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <button style={s.removeBtn} onClick={e => { e.stopPropagation(); setPdfFile(null); }}>
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div style={s.dropzoneContent}>
                  <div style={s.uploadIcon}>
                    <Upload size={40} strokeWidth={1.5} />
                  </div>
                  <p style={s.dropzoneText}>{isDragActive ? 'Drop your PDF here' : 'Drag & drop your resume'}</p>
                  <p style={s.dropzoneHint}>or click to browse your files (up to 10MB)</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Paste Panel */}
        {tab === 'paste' && (
          <div style={s.card}>
            <div style={s.textareaWrapper}>
              <label style={s.label}>Your Resume Text</label>
              <textarea
                style={s.textarea}
                placeholder="Paste your full resume here…"
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                rows={12}
              />
              <div style={s.charCount}>{resumeText.length} characters (min: 50)</div>
            </div>
          </div>
        )}

        {/* Job Description Section */}
        <div style={s.card}>
          <div style={s.jobToggleRow}>
            <div style={s.jobToggleContent}>
              <div style={s.jobToggleTitle}><Briefcase size={18} strokeWidth={2} /> Compare with Job Description</div>
              <div style={s.jobToggleSubtitle}>Get ATS score, keyword matching, and tailoring tips</div>
            </div>
            <label style={s.toggle}>
              <input type="checkbox" checked={includeJob} onChange={e => setIncludeJob(e.target.checked)} style={{ display: 'none' }} />
              <div style={{ ...s.toggleTrack, ...(includeJob ? s.toggleTrackOn : {}) }}>
                <div style={{ ...s.toggleThumb, ...(includeJob ? s.toggleThumbOn : {}) }} />
              </div>
            </label>
          </div>
          {includeJob && (
            <div style={s.textareaWrapper}>
              <label style={s.label}>Job Description</label>
              <textarea
                style={s.textarea}
                placeholder="Paste the job description or job posting here…"
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                rows={8}
              />
              <div style={s.charCount}>{jobDescription.length} characters</div>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div style={s.error}>
            <AlertCircle size={18} strokeWidth={2} />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button style={{...s.submitBtn, opacity: loading ? 0.7 : 1}} onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
              {loadingStep}
            </>
          ) : (
            <>
              Analyze Resume
              <ChevronRight size={18} strokeWidth={2.5} />
            </>
          )}
        </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--paper)',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: 'var(--space-xl)',
  },
  headerSection: {
    marginBottom: 'var(--space-3xl)',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--ink-muted)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    marginBottom: 'var(--space-lg)',
    padding: 0,
    transition: 'color var(--transition-base) ease',
  },
  titleBlock: {
    animation: 'fadeUp 0.5s ease',
  },
  title: {
    fontSize: 'clamp(32px, 5vw, 44px)',
    fontWeight: 700,
    marginBottom: 'var(--space-md)',
    color: 'var(--ink)',
  },
  subtitle: {
    fontSize: 'var(--text-lg)',
    color: 'var(--ink-muted)',
    lineHeight: 1.6,
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 'var(--space-xl)',
  },
  mainForm: {},
  tabsContainer: {
    display: 'flex',
    gap: 'var(--space-sm)',
    background: 'var(--paper-warm)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-sm)',
    marginBottom: 'var(--space-xl)',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    flex: 1,
    padding: 'var(--space-md) var(--space-lg)',
    borderRadius: 'var(--radius)',
    border: 'none',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    background: 'transparent',
    color: 'var(--ink-muted)',
    transition: 'all var(--transition-base) ease',
    fontFamily: 'var(--font-body)',
  },
  tabActive: {
    background: 'var(--paper-card)',
    color: 'var(--accent)',
    boxShadow: 'var(--shadow-sm)',
  },
  card: {
    background: 'var(--paper-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-xl)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all var(--transition-base) ease',
  },
  dropzone: {
    border: '2px dashed var(--border-strong)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-3xl) var(--space-xl)',
    cursor: 'pointer',
    transition: 'all var(--transition-base) ease',
    textAlign: 'center',
    background: 'var(--paper)',
  },
  dropzoneActive: {
    borderColor: 'var(--accent)',
    background: 'rgba(217, 70, 239, 0.05)',
  },
  dropzoneFilled: {
    borderStyle: 'solid',
    borderColor: 'var(--accent)',
    background: 'rgba(217, 70, 239, 0.02)',
  },
  dropzoneContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-lg)',
  },
  uploadIcon: {
    width: 64,
    height: 64,
    borderRadius: 'var(--radius-lg)',
    background: 'rgba(217, 70, 239, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--accent)',
  },
  dropzoneText: {
    fontWeight: 600,
    color: 'var(--ink)',
    fontSize: 'var(--text-lg)',
  },
  dropzoneHint: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-faint)',
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 'var(--radius-lg)',
    background: 'linear-gradient(135deg, #d946ef 0%, #a3185f 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-lg)',
  },
  fileDetails: {
    flex: 1,
    textAlign: 'left',
  },
  fileName: {
    fontWeight: 600,
    fontSize: 'var(--text-base)',
    color: 'var(--ink)',
    marginBottom: '2px',
  },
  fileSize: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-faint)',
  },
  removeBtn: {
    background: 'var(--paper-warm)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: 'var(--space-sm)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--ink-muted)',
    transition: 'all var(--transition-base) ease',
    flexShrink: 0,
  },
  textareaWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  label: {
    fontSize: 'var(--text-sm)',
    fontWeight: 600,
    color: 'var(--ink)',
  },
  textarea: {
    width: '100%',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-lg)',
    fontSize: 'var(--text-base)',
    fontFamily: 'var(--font-body)',
    color: 'var(--ink)',
    background: 'var(--paper)',
    resize: 'vertical',
    minHeight: '180px',
    lineHeight: '1.6',
    transition: 'border-color var(--transition-base) ease',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-faint)',
  },
  jobToggleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--space-lg)',
  },
  jobToggleContent: {
    flex: 1,
  },
  jobToggleTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    fontWeight: 600,
    fontSize: 'var(--text-base)',
    color: 'var(--ink)',
    marginBottom: 'var(--space-xs)',
  },
  jobToggleSubtitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-muted)',
  },
  toggle: {
    cursor: 'pointer',
    flexShrink: 0,
  },
  toggleTrack: {
    width: 52,
    height: 28,
    borderRadius: 100,
    background: 'var(--border-strong)',
    position: 'relative',
    transition: 'background var(--transition-base) ease',
  },
  toggleTrackOn: {
    background: 'var(--accent)',
  },
  toggleThumb: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: 'white',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    transition: 'left var(--transition-base) ease',
  },
  toggleThumbOn: {
    left: 'calc(100% - 25px)',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
    background: 'var(--error-light)',
    border: '1px solid var(--error)',
    color: 'var(--error)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-lg)',
    fontSize: 'var(--text-base)',
    animation: 'slideInLeft 0.3s ease',
  },
  submitBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-lg) var(--space-2xl)',
    background: 'linear-gradient(135deg, #d946ef 0%, #a3185f 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-base)',
    fontWeight: 700,
    boxShadow: '0 8px 32px rgba(217, 70, 239, 0.4)',
    transition: 'all var(--transition-base) ease',
    animation: 'fadeUp 0.5s 0.3s ease both',
  },
};