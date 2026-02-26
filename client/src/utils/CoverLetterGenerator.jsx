import { useState } from "react";
import { FileText, Sparkles, Copy, Download, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { callAI } from "./aiHelper";

const TONES = ["Professional", "Enthusiastic", "Concise", "Creative", "Formal"];
const LENGTHS = ["Short (150–200 words)", "Medium (250–350 words)", "Long (400–500 words)"];

export default function CoverLetterGenerator({ analysis }) {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium (250–350 words)");
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState("");
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState("");

  const candidateName = analysis?.candidate?.name || "the candidate";
  const skills = analysis?.skills ? Object.values(analysis.skills).flat().slice(0, 12).join(", ") : "";
  const strengths = analysis?.strengths?.slice(0, 3).join("; ") || "";
  const experience = analysis?.experience?.map((e) => `${e.role} at ${e.company}`).slice(0, 3).join(", ") || "";

  const generate = async () => {
    if (!jobTitle.trim() || !company.trim()) {
      setError("Please fill in Job Title and Company Name.");
      return;
    }
    setError("");
    setLoading(true);
    setLetter("");

    const wordTarget =
      length === "Short (150–200 words)" ? "150-200 words"
      : length === "Long (400–500 words)" ? "400-500 words"
      : "250-350 words";

    const prompt = `You are a professional career coach and expert cover letter writer.

Write a ${tone.toLowerCase()} cover letter for ${candidateName} applying for the role of "${jobTitle}" at "${company}".

Candidate profile:
- Key skills: ${skills}
- Notable strengths: ${strengths}
- Recent experience: ${experience}
${jobDescription ? `\nJob description context:\n${jobDescription}` : ""}

Requirements:
- Length: approximately ${wordTarget}
- Tone: ${tone}
- Open with a compelling hook (not "I am writing to apply...")
- Weave in 2-3 specific skills from their profile
- End with a confident call to action
- Do NOT include address blocks, date headers, or signature lines — just the body paragraphs
- Output only the cover letter text, nothing else`;

    try {
      const text = await callAI(prompt, 800);
      setLetter(text.trim());
    } catch (e) {
      setError("Generation failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cover_Letter_${company.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.iconWrap}><FileText size={22} color="var(--accent)" /></div>
          <div>
            <h2 style={styles.title}>Cover Letter Generator</h2>
            <p style={styles.subtitle}>AI-crafted letters tailored to your resume & the role</p>
          </div>
        </div>

        <div style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Job Title *</label>
              <input style={styles.input} placeholder="e.g. Senior Software Engineer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Company Name *</label>
              <input style={styles.input} placeholder="e.g. Samsung" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Job Description <span style={styles.optional}>(optional but recommended)</span></label>
            <textarea style={{ ...styles.input, ...styles.textarea }} placeholder="Paste the job description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
          </div>

          <button style={styles.settingsToggle} onClick={() => setShowSettings(!showSettings)}>
            <span>Style Options</span>
            {showSettings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showSettings && (
            <div style={styles.settingsPanel}>
              <div style={styles.field}>
                <label style={styles.label}>Tone</label>
                <div style={styles.chipRow}>
                  {TONES.map((t) => (
                    <button key={t} style={{ ...styles.chip, ...(tone === t ? styles.chipActive : {}) }} onClick={() => setTone(t)}>{t}</button>
                  ))}
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Length</label>
                <div style={styles.chipRow}>
                  {LENGTHS.map((l) => (
                    <button key={l} style={{ ...styles.chip, ...(length === l ? styles.chipActive : {}) }} onClick={() => setLength(l)}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.generateBtn} onClick={generate} disabled={loading}>
            {loading ? <><span style={styles.spinner} /> Crafting your letter...</> : <><Sparkles size={16} /> Generate Cover Letter</>}
          </button>
        </div>

        {(letter || loading) && (
          <div style={styles.output}>
            <div style={styles.outputHeader}>
              <span style={styles.outputLabel}>Your Cover Letter</span>
              {letter && (
                <div style={styles.actions}>
                  <button style={styles.actionBtn} onClick={generate}><RefreshCw size={14} /> Regenerate</button>
                  <button style={styles.actionBtn} onClick={copyToClipboard}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                  <button style={{ ...styles.actionBtn, ...styles.actionBtnPrimary }} onClick={downloadTxt}><Download size={14} /> Download</button>
                </div>
              )}
            </div>
            {loading ? (
              <div style={styles.loadingLines}>
                {[80, 95, 70, 90, 55, 85, 60].map((w, i) => (
                  <div key={i} style={{ ...styles.skeletonLine, width: `${w}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            ) : (
              <div style={styles.letterText}>{letter}</div>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes shimmer{0%,100%{opacity:.4}50%{opacity:.8}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

const styles = {
  page: { padding: "32px 0" },
  container: { maxWidth: 720, margin: "0 auto" },
  header: { display: "flex", alignItems: "center", gap: 16, marginBottom: 28 },
  iconWrap: { width: 48, height: 48, borderRadius: 12, background: "var(--accent-light, #fdf0ec)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title: { fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "var(--ink-muted)", margin: 0 },
  form: { background: "var(--paper-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 28px", marginBottom: 20, boxShadow: "var(--shadow-sm)" },
  row: { display: "flex", gap: 16, marginBottom: 16 },
  field: { flex: 1, marginBottom: 16 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-muted)", marginBottom: 6 },
  optional: { fontWeight: 400, color: "var(--ink-faint)" },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none", boxSizing: "border-box" },
  textarea: { minHeight: 110, resize: "vertical", lineHeight: 1.6 },
  settingsToggle: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 14px", color: "var(--ink-muted)", fontSize: 13, cursor: "pointer", marginBottom: 16, fontFamily: "var(--font-body)" },
  settingsPanel: { background: "var(--paper-warm)", borderRadius: 10, padding: "16px 20px", marginBottom: 16 },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { padding: "6px 14px", borderRadius: 100, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink-muted)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" },
  chipActive: { background: "var(--accent)", color: "white", borderColor: "var(--accent)" },
  error: { color: "var(--accent)", fontSize: 13, marginBottom: 12 },
  generateBtn: { display: "flex", alignItems: "center", gap: 8, justifyContent: "center", width: "100%", padding: "13px 0", borderRadius: 10, background: "var(--accent)", color: "white", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", boxShadow: "0 4px 14px rgba(200,75,47,0.25)" },
  spinner: { width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", display: "inline-block", animation: "spin 0.8s linear infinite" },
  output: { background: "var(--paper-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-sm)" },
  outputHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--border)", background: "var(--paper-warm)" },
  outputLabel: { fontSize: 13, fontWeight: 700, color: "var(--ink-faint)", letterSpacing: "0.06em", textTransform: "uppercase" },
  actions: { display: "flex", gap: 8 },
  actionBtn: { display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink-muted)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)" },
  actionBtnPrimary: { background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" },
  loadingLines: { padding: "24px" },
  skeletonLine: { height: 14, borderRadius: 6, background: "var(--paper-warm)", marginBottom: 12, animation: "shimmer 1.4s ease infinite" },
  letterText: { padding: "24px 28px", fontSize: 15, lineHeight: 1.8, color: "var(--ink)", whiteSpace: "pre-wrap", fontFamily: "var(--font-body)" },
};