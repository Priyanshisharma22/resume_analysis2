import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  FileSearch, ArrowRight, Zap, Target, TrendingUp, FileText,
  Briefcase, Users, Plus, Sparkles, Network, Globe, Award,
  Heart, DollarSign, PenLine, MessageSquare, LayoutTemplate,
  ChevronRight, CheckCircle, Star, BarChart2, ShieldCheck,
  Layers, BookOpen
} from 'lucide-react';
import Header from '../components/Header';

const TOOLS = [
  { icon: LayoutTemplate, label: 'Resume Maker',      color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', desc: 'Build a polished resume with live preview & 4 templates' },
  { icon: FileText,       label: 'Cover Letter',      color: '#f472b6', bg: 'rgba(244,114,182,0.12)', desc: 'Personalized cover letters tailored to each job' },
  { icon: MessageSquare,  label: 'Interview Prep',    color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  desc: 'AI-generated questions & answers for any role' },
  { icon: Users,          label: 'LinkedIn',          color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  desc: 'Optimize your profile to attract recruiters' },
  { icon: PenLine,        label: 'Bullet Rewriter',   color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  desc: 'Rewrite weak bullets into impact-driven lines' },
  { icon: DollarSign,     label: 'Salary Script',     color: '#34d399', bg: 'rgba(52,211,153,0.12)',  desc: 'Negotiate confidently with AI-drafted scripts' },
  { icon: Zap,            label: 'Cold Outreach',     color: '#818cf8', bg: 'rgba(129,140,248,0.12)', desc: 'Emails that get responses from hiring managers' },
  { icon: Network,        label: 'Networking DM',     color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)',  desc: 'LinkedIn cold DMs for any goal or tone' },
  { icon: Globe,          label: 'Portfolio Builder', color: '#2dd4bf', bg: 'rgba(45,212,191,0.12)',  desc: 'One-page portfolio site — live preview + download' },
  { icon: Briefcase,      label: 'Job Tracker',       color: '#a3e635', bg: 'rgba(163,230,53,0.12)',  desc: 'Kanban board to track every application stage' },
  { icon: Award,          label: 'Reference Letter',  color: '#e879f9', bg: 'rgba(232,121,249,0.12)', desc: 'AI drafts for request emails & reference letters' },
  { icon: Heart,          label: 'Thank You Email',   color: '#f87171', bg: 'rgba(248,113,113,0.12)', desc: 'Post-interview follow-ups that keep you top of mind' },
  { icon: TrendingUp,     label: 'Progress Tracker',  color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', desc: 'Track resume improvements over time' },
];

const STEPS = [
  { num: '01', title: 'Upload Your Resume',     desc: 'Drop a PDF or paste your resume text — takes 10 seconds',             color: '#a78bfa' },
  { num: '02', title: 'Add a Job Description',  desc: 'Optional: paste a job posting for ATS scoring & keyword gaps',        color: '#38bdf8' },
  { num: '03', title: 'Get Full Analysis',      desc: 'Score, gaps, improvements, and 13 AI tools — all in one place',       color: '#34d399' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Product Manager · Google',  text: 'Went from 62 to 91 score in a week. The bullet rewriter alone is worth it.', emoji: '👩‍💼' },
  { name: 'Arjun Mehta',  role: 'SWE · Microsoft',           text: 'Job Tracker + Cold Outreach combo helped me land 4 interviews in 2 weeks.',   emoji: '👨‍💻' },
  { name: 'Sofia Lin',    role: 'Data Analyst · Zepto',       text: 'Portfolio Builder created a stunning site in minutes. Recruiters love it.',   emoji: '👩‍🔬' },
];

const STATS = [
  { value: '1,000+', label: 'Resumes Analyzed' },
  { value: '92%',    label: 'Success Rate'      },
  { value: '13',     label: 'AI Tools'          },
  { value: '4.9★',   label: 'User Rating'       },
];

// animated score metrics in the hero visual
const METRICS = [
  { label: 'ATS Score',       value: 85, color: '#a78bfa', w: '85%'  },
  { label: 'Keywords Match',  value: 72, color: '#38bdf8', w: '72%'  },
  { label: 'Formatting',      value: 91, color: '#34d399', w: '91%'  },
  { label: 'Impact Score',    value: 68, color: '#fb923c', w: '68%'  },
];

const BADGES = [
  { icon: ShieldCheck, label: 'ATS Ready',       color: '#34d399', bg: 'rgba(52,211,153,0.12)'  },
  { icon: Star,        label: 'Strong Profile',  color: '#fbbf24', bg: 'rgba(251,191,36,0.12)'  },
  { icon: Layers,      label: '13 Tools Ready',  color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [mounted, setMounted]     = useState(false);
  const [activeWord, setActiveWord] = useState(0);
  const [barAnimate, setBarAnimate] = useState(false);
  const words = ['opportunities.', 'interviews.', 'offers.', 'confidence.'];

  useEffect(() => {
    setTimeout(() => setMounted(true), 60);
    setTimeout(() => setBarAnimate(true), 600);
    const id = setInterval(() => setActiveWord(w => (w + 1) % words.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        .hp-root*,.hp-root*::before,.hp-root*::after{box-sizing:border-box;margin:0;padding:0;}
        .hp-root{background:#070709;color:#d4d4d8;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;}

        /* blobs */
        .hp-blob{position:fixed;border-radius:50%;filter:blur(130px);pointer-events:none;z-index:0;}
        .hp-blob-1{width:700px;height:700px;background:radial-gradient(circle,rgba(124,58,237,0.16) 0%,transparent 70%);top:-200px;left:-200px;}
        .hp-blob-2{width:600px;height:600px;background:radial-gradient(circle,rgba(14,165,233,0.10) 0%,transparent 70%);bottom:-100px;right:-100px;}
        .hp-blob-3{width:400px;height:400px;background:radial-gradient(circle,rgba(236,72,153,0.08) 0%,transparent 70%);top:40%;left:50%;transform:translateX(-50%);}

        .hp-wrap{position:relative;z-index:1;}
        .hp-section{padding:96px 24px;}
        .hp-inner{max-width:1100px;margin:0 auto;}

        /* ── HERO ── */
        .hp-hero{
          min-height:100vh;display:flex;align-items:center;
          padding:40px 24px 60px;
        }
        .hp-hero-inner{
          max-width:1100px;margin:0 auto;width:100%;
          display:grid;grid-template-columns:1fr 1fr;
          gap:60px;align-items:center;
        }

        /* left */
        .hp-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;background:rgba(124,58,237,0.12);border:1px solid rgba(124,58,237,0.25);border-radius:100px;font-size:12px;font-weight:600;color:#a78bfa;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:28px;}
        .hp-badge-dot{width:6px;height:6px;border-radius:50%;background:#a78bfa;animation:hp-pulse 2s infinite;}
        @keyframes hp-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.75)}}

        .hp-h1{font-family:'Syne',sans-serif;font-size:clamp(36px,4.5vw,64px);font-weight:800;line-height:1.05;letter-spacing:-0.03em;color:#fafafa;margin-bottom:22px;}
        .hp-h1-accent{background:linear-gradient(135deg,#a78bfa 0%,#38bdf8 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .hp-rotating-word{display:inline-block;background:linear-gradient(135deg,#f472b6 0%,#fb923c 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;transition:opacity 0.3s ease;min-width:180px;}
        .hp-sub{font-size:clamp(15px,1.6vw,18px);color:#71717a;font-weight:300;line-height:1.7;max-width:460px;margin-bottom:36px;}

        .hp-actions{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:48px;}

        .hp-btn-primary{display:inline-flex;align-items:center;gap:9px;padding:14px 26px;background:linear-gradient(135deg,#7c3aed,#a78bfa);color:white;border:none;border-radius:14px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.2s;box-shadow:0 8px 28px rgba(124,58,237,0.35);position:relative;overflow:hidden;}
        .hp-btn-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 50%);}
        .hp-btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(124,58,237,0.45);}
        .hp-btn-secondary{display:inline-flex;align-items:center;gap:9px;padding:14px 26px;background:rgba(255,255,255,0.04);color:#d4d4d8;border:1px solid rgba(255,255,255,0.1);border-radius:14px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;transition:all 0.2s;}
        .hp-btn-secondary:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.2);}

        .hp-stats{display:flex;gap:0;border-top:1px solid rgba(255,255,255,0.07);padding-top:32px;}
        .hp-stat{flex:1;padding-right:24px;border-right:1px solid rgba(255,255,255,0.07);margin-right:24px;}
        .hp-stat:last-child{border-right:none;}
        .hp-stat-val{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;color:#fafafa;letter-spacing:-0.02em;}
        .hp-stat-label{font-size:11px;color:#52525b;font-weight:500;margin-top:3px;}

        /* ── HERO VISUAL (right side) ── */
        .hp-visual{
          position:relative;
          display:flex;flex-direction:column;gap:14px;
          opacity:0;transform:translateX(24px);
          transition:opacity 0.7s ease 0.3s,transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s;
        }
        .hp-visual.vis{opacity:1;transform:translateX(0);}

        /* main analysis card */
        .hv-card{
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.09);
          border-radius:22px;padding:24px;
          backdrop-filter:blur(20px);
          position:relative;overflow:hidden;
        }
        .hv-card::before{
          content:'';position:absolute;top:0;left:0;right:0;height:3px;
          background:linear-gradient(90deg,#7c3aed,#a78bfa,#38bdf8);
        }

        /* card top bar */
        .hv-topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
        .hv-dots{display:flex;gap:5px;}
        .hv-dot{width:9px;height:9px;border-radius:50%;}
        .hv-filename{font-size:11px;color:#3f3f46;font-family:monospace;letter-spacing:0.04em;}
        .hv-live{display:flex;align-items:center;gap:5px;font-size:10px;font-weight:700;color:#34d399;letter-spacing:0.08em;text-transform:uppercase;}
        .hv-live-dot{width:6px;height:6px;border-radius:50%;background:#34d399;animation:hp-pulse 1.5s infinite;}

        /* score ring */
        .hv-score-row{display:flex;align-items:center;gap:20px;margin-bottom:22px;}
        .hv-ring{position:relative;width:80px;height:80px;flex-shrink:0;}
        .hv-ring svg{transform:rotate(-90deg);}
        .hv-ring-num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#fafafa;}
        .hv-score-info{}
        .hv-score-label{font-size:16px;font-weight:700;color:#fafafa;margin-bottom:4px;font-family:'Syne',sans-serif;letter-spacing:-0.01em;}
        .hv-score-sub{font-size:12px;color:#52525b;}

        /* metric bars */
        .hv-metrics{display:flex;flex-direction:column;gap:10px;margin-bottom:20px;}
        .hv-metric-row{display:flex;flex-direction:column;gap:5px;}
        .hv-metric-top{display:flex;justify-content:space-between;align-items:center;}
        .hv-metric-label{font-size:11px;color:#71717a;font-weight:500;}
        .hv-metric-val{font-size:11px;font-weight:700;color:#e4e4e7;}
        .hv-bar-bg{height:5px;background:rgba(255,255,255,0.06);border-radius:100px;overflow:hidden;}
        .hv-bar-fill{height:100%;border-radius:100px;transition:width 1.2s cubic-bezier(0.22,1,0.36,1);}

        /* badges row */
        .hv-badges{display:flex;gap:8px;flex-wrap:wrap;}
        .hv-badge-chip{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:9px;font-size:11px;font-weight:600;}

        /* floating notification cards */
        .hv-notif{
          background:rgba(15,15,25,0.92);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:14px;padding:12px 16px;
          display:flex;align-items:center;gap:12px;
          backdrop-filter:blur(20px);
          box-shadow:0 8px 32px rgba(0,0,0,0.3);
        }
        .hv-notif-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .hv-notif-title{font-size:12px;font-weight:700;color:#e4e4e7;margin-bottom:2px;}
        .hv-notif-sub{font-size:11px;color:#52525b;}

        /* floating tool pills */
        .hv-tools-row{display:flex;gap:7px;flex-wrap:wrap;}
        .hv-tool-pill{display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);font-size:11px;font-weight:500;color:#64748b;}

        /* ── rest of page ── */
        .hp-tools-bg{background:rgba(255,255,255,0.015);border-top:1px solid rgba(255,255,255,0.05);border-bottom:1px solid rgba(255,255,255,0.05);}
        .hp-sec-eyebrow{display:flex;align-items:center;gap:10px;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#7c3aed;margin-bottom:14px;}
        .hp-sec-eyebrow::after{content:'';flex:1;height:1px;background:rgba(124,58,237,0.2);}
        .hp-sec-title{font-family:'Syne',sans-serif;font-size:clamp(28px,4vw,44px);font-weight:800;letter-spacing:-0.03em;color:#fafafa;margin-bottom:14px;line-height:1.1;}
        .hp-sec-sub{font-size:16px;color:#52525b;font-weight:300;max-width:480px;line-height:1.65;margin-bottom:52px;}

        .hp-tools-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;}
        .hp-tool-card{display:flex;align-items:flex-start;gap:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:18px;cursor:pointer;transition:all 0.2s;position:relative;overflow:hidden;}
        .hp-tool-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--tool-color);transform:scaleX(0);transform-origin:left;transition:transform 0.3s;}
        .hp-tool-card:hover{border-color:rgba(255,255,255,0.12);transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,0.2);}
        .hp-tool-card:hover::before{transform:scaleX(1);}
        .hp-tool-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .hp-tool-name{font-size:13px;font-weight:700;color:#e4e4e7;margin-bottom:4px;letter-spacing:-0.01em;}
        .hp-tool-desc{font-size:11px;color:#52525b;line-height:1.5;}

        .hp-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;}
        .hp-step{position:relative;}
        .hp-step:not(:last-child)::after{content:'→';position:absolute;right:-20px;top:22px;font-size:20px;color:#27272a;}
        .hp-step-num{font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;color:var(--step-color);margin-bottom:16px;}
        .hp-step-icon{width:48px;height:48px;border-radius:14px;background:var(--step-bg);border:1px solid var(--step-border);display:flex;align-items:center;justify-content:center;margin-bottom:20px;}
        .hp-step-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#fafafa;margin-bottom:10px;letter-spacing:-0.02em;}
        .hp-step-desc{font-size:14px;color:#52525b;line-height:1.65;font-weight:300;}

        .hp-testi-bg{background:rgba(255,255,255,0.015);border-top:1px solid rgba(255,255,255,0.05);border-bottom:1px solid rgba(255,255,255,0.05);}
        .hp-testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
        .hp-testi-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:28px;transition:border-color 0.2s;}
        .hp-testi-card:hover{border-color:rgba(255,255,255,0.12);}
        .hp-testi-stars{font-size:13px;letter-spacing:2px;margin-bottom:16px;}
        .hp-testi-text{font-size:15px;color:#a1a1aa;line-height:1.75;font-weight:300;margin-bottom:24px;font-style:italic;}
        .hp-testi-author{display:flex;align-items:center;gap:12px;}
        .hp-testi-emoji{font-size:28px;}
        .hp-testi-name{font-size:14px;font-weight:700;color:#e4e4e7;}
        .hp-testi-role{font-size:12px;color:#52525b;margin-top:2px;}

        .hp-cta-box{background:linear-gradient(135deg,rgba(124,58,237,0.15) 0%,rgba(14,165,233,0.1) 100%);border:1px solid rgba(124,58,237,0.25);border-radius:28px;padding:64px 40px;text-align:center;position:relative;overflow:hidden;}
        .hp-cta-box::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 0%,rgba(124,58,237,0.2) 0%,transparent 60%);pointer-events:none;}
        .hp-cta-title{font-family:'Syne',sans-serif;font-size:clamp(28px,4vw,48px);font-weight:800;color:#fafafa;letter-spacing:-0.03em;margin-bottom:16px;position:relative;z-index:1;line-height:1.1;}
        .hp-cta-sub{font-size:17px;color:#71717a;font-weight:300;max-width:480px;margin:0 auto 40px;position:relative;z-index:1;line-height:1.65;}
        .hp-cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;position:relative;z-index:1;}

        .hp-footer{padding:48px 24px 32px;border-top:1px solid rgba(255,255,255,0.06);}
        .hp-footer-inner{max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:flex-start;gap:32px;flex-wrap:wrap;}
        .hp-footer-brand{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:#fafafa;margin-bottom:8px;}
        .hp-footer-tagline{font-size:13px;color:#3f3f46;}
        .hp-footer-links{display:flex;gap:28px;}
        .hp-footer-link{font-size:13px;color:#52525b;text-decoration:none;transition:color 0.2s;}
        .hp-footer-link:hover{color:#a1a1aa;}
        .hp-footer-bottom{max-width:1100px;margin:32px auto 0;padding-top:24px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;font-size:12px;color:#27272a;}

        .hp-fade{opacity:0;transform:translateY(20px);transition:opacity 0.65s cubic-bezier(0.22,1,0.36,1),transform 0.65s cubic-bezier(0.22,1,0.36,1);}
        .hp-fade.vis{opacity:1;transform:translateY(0);}
        .hp-fade-d1{transition-delay:0.1s;}
        .hp-fade-d2{transition-delay:0.2s;}
        .hp-fade-d3{transition-delay:0.3s;}

        @keyframes hv-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .hv-float{animation:hv-float 4s ease-in-out infinite;}
        .hv-float-slow{animation:hv-float 6s ease-in-out infinite;}

        @media(max-width:900px){
          .hp-hero-inner{grid-template-columns:1fr;}
          .hp-visual{display:none;}
          .hp-steps{grid-template-columns:1fr;}
          .hp-step:not(:last-child)::after{display:none;}
          .hp-testi-grid{grid-template-columns:1fr;}
          .hp-stats{flex-wrap:wrap;gap:24px;}
          .hp-stat{border-right:none;margin-right:0;flex:none;width:calc(50% - 12px);}
        }
        @media(max-width:600px){
          .hp-section{padding:64px 20px;}
          .hp-hero{padding:80px 20px 60px;}
          .hp-cta-box{padding:40px 20px;}
        }
      `}</style>

      <div className="hp-root">
        <div className="hp-blob hp-blob-1" />
        <div className="hp-blob hp-blob-2" />
        <div className="hp-blob hp-blob-3" />

        <div className="hp-wrap">
          <Header />

          {/* ── HERO ── */}
          <section className="hp-hero">
            <div className="hp-hero-inner">

              {/* LEFT — text */}
              <div>
                <div className={`hp-badge hp-fade${mounted ? ' vis' : ''}`}>
                  <div className="hp-badge-dot" />
                  AI-Powered Career Platform
                </div>

                <h1 className={`hp-h1 hp-fade hp-fade-d1${mounted ? ' vis' : ''}`}>
                  Your resume,<br />
                  <span className="hp-h1-accent">ready for </span>
                  <span className="hp-rotating-word">{words[activeWord]}</span>
                </h1>

                <p className={`hp-sub hp-fade hp-fade-d2${mounted ? ' vis' : ''}`}>
                  Upload your resume and unlock 13 AI tools — from ATS scoring and
                  job matching to portfolio building and offer negotiation.
                </p>

                <div className={`hp-actions hp-fade hp-fade-d3${mounted ? ' vis' : ''}`}>
                  <button className="hp-btn-primary" onClick={() => navigate('/analyze')}>
                    <FileSearch size={17} /> Analyze My Resume <ArrowRight size={15} />
                  </button>
                  <button className="hp-btn-secondary" onClick={() => navigate('/ai-tools', { state: { defaultTab: 'maker' } })}>
                    <Plus size={15} /> Build from Scratch
                  </button>
                </div>

                <div className={`hp-stats hp-fade hp-fade-d3${mounted ? ' vis' : ''}`}>
                  {STATS.map(({ value, label }) => (
                    <div className="hp-stat" key={label}>
                      <div className="hp-stat-val">{value}</div>
                      <div className="hp-stat-label">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — visual */}
              <div className={`hp-visual${mounted ? ' vis' : ''}`}>

                {/* Main analysis card */}
                <div className="hv-card hv-float">
                  {/* top bar */}
                  <div className="hv-topbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="hv-dots">
                        <div className="hv-dot" style={{ background: '#f87171' }} />
                        <div className="hv-dot" style={{ background: '#fbbf24' }} />
                        <div className="hv-dot" style={{ background: '#34d399' }} />
                      </div>
                      <span className="hv-filename">resume_analysis.ai</span>
                    </div>
                    <div className="hv-live">
                      <div className="hv-live-dot" /> Live
                    </div>
                  </div>

                  {/* Score ring + label */}
                  <div className="hv-score-row">
                    <div className="hv-ring">
                      <svg width="80" height="80" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                        <circle
                          cx="40" cy="40" r="34" fill="none"
                          stroke="url(#scoreGrad)" strokeWidth="7"
                          strokeLinecap="round"
                          strokeDasharray="213.6"
                          strokeDashoffset={barAnimate ? 213.6 * (1 - 0.85) : 213.6}
                          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1) 0.4s' }}
                        />
                        <defs>
                          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#7c3aed" />
                            <stop offset="100%" stopColor="#a78bfa" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="hv-ring-num">85</div>
                    </div>
                    <div className="hv-score-info">
                      <div className="hv-score-label">Overall Score</div>
                      <div className="hv-score-sub" style={{ color: '#34d399', fontWeight: 600, fontSize: 13 }}>✓ Strong Resume</div>
                      <div className="hv-score-sub" style={{ marginTop: 4 }}>Analyzed in 2.3s</div>
                    </div>
                  </div>

                  {/* Metric bars */}
                  <div className="hv-metrics">
                    {METRICS.map(({ label, value, color, w }) => (
                      <div className="hv-metric-row" key={label}>
                        <div className="hv-metric-top">
                          <span className="hv-metric-label">{label}</span>
                          <span className="hv-metric-val" style={{ color }}>{value}</span>
                        </div>
                        <div className="hv-bar-bg">
                          <div
                            className="hv-bar-fill"
                            style={{
                              width: barAnimate ? w : '0%',
                              background: `linear-gradient(90deg,${color}99,${color})`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Badge chips */}
                  <div className="hv-badges">
                    {BADGES.map(({ icon: Icon, label, color, bg }) => (
                      <div key={label} className="hv-badge-chip" style={{ background: bg, color }}>
                        <Icon size={11} />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Two small notification cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

                  <div className="hv-notif hv-float-slow">
                    <div className="hv-notif-icon" style={{ background: 'rgba(52,211,153,0.12)' }}>
                      <CheckCircle size={16} color="#34d399" />
                    </div>
                    <div>
                      <div className="hv-notif-title">ATS Passed</div>
                      <div className="hv-notif-sub">7 / 8 systems</div>
                    </div>
                  </div>

                  <div className="hv-notif hv-float-slow" style={{ animationDelay: '1s' }}>
                    <div className="hv-notif-icon" style={{ background: 'rgba(251,191,36,0.12)' }}>
                      <Star size={16} color="#fbbf24" />
                    </div>
                    <div>
                      <div className="hv-notif-title">Top 15%</div>
                      <div className="hv-notif-sub">vs similar roles</div>
                    </div>
                  </div>

                </div>

                {/* Tools row */}
                <div className="hv-notif" style={{ padding: '14px 16px' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={15} color="#a78bfa" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="hv-notif-title" style={{ marginBottom: 8 }}>13 AI Tools Unlocked</div>
                    <div className="hv-tools-row">
                      {['Resume', 'Cover Letter', 'LinkedIn', 'Portfolio', '+9 more'].map(t => (
                        <span key={t} className="hv-tool-pill">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
              {/* end right visual */}

            </div>
          </section>

          {/* ── ALL TOOLS ── */}
          <section className="hp-section hp-tools-bg">
            <div className="hp-inner">
              <div className="hp-sec-eyebrow">13 AI Tools</div>
              <h2 className="hp-sec-title">Everything for your job search</h2>
              <p className="hp-sec-sub">One platform. Every tool you need from application to offer.</p>
              <div className="hp-tools-grid">
                {TOOLS.map(({ icon: Icon, label, color, bg, desc }) => (
                  <div key={label} className="hp-tool-card" style={{ '--tool-color': color }} onClick={() => navigate('/ai-tools')}>
                    <div className="hp-tool-icon" style={{ background: bg }}><Icon size={16} color={color} /></div>
                    <div>
                      <div className="hp-tool-name">{label}</div>
                      <div className="hp-tool-desc">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 36 }}>
                <button className="hp-btn-primary" onClick={() => navigate('/ai-tools')} style={{ display: 'inline-flex' }}>
                  <Sparkles size={15} /> Open All Tools <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section className="hp-section">
            <div className="hp-inner">
              <div className="hp-sec-eyebrow">How it works</div>
              <h2 className="hp-sec-title">Three steps to a better career</h2>
              <p className="hp-sec-sub">From upload to actionable insights in under 60 seconds.</p>
              <div className="hp-steps">
                {STEPS.map(({ num, title, desc, color }, i) => (
                  <div key={num} className="hp-step" style={{ '--step-color': color, '--step-bg': `${color}12`, '--step-border': `${color}25` }}>
                    <div className="hp-step-num">STEP {num}</div>
                    <div className="hp-step-icon">
                      {i === 0 && <FileSearch size={20} color={color} />}
                      {i === 1 && <Target size={20} color={color} />}
                      {i === 2 && <Sparkles size={20} color={color} />}
                    </div>
                    <div className="hp-step-title">{title}</div>
                    <div className="hp-step-desc">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── TESTIMONIALS ── */}
          <section className="hp-section hp-testi-bg">
            <div className="hp-inner">
              <div className="hp-sec-eyebrow">User stories</div>
              <h2 className="hp-sec-title">Loved by job seekers</h2>
              <p className="hp-sec-sub" style={{ marginBottom: 44 }}>Real results from real people.</p>
              <div className="hp-testi-grid">
                {TESTIMONIALS.map(({ name, role, text, emoji }) => (
                  <div className="hp-testi-card" key={name}>
                    <div className="hp-testi-stars">★★★★★</div>
                    <p className="hp-testi-text">"{text}"</p>
                    <div className="hp-testi-author">
                      <span className="hp-testi-emoji">{emoji}</span>
                      <div>
                        <div className="hp-testi-name">{name}</div>
                        <div className="hp-testi-role">{role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="hp-section">
            <div className="hp-inner">
              <div className="hp-cta-box">
                <h2 className="hp-cta-title">Ready to land your<br />dream role?</h2>
                <p className="hp-cta-sub">Join thousands of job seekers using ResumeIQ to analyze, build, and get hired faster.</p>
                <div className="hp-cta-btns">
                  <button className="hp-btn-primary" onClick={() => navigate('/analyze')}>
                    Analyze My Resume <ArrowRight size={15} />
                  </button>
                  <button className="hp-btn-secondary" onClick={() => navigate('/ai-tools')}>
                    Explore All 13 Tools <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="hp-footer">
            <div className="hp-footer-inner">
              <div>
                <div className="hp-footer-brand">ResumeIQ</div>
                <div className="hp-footer-tagline">AI-powered career tools for modern job seekers</div>
              </div>
              <div className="hp-footer-links">
                {['About', 'Privacy', 'Terms', 'Contact'].map(l => (
                  <a key={l} href="#" className="hp-footer-link">{l}</a>
                ))}
              </div>
            </div>
            <div className="hp-footer-bottom">© 2026 ResumeIQ · All rights reserved</div>
          </footer>

        </div>
      </div>
    </>
  );
}