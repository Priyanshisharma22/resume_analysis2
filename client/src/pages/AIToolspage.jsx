import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, MessageSquare, Linkedin, TrendingUp, PenLine, DollarSign, Mail, Heart, LayoutTemplate } from 'lucide-react';
import CoverLetterGenerator from '../utils/CoverLetterGenerator';
import InterviewPrepGenerator from '../utils/InterviewPrepGenerator';
import LinkedInOptimizer from '../utils/LinkedInOptimizer';
import ImprovementTracker from '../utils/ImprovementTracker';
import ResumeRewriter from '../utils/ResumeRewriter';
import SalaryNegotiator from '../utils/SalaryNegotiator';
import ColdOutreach from '../utils/ColdOutreach';
import ThankYouEmail from '../utils/ThankYouEmail';
import ResumeMaker from '../utils/ResumeMaker';
import DarkModeToggle from '../utils/DarkModeToggle';

const TABS = [
  { id: 'maker',      label: 'Resume Maker',   icon: LayoutTemplate, color: '#7c3aed' },
  { id: 'cover',      label: 'Cover Letter',   icon: FileText,       color: 'var(--accent)' },
  { id: 'interview',  label: 'Interview Prep',  icon: MessageSquare,  color: 'var(--blue)' },
  { id: 'linkedin',   label: 'LinkedIn',        icon: Linkedin,       color: '#0077b5' },
  { id: 'rewriter',   label: 'Bullet Rewriter', icon: PenLine,        color: 'var(--accent)' },
  { id: 'salary',     label: 'Salary Script',   icon: DollarSign,     color: 'var(--green)' },
  { id: 'outreach',   label: 'Cold Outreach',   icon: Mail,           color: 'var(--blue)' },
  { id: 'thankyou',   label: 'Thank You',       icon: Heart,          color: '#e85d7a' },
  { id: 'tracker',    label: 'Progress',        icon: TrendingUp,     color: 'var(--green)' },
];

const ROW1 = TABS.slice(0, 5);
const ROW2 = TABS.slice(5);

export default function AIToolsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('maker');

  const analysis = state?.analysis || null;

  const renderTab = ({ id, label, icon: Icon, color }) => {
    const active = activeTab === id;
    return (
      <button
        key={id}
        style={{
          ...styles.tab,
          ...(active ? { ...styles.tabActive, borderBottomColor: color, color } : {}),
        }}
        onClick={() => setActiveTab(id)}
      >
        <Icon size={14} color={active ? color : 'var(--ink-faint)'} />
        {label}
      </button>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.topBar}>
          <button style={styles.back} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back to Results
          </button>
          <h1 style={styles.pageTitle}>AI Career Tools</h1>
          <DarkModeToggle />
        </div>

        <div style={styles.tabsWrapper}>
          <div style={styles.tabBar}>{ROW1.map(renderTab)}</div>
          <div style={styles.tabBar}>{ROW2.map(renderTab)}</div>
        </div>

        <div style={styles.content}>
          {activeTab === 'maker'     && <ResumeMaker            analysis={analysis} />}
          {activeTab === 'cover'     && <CoverLetterGenerator   analysis={analysis} />}
          {activeTab === 'interview' && <InterviewPrepGenerator analysis={analysis} />}
          {activeTab === 'linkedin'  && <LinkedInOptimizer      analysis={analysis} />}
          {activeTab === 'rewriter'  && <ResumeRewriter         analysis={analysis} />}
          {activeTab === 'salary'    && <SalaryNegotiator       analysis={analysis} />}
          {activeTab === 'outreach'  && <ColdOutreach           analysis={analysis} />}
          {activeTab === 'thankyou'  && <ThankYouEmail          analysis={analysis} />}
          {activeTab === 'tracker'   && <ImprovementTracker />}
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--paper)', padding: '40px 24px' },
  container: { maxWidth: 1100, margin: '0 auto' },
  topBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 16, marginBottom: 28,
  },
  back: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--ink-muted)', fontSize: 14, padding: 0, flexShrink: 0,
  },
  pageTitle: {
    fontFamily: 'var(--font-display)', fontSize: 26,
    letterSpacing: '-0.02em', flex: 1, textAlign: 'center',
  },
  tabsWrapper: { borderBottom: '1px solid var(--border)', marginBottom: 8 },
  tabBar: { display: 'flex', gap: 2, overflowX: 'auto' },
  tab: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '10px 14px', background: 'none', border: 'none',
    borderBottom: '2px solid transparent', cursor: 'pointer',
    fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500,
    color: 'var(--ink-muted)', transition: 'all 0.15s',
    marginBottom: '-1px', whiteSpace: 'nowrap', flexShrink: 0,
  },
  tabActive: { fontWeight: 700 },
  content: { paddingTop: 8 },
};