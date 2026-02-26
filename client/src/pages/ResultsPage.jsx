import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Briefcase, GraduationCap, Star, Zap,
  Target, TrendingUp, CheckCircle, ChevronDown, ChevronUp, Search, Download, Wand2,
} from 'lucide-react';
import DarkModeToggle from '../utils/DarkModeToggle';
import { generatePDF } from '../utils/generatePDF';
import { saveSnapshot } from '../utils/ImprovementTracker';

const PRIORITY_COLOR = { high: 'var(--accent)', medium: 'var(--gold)', low: 'var(--blue)' };
const PRIORITY_BG = { high: 'var(--accent-light)', medium: 'var(--gold-light)', low: 'var(--blue-light)' };

function ScoreRing({ score, size = 120 }) {
  const r = (size / 2) - 10;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--gold)' : 'var(--accent)';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={8} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        fill="var(--ink)" fontSize={size/5} fontWeight="700"
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fontFamily: 'var(--font-body)' }}>
        {score}
      </text>
    </svg>
  );
}

function MiniBar({ label, value }) {
  const color = value >= 80 ? 'var(--green)' : value >= 60 ? 'var(--gold)' : 'var(--accent)';
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
        <span>{label}</span><span style={{ fontWeight: 600, color }}>{value}</span>
      </div>
      <div style={{ height: 6, background: 'var(--paper-warm)', borderRadius: 3 }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 3, transition: 'width 1s ease' }} />
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={s.section}>
      <button style={s.sectionHeader} onClick={() => setOpen(!open)}>
        <span style={s.sectionTitleRow}><Icon size={18} color="var(--accent)" /> {title}</span>
        {open ? <ChevronUp size={18} color="var(--ink-faint)" /> : <ChevronDown size={18} color="var(--ink-faint)" />}
      </button>
      {open && <div style={s.sectionBody}>{children}</div>}
    </div>
  );
}

function Tag({ children, bg = 'var(--paper-warm)', color = 'var(--ink-muted)' }) {
  return (
    <span style={{ padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 500, background: bg, color, display: 'inline-block' }}>
      {children}
    </span>
  );
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [exporting, setExporting] = useState(false);
  const [snapshotSaved, setSnapshotSaved] = useState(false);

  // Auto-save snapshot whenever fresh results are viewed
  useEffect(() => {
    if (state?.analysis && !snapshotSaved) {
      saveSnapshot(state.analysis);
      setSnapshotSaved(true);
    }
  }, [state?.analysis]);

  if (!state?.analysis) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>No results found. <button onClick={() => navigate('/analyze')} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Go back</button></p>
      </div>
    );
  }

  const { analysis: a, matchData: m } = state;

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await generatePDF(a, m);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* Header */}
        <div style={s.topBar}>
          <button style={s.back} onClick={() => navigate('/analyze')}>
            <ArrowLeft size={16} /> Analyze Another
          </button>
          <h1 style={s.pageTitle}>Analysis Results</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={s2.exportBtn} onClick={handleExportPDF} disabled={exporting}>
              <Download size={15} />
              {exporting ? 'Exporting...' : 'Export PDF'}
            </button>
            <DarkModeToggle />
          </div>
        </div>

        {/* Snapshot saved notice */}
        {snapshotSaved && (
          <div style={s2.snapshotBanner}>
            <TrendingUp size={15} color="var(--green)" />
            Snapshot saved to your <button style={s2.snapshotLink} onClick={() => navigate('/ai-tools', { state: { analysis: a }, hash: 'tracker' })}>Improvement Tracker</button>
          </div>
        )}

        {/* Score Hero */}
        <div style={s.scoreHero}>
          <div style={s.scoreLeft}>
            <div style={s.gradeChip}>Grade: <strong>{a.score.grade}</strong></div>
            <h2 style={s.candidateName}>{a.candidate?.name || 'Your Resume'}</h2>
            {a.candidate?.summary && <p style={s.candidateSummary}>{a.candidate.summary}</p>}
          </div>
          <div style={s.scoreRight}>
            <ScoreRing score={a.score.overall} size={130} />
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 13, color: 'var(--ink-faint)' }}>Overall Score</div>
          </div>
        </div>

        {/* AI Tools Banner */}
        <div style={s2.aiBanner}>
          <div style={s2.aiBannerLeft}>
            <Wand2 size={20} color="var(--accent)" />
            <div>
              <div style={s2.aiBannerTitle}>AI Career Tools Available</div>
              <div style={s2.aiBannerSub}>Generate a cover letter, prep for interviews, and optimize your LinkedIn — all tailored to your resume.</div>
            </div>
          </div>
          <button
            style={s2.aiBannerBtn}
            onClick={() => navigate('/ai-tools', { state: { analysis: a } })}
          >
            Open Tools →
          </button>
        </div>

        {/* Breakdown bars */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>Score Breakdown</h3>
          {Object.entries(a.score.breakdown).map(([key, val]) => (
            <MiniBar key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} value={val} />
          ))}
        </div>

        {/* Strengths */}
        {a.strengths?.length > 0 && (
          <Section icon={CheckCircle} title="Strengths">
            <ul style={s.list}>
              {a.strengths.map((str, i) => (
                <li key={i} style={s2.strengthItem}>
                  <CheckCircle size={15} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Improvements */}
        {a.improvements?.length > 0 && (
          <Section icon={Zap} title="Improvements">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {a.improvements.map((item, i) => (
                <div key={i} style={{ ...s2.improvCard, borderLeft: `3px solid ${PRIORITY_COLOR[item.priority]}` }}>
                  <div style={s2.improvHeader}>
                    <Tag bg={PRIORITY_BG[item.priority]} color={PRIORITY_COLOR[item.priority]}>{item.priority} priority</Tag>
                    <span style={s2.improvCat}>{item.category}</span>
                  </div>
                  <p style={s2.improvIssue}><strong>Issue:</strong> {item.issue}</p>
                  <p style={s2.improvSug}><strong>Fix:</strong> {item.suggestion}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Skills */}
        {a.skills && (
          <Section icon={Star} title="Skills Detected">
            {Object.entries(a.skills).map(([category, items]) =>
              items?.length > 0 ? (
                <div key={category} style={{ marginBottom: 16 }}>
                  <div style={s2.skillCat}>{category.charAt(0).toUpperCase() + category.slice(1)}</div>
                  <div style={s2.tagRow}>{items.map(skill => <Tag key={skill}>{skill}</Tag>)}</div>
                </div>
              ) : null
            )}
          </Section>
        )}

        {/* Experience */}
        {a.experience?.length > 0 && (
          <Section icon={Briefcase} title="Experience" defaultOpen={false}>
            {a.experience.map((exp, i) => (
              <div key={i} style={s2.expCard}>
                <div style={s2.expHeader}>
                  <strong>{exp.role}</strong>
                  <span style={s2.expDuration}>{exp.duration}</span>
                </div>
                <div style={s2.expCompany}>{exp.company}</div>
                <ul style={s2.expList}>
                  {exp.highlights?.map((h, j) => <li key={j} style={s2.expItem}>{h}</li>)}
                </ul>
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {a.education?.length > 0 && (
          <Section icon={GraduationCap} title="Education" defaultOpen={false}>
            {a.education.map((edu, i) => (
              <div key={i} style={s2.eduCard}>
                <strong>{edu.degree}</strong>
                <div style={{ fontSize: 14, color: 'var(--ink-muted)' }}>{edu.institution} {edu.year ? `· ${edu.year}` : ''}</div>
              </div>
            ))}
          </Section>
        )}

        {/* Keywords */}
        {(a.keywords?.length > 0 || a.missingKeywords?.length > 0) && (
          <Section icon={Target} title="Keywords" defaultOpen={false}>
            {a.keywords?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={s2.skillCat}>Present in Resume</div>
                <div style={s2.tagRow}>{a.keywords.map(k => <Tag key={k} bg="var(--green-light)" color="var(--green)">{k}</Tag>)}</div>
              </div>
            )}
            {a.missingKeywords?.length > 0 && (
              <div>
                <div style={s2.skillCat}>Missing / Suggested</div>
                <div style={s2.tagRow}>{a.missingKeywords.map(k => <Tag key={k} bg="var(--accent-light)" color="var(--accent-dark)">{k}</Tag>)}</div>
              </div>
            )}
          </Section>
        )}

        {/* Job Match */}
        {m && (
          <Section icon={TrendingUp} title={`Job Match · ${m.matchScore}/100`}>
            <div style={s2.matchScoreRow}>
              <ScoreRing score={m.matchScore} size={100} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>Grade: {m.matchGrade}</div>
                <p style={{ color: 'var(--ink-muted)', fontSize: 14 }}>{m.verdict}</p>
              </div>
            </div>
            {m.matchedRequirements?.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div style={s2.skillCat}>✅ Matched Requirements</div>
                {m.matchedRequirements.map((r, i) => (
                  <div key={i} style={s2.reqItem}>
                    <strong style={{ fontSize: 13 }}>{r.requirement}</strong>
                    <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 3 }}>{r.evidence}</p>
                  </div>
                ))}
              </div>
            )}
            {m.missingRequirements?.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div style={s2.skillCat}>❌ Gaps Found</div>
                {m.missingRequirements.map((r, i) => (
                  <div key={i} style={{ ...s2.reqItem, borderLeft: '3px solid var(--accent)' }}>
                    <strong style={{ fontSize: 13 }}>{r.requirement}</strong>
                    <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 3 }}>{r.gap}</p>
                    <p style={{ fontSize: 13, color: 'var(--blue)', marginTop: 4 }}><strong>How to fix:</strong> {r.howToAddress}</p>
                  </div>
                ))}
              </div>
            )}
            {m.tailoringTips?.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div style={s2.skillCat}>💡 Tailoring Tips</div>
                {m.tailoringTips.map((t, i) => (
                  <div key={i} style={s2.tipItem}>
                    <Tag bg="var(--blue-light)" color="var(--blue)">{t.section}</Tag>
                    <p style={{ fontSize: 14, marginTop: 6, color: 'var(--ink-muted)' }}>{t.tip}</p>
                  </div>
                ))}
              </div>
            )}
            {m.atsOptimization && (
              <div style={{ marginTop: 20, padding: 16, background: 'var(--paper-warm)', borderRadius: 8 }}>
                <div style={{ fontWeight: 600, marginBottom: 10 }}>ATS Score: {m.atsOptimization.score}/100</div>
                <MiniBar label="ATS Compatibility" value={m.atsOptimization.score} />
                <ul style={{ paddingLeft: 18, marginTop: 10 }}>
                  {m.atsOptimization.tips?.map((t, i) => <li key={i} style={{ fontSize: 13, color: 'var(--ink-muted)', marginBottom: 6 }}>{t}</li>)}
                </ul>
              </div>
            )}
          </Section>
        )}

        {/* Footer actions */}
        <div style={s2.footerAction}>
          <button
            style={s2.aiToolsBtn}
            onClick={() => navigate('/ai-tools', { state: { analysis: a } })}
          >
            <Wand2 size={16} /> AI Career Tools
          </button>
          <button style={s2.findJobsBtn} onClick={() => navigate('/jobs', { state: { analysis: a } })}>
            <Search size={16} /> Find Matching Jobs
          </button>
          <button style={s2.pdfBtn} onClick={handleExportPDF} disabled={exporting}>
            <Download size={16} /> {exporting ? 'Exporting...' : 'Export PDF Report'}
          </button>
          <button style={s2.analyzeBtn} onClick={() => navigate('/analyze')}>
            Analyze Another Resume
          </button>
        </div>

      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: 'var(--paper)', padding: '40px 24px' },
  container: { maxWidth: 760, margin: '0 auto' },
  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 32 },
  back: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--ink-muted)', fontSize: 14, padding: 0, flexShrink: 0,
  },
  pageTitle: { fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '-0.02em', flex: 1 },
  scoreHero: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'var(--paper-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '28px 32px', marginBottom: 16,
    boxShadow: 'var(--shadow-sm)', gap: 24,
  },
  scoreLeft: { flex: 1 },
  scoreRight: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  gradeChip: {
    display: 'inline-block', padding: '4px 12px',
    background: 'var(--paper-warm)', borderRadius: 100,
    fontSize: 13, color: 'var(--ink-muted)', marginBottom: 10,
  },
  candidateName: { fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 10, letterSpacing: '-0.02em' },
  candidateSummary: { fontSize: 14, color: 'var(--ink-muted)', lineHeight: 1.6, maxWidth: 440 },
  card: {
    background: 'var(--paper-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '24px 28px', marginBottom: 16,
    boxShadow: 'var(--shadow-sm)',
  },
  cardTitle: { fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 },
  section: {
    background: 'var(--paper-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', marginBottom: 16, boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
  },
  sectionHeader: {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 24px', background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: 'var(--font-body)',
  },
  sectionTitleRow: { display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, fontSize: 16, color: 'var(--ink)' },
  sectionBody: { padding: '0 24px 24px' },
  list: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 },
};

const s2 = {
  snapshotBanner: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 16px', marginBottom: 16, borderRadius: 8,
    background: 'var(--green-light, #d8f0e2)', border: '1px solid var(--green)',
    fontSize: 13, color: 'var(--ink)',
  },
  snapshotLink: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--green)', fontWeight: 600, fontSize: 13,
    textDecoration: 'underline', padding: 0,
  },
  aiBanner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 16, padding: '16px 20px', marginBottom: 16, borderRadius: 12,
    background: 'linear-gradient(135deg, var(--accent-light, #fde8e3), var(--blue-light, #deeaf7))',
    border: '1px solid var(--border)',
  },
  aiBannerLeft: { display: 'flex', alignItems: 'flex-start', gap: 12 },
  aiBannerTitle: { fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 3 },
  aiBannerSub: { fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.4 },
  aiBannerBtn: {
    flexShrink: 0, padding: '9px 18px', borderRadius: 8,
    background: 'var(--accent)', color: 'white', border: 'none',
    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
    whiteSpace: 'nowrap',
  },
  strengthItem: { display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'var(--ink)' },
  improvCard: { padding: '14px 16px', background: 'var(--paper-warm)', borderRadius: 8 },
  improvHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 },
  improvCat: { fontSize: 12, fontWeight: 600, color: 'var(--ink-muted)' },
  improvIssue: { fontSize: 14, marginBottom: 6, color: 'var(--ink)' },
  improvSug: { fontSize: 14, color: 'var(--green)' },
  skillCat: { fontSize: 12, fontWeight: 700, color: 'var(--ink-faint)', letterSpacing: '0.06em', marginBottom: 10, textTransform: 'uppercase' },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  expCard: { marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' },
  expHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  expDuration: { fontSize: 12, color: 'var(--ink-faint)' },
  expCompany: { fontSize: 13, color: 'var(--ink-muted)', marginBottom: 10 },
  expList: { paddingLeft: 18 },
  expItem: { fontSize: 14, color: 'var(--ink)', marginBottom: 6, lineHeight: 1.5 },
  eduCard: { marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--border)', fontSize: 14 },
  matchScoreRow: { display: 'flex', alignItems: 'center', gap: 24 },
  reqItem: {
    padding: '12px 14px', background: 'var(--paper-warm)', borderRadius: 8,
    marginBottom: 10, borderLeft: '3px solid var(--green)',
  },
  tipItem: { marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--border)' },
  exportBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 14px', background: 'var(--paper-warm)', color: 'var(--ink)',
    border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
  },
  footerAction: {
    display: 'flex', gap: 12, justifyContent: 'center',
    marginTop: 40, marginBottom: 40, flexWrap: 'wrap',
  },
  aiToolsBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '14px 24px', background: 'var(--accent)', color: 'white',
    border: 'none', borderRadius: 10, cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600,
    boxShadow: '0 4px 14px rgba(200,75,47,0.25)',
  },
  findJobsBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '14px 24px', background: 'var(--ink)', color: 'var(--paper)',
    border: 'none', borderRadius: 10, cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600,
  },
  pdfBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '14px 24px', background: 'var(--paper-warm)', color: 'var(--ink)',
    border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500,
  },
  analyzeBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '14px 24px', background: 'var(--paper)', color: 'var(--ink)',
    border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500,
  },
};