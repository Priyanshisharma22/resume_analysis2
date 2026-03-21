import { useState, useRef } from "react";
import {
  Globe, Download, Eye, Edit3, Sparkles, Plus, Trash2,
  Check, ExternalLink, Code, Palette, User, Briefcase,
  GraduationCap, Wrench, FolderOpen, Mail, Loader
} from "lucide-react";
import { callAI } from "./aiHelper";

// ── THEMES ────────────────────────────────────────────────────────────────

const THEMES = [
  {
    id: "midnight",
    name: "Midnight",
    desc: "Dark & sleek",
    preview: ["#0f0f1a", "#7c3aed", "#e2e8f0"],
  },
  {
    id: "editorial",
    name: "Editorial",
    desc: "Clean & bold",
    preview: ["#fafaf8", "#1a1a1a", "#d946ef"],
  },
  {
    id: "forest",
    name: "Forest",
    desc: "Calm & natural",
    preview: ["#0d1f1a", "#10b981", "#f0fdf4"],
  },
  {
    id: "sunset",
    name: "Sunset",
    desc: "Warm & vibrant",
    preview: ["#fff7ed", "#ea580c", "#1a1a1a"],
  },
  {
    id: "ocean",
    name: "Ocean",
    desc: "Cool & professional",
    preview: ["#0c1445", "#38bdf8", "#e0f2fe"],
  },
];

// ── THEME CSS GENERATORS ──────────────────────────────────────────────────

function getThemeVars(themeId) {
  const themes = {
    midnight: {
      bg: "#0f0f1a", bg2: "#1a1a2e", bg3: "#16213e",
      accent: "#7c3aed", accent2: "#a78bfa",
      text: "#e2e8f0", textMuted: "#94a3b8", textFaint: "#475569",
      border: "rgba(255,255,255,0.08)", card: "rgba(255,255,255,0.04)",
      gradient: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
      heroGrad: "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(124,58,237,0.3) 0%, transparent 60%)",
      font: "'Inter', sans-serif", headFont: "'Syne', sans-serif",
    },
    editorial: {
      bg: "#fafaf8", bg2: "#f4f4f0", bg3: "#eeeeea",
      accent: "#1a1a1a", accent2: "#d946ef",
      text: "#1a1a1a", textMuted: "#52525b", textFaint: "#a1a1aa",
      border: "rgba(0,0,0,0.08)", card: "rgba(0,0,0,0.03)",
      gradient: "linear-gradient(135deg, #1a1a1a 0%, #3f3f46 100%)",
      heroGrad: "radial-gradient(ellipse 60% 80% at 70% 40%, rgba(217,70,239,0.12) 0%, transparent 60%)",
      font: "'DM Sans', sans-serif", headFont: "'Instrument Serif', serif",
    },
    forest: {
      bg: "#0d1f1a", bg2: "#0f2920", bg3: "#163326",
      accent: "#10b981", accent2: "#34d399",
      text: "#f0fdf4", textMuted: "#86efac", textFaint: "#4ade80",
      border: "rgba(16,185,129,0.15)", card: "rgba(16,185,129,0.05)",
      gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
      heroGrad: "radial-gradient(ellipse 70% 60% at 20% 60%, rgba(16,185,129,0.25) 0%, transparent 60%)",
      font: "'Inter', sans-serif", headFont: "'Syne', sans-serif",
    },
    sunset: {
      bg: "#fff7ed", bg2: "#ffedd5", bg3: "#fed7aa",
      accent: "#ea580c", accent2: "#fb923c",
      text: "#1a1a1a", textMuted: "#57534e", textFaint: "#a8a29e",
      border: "rgba(234,88,12,0.15)", card: "rgba(234,88,12,0.04)",
      gradient: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
      heroGrad: "radial-gradient(ellipse 80% 50% at 60% 30%, rgba(234,88,12,0.15) 0%, transparent 60%)",
      font: "'DM Sans', sans-serif", headFont: "'Syne', sans-serif",
    },
    ocean: {
      bg: "#0c1445", bg2: "#0f1b56", bg3: "#132268",
      accent: "#38bdf8", accent2: "#7dd3fc",
      text: "#e0f2fe", textMuted: "#7dd3fc", textFaint: "#38bdf8",
      border: "rgba(56,189,248,0.15)", card: "rgba(56,189,248,0.06)",
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
      heroGrad: "radial-gradient(ellipse 70% 60% at 80% 20%, rgba(56,189,248,0.2) 0%, transparent 60%)",
      font: "'Inter', sans-serif", headFont: "'Syne', sans-serif",
    },
  };
  return themes[themeId] || themes.midnight;
}

// ── HTML GENERATOR ────────────────────────────────────────────────────────

function generatePortfolioHTML(data, themeId) {
  const t = getThemeVars(themeId);
  const { personal: p, experience, education, skills, projects, tagline } = data;

  const skillsList = skills.filter(s => s.items).map(s =>
    s.items.split(",").map(i => i.trim()).filter(Boolean)
  ).flat();

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${p.name || "Portfolio"} — ${p.title || "Developer"}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Inter:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: ${t.bg};
    --bg2: ${t.bg2};
    --bg3: ${t.bg3};
    --accent: ${t.accent};
    --accent2: ${t.accent2};
    --text: ${t.text};
    --text-muted: ${t.textMuted};
    --text-faint: ${t.textFaint};
    --border: ${t.border};
    --card: ${t.card};
    --gradient: ${t.gradient};
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: ${t.font};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  /* ── NAV ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 40px;
    background: ${t.bg}cc;
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: ${t.headFont};
    font-size: 18px; font-weight: 700;
    color: var(--text); text-decoration: none;
    letter-spacing: -0.02em;
  }
  .nav-links { display: flex; gap: 32px; list-style: none; }
  .nav-links a {
    color: var(--text-muted); text-decoration: none;
    font-size: 14px; font-weight: 500;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--accent2); }
  .nav-cta {
    padding: 8px 20px;
    background: var(--gradient);
    color: white; text-decoration: none;
    border-radius: 100px; font-size: 13px; font-weight: 600;
    transition: opacity 0.2s; white-space: nowrap;
  }
  .nav-cta:hover { opacity: 0.85; }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex; align-items: center;
    padding: 120px 40px 80px;
    position: relative; overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background: ${t.heroGrad};
    pointer-events: none;
  }
  .hero-inner { max-width: 800px; position: relative; z-index: 1; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 14px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 100px;
    font-size: 12px; font-weight: 600;
    color: var(--accent2);
    letter-spacing: 0.06em; text-transform: uppercase;
    margin-bottom: 24px;
  }
  .hero-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent2);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }
  .hero h1 {
    font-family: ${t.headFont};
    font-size: clamp(40px, 6vw, 72px);
    font-weight: ${themeId === "editorial" ? "400" : "800"};
    line-height: 1.05;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 20px;
  }
  .hero h1 em {
    font-style: italic;
    background: var(--gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero-sub {
    font-size: clamp(16px, 2vw, 20px);
    color: var(--text-muted); font-weight: 300;
    max-width: 520px; line-height: 1.65;
    margin-bottom: 40px;
  }
  .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }
  .btn-primary {
    padding: 14px 28px;
    background: var(--gradient);
    color: white; border: none;
    border-radius: 12px; font-size: 15px; font-weight: 600;
    cursor: pointer; text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.2); }
  .btn-secondary {
    padding: 14px 28px;
    background: var(--card);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 12px; font-size: 15px; font-weight: 500;
    cursor: pointer; text-decoration: none;
    transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-secondary:hover { background: var(--bg3); border-color: var(--accent2); }

  /* ── SECTIONS ── */
  section { padding: 100px 40px; }
  .section-inner { max-width: 1000px; margin: 0 auto; }
  .section-label {
    display: flex; align-items: center; gap: 12px;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--accent2); margin-bottom: 16px;
  }
  .section-label::after {
    content: ''; flex: 1; height: 1px;
    background: var(--border);
  }
  .section-title {
    font-family: ${t.headFont};
    font-size: clamp(28px, 4vw, 44px);
    font-weight: ${themeId === "editorial" ? "400" : "700"};
    letter-spacing: -0.02em;
    color: var(--text); margin-bottom: 48px;
    line-height: 1.15;
  }

  /* ── ABOUT ── */
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .about-text { font-size: 17px; color: var(--text-muted); line-height: 1.8; font-weight: 300; }
  .about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .stat-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; padding: 24px;
    transition: border-color 0.2s;
  }
  .stat-card:hover { border-color: var(--accent2); }
  .stat-num {
    font-family: ${t.headFont};
    font-size: 36px; font-weight: 800;
    background: var(--gradient);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    line-height: 1;
  }
  .stat-label { font-size: 13px; color: var(--text-faint); margin-top: 6px; font-weight: 500; }

  /* ── SKILLS ── */
  .skills-bg { background: var(--bg2); }
  .skills-grid { display: flex; flex-wrap: wrap; gap: 10px; }
  .skill-chip {
    padding: 8px 16px;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 100px; font-size: 13px; font-weight: 500;
    color: var(--text-muted); transition: all 0.2s; cursor: default;
  }
  .skill-chip:hover {
    background: var(--bg3); color: var(--text);
    border-color: var(--accent2);
    transform: translateY(-2px);
  }

  /* ── EXPERIENCE ── */
  .exp-list { display: flex; flex-direction: column; gap: 2px; }
  .exp-item {
    display: grid; grid-template-columns: 140px 1fr;
    gap: 32px; padding: 28px 0;
    border-bottom: 1px solid var(--border);
  }
  .exp-item:last-child { border-bottom: none; }
  .exp-date { font-size: 12px; color: var(--text-faint); font-weight: 500; padding-top: 4px; font-family: 'Inter', monospace; }
  .exp-role {
    font-size: 17px; font-weight: 700;
    color: var(--text); margin-bottom: 4px; letter-spacing: -0.01em;
  }
  .exp-company {
    font-size: 14px; color: var(--accent2);
    font-weight: 600; margin-bottom: 12px;
  }
  .exp-bullets { list-style: none; padding: 0; }
  .exp-bullets li {
    font-size: 14px; color: var(--text-muted);
    padding: 4px 0 4px 18px; position: relative;
    line-height: 1.6;
  }
  .exp-bullets li::before {
    content: '—'; position: absolute; left: 0;
    color: var(--accent2); font-size: 12px;
  }

  /* ── PROJECTS ── */
  .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .project-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 20px; padding: 28px;
    transition: all 0.25s; position: relative; overflow: hidden;
  }
  .project-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--gradient);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s;
  }
  .project-card:hover::before { transform: scaleX(1); }
  .project-card:hover { border-color: var(--accent2); transform: translateY(-4px); }
  .project-num {
    font-size: 11px; font-weight: 700; color: var(--text-faint);
    letter-spacing: 0.1em; margin-bottom: 16px; font-family: 'Inter', monospace;
  }
  .project-name {
    font-size: 18px; font-weight: 700; color: var(--text);
    margin-bottom: 8px; letter-spacing: -0.01em;
  }
  .project-desc { font-size: 14px; color: var(--text-muted); line-height: 1.65; margin-bottom: 16px; }
  .project-tech { display: flex; flex-wrap: wrap; gap: 6px; }
  .tech-tag {
    padding: 3px 10px;
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: 6px; font-size: 11px;
    color: var(--text-faint); font-weight: 600;
  }

  /* ── CONTACT ── */
  .contact-bg { background: var(--bg2); }
  .contact-inner { max-width: 600px; margin: 0 auto; text-align: center; }
  .contact-inner .section-label { justify-content: center; }
  .contact-inner .section-label::after { display: none; }
  .contact-desc { font-size: 17px; color: var(--text-muted); line-height: 1.7; margin-bottom: 40px; font-weight: 300; }
  .contact-links { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .contact-link {
    padding: 12px 24px;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; font-size: 14px; font-weight: 500;
    color: var(--text-muted); text-decoration: none;
    transition: all 0.2s;
  }
  .contact-link:hover { border-color: var(--accent2); color: var(--text); background: var(--bg3); }

  /* ── FOOTER ── */
  footer {
    padding: 32px 40px;
    border-top: 1px solid var(--border);
    text-align: center;
    font-size: 13px; color: var(--text-faint);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    nav { padding: 14px 20px; }
    .nav-links { display: none; }
    section { padding: 70px 20px; }
    .hero { padding: 100px 20px 60px; }
    .about-grid { grid-template-columns: 1fr; gap: 40px; }
    .exp-item { grid-template-columns: 1fr; gap: 8px; }
    .projects-grid { grid-template-columns: 1fr; }
  }

  /* ── SCROLL ANIMATIONS ── */
  .fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
</style>
</head>
<body>

<!-- NAV -->
<nav>
  <a href="#" class="nav-logo">${p.name?.split(" ")[0] || "Portfolio"}</a>
  <ul class="nav-links">
    <li><a href="#about">About</a></li>
    ${experience.some(e => e.role) ? '<li><a href="#experience">Experience</a></li>' : ''}
    ${projects.some(pr => pr.name) ? '<li><a href="#projects">Projects</a></li>' : ''}
    <li><a href="#contact">Contact</a></li>
  </ul>
  ${p.email ? `<a href="mailto:${p.email}" class="nav-cta">Get in touch</a>` : ''}
</nav>

<!-- HERO -->
<section class="hero" id="home">
  <div class="hero-inner">
    <div class="hero-badge">
      <div class="hero-badge-dot"></div>
      ${p.title || "Available for opportunities"}
    </div>
    <h1>Hi, I'm <em>${p.name || "Your Name"}</em></h1>
    <p class="hero-sub">${tagline || p.summary?.slice(0, 120) || "A passionate professional building great things."}</p>
    <div class="hero-actions">
      ${projects.some(pr => pr.name) ? '<a href="#projects" class="btn-primary">View My Work →</a>' : ''}
      ${p.email ? `<a href="mailto:${p.email}" class="btn-secondary">✉ Contact Me</a>` : ''}
    </div>
  </div>
</section>

<!-- ABOUT -->
<section id="about">
  <div class="section-inner fade-in">
    <div class="section-label">About Me</div>
    <div class="about-grid">
      <div>
        <h2 class="section-title">Crafting experiences that make a difference</h2>
        <p class="about-text">${p.summary || "I'm a passionate professional with a drive to create impactful work."}</p>
        ${p.location ? `<p style="margin-top:16px; font-size:14px; color:var(--text-faint);">📍 ${p.location}</p>` : ''}
      </div>
      <div class="about-stats">
        <div class="stat-card">
          <div class="stat-num">${experience.length}+</div>
          <div class="stat-label">Roles & Positions</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${projects.filter(p => p.name).length || "5"}+</div>
          <div class="stat-label">Projects Built</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${skillsList.length || "10"}+</div>
          <div class="stat-label">Skills & Tools</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">${education.filter(e => e.degree).length || "1"}</div>
          <div class="stat-label">Degrees Earned</div>
        </div>
      </div>
    </div>
  </div>
</section>

${skillsList.length > 0 ? `
<!-- SKILLS -->
<section class="skills-bg" id="skills">
  <div class="section-inner fade-in">
    <div class="section-label">Skills & Tools</div>
    <h2 class="section-title">What I work with</h2>
    <div class="skills-grid">
      ${skillsList.map(sk => `<div class="skill-chip">${sk}</div>`).join("\n      ")}
    </div>
  </div>
</section>` : ''}

${experience.some(e => e.role) ? `
<!-- EXPERIENCE -->
<section id="experience">
  <div class="section-inner fade-in">
    <div class="section-label">Experience</div>
    <h2 class="section-title">Where I've worked</h2>
    <div class="exp-list">
      ${experience.filter(e => e.role || e.company).map(exp => `
      <div class="exp-item">
        <div class="exp-date">${exp.duration || "Present"}</div>
        <div>
          <div class="exp-role">${exp.role}</div>
          <div class="exp-company">${exp.company}${exp.location ? ` · ${exp.location}` : ""}</div>
          <ul class="exp-bullets">
            ${exp.bullets.filter(b => b.trim()).map(b => `<li>${b}</li>`).join("\n            ")}
          </ul>
        </div>
      </div>`).join("\n")}
    </div>
  </div>
</section>` : ''}

${projects.some(pr => pr.name) ? `
<!-- PROJECTS -->
<section id="projects" style="background:var(--bg2);">
  <div class="section-inner fade-in">
    <div class="section-label">Projects</div>
    <h2 class="section-title">Things I've built</h2>
    <div class="projects-grid">
      ${projects.filter(pr => pr.name).map((proj, i) => `
      <div class="project-card">
        <div class="project-num">${String(i + 1).padStart(2, "0")}</div>
        <div class="project-name">${proj.name}</div>
        <p class="project-desc">${proj.description || "A project I built with passion."}</p>
        ${proj.tech ? `<div class="project-tech">${proj.tech.split(",").map(t => `<span class="tech-tag">${t.trim()}</span>`).join("")}</div>` : ""}
        ${proj.link ? `<a href="${proj.link}" target="_blank" style="display:inline-flex;align-items:center;gap:6px;margin-top:16px;font-size:13px;color:var(--accent2);font-weight:600;text-decoration:none;">View Project →</a>` : ""}
      </div>`).join("\n")}
    </div>
  </div>
</section>` : ''}

<!-- CONTACT -->
<section class="contact-bg" id="contact">
  <div class="contact-inner fade-in">
    <div class="section-label">Contact</div>
    <h2 class="section-title" style="margin-bottom:16px;">Let's work together</h2>
    <p class="contact-desc">Open to new opportunities, collaborations, and interesting conversations. Feel free to reach out!</p>
    <div class="contact-links">
      ${p.email ? `<a href="mailto:${p.email}" class="contact-link">✉ ${p.email}</a>` : ""}
      ${p.linkedin ? `<a href="https://${p.linkedin.replace("https://", "")}" target="_blank" class="contact-link">💼 LinkedIn</a>` : ""}
      ${p.website ? `<a href="https://${p.website.replace("https://", "")}" target="_blank" class="contact-link">🌐 ${p.website}</a>` : ""}
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <p>© ${new Date().getFullYear()} ${p.name || "Portfolio"} · Built with care</p>
</footer>

<script>
  // Fade-in on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.1 });
  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
</script>
</body>
</html>`;
}

// ── EMPTY STATE ───────────────────────────────────────────────────────────

const EMPTY = {
  personal: { name: "", title: "", email: "", phone: "", location: "", linkedin: "", website: "", summary: "" },
  tagline: "",
  experience: [{ id: 1, role: "", company: "", duration: "", location: "", bullets: [""] }],
  education: [{ id: 1, degree: "", institution: "", year: "" }],
  skills: [{ id: 1, category: "Technical", items: "" }],
  projects: [{ id: 1, name: "", description: "", tech: "", link: "" }],
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────

export default function PortfolioBuilder({ analysis }) {
  const iframeRef = useRef(null);

  const [theme, setTheme] = useState("midnight");
  const [mode, setMode] = useState("split");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState(() => {
    if (!analysis) return EMPTY;
    return {
      personal: {
        name: analysis.candidate?.name || "",
        title: analysis.experience?.[0]?.role || "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        website: "",
        summary: analysis.candidate?.summary || "",
      },
      tagline: "",
      experience: analysis.experience?.length
        ? analysis.experience.map((e, i) => ({
            id: i + 1, role: e.role || "", company: e.company || "",
            duration: e.duration || "", location: "",
            bullets: e.highlights?.length ? e.highlights : [""],
          }))
        : EMPTY.experience,
      education: analysis.education?.length
        ? analysis.education.map((e, i) => ({
            id: i + 1, degree: e.degree || "",
            institution: e.institution || "", year: e.year || "",
          }))
        : EMPTY.education,
      skills: analysis.skills
        ? Object.entries(analysis.skills)
            .filter(([, v]) => v?.length)
            .map(([k, v], i) => ({ id: i + 1, category: k, items: v.join(", ") }))
        : EMPTY.skills,
      projects: EMPTY.projects,
    };
  });

  // ── helpers ────────────────────────────────────────────────────────────
  const setP = (k, v) => setData(d => ({ ...d, personal: { ...d.personal, [k]: v } }));

  const addExp = () => setData(d => ({ ...d, experience: [...d.experience, { id: Date.now(), role: "", company: "", duration: "", location: "", bullets: [""] }] }));
  const removeExp = id => setData(d => ({ ...d, experience: d.experience.filter(e => e.id !== id) }));
  const updateExp = (id, k, v) => setData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, [k]: v } : e) }));
  const updateExpBullet = (id, i, v) => setData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, bullets: e.bullets.map((b, j) => j === i ? v : b) } : e) }));
  const addExpBullet = id => setData(d => ({ ...d, experience: d.experience.map(e => e.id === id ? { ...e, bullets: [...e.bullets, ""] } : e) }));

  const addProj = () => setData(d => ({ ...d, projects: [...d.projects, { id: Date.now(), name: "", description: "", tech: "", link: "" }] }));
  const removeProj = id => setData(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) }));
  const updateProj = (id, k, v) => setData(d => ({ ...d, projects: d.projects.map(p => p.id === id ? { ...p, [k]: v } : p) }));

  const addSkill = () => setData(d => ({ ...d, skills: [...d.skills, { id: Date.now(), category: "", items: "" }] }));
  const removeSkill = id => setData(d => ({ ...d, skills: d.skills.filter(s => s.id !== id) }));
  const updateSkill = (id, k, v) => setData(d => ({ ...d, skills: d.skills.map(s => s.id === id ? { ...s, [k]: v } : s) }));

  // ── AI enhance ────────────────────────────────────────────────────────
  const aiEnhance = async () => {
    setAiLoading(true); setError(""); setAiDone(false);
    try {
      const prompt = `You are a portfolio copywriter. Given this resume data, write:
1. A punchy one-liner tagline (under 15 words, first-person, no clichés like "passionate" or "results-driven")
2. An improved bio/summary (2 sentences, confident, specific)
3. Better project descriptions for each project (1-2 sentences each, focus on impact)

Resume:
Name: ${data.personal.name}
Role: ${data.personal.title}
Summary: ${data.personal.summary}
Skills: ${data.skills.map(s => s.items).join(", ")}
Projects: ${data.projects.map(p => `${p.name}: ${p.description}`).join(" | ")}

Return ONLY valid JSON:
{
  "tagline": "...",
  "summary": "...",
  "projects": [{"name": "...", "description": "..."}]
}`;

      const raw = await callAI(prompt, 600);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean.slice(clean.indexOf("{"), clean.lastIndexOf("}") + 1));

      setData(d => ({
        ...d,
        tagline: parsed.tagline || d.tagline,
        personal: { ...d.personal, summary: parsed.summary || d.personal.summary },
        projects: d.projects.map(p => {
          const enhanced = parsed.projects?.find(ep => ep.name?.toLowerCase().includes(p.name?.toLowerCase()));
          return enhanced ? { ...p, description: enhanced.description } : p;
        }),
      }));
      setAiDone(true);
      setTimeout(() => setAiDone(false), 3000);
    } catch (e) {
      setError("AI enhancement failed: " + e.message);
    } finally {
      setAiLoading(false);
    }
  };

  // ── download ──────────────────────────────────────────────────────────
  const download = () => {
    const html = generatePortfolioHTML(data, theme);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.personal.name?.replace(/\s+/g, "-") || "portfolio"}-portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const html = generatePortfolioHTML(data, theme);
  const showEdit = mode === "split" || mode === "edit";
  const showPreview = mode === "split" || mode === "preview";

  return (
    <>
      <style>{`
        @keyframes pb-spin { to { transform: rotate(360deg); } }
        .pb-root { padding: 4px 0 40px; }
        .pb-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 9px; padding: 9px 13px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #e2e8f0; outline: none; transition: border-color 0.18s; box-sizing: border-box; }
        .pb-input::placeholder { color: #334155; }
        .pb-input:focus { border-color: rgba(167,139,250,0.4); background: rgba(167,139,250,0.04); }
        .pb-textarea { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 9px; padding: 9px 13px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #e2e8f0; outline: none; resize: vertical; min-height: 72px; line-height: 1.6; transition: border-color 0.18s; box-sizing: border-box; }
        .pb-textarea::placeholder { color: #334155; }
        .pb-textarea:focus { border-color: rgba(167,139,250,0.4); background: rgba(167,139,250,0.04); }
        .pb-label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: #475569; margin-bottom: 6px; }
        .pb-field { margin-bottom: 12px; }
        .pb-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .pb-section { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 18px; margin-bottom: 14px; }
        .pb-section-title { font-size: 13px; font-weight: 700; color: #94a3b8; margin-bottom: 14px; display: flex; align-items: center; gap: 7px; }
        .pb-entry { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 14px; margin-bottom: 10px; }
        .pb-entry-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .pb-entry-num { font-size: 10px; font-weight: 700; color: #334155; letter-spacing: 0.1em; text-transform: uppercase; }
        .pb-remove { background: none; border: none; cursor: pointer; color: #475569; display: flex; align-items: center; padding: 4px; border-radius: 5px; transition: color 0.15s; }
        .pb-remove:hover { color: #f87171; }
        .pb-add { display: flex; align-items: center; gap: 6px; width: 100%; padding: 8px; border-radius: 8px; border: 1px dashed rgba(255,255,255,0.1); background: none; color: #475569; font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer; justify-content: center; transition: all 0.15s; }
        .pb-add:hover { border-color: rgba(167,139,250,0.4); color: #a78bfa; }
        .pb-add-small { display: flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 6px; border: 1px dashed rgba(255,255,255,0.08); background: none; color: #475569; font-family: 'DM Sans', sans-serif; font-size: 11px; cursor: pointer; }
      `}</style>

      <div className="pb-root">

        {/* ── Toolbar ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe size={18} color="#38bdf8" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}>Portfolio Builder</div>
              <div style={{ fontSize: 12, color: "#475569" }}>One-page site from your resume</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {/* Mode toggle */}
            <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 3, border: "1px solid rgba(255,255,255,0.07)" }}>
              {[["edit", Edit3], ["split", Code], ["preview", Eye]].map(([m, Icon]) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 7, border: "none", background: mode === m ? "rgba(255,255,255,0.08)" : "none", color: mode === m ? "#e2e8f0" : "#475569", fontFamily: "DM Sans, sans-serif", fontSize: 12, cursor: "pointer", fontWeight: 500, transition: "all 0.15s" }}
                >
                  <Icon size={12} />
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            {/* AI Enhance */}
            <button
              onClick={aiEnhance}
              disabled={aiLoading}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, border: "1px solid rgba(167,139,250,0.3)", background: "rgba(167,139,250,0.1)", color: aiDone ? "#34d399" : "#a78bfa", fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
            >
              {aiLoading
                ? <><span style={{ width: 12, height: 12, border: "2px solid rgba(167,139,250,0.3)", borderTopColor: "#a78bfa", borderRadius: "50%", animation: "pb-spin 0.7s linear infinite", display: "inline-block" }} /> Enhancing…</>
                : aiDone
                  ? <><Check size={12} /> Enhanced!</>
                  : <><Sparkles size={12} /> AI Enhance</>
              }
            </button>

            {/* Download */}
            <button
              onClick={download}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, border: "none", background: "linear-gradient(135deg, #0ea5e9, #38bdf8)", color: "white", fontFamily: "DM Sans, sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(14,165,233,0.3)" }}
            >
              <Download size={13} /> Download HTML
            </button>
          </div>
        </div>

        {/* ── Theme picker ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Theme</span>
          {THEMES.map(th => (
            <button
              key={th.id}
              onClick={() => setTheme(th.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: 9, border: theme === th.id ? "1px solid rgba(167,139,250,0.5)" : "1px solid rgba(255,255,255,0.07)", background: theme === th.id ? "rgba(167,139,250,0.1)" : "rgba(255,255,255,0.03)", cursor: "pointer", transition: "all 0.15s" }}
            >
              <div style={{ display: "flex", gap: 2 }}>
                {th.preview.map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,0.1)" }} />)}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: theme === th.id ? "#a78bfa" : "#64748b" }}>{th.name}</span>
              {theme === th.id && <Check size={10} color="#a78bfa" />}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 14 }}>
            {error}
          </div>
        )}

        {/* ── Main area ── */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>

          {/* Editor */}
          {showEdit && (
            <div style={{ flex: mode === "split" ? "0 0 42%" : 1, maxWidth: mode === "split" ? "42%" : "100%", overflowY: "auto", maxHeight: "calc(100vh - 280px)" }}>

              {/* Personal */}
              <div className="pb-section">
                <div className="pb-section-title"><User size={14} color="#a78bfa" /> Personal Info</div>
                <div className="pb-row2">
                  <div className="pb-field"><label className="pb-label">Full Name</label><input className="pb-input" placeholder="Jane Smith" value={data.personal.name} onChange={e => setP("name", e.target.value)} /></div>
                  <div className="pb-field"><label className="pb-label">Title / Role</label><input className="pb-input" placeholder="Full-Stack Engineer" value={data.personal.title} onChange={e => setP("title", e.target.value)} /></div>
                </div>
                <div className="pb-row2">
                  <div className="pb-field"><label className="pb-label">Email</label><input className="pb-input" placeholder="jane@email.com" value={data.personal.email} onChange={e => setP("email", e.target.value)} /></div>
                  <div className="pb-field"><label className="pb-label">Location</label><input className="pb-input" placeholder="San Francisco, CA" value={data.personal.location} onChange={e => setP("location", e.target.value)} /></div>
                </div>
                <div className="pb-row2">
                  <div className="pb-field"><label className="pb-label">LinkedIn</label><input className="pb-input" placeholder="linkedin.com/in/jane" value={data.personal.linkedin} onChange={e => setP("linkedin", e.target.value)} /></div>
                  <div className="pb-field"><label className="pb-label">Website</label><input className="pb-input" placeholder="janesmith.dev" value={data.personal.website} onChange={e => setP("website", e.target.value)} /></div>
                </div>
                <div className="pb-field">
                  <label className="pb-label">Tagline <span style={{ color: "#334155", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(hero one-liner)</span></label>
                  <input className="pb-input" placeholder='e.g. "I build fast products that people love."' value={data.tagline} onChange={e => setData(d => ({ ...d, tagline: e.target.value }))} />
                </div>
                <div className="pb-field">
                  <label className="pb-label">Bio / Summary</label>
                  <textarea className="pb-textarea" rows={3} placeholder="A compelling 2-sentence bio about your work and impact..." value={data.personal.summary} onChange={e => setP("summary", e.target.value)} />
                </div>
              </div>

              {/* Projects */}
              <div className="pb-section">
                <div className="pb-section-title"><FolderOpen size={14} color="#fb923c" /> Projects</div>
                {data.projects.map((proj, idx) => (
                  <div className="pb-entry" key={proj.id}>
                    <div className="pb-entry-header">
                      <span className="pb-entry-num">Project {idx + 1}</span>
                      <button className="pb-remove" onClick={() => removeProj(proj.id)}><Trash2 size={12} /></button>
                    </div>
                    <div className="pb-row2">
                      <div className="pb-field"><label className="pb-label">Name</label><input className="pb-input" placeholder="My Project" value={proj.name} onChange={e => updateProj(proj.id, "name", e.target.value)} /></div>
                      <div className="pb-field"><label className="pb-label">Tech Stack</label><input className="pb-input" placeholder="React, Node, Postgres" value={proj.tech} onChange={e => updateProj(proj.id, "tech", e.target.value)} /></div>
                    </div>
                    <div className="pb-field"><label className="pb-label">Description</label><textarea className="pb-textarea" rows={2} placeholder="What it does and why it matters..." value={proj.description} onChange={e => updateProj(proj.id, "description", e.target.value)} /></div>
                    <div className="pb-field"><label className="pb-label">Link <span style={{ color: "#334155", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label><input className="pb-input" placeholder="github.com/jane/project" value={proj.link} onChange={e => updateProj(proj.id, "link", e.target.value)} /></div>
                  </div>
                ))}
                <button className="pb-add" onClick={addProj}><Plus size={12} /> Add Project</button>
              </div>

              {/* Experience */}
              <div className="pb-section">
                <div className="pb-section-title"><Briefcase size={14} color="#38bdf8" /> Experience</div>
                {data.experience.map((exp, idx) => (
                  <div className="pb-entry" key={exp.id}>
                    <div className="pb-entry-header">
                      <span className="pb-entry-num">Experience {idx + 1}</span>
                      {data.experience.length > 1 && <button className="pb-remove" onClick={() => removeExp(exp.id)}><Trash2 size={12} /></button>}
                    </div>
                    <div className="pb-row2">
                      <div className="pb-field"><label className="pb-label">Role</label><input className="pb-input" placeholder="Senior Engineer" value={exp.role} onChange={e => updateExp(exp.id, "role", e.target.value)} /></div>
                      <div className="pb-field"><label className="pb-label">Company</label><input className="pb-input" placeholder="Acme Corp" value={exp.company} onChange={e => updateExp(exp.id, "company", e.target.value)} /></div>
                    </div>
                    <div className="pb-field"><label className="pb-label">Duration</label><input className="pb-input" placeholder="Jan 2022 – Present" value={exp.duration} onChange={e => updateExp(exp.id, "duration", e.target.value)} /></div>
                    <div className="pb-field">
                      <label className="pb-label">Key Points</label>
                      {exp.bullets.map((b, bi) => (
                        <div key={bi} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                          <input className="pb-input" placeholder="• What you did and its impact..." value={b} onChange={e => updateExpBullet(exp.id, bi, e.target.value)} />
                        </div>
                      ))}
                      <button className="pb-add-small" onClick={() => addExpBullet(exp.id)}><Plus size={11} /> Add point</button>
                    </div>
                  </div>
                ))}
                <button className="pb-add" onClick={addExp}><Plus size={12} /> Add Experience</button>
              </div>

              {/* Skills */}
              <div className="pb-section">
                <div className="pb-section-title"><Wrench size={14} color="#34d399" /> Skills</div>
                {data.skills.map((sk, idx) => (
                  <div className="pb-entry" key={sk.id}>
                    <div className="pb-entry-header">
                      <span className="pb-entry-num">Group {idx + 1}</span>
                      {data.skills.length > 1 && <button className="pb-remove" onClick={() => removeSkill(sk.id)}><Trash2 size={12} /></button>}
                    </div>
                    <div className="pb-row2">
                      <div className="pb-field"><label className="pb-label">Category</label><input className="pb-input" placeholder="Frontend" value={sk.category} onChange={e => updateSkill(sk.id, "category", e.target.value)} /></div>
                      <div className="pb-field"><label className="pb-label">Skills (comma separated)</label><input className="pb-input" placeholder="React, TypeScript, CSS" value={sk.items} onChange={e => updateSkill(sk.id, "items", e.target.value)} /></div>
                    </div>
                  </div>
                ))}
                <button className="pb-add" onClick={addSkill}><Plus size={12} /> Add Skill Group</button>
              </div>

            </div>
          )}

          {/* Preview */}
          {showPreview && (
            <div style={{ flex: 1, position: "sticky", top: 0 }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ display: "flex", gap: 5 }}>
                      {["#f87171","#fbbf24","#34d399"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
                    </div>
                    <span style={{ fontSize: 11, color: "#334155", fontFamily: "monospace", marginLeft: 6 }}>
                      {data.personal.name?.toLowerCase().replace(/\s+/g, "-") || "portfolio"}.html
                    </span>
                  </div>
                  <button onClick={download} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)", background: "none", color: "#475569", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                    <ExternalLink size={10} /> Open
                  </button>
                </div>
                <iframe
                  ref={iframeRef}
                  srcDoc={html}
                  style={{ width: "100%", height: mode === "preview" ? "calc(100vh - 220px)" : "calc(100vh - 340px)", border: "none", display: "block", background: "white" }}
                  title="Portfolio Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}