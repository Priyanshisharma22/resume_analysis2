import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, FileText, MessageSquare, Linkedin,
  TrendingUp, PenLine, DollarSign, Mail, Heart,
  LayoutTemplate, Network, Globe, Briefcase, Award
} from 'lucide-react';
import CoverLetterGenerator from '../utils/CoverLetterGenerator';
import InterviewPrepGenerator from '../utils/InterviewPrepGenerator';
import LinkedInOptimizer from '../utils/LinkedInOptimizer';
import ImprovementTracker from '../utils/ImprovementTracker';
import ResumeRewriter from '../utils/ResumeRewriter';
import SalaryNegotiator from '../utils/SalaryNegotiator';
import ColdOutreach from '../utils/ColdOutreach';
import ThankYouEmail from '../utils/ThankYouEmail';
import ResumeMaker from '../utils/ResumeMaker';
import NetworkingDM from '../utils/NetworkingDM';
import PortfolioBuilder from '../utils/PortfolioBuilder';
import JobTracker from '../utils/JobTracker';
import ReferenceLetter from '../utils/ReferenceLetter';
import DarkModeToggle from '../utils/DarkModeToggle';

const TABS = [
  { id: 'maker',      label: 'Resume Maker',      icon: LayoutTemplate, color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', num: '01' },
  { id: 'cover',      label: 'Cover Letter',      icon: FileText,       color: '#f472b6', bg: 'rgba(244,114,182,0.12)', num: '02' },
  { id: 'interview',  label: 'Interview Prep',    icon: MessageSquare,  color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  num: '03' },
  { id: 'linkedin',   label: 'LinkedIn',          icon: Linkedin,       color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  num: '04' },
  { id: 'rewriter',   label: 'Bullet Rewriter',   icon: PenLine,        color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  num: '05' },
  { id: 'salary',     label: 'Salary Script',     icon: DollarSign,     color: '#34d399', bg: 'rgba(52,211,153,0.12)',  num: '06' },
  { id: 'outreach',   label: 'Cold Outreach',     icon: Mail,           color: '#818cf8', bg: 'rgba(129,140,248,0.12)', num: '07' },
  { id: 'networking', label: 'Networking DM',     icon: Network,        color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)',  num: '08', isNew: true },
  { id: 'portfolio',  label: 'Portfolio Builder', icon: Globe,          color: '#2dd4bf', bg: 'rgba(45,212,191,0.12)',  num: '09', isNew: true },
  { id: 'tracker',    label: 'Job Tracker',       icon: Briefcase,      color: '#a3e635', bg: 'rgba(163,230,53,0.12)',  num: '10', isNew: true },
  { id: 'reference',  label: 'Reference Letter',  icon: Award,          color: '#e879f9', bg: 'rgba(232,121,249,0.12)', num: '11', isNew: true },
  { id: 'thankyou',   label: 'Thank You',         icon: Heart,          color: '#f87171', bg: 'rgba(248,113,113,0.12)', num: '12' },
  { id: 'progress',   label: 'Progress',          icon: TrendingUp,     color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', num: '13' },
];

export default function AIToolsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('maker');
  const [mounted, setMounted] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const analysis = state?.analysis || null;
  const activeData = TABS.find(t => t.id === activeTab);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .atp-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .atp-root {
          min-height: 100vh; background: #0a0a0f;
          font-family: 'DM Sans', sans-serif; color: #e2e8f0;
          position: relative; overflow-x: hidden;
        }
        .atp-root::before {
          content: ''; position: fixed; inset: 0;
          background:
            radial-gradient(ellipse 80% 50% at 10% -10%, rgba(167,139,250,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 90% 100%, rgba(56,189,248,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 50% 50%, rgba(15,15,25,0) 0%, #0a0a0f 100%);
          pointer-events: none; z-index: 0;
        }
        .atp-root::after {
          content: ''; position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 0; opacity: 0.6;
        }
        .atp-inner { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 32px 24px 60px; }

        .atp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 48px; opacity: 0; transform: translateY(-12px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .atp-header.vis { opacity: 1; transform: translateY(0); }
        .atp-back { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; padding: 8px 14px; border-radius: 100px; cursor: pointer; transition: all 0.2s; }
        .atp-back:hover { background: rgba(255,255,255,0.09); color: #e2e8f0; border-color: rgba(255,255,255,0.15); }
        .atp-title-block { text-align: center; }
        .atp-eyebrow { font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: #64748b; margin-bottom: 6px; }
        .atp-title { font-family: 'Syne', sans-serif; font-size: clamp(22px, 3vw, 32px); font-weight: 800; letter-spacing: -0.03em; background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.1; }

        .atp-layout { display: grid; grid-template-columns: 236px 1fr; gap: 20px; align-items: start; opacity: 0; transform: translateY(16px); transition: opacity 0.55s ease 0.15s, transform 0.55s ease 0.15s; }
        .atp-layout.vis { opacity: 1; transform: translateY(0); }

        .atp-sidebar { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 12px; position: sticky; top: 24px; backdrop-filter: blur(12px); max-height: calc(100vh - 48px); overflow-y: auto; }
        .atp-sidebar::-webkit-scrollbar { width: 3px; }
        .atp-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        .atp-sidebar-label { font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #475569; padding: 4px 8px 10px; }

        .atp-nav-btn { width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; border: none; background: transparent; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: #64748b; transition: all 0.18s; text-align: left; position: relative; overflow: hidden; }
        .atp-nav-btn:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }
        .atp-nav-btn.active { color: #fff; }
        .atp-nav-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.18s; }
        .atp-nav-num { margin-left: auto; font-size: 10px; font-weight: 600; letter-spacing: 0.05em; opacity: 0.35; font-family: 'Syne', sans-serif; }
        .atp-nav-btn.active .atp-nav-num { opacity: 0.6; }
        .atp-nav-btn.active::before { content: ''; position: absolute; left: 0; top: 20%; bottom: 20%; width: 3px; border-radius: 0 2px 2px 0; background: var(--tab-color, #a78bfa); }
        .atp-new-badge { font-size: 9px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; background: linear-gradient(135deg, #0ea5e9, #38bdf8); color: white; padding: 2px 6px; border-radius: 4px; line-height: 1.5; flex-shrink: 0; margin-left: auto; }

        .atp-panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; overflow: hidden; backdrop-filter: blur(12px); min-height: 600px; }
        .atp-panel-header { padding: 20px 28px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 14px; position: relative; overflow: hidden; }
        .atp-panel-header::after { content: ''; position: absolute; inset: 0; background: var(--panel-bg, rgba(167,139,250,0.05)); pointer-events: none; }
        .atp-panel-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; z-index: 1; }
        .atp-panel-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; letter-spacing: -0.02em; color: #f1f5f9; position: relative; z-index: 1; }
        .atp-panel-sub { font-size: 12px; color: #475569; margin-top: 2px; position: relative; z-index: 1; }
        .atp-panel-body { padding: 28px; }

        @media (max-width: 768px) {
          .atp-layout { grid-template-columns: 1fr; }
          .atp-sidebar { position: static; display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; max-height: none; overflow: visible; }
          .atp-sidebar-label { display: none; }
          .atp-nav-btn { padding: 8px; flex-direction: column; gap: 4px; font-size: 10px; text-align: center; }
          .atp-nav-num, .atp-new-badge { display: none; }
          .atp-nav-btn.active::before { display: none; }
        }
        .atp-panel-body::-webkit-scrollbar { width: 4px; }
        .atp-panel-body::-webkit-scrollbar-track { background: transparent; }
        .atp-panel-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      <div className="atp-root">
        <div className="atp-inner">

          <header className={`atp-header${mounted ? ' vis' : ''}`}>
            <button className="atp-back" onClick={() => navigate(-1)}>
              <ArrowLeft size={14} /> Back
            </button>
            <div className="atp-title-block">
              <div className="atp-eyebrow">Powered by AI</div>
              <h1 className="atp-title">Career Tools</h1>
            </div>
            <DarkModeToggle />
          </header>

          <div className={`atp-layout${mounted ? ' vis' : ''}`}>

            <nav className="atp-sidebar">
              <div className="atp-sidebar-label">Tools</div>
              {TABS.map(({ id, label, icon: Icon, color, bg, num, isNew }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    className={`atp-nav-btn${active ? ' active' : ''}`}
                    style={{ '--tab-color': color }}
                    onClick={() => setActiveTab(id)}
                    onMouseEnter={() => setHoveredTab(id)}
                    onMouseLeave={() => setHoveredTab(null)}
                  >
                    <span
                      className="atp-nav-icon"
                      style={{ background: active || hoveredTab === id ? bg : 'rgba(255,255,255,0.04)' }}
                    >
                      <Icon size={14} color={active ? color : hoveredTab === id ? color : '#475569'} />
                    </span>
                    {label}
                    {isNew
                      ? <span className="atp-new-badge">New</span>
                      : <span className="atp-nav-num">{num}</span>
                    }
                  </button>
                );
              })}
            </nav>

            <div className="atp-panel">
              <div className="atp-panel-header" style={{ '--panel-bg': activeData?.bg }}>
                <div className="atp-panel-icon" style={{ background: activeData?.bg, border: `1px solid ${activeData?.color}30` }}>
                  {activeData && <activeData.icon size={18} color={activeData.color} />}
                </div>
                <div>
                  <div className="atp-panel-title">{activeData?.label}</div>
                  <div className="atp-panel-sub">AI-powered tool · {activeData?.num}</div>
                </div>
              </div>

              <div className="atp-panel-body">
                {activeTab === 'maker'      && <ResumeMaker            analysis={analysis} />}
                {activeTab === 'cover'      && <CoverLetterGenerator   analysis={analysis} />}
                {activeTab === 'interview'  && <InterviewPrepGenerator analysis={analysis} />}
                {activeTab === 'linkedin'   && <LinkedInOptimizer      analysis={analysis} />}
                {activeTab === 'rewriter'   && <ResumeRewriter         analysis={analysis} />}
                {activeTab === 'salary'     && <SalaryNegotiator       analysis={analysis} />}
                {activeTab === 'outreach'   && <ColdOutreach           analysis={analysis} />}
                {activeTab === 'networking' && <NetworkingDM           analysis={analysis} />}
                {activeTab === 'portfolio'  && <PortfolioBuilder       analysis={analysis} />}
                {activeTab === 'tracker'    && <JobTracker />}
                {activeTab === 'reference'  && <ReferenceLetter        analysis={analysis} />}
                {activeTab === 'thankyou'   && <ThankYouEmail          analysis={analysis} />}
                {activeTab === 'progress'   && <ImprovementTracker />}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}