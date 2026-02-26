import { useState, useRef } from "react";
import {
  FileText, Plus, Trash2, Download, Eye, Edit3,
  ChevronDown, ChevronUp, GripVertical, Sparkles, Check
} from "lucide-react";

// ── TEMPLATES ─────────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    desc: "Clean & ATS-friendly",
    accent: "#1a1a2e",
    style: "traditional",
  },
  {
    id: "modern",
    name: "Modern",
    desc: "Bold sidebar layout",
    accent: "#c84b2f",
    style: "sidebar",
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Elegant whitespace",
    accent: "#2d6a4f",
    style: "minimal",
  },
  {
    id: "executive",
    name: "Executive",
    desc: "Senior professional",
    accent: "#1b3a6b",
    style: "executive",
  },
];

const EMPTY_RESUME = {
  personal: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
  },
  experience: [
    { id: 1, role: "", company: "", duration: "", location: "", bullets: [""] },
  ],
  education: [
    { id: 1, degree: "", institution: "", year: "", gpa: "" },
  ],
  skills: [
    { id: 1, category: "Technical", items: "" },
    { id: 2, category: "Soft Skills", items: "" },
  ],
  projects: [],
  certifications: [],
};

// ── PREVIEW RENDERERS ──────────────────────────────────────────────────────

function ClassicPreview({ data, accent }) {
  const { personal: p, experience, education, skills, projects, certifications } = data;
  return (
    <div style={{ fontFamily: "'Georgia', serif", color: "#1a1a1a", fontSize: 11, lineHeight: 1.5 }}>
      {/* Header */}
      <div style={{ textAlign: "center", borderBottom: `2px solid ${accent}`, paddingBottom: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.05em", color: accent }}>{p.name || "YOUR NAME"}</div>
        {p.title && <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{p.title}</div>}
        <div style={{ fontSize: 10, color: "#666", marginTop: 6, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {p.summary && (
        <PreviewSection title="PROFESSIONAL SUMMARY" accent={accent}>
          <p style={{ margin: 0, fontSize: 11, color: "#333", lineHeight: 1.6 }}>{p.summary}</p>
        </PreviewSection>
      )}

      {/* Experience */}
      {experience.some(e => e.role || e.company) && (
        <PreviewSection title="EXPERIENCE" accent={accent}>
          {experience.filter(e => e.role || e.company).map((exp, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: 12 }}>{exp.role || "Role"}</span>
                <span style={{ fontSize: 10, color: "#666" }}>{exp.duration}</span>
              </div>
              <div style={{ fontSize: 11, color: "#555", fontStyle: "italic" }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
              <ul style={{ paddingLeft: 14, margin: "4px 0 0", listStyle: "disc" }}>
                {exp.bullets.filter(b => b.trim()).map((b, j) => (
                  <li key={j} style={{ fontSize: 11, color: "#333", marginBottom: 2 }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </PreviewSection>
      )}

      {/* Education */}
      {education.some(e => e.degree || e.institution) && (
        <PreviewSection title="EDUCATION" accent={accent}>
          {education.filter(e => e.degree || e.institution).map((edu, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 12 }}>{edu.degree}</div>
                <div style={{ fontSize: 11, color: "#555" }}>{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</div>
              </div>
              <div style={{ fontSize: 10, color: "#666" }}>{edu.year}</div>
            </div>
          ))}
        </PreviewSection>
      )}

      {/* Skills */}
      {skills.some(s => s.items) && (
        <PreviewSection title="SKILLS" accent={accent}>
          {skills.filter(s => s.items).map((s, i) => (
            <div key={i} style={{ fontSize: 11, marginBottom: 3 }}>
              <strong>{s.category}:</strong> {s.items}
            </div>
          ))}
        </PreviewSection>
      )}

      {/* Projects */}
      {projects.some(p => p.name) && (
        <PreviewSection title="PROJECTS" accent={accent}>
          {projects.filter(p => p.name).map((proj, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 12 }}>{proj.name} {proj.tech && <span style={{ fontWeight: 400, color: "#666" }}>· {proj.tech}</span>}</div>
              <div style={{ fontSize: 11, color: "#333" }}>{proj.description}</div>
            </div>
          ))}
        </PreviewSection>
      )}

      {/* Certifications */}
      {certifications.some(c => c.name) && (
        <PreviewSection title="CERTIFICATIONS" accent={accent}>
          {certifications.filter(c => c.name).map((cert, i) => (
            <div key={i} style={{ fontSize: 11, marginBottom: 3 }}>
              <strong>{cert.name}</strong>{cert.issuer ? ` — ${cert.issuer}` : ""}{cert.year ? ` (${cert.year})` : ""}
            </div>
          ))}
        </PreviewSection>
      )}
    </div>
  );
}

function ModernPreview({ data, accent }) {
  const { personal: p, experience, education, skills, projects, certifications } = data;
  return (
    <div style={{ fontFamily: "'Helvetica Neue', sans-serif", display: "flex", fontSize: 11, color: "#1a1a1a", minHeight: 400 }}>
      {/* Sidebar */}
      <div style={{ width: "32%", background: accent, color: "white", padding: "20px 14px", flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.2, marginBottom: 4, wordBreak: "break-word" }}>{p.name || "YOUR NAME"}</div>
        {p.title && <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: 14 }}>{p.title}</div>}

        <SideSection title="CONTACT">
          {p.email && <div style={{ fontSize: 10, opacity: 0.9, marginBottom: 3, wordBreak: "break-all" }}>{p.email}</div>}
          {p.phone && <div style={{ fontSize: 10, opacity: 0.9, marginBottom: 3 }}>{p.phone}</div>}
          {p.location && <div style={{ fontSize: 10, opacity: 0.9, marginBottom: 3 }}>{p.location}</div>}
          {p.linkedin && <div style={{ fontSize: 10, opacity: 0.9, marginBottom: 3, wordBreak: "break-all" }}>{p.linkedin}</div>}
        </SideSection>

        {skills.some(s => s.items) && (
          <SideSection title="SKILLS">
            {skills.filter(s => s.items).map((s, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 9, fontWeight: 700, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{s.category}</div>
                <div style={{ fontSize: 10, opacity: 0.9, lineHeight: 1.5 }}>{s.items}</div>
              </div>
            ))}
          </SideSection>
        )}

        {education.some(e => e.degree) && (
          <SideSection title="EDUCATION">
            {education.filter(e => e.degree || e.institution).map((edu, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700 }}>{edu.degree}</div>
                <div style={{ fontSize: 9, opacity: 0.8 }}>{edu.institution}</div>
                {edu.year && <div style={{ fontSize: 9, opacity: 0.7 }}>{edu.year}</div>}
              </div>
            ))}
          </SideSection>
        )}

        {certifications.some(c => c.name) && (
          <SideSection title="CERTIFICATIONS">
            {certifications.filter(c => c.name).map((cert, i) => (
              <div key={i} style={{ fontSize: 10, opacity: 0.9, marginBottom: 4 }}>{cert.name}</div>
            ))}
          </SideSection>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "20px 16px" }}>
        {p.summary && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>ABOUT</div>
            <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: "#333" }}>{p.summary}</p>
          </div>
        )}

        {experience.some(e => e.role || e.company) && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, borderBottom: `1.5px solid ${accent}`, paddingBottom: 3 }}>EXPERIENCE</div>
            {experience.filter(e => e.role || e.company).map((exp, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700, fontSize: 12 }}>{exp.role}</span>
                  <span style={{ fontSize: 10, color: "#777" }}>{exp.duration}</span>
                </div>
                <div style={{ fontSize: 10, color: accent, fontWeight: 600, marginBottom: 3 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
                <ul style={{ paddingLeft: 14, margin: 0 }}>
                  {exp.bullets.filter(b => b.trim()).map((b, j) => (
                    <li key={j} style={{ fontSize: 11, color: "#333", marginBottom: 2 }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {projects.some(p => p.name) && (
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, color: accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, borderBottom: `1.5px solid ${accent}`, paddingBottom: 3 }}>PROJECTS</div>
            {projects.filter(p => p.name).map((proj, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 12 }}>{proj.name} {proj.tech && <span style={{ fontWeight: 400, fontSize: 10, color: "#666" }}>· {proj.tech}</span>}</div>
                <div style={{ fontSize: 11, color: "#444" }}>{proj.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MinimalPreview({ data, accent }) {
  const { personal: p, experience, education, skills, projects, certifications } = data;
  return (
    <div style={{ fontFamily: "'Georgia', serif", color: "#222", fontSize: 11, lineHeight: 1.6, padding: "0 8px" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.02em", color: "#111" }}>{p.name || "Your Name"}</div>
        {p.title && <div style={{ fontSize: 12, color: accent, fontWeight: 600, marginBottom: 4 }}>{p.title}</div>}
        <div style={{ fontSize: 10, color: "#888", display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).join("  ·  ")}
        </div>
      </div>

      {p.summary && <div style={{ fontSize: 12, color: "#444", lineHeight: 1.7, marginBottom: 16, borderLeft: `2px solid ${accent}`, paddingLeft: 12 }}>{p.summary}</div>}

      {experience.some(e => e.role || e.company) && (
        <MinSection title="Experience" accent={accent}>
          {experience.filter(e => e.role || e.company).map((exp, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>{exp.role}</span>
                <span style={{ fontSize: 10, color: "#888" }}>{exp.duration}</span>
              </div>
              <div style={{ fontSize: 11, color: accent }}>{exp.company}{exp.location ? `, ${exp.location}` : ""}</div>
              <ul style={{ paddingLeft: 16, margin: "4px 0 0" }}>
                {exp.bullets.filter(b => b.trim()).map((b, j) => (
                  <li key={j} style={{ fontSize: 11, color: "#444" }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </MinSection>
      )}

      {education.some(e => e.degree) && (
        <MinSection title="Education" accent={accent}>
          {education.filter(e => e.degree || e.institution).map((edu, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{edu.degree}</div>
                <div style={{ fontSize: 11, color: "#666" }}>{edu.institution}</div>
              </div>
              <div style={{ fontSize: 10, color: "#888" }}>{edu.year}</div>
            </div>
          ))}
        </MinSection>
      )}

      {skills.some(s => s.items) && (
        <MinSection title="Skills" accent={accent}>
          {skills.filter(s => s.items).map((s, i) => (
            <div key={i} style={{ fontSize: 11, marginBottom: 2 }}><strong style={{ color: accent }}>{s.category}:</strong> {s.items}</div>
          ))}
        </MinSection>
      )}

      {projects.some(p => p.name) && (
        <MinSection title="Projects" accent={accent}>
          {projects.filter(p => p.name).map((proj, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <strong>{proj.name}</strong>{proj.tech && <span style={{ color: "#888", fontSize: 10 }}> · {proj.tech}</span>}
              <div style={{ fontSize: 11, color: "#444" }}>{proj.description}</div>
            </div>
          ))}
        </MinSection>
      )}
    </div>
  );
}

function ExecutivePreview({ data, accent }) {
  const { personal: p, experience, education, skills, projects, certifications } = data;
  return (
    <div style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', serif", color: "#1a1a1a", fontSize: 11 }}>
      <div style={{ background: accent, color: "white", padding: "18px 20px", marginBottom: 0 }}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{p.name || "YOUR NAME"}</div>
        {p.title && <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2, letterSpacing: "0.04em" }}>{p.title}</div>}
        <div style={{ fontSize: 9, opacity: 0.75, marginTop: 8, display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
        </div>
      </div>

      <div style={{ padding: "14px 20px" }}>
        {p.summary && (
          <div style={{ marginBottom: 12, padding: "10px 14px", background: "#f8f8f8", borderLeft: `3px solid ${accent}` }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>EXECUTIVE PROFILE</div>
            <p style={{ margin: 0, fontSize: 11, lineHeight: 1.7 }}>{p.summary}</p>
          </div>
        )}

        {experience.some(e => e.role || e.company) && (
          <ExecSection title="PROFESSIONAL EXPERIENCE" accent={accent}>
            {experience.filter(e => e.role || e.company).map((exp, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${accent}22`, paddingBottom: 3, marginBottom: 3 }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 12 }}>{exp.role}</span>
                    <span style={{ color: accent, fontWeight: 600, fontSize: 11 }}>{exp.company ? ` · ${exp.company}` : ""}</span>
                  </div>
                  <span style={{ fontSize: 10, color: "#666" }}>{exp.duration}</span>
                </div>
                <ul style={{ paddingLeft: 16, margin: "4px 0 0" }}>
                  {exp.bullets.filter(b => b.trim()).map((b, j) => (
                    <li key={j} style={{ fontSize: 11, color: "#333", marginBottom: 2, lineHeight: 1.5 }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </ExecSection>
        )}

        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            {education.some(e => e.degree) && (
              <ExecSection title="EDUCATION" accent={accent}>
                {education.filter(e => e.degree || e.institution).map((edu, i) => (
                  <div key={i} style={{ marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: 11 }}>{edu.degree}</div>
                    <div style={{ fontSize: 10, color: "#555" }}>{edu.institution} {edu.year ? `· ${edu.year}` : ""}</div>
                  </div>
                ))}
              </ExecSection>
            )}
          </div>
          <div style={{ flex: 1 }}>
            {skills.some(s => s.items) && (
              <ExecSection title="CORE COMPETENCIES" accent={accent}>
                {skills.filter(s => s.items).map((s, i) => (
                  <div key={i} style={{ fontSize: 10, marginBottom: 3 }}><strong>{s.category}:</strong> {s.items}</div>
                ))}
              </ExecSection>
            )}
          </div>
        </div>

        {certifications.some(c => c.name) && (
          <ExecSection title="CERTIFICATIONS & AWARDS" accent={accent}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {certifications.filter(c => c.name).map((cert, i) => (
                <span key={i} style={{ padding: "2px 8px", background: `${accent}15`, borderRadius: 3, fontSize: 10, border: `1px solid ${accent}33` }}>{cert.name}</span>
              ))}
            </div>
          </ExecSection>
        )}
      </div>
    </div>
  );
}

// ── SMALL PREVIEW HELPERS ──────────────────────────────────────────────────

function PreviewSection({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: `1px solid ${accent}`, paddingBottom: 2, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

function SideSection({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, marginBottom: 6, borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: 4 }}>{title}</div>
      {children}
    </div>
  );
}

function MinSection({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  );
}

function ExecSection({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 8, fontWeight: 800, color: accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6, borderBottom: `1.5px solid ${accent}`, paddingBottom: 2 }}>{title}</div>
      {children}
    </div>
  );
}

// ── FORM SECTIONS ──────────────────────────────────────────────────────────

function FormSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={fs.wrapper}>
      <button style={fs.header} onClick={() => setOpen(!open)}>
        <span style={fs.title}>{title}</span>
        {open ? <ChevronUp size={16} color="var(--ink-faint)" /> : <ChevronDown size={16} color="var(--ink-faint)" />}
      </button>
      {open && <div style={fs.body}>{children}</div>}
    </div>
  );
}

const fs = {
  wrapper: { background: "var(--paper-card)", border: "1px solid var(--border)", borderRadius: 10, marginBottom: 12, overflow: "hidden" },
  header: { width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" },
  title: { fontSize: 14, fontWeight: 700, color: "var(--ink)" },
  body: { padding: "0 18px 18px" },
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-muted)", marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

const INPUT = { width: "100%", padding: "9px 12px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-body)", fontSize: 13, outline: "none", boxSizing: "border-box" };
const TEXTAREA = { ...INPUT, resize: "vertical", lineHeight: 1.6 };
const ROW2 = { display: "flex", gap: 12 };

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────

export default function ResumeMaker({ analysis }) {
  const [template, setTemplate] = useState("classic");
  const [resume, setResume] = useState(() => {
    // Pre-fill from analysis if available
    if (!analysis) return EMPTY_RESUME;
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
      experience: analysis.experience?.length
        ? analysis.experience.map((e, i) => ({
            id: i + 1,
            role: e.role || "",
            company: e.company || "",
            duration: e.duration || "",
            location: "",
            bullets: e.highlights?.length ? e.highlights : [""],
          }))
        : EMPTY_RESUME.experience,
      education: analysis.education?.length
        ? analysis.education.map((e, i) => ({
            id: i + 1,
            degree: e.degree || "",
            institution: e.institution || "",
            year: e.year || "",
            gpa: "",
          }))
        : EMPTY_RESUME.education,
      skills: analysis.skills
        ? Object.entries(analysis.skills)
            .filter(([, v]) => v?.length)
            .map(([k, v], i) => ({ id: i + 1, category: k.charAt(0).toUpperCase() + k.slice(1), items: v.join(", ") }))
        : EMPTY_RESUME.skills,
      projects: [],
      certifications: [],
    };
  });

  const [mode, setMode] = useState("split"); // "split" | "edit" | "preview"
  const previewRef = useRef(null);

  const tpl = TEMPLATES.find(t => t.id === template);

  // ── update helpers ────────────────────────────────────────────────────
  const setPersonal = (key, val) => setResume(r => ({ ...r, personal: { ...r.personal, [key]: val } }));

  const updateExp = (id, key, val) => setResume(r => ({
    ...r, experience: r.experience.map(e => e.id === id ? { ...e, [key]: val } : e)
  }));
  const updateExpBullet = (id, idx, val) => setResume(r => ({
    ...r, experience: r.experience.map(e => e.id === id
      ? { ...e, bullets: e.bullets.map((b, i) => i === idx ? val : b) }
      : e)
  }));
  const addExpBullet = (id) => setResume(r => ({
    ...r, experience: r.experience.map(e => e.id === id ? { ...e, bullets: [...e.bullets, ""] } : e)
  }));
  const removeExpBullet = (id, idx) => setResume(r => ({
    ...r, experience: r.experience.map(e => e.id === id
      ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) }
      : e)
  }));
  const addExp = () => setResume(r => ({
    ...r, experience: [...r.experience, { id: Date.now(), role: "", company: "", duration: "", location: "", bullets: [""] }]
  }));
  const removeExp = (id) => setResume(r => ({ ...r, experience: r.experience.filter(e => e.id !== id) }));

  const updateEdu = (id, key, val) => setResume(r => ({
    ...r, education: r.education.map(e => e.id === id ? { ...e, [key]: val } : e)
  }));
  const addEdu = () => setResume(r => ({
    ...r, education: [...r.education, { id: Date.now(), degree: "", institution: "", year: "", gpa: "" }]
  }));
  const removeEdu = (id) => setResume(r => ({ ...r, education: r.education.filter(e => e.id !== id) }));

  const updateSkill = (id, key, val) => setResume(r => ({
    ...r, skills: r.skills.map(s => s.id === id ? { ...s, [key]: val } : s)
  }));
  const addSkill = () => setResume(r => ({
    ...r, skills: [...r.skills, { id: Date.now(), category: "", items: "" }]
  }));
  const removeSkill = (id) => setResume(r => ({ ...r, skills: r.skills.filter(s => s.id !== id) }));

  const updateProject = (id, key, val) => setResume(r => ({
    ...r, projects: r.projects.map(p => p.id === id ? { ...p, [key]: val } : p)
  }));
  const addProject = () => setResume(r => ({
    ...r, projects: [...r.projects, { id: Date.now(), name: "", tech: "", description: "" }]
  }));
  const removeProject = (id) => setResume(r => ({ ...r, projects: r.projects.filter(p => p.id !== id) }));

  const updateCert = (id, key, val) => setResume(r => ({
    ...r, certifications: r.certifications.map(c => c.id === id ? { ...c, [key]: val } : c)
  }));
  const addCert = () => setResume(r => ({
    ...r, certifications: [...r.certifications, { id: Date.now(), name: "", issuer: "", year: "" }]
  }));
  const removeCert = (id) => setResume(r => ({ ...r, certifications: r.certifications.filter(c => c.id !== id) }));

  // ── export ────────────────────────────────────────────────────────────
  const exportTxt = () => {
    const { personal: p, experience, education, skills, projects, certifications } = resume;
    let txt = `${p.name}\n${p.title}\n`;
    if (p.email) txt += `${p.email} | `;
    if (p.phone) txt += `${p.phone} | `;
    if (p.location) txt += p.location;
    txt += `\n\n`;
    if (p.summary) txt += `SUMMARY\n${p.summary}\n\n`;
    if (experience.some(e => e.role)) {
      txt += `EXPERIENCE\n`;
      experience.filter(e => e.role).forEach(e => {
        txt += `${e.role} | ${e.company} | ${e.duration}\n`;
        e.bullets.filter(b => b.trim()).forEach(b => txt += `• ${b}\n`);
        txt += "\n";
      });
    }
    if (education.some(e => e.degree)) {
      txt += `EDUCATION\n`;
      education.filter(e => e.degree).forEach(e => txt += `${e.degree} | ${e.institution} | ${e.year}\n`);
      txt += "\n";
    }
    if (skills.some(s => s.items)) {
      txt += `SKILLS\n`;
      skills.filter(s => s.items).forEach(s => txt += `${s.category}: ${s.items}\n`);
    }
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.name || "resume"}_resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportHTML = () => {
    const content = previewRef.current?.innerHTML || "";
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${resume.personal.name} - Resume</title><style>body{margin:0;padding:20px;background:#fff;} *{box-sizing:border-box;}</style></head><body>${content}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.personal.name || "resume"}_resume.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printResume = () => {
    const content = previewRef.current?.innerHTML || "";
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Resume</title><style>@page{margin:15mm} body{margin:0;font-size:11pt;} *{box-sizing:border-box;}</style></head><body>${content}</body></html>`);
    win.document.close();
    win.print();
  };

  const PreviewComponent = {
    classic: ClassicPreview,
    modern: ModernPreview,
    minimal: MinimalPreview,
    executive: ExecutivePreview,
  }[template];

  const showEdit = mode === "split" || mode === "edit";
  const showPreview = mode === "split" || mode === "preview";

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.topHeader}>
        <div style={s.headerLeft}>
          <div style={s.iconWrap}><FileText size={20} color="var(--accent)" /></div>
          <div>
            <h2 style={s.title}>Resume Maker</h2>
            <p style={s.subtitle}>Build a professional resume with live preview</p>
          </div>
        </div>
        <div style={s.headerActions}>
          <div style={s.modeToggle}>
            {["edit", "split", "preview"].map(m => (
              <button key={m} style={{ ...s.modeBtn, ...(mode === m ? s.modeBtnActive : {}) }} onClick={() => setMode(m)}>
                {m === "edit" ? <Edit3 size={13} /> : m === "preview" ? <Eye size={13} /> : <span style={{ fontSize: 11 }}>⊞</span>}
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
          <button style={s.exportBtn} onClick={printResume}><Download size={13} /> Print / PDF</button>
          <button style={{ ...s.exportBtn, background: "var(--paper-warm)" }} onClick={exportHTML}><Download size={13} /> HTML</button>
          <button style={{ ...s.exportBtn, background: "var(--paper-warm)" }} onClick={exportTxt}><Download size={13} /> TXT</button>
        </div>
      </div>

      {/* Template picker */}
      <div style={s.templateRow}>
        <span style={s.templateLabel}>Template:</span>
        {TEMPLATES.map(t => (
          <button
            key={t.id}
            style={{ ...s.templateBtn, ...(template === t.id ? { ...s.templateBtnActive, borderColor: t.accent } : {}) }}
            onClick={() => setTemplate(t.id)}
          >
            <div style={{ ...s.templateSwatch, background: t.accent }} />
            <div>
              <div style={s.templateName}>{t.name}</div>
              <div style={s.templateDesc}>{t.desc}</div>
            </div>
            {template === t.id && <Check size={13} color={t.accent} style={{ marginLeft: "auto" }} />}
          </button>
        ))}
      </div>

      {/* Main area */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>

        {/* Editor */}
        {showEdit && (
          <div style={{ flex: mode === "split" ? "0 0 45%" : 1, maxWidth: mode === "split" ? "45%" : "100%" }}>

            <FormSection title="Personal Information">
              <div style={ROW2}>
                <Field label="Full Name"><input style={INPUT} placeholder="Jane Smith" value={resume.personal.name} onChange={e => setPersonal("name", e.target.value)} /></Field>
                <Field label="Professional Title"><input style={INPUT} placeholder="Software Engineer" value={resume.personal.title} onChange={e => setPersonal("title", e.target.value)} /></Field>
              </div>
              <div style={ROW2}>
                <Field label="Email"><input style={INPUT} placeholder="jane@email.com" value={resume.personal.email} onChange={e => setPersonal("email", e.target.value)} /></Field>
                <Field label="Phone"><input style={INPUT} placeholder="+1 555 000 0000" value={resume.personal.phone} onChange={e => setPersonal("phone", e.target.value)} /></Field>
              </div>
              <div style={ROW2}>
                <Field label="Location"><input style={INPUT} placeholder="New York, NY" value={resume.personal.location} onChange={e => setPersonal("location", e.target.value)} /></Field>
                <Field label="LinkedIn"><input style={INPUT} placeholder="linkedin.com/in/jane" value={resume.personal.linkedin} onChange={e => setPersonal("linkedin", e.target.value)} /></Field>
              </div>
              <Field label="Website / Portfolio"><input style={INPUT} placeholder="janesmith.dev" value={resume.personal.website} onChange={e => setPersonal("website", e.target.value)} /></Field>
              <Field label="Professional Summary"><textarea style={{ ...TEXTAREA, minHeight: 80 }} placeholder="A compelling 2-3 sentence overview of your career..." value={resume.personal.summary} onChange={e => setPersonal("summary", e.target.value)} /></Field>
            </FormSection>

            <FormSection title="Work Experience">
              {resume.experience.map((exp, idx) => (
                <div key={exp.id} style={s.entryCard}>
                  <div style={s.entryHeader}>
                    <span style={s.entryNum}>Experience {idx + 1}</span>
                    {resume.experience.length > 1 && (
                      <button style={s.removeBtn} onClick={() => removeExp(exp.id)}><Trash2 size={13} /></button>
                    )}
                  </div>
                  <div style={ROW2}>
                    <Field label="Job Title"><input style={INPUT} placeholder="Senior Engineer" value={exp.role} onChange={e => updateExp(exp.id, "role", e.target.value)} /></Field>
                    <Field label="Company"><input style={INPUT} placeholder="Acme Corp" value={exp.company} onChange={e => updateExp(exp.id, "company", e.target.value)} /></Field>
                  </div>
                  <div style={ROW2}>
                    <Field label="Duration"><input style={INPUT} placeholder="Jan 2022 – Present" value={exp.duration} onChange={e => updateExp(exp.id, "duration", e.target.value)} /></Field>
                    <Field label="Location"><input style={INPUT} placeholder="Remote / NYC" value={exp.location} onChange={e => updateExp(exp.id, "location", e.target.value)} /></Field>
                  </div>
                  <Field label="Bullet Points">
                    {exp.bullets.map((b, bi) => (
                      <div key={bi} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                        <textarea style={{ ...TEXTAREA, minHeight: 44, flex: 1 }} placeholder="• Achieved X by doing Y, resulting in Z..." value={b} onChange={e => updateExpBullet(exp.id, bi, e.target.value)} rows={2} />
                        {exp.bullets.length > 1 && (
                          <button style={s.removeBtn} onClick={() => removeExpBullet(exp.id, bi)}><Trash2 size={12} /></button>
                        )}
                      </div>
                    ))}
                    <button style={s.addSmallBtn} onClick={() => addExpBullet(exp.id)}><Plus size={13} /> Add Bullet</button>
                  </Field>
                </div>
              ))}
              <button style={s.addBtn} onClick={addExp}><Plus size={14} /> Add Experience</button>
            </FormSection>

            <FormSection title="Education">
              {resume.education.map((edu, idx) => (
                <div key={edu.id} style={s.entryCard}>
                  <div style={s.entryHeader}>
                    <span style={s.entryNum}>Education {idx + 1}</span>
                    {resume.education.length > 1 && (
                      <button style={s.removeBtn} onClick={() => removeEdu(edu.id)}><Trash2 size={13} /></button>
                    )}
                  </div>
                  <div style={ROW2}>
                    <Field label="Degree / Certificate"><input style={INPUT} placeholder="B.S. Computer Science" value={edu.degree} onChange={e => updateEdu(edu.id, "degree", e.target.value)} /></Field>
                    <Field label="Institution"><input style={INPUT} placeholder="MIT" value={edu.institution} onChange={e => updateEdu(edu.id, "institution", e.target.value)} /></Field>
                  </div>
                  <div style={ROW2}>
                    <Field label="Year"><input style={INPUT} placeholder="2020" value={edu.year} onChange={e => updateEdu(edu.id, "year", e.target.value)} /></Field>
                    <Field label="GPA (optional)"><input style={INPUT} placeholder="3.8/4.0" value={edu.gpa} onChange={e => updateEdu(edu.id, "gpa", e.target.value)} /></Field>
                  </div>
                </div>
              ))}
              <button style={s.addBtn} onClick={addEdu}><Plus size={14} /> Add Education</button>
            </FormSection>

            <FormSection title="Skills">
              {resume.skills.map((sk, idx) => (
                <div key={sk.id} style={s.entryCard}>
                  <div style={s.entryHeader}>
                    <span style={s.entryNum}>Skill Group {idx + 1}</span>
                    {resume.skills.length > 1 && (
                      <button style={s.removeBtn} onClick={() => removeSkill(sk.id)}><Trash2 size={13} /></button>
                    )}
                  </div>
                  <div style={ROW2}>
                    <Field label="Category"><input style={INPUT} placeholder="Technical" value={sk.category} onChange={e => updateSkill(sk.id, "category", e.target.value)} /></Field>
                    <Field label="Skills (comma separated)"><input style={INPUT} placeholder="React, Node.js, Python..." value={sk.items} onChange={e => updateSkill(sk.id, "items", e.target.value)} /></Field>
                  </div>
                </div>
              ))}
              <button style={s.addBtn} onClick={addSkill}><Plus size={14} /> Add Skill Group</button>
            </FormSection>

            <FormSection title="Projects" defaultOpen={false}>
              {resume.projects.map((proj, idx) => (
                <div key={proj.id} style={s.entryCard}>
                  <div style={s.entryHeader}>
                    <span style={s.entryNum}>Project {idx + 1}</span>
                    <button style={s.removeBtn} onClick={() => removeProject(proj.id)}><Trash2 size={13} /></button>
                  </div>
                  <div style={ROW2}>
                    <Field label="Project Name"><input style={INPUT} placeholder="Portfolio Website" value={proj.name} onChange={e => updateProject(proj.id, "name", e.target.value)} /></Field>
                    <Field label="Tech Stack"><input style={INPUT} placeholder="React, Firebase" value={proj.tech} onChange={e => updateProject(proj.id, "tech", e.target.value)} /></Field>
                  </div>
                  <Field label="Description"><textarea style={{ ...TEXTAREA, minHeight: 60 }} placeholder="What it does and your impact..." value={proj.description} onChange={e => updateProject(proj.id, "description", e.target.value)} /></Field>
                </div>
              ))}
              <button style={s.addBtn} onClick={addProject}><Plus size={14} /> Add Project</button>
            </FormSection>

            <FormSection title="Certifications" defaultOpen={false}>
              {resume.certifications.map((cert, idx) => (
                <div key={cert.id} style={s.entryCard}>
                  <div style={s.entryHeader}>
                    <span style={s.entryNum}>Certification {idx + 1}</span>
                    <button style={s.removeBtn} onClick={() => removeCert(cert.id)}><Trash2 size={13} /></button>
                  </div>
                  <div style={ROW2}>
                    <Field label="Certification Name"><input style={INPUT} placeholder="AWS Solutions Architect" value={cert.name} onChange={e => updateCert(cert.id, "name", e.target.value)} /></Field>
                    <Field label="Issuer"><input style={INPUT} placeholder="Amazon" value={cert.issuer} onChange={e => updateCert(cert.id, "issuer", e.target.value)} /></Field>
                  </div>
                  <Field label="Year"><input style={{ ...INPUT, maxWidth: 120 }} placeholder="2023" value={cert.year} onChange={e => updateCert(cert.id, "year", e.target.value)} /></Field>
                </div>
              ))}
              <button style={s.addBtn} onClick={addCert}><Plus size={14} /> Add Certification</button>
            </FormSection>

          </div>
        )}

        {/* Preview */}
        {showPreview && (
          <div style={{ flex: 1, position: "sticky", top: 20 }}>
            <div style={s.previewWrapper}>
              <div style={s.previewToolbar}>
                <span style={s.previewLabel}>LIVE PREVIEW · {tpl.name}</span>
                <button style={s.printBtn} onClick={printResume}><Download size={12} /> Print</button>
              </div>
              <div style={s.previewScroll}>
                <div ref={previewRef} style={s.previewPage}>
                  <PreviewComponent data={resume} accent={tpl.accent} />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const s = {
  page: { padding: "24px 0" },
  topHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 },
  headerLeft: { display: "flex", alignItems: "center", gap: 14 },
  iconWrap: { width: 44, height: 44, borderRadius: 10, background: "var(--accent-light, #fdf0ec)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title: { fontSize: 20, fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 2 },
  subtitle: { fontSize: 13, color: "var(--ink-muted)", margin: 0 },
  headerActions: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  modeToggle: { display: "flex", background: "var(--paper-warm)", borderRadius: 8, padding: 3, gap: 2 },
  modeBtn: { display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 6, border: "none", background: "none", color: "var(--ink-muted)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 500 },
  modeBtnActive: { background: "var(--paper-card)", color: "var(--ink)", boxShadow: "var(--shadow-sm)" },
  exportBtn: { display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--accent)", color: "white", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 600 },

  templateRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  templateLabel: { fontSize: 12, fontWeight: 600, color: "var(--ink-muted)", marginRight: 4 },
  templateBtn: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--paper-card)", cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.15s" },
  templateBtnActive: { background: "var(--paper-warm)", boxShadow: "var(--shadow-sm)" },
  templateSwatch: { width: 12, height: 12, borderRadius: 3, flexShrink: 0 },
  templateName: { fontSize: 13, fontWeight: 600, color: "var(--ink)" },
  templateDesc: { fontSize: 11, color: "var(--ink-faint)" },

  entryCard: { background: "var(--paper-warm)", borderRadius: 8, padding: "14px 14px 6px", marginBottom: 10 },
  entryHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  entryNum: { fontSize: 11, fontWeight: 700, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.06em" },
  removeBtn: { background: "none", border: "none", cursor: "pointer", color: "var(--accent)", display: "flex", alignItems: "center", padding: 4, borderRadius: 5 },
  addBtn: { display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 7, border: "1px dashed var(--border)", background: "none", color: "var(--ink-muted)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)", width: "100%", justifyContent: "center", marginTop: 4 },
  addSmallBtn: { display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6, border: "1px dashed var(--border)", background: "none", color: "var(--ink-muted)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)" },

  previewWrapper: { background: "var(--paper-warm)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-sm)" },
  previewToolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: "var(--paper-card)", borderBottom: "1px solid var(--border)" },
  previewLabel: { fontSize: 11, fontWeight: 700, color: "var(--ink-faint)", letterSpacing: "0.06em" },
  printBtn: { display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink-muted)", fontSize: 11, cursor: "pointer", fontFamily: "var(--font-body)" },
  previewScroll: { maxHeight: "calc(100vh - 220px)", overflowY: "auto", padding: 16 },
  previewPage: { background: "white", minHeight: 500, padding: "24px 28px", boxShadow: "0 2px 16px rgba(0,0,0,0.12)", borderRadius: 4 },
};