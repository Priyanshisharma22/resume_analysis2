import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  FileText, ArrowRight, CheckCircle, Zap, Target, TrendingUp,
  FileSearch, Plus, Sparkles, ChevronRight
} from 'lucide-react';
import DarkModeToggle from '../utils/DarkModeToggle';

const WORDS = ['feedback.', 'insights.', 'results.', 'success.'];

export default function HomePage() {
  const navigate = useNavigate();
  const [wordIdx, setWordIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setWordIdx(i => (i + 1) % WORDS.length);
        setFading(false);
      }, 350);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const goToAnalyze = () => navigate('/analyze');
  const goToBuilder = () => navigate('/ai-tools', { state: { defaultTab: 'maker' } });

  return (
    <div style={s.page}>
      {/* NAV */}
      <nav style={s.nav}>
        <div style={s.logo}>
          <div style={s.logoBox}>R</div>
          <span style={s.logoText}>ResumeIQ</span>
        </div>
        <div style={s.navRight}>
          <DarkModeToggle />
          <button style={s.navBtn} onClick={goToAnalyze}>
            Analyze My Resume <ArrowRight size={15} />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.badge}><Sparkles size={13} /> AI-Powered Career Tools</div>

          <h1 style={s.heading}>
            Get instant AI
            <br />
            <span style={{ ...s.word, opacity: fading ? 0 : 1, transform: fading ? 'translateY(8px)' : 'translateY(0)' }}>
              {WORDS[wordIdx]}
            </span>
          </h1>

          <p style={s.subheading}>
            Upload your resume. Paste a job description. Get an instant AI
            analysis with a score, skill breakdown, and prioritized
            improvements — in seconds.
          </p>

          {/* PRIMARY ACTIONS */}
          <div style={s.actionRow}>
            {/* Existing resume */}
            <button style={s.primaryBtn} onClick={goToAnalyze}>
              <FileSearch size={18} />
              Get My Analysis
              <ArrowRight size={16} />
            </button>

            {/* No resume */}
            <button style={s.secondaryBtn} onClick={goToBuilder}>
              <Plus size={18} />
              Build a Resume
              <span style={s.secondaryBtnTag}>New</span>
            </button>
          </div>

          {/* No resume nudge card */}
          <div style={s.nudgeCard}>
            <div style={s.nudgeIcon}><FileText size={20} color="var(--accent)" /></div>
            <div style={s.nudgeText}>
              <span style={s.nudgeBold}>Don't have a resume yet?</span>
              {" "}Build one in minutes with our Resume Maker — choose from 8 professional templates and export as PDF.
            </div>
            <button style={s.nudgeBtn} onClick={goToBuilder}>
              Start Building <ChevronRight size={14} />
            </button>
          </div>

          {/* Trust badges */}
          <div style={s.badges}>
            {['Instant analysis in seconds', 'ATS optimization tips', 'No signup required', '8 resume templates'].map((b, i) => (
              <span key={i} style={s.trustBadge}>
                <CheckCircle size={13} color="var(--accent)" /> {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section style={s.features}>
        {FEATURES.map((f, i) => (
          <div key={i} style={s.card}>
            <div style={{ ...s.cardIcon, background: f.bg }}>
              <f.icon size={22} color="var(--accent)" />
            </div>
            <div style={s.cardTitle}>{f.title}</div>
            <div style={s.cardDesc}>{f.desc}</div>
          </div>
        ))}
      </section>

      {/* NO RESUME SECTION */}
      <section style={s.builderSection}>
        <div style={s.builderInner}>
          <div style={s.builderLeft}>
            <div style={s.builderBadge}>✨ New Feature</div>
            <h2 style={s.builderTitle}>Starting from scratch?</h2>
            <p style={s.builderDesc}>
              Our Resume Maker helps you build a polished, professional resume in minutes.
              Pick from 8 templates — Classic, Modern, Creative, Tech, and more — fill in your details,
              and export as PDF or HTML. No existing resume needed.
            </p>
            <div style={s.templatePills}>
              {['Classic', 'Modern', 'Minimal', 'Executive', 'Creative', 'Tech', 'Compact', 'Academic'].map(t => (
                <span key={t} style={s.pill}>{t}</span>
              ))}
            </div>
            <button style={s.builderBtn} onClick={goToBuilder}>
              <Plus size={16} /> Build My Resume Free
            </button>
          </div>
          <div style={s.builderRight}>
            <div style={s.mockCard}>
              <div style={s.mockHeader}>
                <div style={s.mockDot} /><div style={s.mockDot} /><div style={s.mockDot} />
                <span style={s.mockTitle}>Resume Maker</span>
              </div>
              <div style={s.mockBody}>
                <div style={s.mockGrid}>
                  {['Classic', 'Modern', 'Creative', 'Tech'].map((t, i) => (
                    <div key={t} style={{ ...s.mockTemplate, ...(i === 0 ? s.mockTemplateActive : {}) }}>
                      <div style={{ ...s.mockSwatch, background: ['#1a1a2e','#c84b2f','#7c3aed','#0f766e'][i] }} />
                      <span style={s.mockTplName}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={s.mockForm}>
                  {['Full Name', 'Job Title', 'Email', 'Experience'].map(f => (
                    <div key={f} style={s.mockField}>
                      <div style={s.mockFieldLabel}>{f}</div>
                      <div style={s.mockFieldInput} />
                    </div>
                  ))}
                </div>
                <div style={s.mockPreview}>
                  <div style={s.mockLine} />
                  <div style={{ ...s.mockLine, width: '70%' }} />
                  <div style={{ ...s.mockLine, width: '85%' }} />
                  <div style={{ ...s.mockLine, width: '60%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeWord { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

const FEATURES = [
  { icon: FileText,   bg: 'var(--accent-light, #fdf0ec)', title: 'Smart Parsing',    desc: 'Extract skills, experience, and education from any resume format.' },
  { icon: Target,     bg: 'var(--accent-light, #fdf0ec)', title: 'Job Matching',     desc: 'See exactly how well your resume aligns with any job description.' },
  { icon: TrendingUp, bg: 'var(--accent-light, #fdf0ec)', title: 'Score & Grade',    desc: 'Get an objective score with detailed category breakdowns.' },
  { icon: Zap,        bg: 'var(--accent-light, #fdf0ec)', title: 'AI Suggestions',   desc: 'Receive concrete, prioritized improvements to boost your chances.' },
];

const s = {
  page: { minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)' },

  // NAV
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '1px solid var(--border)' },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoBox: { width: 36, height: 36, borderRadius: 8, background: 'var(--ink)', color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 },
  logoText: { fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  navBtn: { display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--paper-card)', color: 'var(--ink)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' },

  // HERO
  hero: { padding: '80px 24px 60px', textAlign: 'center' },
  heroInner: { maxWidth: 700, margin: '0 auto' },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 100, border: '1px solid var(--border)', background: 'var(--paper-warm)', fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)', marginBottom: 28 },
  heading: { fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 24 },
  word: { color: 'var(--accent)', display: 'inline-block', transition: 'opacity 0.35s ease, transform 0.35s ease' },
  subheading: { fontSize: 18, color: 'var(--ink-muted)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' },

  // ACTIONS
  actionRow: { display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 },
  primaryBtn: { display: 'flex', alignItems: 'center', gap: 10, padding: '16px 32px', borderRadius: 14, background: 'var(--accent)', color: 'white', border: 'none', fontSize: 17, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 6px 20px rgba(200,75,47,0.35)', transition: 'transform 0.15s, box-shadow 0.15s' },
  secondaryBtn: { display: 'flex', alignItems: 'center', gap: 10, padding: '16px 28px', borderRadius: 14, background: 'var(--paper-card)', color: 'var(--ink)', border: '1.5px solid var(--border)', fontSize: 17, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s', position: 'relative' },
  secondaryBtnTag: { fontSize: 10, fontWeight: 800, background: 'var(--accent)', color: 'white', padding: '2px 7px', borderRadius: 100, letterSpacing: '0.05em' },

  // NUDGE CARD
  nudgeCard: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'var(--paper-card)', border: '1px solid var(--border)', borderRadius: 12, maxWidth: 600, margin: '0 auto 32px', textAlign: 'left', flexWrap: 'wrap' },
  nudgeIcon: { width: 40, height: 40, borderRadius: 10, background: 'var(--accent-light, #fdf0ec)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  nudgeText: { flex: 1, fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.5, minWidth: 180 },
  nudgeBold: { fontWeight: 700, color: 'var(--ink)' },
  nudgeBtn: { display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 8, background: 'var(--accent)', color: 'white', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' },

  // TRUST
  badges: { display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' },
  trustBadge: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink-muted)' },

  // FEATURES
  features: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, maxWidth: 1000, margin: '0 auto', padding: '20px 24px 80px' },
  card: { background: 'var(--paper-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 20px' },
  cardIcon: { width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 17, fontWeight: 700, marginBottom: 8 },
  cardDesc: { fontSize: 14, color: 'var(--ink-muted)', lineHeight: 1.6 },

  // BUILDER SECTION
  builderSection: { background: 'var(--paper-warm)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '80px 24px' },
  builderInner: { maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 60, alignItems: 'center', flexWrap: 'wrap' },
  builderLeft: { flex: '1 1 340px' },
  builderBadge: { display: 'inline-block', fontSize: 12, fontWeight: 700, background: 'var(--accent)', color: 'white', padding: '4px 12px', borderRadius: 100, marginBottom: 16 },
  builderTitle: { fontSize: 36, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 16 },
  builderDesc: { fontSize: 15, color: 'var(--ink-muted)', lineHeight: 1.8, marginBottom: 24 },
  templatePills: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
  pill: { padding: '5px 12px', borderRadius: 100, border: '1px solid var(--border)', background: 'var(--paper-card)', fontSize: 12, fontWeight: 600, color: 'var(--ink-muted)' },
  builderBtn: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 12, background: 'var(--accent)', color: 'white', border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 16px rgba(200,75,47,0.3)' },

  // MOCK UI
  builderRight: { flex: '1 1 300px', display: 'flex', justifyContent: 'center' },
  mockCard: { width: '100%', maxWidth: 380, background: 'var(--paper-card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
  mockHeader: { display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--paper)' },
  mockDot: { width: 10, height: 10, borderRadius: '50%', background: 'var(--border)' },
  mockTitle: { fontSize: 12, fontWeight: 600, color: 'var(--ink-muted)', marginLeft: 6 },
  mockBody: { padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  mockGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  mockTemplate: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--paper)', cursor: 'pointer' },
  mockTemplateActive: { borderColor: 'var(--accent)', background: 'var(--accent-light, #fdf0ec)' },
  mockSwatch: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  mockTplName: { fontSize: 11, fontWeight: 600, color: 'var(--ink)' },
  mockForm: { display: 'flex', flexDirection: 'column', gap: 6 },
  mockField: {},
  mockFieldLabel: { fontSize: 10, fontWeight: 600, color: 'var(--ink-faint)', marginBottom: 3 },
  mockFieldInput: { height: 28, borderRadius: 6, background: 'var(--paper)', border: '1px solid var(--border)' },
  mockPreview: { background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 },
  mockLine: { height: 8, borderRadius: 4, background: 'var(--border)', width: '100%' },
};