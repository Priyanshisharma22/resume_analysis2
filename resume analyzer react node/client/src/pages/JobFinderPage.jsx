import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Search, Briefcase, DollarSign, ExternalLink,
  Linkedin, Globe, MapPin, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react';

const PLATFORMS = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    bg: '#E8F0FB',
    icon: '🔗',
    getUrl: (query, location) =>
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`,
  },
  {
    id: 'indeed',
    name: 'Indeed',
    color: '#003A9B',
    bg: '#E8EEFB',
    icon: '🔍',
    getUrl: (query, location) =>
      `https://in.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}`,
  },
  {
    id: 'naukri',
    name: 'Naukri',
    color: '#FF7555',
    bg: '#FFF0ED',
    icon: '💼',
    getUrl: (query, location) =>
      `https://www.naukri.com/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}-jobs${location ? `-in-${encodeURIComponent(location.toLowerCase().replace(/\s+/g, '-'))}` : ''}`,
  },
  {
    id: 'internshala',
    name: 'Internshala',
    color: '#0DB9A7',
    bg: '#E6F8F6',
    icon: '🎓',
    getUrl: (query) =>
      `https://internshala.com/jobs/keyword-${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}/`,
  },
];

const SALARY_SEARCHES = [
  { label: 'Google', getUrl: (q, loc) => `https://www.google.com/search?q=${encodeURIComponent(q + ' salary ' + loc)}` },
  { label: 'Glassdoor', getUrl: (q, loc) => `https://www.glassdoor.co.in/Salaries/${encodeURIComponent(q.toLowerCase().replace(/\s+/g, '-'))}-salary-SRCH_KO0,${q.length}.htm` },
  { label: 'AmbitionBox', getUrl: (q) => `https://www.ambitionbox.com/profile/${encodeURIComponent(q.toLowerCase().replace(/\s+/g, '-'))}/salaries` },
];

export default function JobFinderPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Pre-fill from resume analysis if available
  const analysis = state?.analysis;
  const suggestedTitle = analysis?.candidate?.role || analysis?.jobTitle || '';
  const suggestedSkills = analysis?.skills
    ? Object.values(analysis.skills).flat().slice(0, 5).join(', ')
    : '';

  const [query, setQuery] = useState(suggestedTitle);
  const [location, setLocation] = useState('India');
  const [jobType, setJobType] = useState('full-time');
  const [experience, setExperience] = useState('');
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearched(true);
  };

  const fullQuery = [query, experience, jobType !== 'any' ? jobType : ''].filter(Boolean).join(' ');

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* Header */}
        <div style={s.topBar}>
          <button style={s.back} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 style={s.pageTitle}>Job Finder</h1>
        </div>

        {/* If coming from analysis, show context */}
        {analysis && (
          <div style={s.contextBanner}>
            <Sparkles size={16} color="var(--accent)" />
            <span>Based on your resume analysis{suggestedTitle ? ` — detected role: <strong>${suggestedTitle}</strong>` : ''}</span>
            {suggestedSkills && (
              <span style={{ color: 'var(--ink-faint)', fontSize: 13 }}>Skills: {suggestedSkills}</span>
            )}
          </div>
        )}

        {/* Search Card */}
        <div style={s.card}>
          <h3 style={s.cardTitle}>Search Jobs</h3>

          <div style={s.formGrid}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Job Title / Keywords</label>
              <div style={s.inputWrap}>
                <Search size={16} color="var(--ink-faint)" style={s.inputIcon} />
                <input
                  style={s.input}
                  placeholder="e.g. React Developer, Data Analyst"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Location</label>
              <div style={s.inputWrap}>
                <MapPin size={16} color="var(--ink-faint)" style={s.inputIcon} />
                <input
                  style={s.input}
                  placeholder="e.g. Bangalore, Remote"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Job Type</label>
              <select style={s.select} value={jobType} onChange={e => setJobType(e.target.value)}>
                <option value="any">Any</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Experience Level</label>
              <select style={s.select} value={experience} onChange={e => setExperience(e.target.value)}>
                <option value="">Any</option>
                <option value="fresher">Fresher / Entry Level</option>
                <option value="1-3 years experience">1–3 Years</option>
                <option value="3-5 years experience">3–5 Years</option>
                <option value="5+ years experience">5+ Years</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>
          </div>

          <button style={s.searchBtn} onClick={handleSearch}>
            <Search size={16} /> Find Jobs
          </button>
        </div>

        {/* Results */}
        {searched && query && (
          <>
            {/* Job Platforms */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>
                <Briefcase size={18} color="var(--accent)" style={{ verticalAlign: 'middle', marginRight: 8 }} />
                Search on Job Platforms
              </h3>
              <p style={s.subtitle}>Click any platform to search for <strong>"{fullQuery}"</strong> in <strong>{location}</strong></p>

              <div style={s.platformGrid}>
                {PLATFORMS.map(platform => (
                  <a
                    key={platform.id}
                    href={platform.getUrl(fullQuery, location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...s.platformCard, borderColor: platform.color + '33' }}
                  >
                    <div style={{ ...s.platformIcon, background: platform.bg }}>
                      <span style={{ fontSize: 24 }}>{platform.icon}</span>
                    </div>
                    <div style={s.platformInfo}>
                      <div style={{ ...s.platformName, color: platform.color }}>{platform.name}</div>
                      <div style={s.platformDesc}>Search "{query}" jobs</div>
                    </div>
                    <ExternalLink size={14} color="var(--ink-faint)" />
                  </a>
                ))}
              </div>
            </div>

            {/* Salary Info */}
            <div style={s.card}>
              <button style={s.salaryToggle} onClick={() => setSalaryOpen(!salaryOpen)}>
                <span style={s.sectionTitleRow}>
                  <DollarSign size={18} color="var(--accent)" />
                  Salary Research for "{query}"
                </span>
                {salaryOpen
                  ? <ChevronUp size={18} color="var(--ink-faint)" />
                  : <ChevronDown size={18} color="var(--ink-faint)" />}
              </button>

              {salaryOpen && (
                <div style={s.salaryBody}>
                  <p style={s.subtitle}>Check salary ranges on these platforms:</p>
                  <div style={s.salaryGrid}>
                    {SALARY_SEARCHES.map(src => (
                      <a
                        key={src.label}
                        href={src.getUrl(query, location)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={s.salaryCard}
                      >
                        <span style={s.salaryLabel}>{src.label}</span>
                        <span style={s.salaryAction}>
                          View salaries <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
                        </span>
                      </a>
                    ))}
                  </div>

                  <div style={s.salaryNote}>
                    💡 Salary data is sourced from third-party platforms and may vary by company, location, and experience.
                  </div>
                </div>
              )}
            </div>

            {/* Tips */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>
                <Sparkles size={18} color="var(--accent)" style={{ verticalAlign: 'middle', marginRight: 8 }} />
                Job Search Tips for "{query}"
              </h3>
              <div style={s.tipsList}>
                {[
                  `Set up job alerts on LinkedIn and Naukri for "${query}" to get daily notifications.`,
                  'Tailor your resume for each application using keywords from the job description.',
                  'Apply within the first 24 hours of a job posting for better visibility.',
                  'Connect with recruiters on LinkedIn who specialize in your field.',
                  'Use "Easy Apply" on LinkedIn for quick applications, but personalize your message.',
                ].map((tip, i) => (
                  <div key={i} style={s.tipItem}>
                    <span style={s.tipNum}>{i + 1}</span>
                    <span style={{ fontSize: 14, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {!searched && (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>🔎</div>
            <p style={s.emptyText}>Enter a job title and click <strong>Find Jobs</strong> to search across LinkedIn, Indeed, Naukri, and Internshala.</p>
          </div>
        )}

      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: 'var(--paper)', padding: '40px 24px' },
  container: { maxWidth: 760, margin: '0 auto' },
  topBar: { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 },
  back: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--ink-muted)', fontSize: 14, padding: 0, flexShrink: 0,
  },
  pageTitle: { fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '-0.02em' },
  contextBanner: {
    display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
    background: 'var(--accent-light)', border: '1px solid var(--accent)',
    borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 14,
    color: 'var(--ink-muted)',
  },
  card: {
    background: 'var(--paper-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '24px 28px', marginBottom: 16,
    boxShadow: 'var(--shadow-sm)',
  },
  cardTitle: { fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 },
  subtitle: { fontSize: 14, color: 'var(--ink-muted)', marginBottom: 20 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: 'var(--ink-muted)' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: 12 },
  input: {
    width: '100%', padding: '10px 12px 10px 36px',
    border: '1px solid var(--border)', borderRadius: 8,
    fontFamily: 'var(--font-body)', fontSize: 14,
    background: 'var(--paper)', color: 'var(--ink)',
    outline: 'none', boxSizing: 'border-box',
  },
  select: {
    width: '100%', padding: '10px 12px',
    border: '1px solid var(--border)', borderRadius: 8,
    fontFamily: 'var(--font-body)', fontSize: 14,
    background: 'var(--paper)', color: 'var(--ink)',
    outline: 'none', cursor: 'pointer',
  },
  searchBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    width: '100%', padding: '14px', background: 'var(--accent)', color: 'white',
    border: 'none', borderRadius: 10, cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600,
    boxShadow: '0 4px 14px rgba(200,75,47,0.25)',
  },
  platformGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  platformCard: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '16px', border: '1px solid', borderRadius: 10,
    background: 'var(--paper)', textDecoration: 'none',
    transition: 'transform 0.15s, box-shadow 0.15s',
    cursor: 'pointer',
  },
  platformIcon: {
    width: 48, height: 48, borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  platformInfo: { flex: 1 },
  platformName: { fontWeight: 700, fontSize: 15, marginBottom: 3 },
  platformDesc: { fontSize: 12, color: 'var(--ink-faint)' },
  salaryToggle: {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
    fontFamily: 'var(--font-body)',
  },
  sectionTitleRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontWeight: 600, fontSize: 16, color: 'var(--ink)',
    fontFamily: 'var(--font-display)',
  },
  salaryBody: { marginTop: 20 },
  salaryGrid: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 },
  salaryCard: {
    display: 'flex', flexDirection: 'column', gap: 4,
    padding: '14px 18px', border: '1px solid var(--border)',
    borderRadius: 10, textDecoration: 'none', background: 'var(--paper-warm)',
    minWidth: 140,
  },
  salaryLabel: { fontWeight: 700, fontSize: 14, color: 'var(--ink)' },
  salaryAction: { fontSize: 12, color: 'var(--accent)' },
  salaryNote: {
    fontSize: 13, color: 'var(--ink-faint)', background: 'var(--paper-warm)',
    padding: '10px 14px', borderRadius: 8,
  },
  tipsList: { display: 'flex', flexDirection: 'column', gap: 12 },
  tipItem: { display: 'flex', gap: 12, alignItems: 'flex-start' },
  tipNum: {
    width: 24, height: 24, borderRadius: '50%', background: 'var(--accent-light)',
    color: 'var(--accent-dark)', fontSize: 12, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  emptyState: {
    textAlign: 'center', padding: '60px 20px',
    color: 'var(--ink-muted)',
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 15, lineHeight: 1.7, maxWidth: 400, margin: '0 auto' },
};