import { useState } from "react";
import { Linkedin, Sparkles, Copy, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { callAI } from "./aiHelper";

const SECTIONS = [
  { id: "headline", label: "Headline", icon: "✦", description: "120-char hook under your name" },
  { id: "about", label: "About / Summary", icon: "◈", description: "First-person story, 3–5 paragraphs" },
  { id: "experience", label: "Experience Bullets", icon: "◉", description: "Achievement-focused bullet rewrites" },
  { id: "skills", label: "Skills to Add", icon: "◆", description: "Suggested keywords to include" },
];

function CopyableBlock({ content, label }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={cb.wrapper}>
      <div style={cb.header}>
        <span style={cb.label}>{label}</span>
        <button style={cb.copyBtn} onClick={copy}>
          {copied ? <><CheckCircle size={13} color="var(--green)" /> Copied!</> : <><Copy size={13} /> Copy</>}
        </button>
      </div>
      <p style={cb.content}>{content}</p>
    </div>
  );
}

function ScoreIndicator({ label, score }) {
  const color = score >= 80 ? "var(--green)" : score >= 60 ? "var(--gold)" : "var(--accent)";
  return (
    <div style={si.row}>
      <span style={si.label}>{label}</span>
      <div style={si.right}>
        <div style={si.barBg}><div style={{ ...si.barFill, width: `${score}%`, background: color }} /></div>
        <span style={{ ...si.score, color }}>{score}</span>
      </div>
    </div>
  );
}

export default function LinkedInOptimizer({ analysis }) {
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [selectedSections, setSelectedSections] = useState(["headline", "about"]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("headline");

  const a = analysis || {};
  const skills = a.skills ? Object.values(a.skills).flat().slice(0, 20).join(", ") : "";
  const strengths = a.strengths?.slice(0, 4).join("; ") || "";
  const experience = a.experience?.map((e) => `${e.role} at ${e.company}: ${e.highlights?.slice(0, 2).join(". ")}`).slice(0, 3).join("\n") || "";
  const candidateName = a.candidate?.name || "the candidate";
  const currentTitle = a.experience?.[0]?.role || "";

  const toggleSection = (id) => setSelectedSections((prev) =>
    prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
  );

  const generate = async () => {
    if (!targetRole.trim()) { setError("Please enter your target role."); return; }
    if (selectedSections.length === 0) { setError("Select at least one section to optimize."); return; }
    setError(""); setLoading(true); setResult(null);

    const needsHeadline = selectedSections.includes("headline");
    const needsAbout = selectedSections.includes("about");
    const needsExperience = selectedSections.includes("experience");
    const needsSkills = selectedSections.includes("skills");

    const sectionFields = [
      needsHeadline && `"headline": "A compelling 120-character LinkedIn headline for the target role"`,
      needsAbout && `"about": "First-person LinkedIn About section, 3-4 paragraphs, ends with a call to action. Use \\n for paragraph breaks."`,
      needsExperience && `"experienceBullets": ["achievement-focused bullet 1", "bullet 2", "bullet 3"]`,
      needsSkills && `"suggestedSkills": ["skill1", "skill2", "skill3"]`,
      `"profileScore": { "keyword_optimization": 75, "completeness": 80, "storytelling": 70, "visibility": 65 }`,
      `"quickWins": ["actionable tip 1", "tip 2", "tip 3"]`,
    ].filter(Boolean).join(",\n  ");

    const prompt = `You are a LinkedIn profile expert and personal branding strategist.

Optimize ${candidateName}'s LinkedIn profile for the role of "${targetRole}"${industry ? ` in the ${industry} industry` : ""}.

Resume data:
- Current/recent title: ${currentTitle}
- Skills: ${skills}
- Strengths: ${strengths}
- Experience highlights:
${experience}

Return ONLY valid JSON. No markdown, no explanation. Start with { and end with }.
All string values must be properly escaped. Use \\n for newlines inside strings.

{
  ${sectionFields}
}`;

    try {
      const text = await callAI(prompt, 1200);

      // Strip any markdown fences
      let clean = text.replace(/```json|```/g, "").trim();

      // Extract the JSON object
      const jsonStart = clean.indexOf('{');
      const jsonEnd = clean.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) throw new Error("No JSON object found in response");
      let jsonStr = clean.slice(jsonStart, jsonEnd + 1);

      let parsed;
      try {
        parsed = JSON.parse(jsonStr);
      } catch (parseErr) {
        // Fallback: fix unescaped newlines/tabs inside JSON string values
        jsonStr = jsonStr.replace(/("(?:[^"\\]|\\.)*")/g, (match) => {
          return match
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "")
            .replace(/\t/g, "\\t");
        });
        parsed = JSON.parse(jsonStr);
      }

      setResult(parsed);
      setActiveTab(selectedSections[0]);
    } catch (e) {
      setError("Generation failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const availableTabs = SECTIONS.filter((s) =>
    selectedSections.includes(s.id) && result &&
    result[s.id === "experience" ? "experienceBullets" : s.id === "skills" ? "suggestedSkills" : s.id]
  );

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.iconWrap}><Linkedin size={22} color="#0077b5" /></div>
          <div>
            <h2 style={styles.title}>LinkedIn Profile Optimizer</h2>
            <p style={styles.subtitle}>AI-powered profile copy that gets you noticed by recruiters</p>
          </div>
        </div>

        <div style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Target Role *</label>
              <input style={styles.input} placeholder="e.g. Data Scientist" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Industry <span style={styles.optional}>(optional)</span></label>
              <input style={styles.input} placeholder="e.g. FinTech, Healthcare AI" value={industry} onChange={(e) => setIndustry(e.target.value)} />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Sections to Optimize</label>
            <div style={styles.sectionGrid}>
              {SECTIONS.map((sec) => {
                const active = selectedSections.includes(sec.id);
                return (
                  <button key={sec.id} style={{ ...styles.sectionCard, ...(active ? styles.sectionCardActive : {}) }} onClick={() => toggleSection(sec.id)}>
                    <span style={styles.sectionIcon}>{sec.icon}</span>
                    <div>
                      <div style={styles.sectionLabel}>{sec.label}</div>
                      <div style={styles.sectionDesc}>{sec.description}</div>
                    </div>
                    {active && <CheckCircle size={16} color="var(--green)" style={{ marginLeft: "auto", flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.generateBtn} onClick={generate} disabled={loading}>
            {loading
              ? <><span style={styles.spinner} /> Analyzing & optimizing...</>
              : result
              ? <><RefreshCw size={16} /> Regenerate</>
              : <><Sparkles size={16} /> Optimize My LinkedIn</>}
          </button>
        </div>

        {loading && (
          <div style={styles.skeleton}>
            {[85, 60, 75].map((w, i) => (
              <div key={i} style={{ ...styles.skeletonLine, width: `${w}%`, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}

        {result && !loading && (
          <>
            {result.profileScore && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Estimated Profile Strength</h3>
                {Object.entries(result.profileScore).map(([key, val]) => (
                  <ScoreIndicator key={key} label={key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} score={val} />
                ))}
              </div>
            )}

            {result.quickWins?.length > 0 && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>⚡ Quick Wins</h3>
                <div style={styles.quickWins}>
                  {result.quickWins.map((tip, i) => (
                    <div key={i} style={styles.quickWinItem}>
                      <AlertCircle size={14} color="var(--gold)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.5 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {availableTabs.length > 0 && (
              <div style={styles.card}>
                <div style={styles.tabs}>
                  {availableTabs.map((sec) => (
                    <button key={sec.id} style={{ ...styles.tab, ...(activeTab === sec.id ? styles.tabActive : {}) }} onClick={() => setActiveTab(sec.id)}>
                      {sec.icon} {sec.label}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 20 }}>
                  {activeTab === "headline" && result.headline && (
                    <CopyableBlock content={result.headline} label="LinkedIn Headline" />
                  )}
                  {activeTab === "about" && result.about && (
                    <CopyableBlock content={result.about} label="About / Summary Section" />
                  )}
                  {activeTab === "experience" && result.experienceBullets && (
                    <div>
                      <div style={styles.innerLabel}>REWRITTEN EXPERIENCE BULLETS</div>
                      {result.experienceBullets.map((bullet, i) => (
                        <div key={i} style={styles.bulletItem}>
                          <span style={styles.bullet}>▸</span>
                          <span style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink)" }}>{bullet}</span>
                        </div>
                      ))}
                      <button style={styles.copyAllBtn} onClick={() => navigator.clipboard.writeText(result.experienceBullets.map((b) => `• ${b}`).join("\n"))}>
                        <Copy size={13} /> Copy All Bullets
                      </button>
                    </div>
                  )}
                  {activeTab === "skills" && result.suggestedSkills && (
                    <div>
                      <div style={styles.innerLabel}>SUGGESTED SKILLS TO ADD</div>
                      <div style={styles.skillTagGrid}>
                        {result.suggestedSkills.map((skill, i) => (
                          <span key={i} style={styles.skillTag}>{skill}</span>
                        ))}
                      </div>
                      <p style={styles.skillHint}>Add these to your LinkedIn Skills section.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <style>{`@keyframes shimmer{0%,100%{opacity:.4}50%{opacity:.8}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

const cb = {
  wrapper: { background: "var(--paper-warm)", borderRadius: 10, overflow: "hidden" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid var(--border)" },
  label: { fontSize: 11, fontWeight: 700, color: "var(--ink-faint)", letterSpacing: "0.06em", textTransform: "uppercase" },
  copyBtn: { display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink-muted)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
  content: { padding: "14px 16px", fontSize: 14, lineHeight: 1.75, color: "var(--ink)", margin: 0, whiteSpace: "pre-wrap" },
};

const si = {
  row: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 14 },
  label: { fontSize: 14, color: "var(--ink)" },
  right: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
  barBg: { width: 120, height: 6, borderRadius: 3, background: "var(--paper-warm)", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 3, transition: "width 1s ease" },
  score: { fontSize: 13, fontWeight: 700, width: 28, textAlign: "right" },
};

const styles = {
  page: { padding: "32px 0" },
  container: { maxWidth: 760, margin: "0 auto" },
  header: { display: "flex", alignItems: "center", gap: 16, marginBottom: 28 },
  iconWrap: { width: 48, height: 48, borderRadius: 12, background: "#e8f4fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title: { fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "var(--ink-muted)", margin: 0 },
  form: { background: "var(--paper-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 28px", marginBottom: 20, boxShadow: "var(--shadow-sm)" },
  row: { display: "flex", gap: 16 },
  field: { flex: 1, marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-muted)", marginBottom: 8 },
  optional: { fontWeight: 400, color: "var(--ink-faint)" },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none", boxSizing: "border-box" },
  sectionGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  sectionCard: { display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 10, background: "var(--paper)", cursor: "pointer", textAlign: "left", fontFamily: "inherit" },
  sectionCardActive: { borderColor: "var(--green)", background: "var(--green-light, #d8f0e2)" },
  sectionIcon: { fontSize: 18, flexShrink: 0, marginTop: 2 },
  sectionLabel: { fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 2 },
  sectionDesc: { fontSize: 12, color: "var(--ink-faint)" },
  error: { color: "var(--accent)", fontSize: 13, marginBottom: 12 },
  generateBtn: { display: "flex", alignItems: "center", gap: 8, justifyContent: "center", width: "100%", padding: "13px 0", borderRadius: 10, background: "#0077b5", color: "white", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", boxShadow: "0 4px 14px rgba(0,119,181,0.25)" },
  spinner: { width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", display: "inline-block", animation: "spin 0.8s linear infinite" },
  skeleton: { padding: "24px 0", display: "flex", flexDirection: "column", gap: 12 },
  skeletonLine: { height: 14, borderRadius: 6, background: "var(--paper-warm)", animation: "shimmer 1.4s ease infinite" },
  card: { background: "var(--paper-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "22px 24px", marginBottom: 16, boxShadow: "var(--shadow-sm)" },
  cardTitle: { fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 16 },
  quickWins: { display: "flex", flexDirection: "column", gap: 10 },
  quickWinItem: { display: "flex", gap: 10, alignItems: "flex-start" },
  tabs: { display: "flex", gap: 8, flexWrap: "wrap" },
  tab: { padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink-muted)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" },
  tabActive: { background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" },
  innerLabel: { fontSize: 11, fontWeight: 700, color: "var(--ink-faint)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 },
  bulletItem: { display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--border)" },
  bullet: { color: "var(--accent)", fontWeight: 700, flexShrink: 0, marginTop: 2 },
  copyAllBtn: { display: "flex", alignItems: "center", gap: 6, marginTop: 4, padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink-muted)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" },
  skillTagGrid: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  skillTag: { padding: "5px 12px", borderRadius: 100, fontSize: 13, fontWeight: 500, background: "var(--paper-warm)", color: "var(--ink-muted)" },
  skillHint: { fontSize: 13, color: "var(--ink-faint)", fontStyle: "italic" },
};