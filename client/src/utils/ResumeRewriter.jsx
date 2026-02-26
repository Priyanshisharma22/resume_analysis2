import { useState } from "react";
import { PenLine, Sparkles, Copy, RefreshCw, CheckCircle } from "lucide-react";
import { callAI } from "./aiHelper";

const ACTIONS = ["Quantified impact", "Leadership", "Technical depth", "Concise", "STAR format"];

export default function ResumeRewriter({ analysis }) {
  const [bullet, setBullet] = useState("");
  const [role, setRole] = useState("");
  const [focus, setFocus] = useState("STAR format");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const experience = analysis?.experience?.[0]?.role || "";

  const rewrite = async () => {
    if (!bullet.trim()) { setError("Please paste a bullet point to rewrite."); return; }
    setError(""); setLoading(true); setResult(null);

    const prompt = `You are an expert resume coach. Rewrite the following weak resume bullet point into a strong, impactful version.

Weak bullet: "${bullet}"
${role ? `Target role: ${role}` : experience ? `Candidate's role: ${experience}` : ""}
Focus: ${focus}

Rules:
- Start with a strong action verb
- Include measurable impact where possible (infer realistic numbers if none given)
- Apply ${focus} technique
- Keep it to 1-2 lines max
- Return ONLY a JSON object, starting with { and ending with }, no markdown:
{
  "rewritten": "the improved bullet point",
  "explanation": "2-sentence explanation of what changed and why",
  "actionVerb": "the strong verb used",
  "improvements": ["improvement 1", "improvement 2", "improvement 3"]
}`;

    try {
      const text = await callAI(prompt, 600);
      const clean = text.replace(/```json|```/g, "").trim();
      const jsonStart = clean.indexOf('{');
      const jsonEnd = clean.lastIndexOf('}');
      const parsed = JSON.parse(clean.slice(jsonStart, jsonEnd + 1));
      setResult(parsed);
    } catch (e) {
      setError("Rewrite failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result.rewritten);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={st.page}>
      <div style={st.header}>
        <div style={st.iconWrap}><PenLine size={22} color="var(--accent)" /></div>
        <div>
          <h2 style={st.title}>Resume Bullet Rewriter</h2>
          <p style={st.subtitle}>Transform weak bullets into powerful, STAR-format achievements</p>
        </div>
      </div>

      <div style={st.form}>
        <div style={st.field}>
          <label style={st.label}>Weak Bullet Point *</label>
          <textarea
            style={{ ...st.input, ...st.textarea }}
            placeholder='e.g. "Helped with customer service and answered phone calls"'
            value={bullet}
            onChange={e => setBullet(e.target.value)}
            rows={3}
          />
        </div>

        <div style={st.field}>
          <label style={st.label}>Target Role <span style={st.opt}>(optional)</span></label>
          <input style={st.input} placeholder="e.g. Product Manager" value={role} onChange={e => setRole(e.target.value)} />
        </div>

        <div style={st.field}>
          <label style={st.label}>Rewrite Focus</label>
          <div style={st.chipRow}>
            {ACTIONS.map(a => (
              <button key={a} style={{ ...st.chip, ...(focus === a ? st.chipActive : {}) }} onClick={() => setFocus(a)}>{a}</button>
            ))}
          </div>
        </div>

        {error && <p style={st.error}>{error}</p>}

        <button style={st.btn} onClick={rewrite} disabled={loading}>
          {loading ? <><span style={st.spinner} /> Rewriting...</> : <><Sparkles size={16} /> Rewrite Bullet</>}
        </button>
      </div>

      {result && (
        <div style={st.output}>
          <div style={st.outputHeader}>
            <span style={st.outputLabel}>Rewritten Bullet</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={st.actionBtn} onClick={rewrite}><RefreshCw size={13} /> Redo</button>
              <button style={{ ...st.actionBtn, ...st.actionPrimary }} onClick={copy}>
                {copied ? <><CheckCircle size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
              </button>
            </div>
          </div>

          <div style={st.resultBody}>
            <div style={st.rewrittenText}>
              <span style={st.verbBadge}>{result.actionVerb}</span>
              {result.rewritten?.replace(result.actionVerb, "").trim()}
            </div>

            <div style={st.explanation}>{result.explanation}</div>

            {result.improvements?.length > 0 && (
              <div style={st.improvements}>
                <div style={st.improvLabel}>WHAT CHANGED</div>
                {result.improvements.map((imp, i) => (
                  <div key={i} style={st.improvItem}>
                    <CheckCircle size={13} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>{imp}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={st.beforeAfter}>
              <div style={st.beforeBox}>
                <div style={st.baLabel}>BEFORE</div>
                <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: 0, lineHeight: 1.6 }}>{bullet}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const st = {
  page: { padding: "32px 0" },
  header: { display: "flex", alignItems: "center", gap: 16, marginBottom: 28 },
  iconWrap: { width: 48, height: 48, borderRadius: 12, background: "var(--accent-light, #fdf0ec)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title: { fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "var(--ink-muted)", margin: 0 },
  form: { background: "var(--paper-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 28px", marginBottom: 20, boxShadow: "var(--shadow-sm)" },
  field: { marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-muted)", marginBottom: 8 },
  opt: { fontWeight: 400, color: "var(--ink-faint)" },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none", boxSizing: "border-box" },
  textarea: { resize: "vertical", lineHeight: 1.6, minHeight: 80 },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { padding: "6px 14px", borderRadius: 100, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink-muted)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" },
  chipActive: { background: "var(--accent)", color: "white", borderColor: "var(--accent)" },
  error: { color: "var(--accent)", fontSize: 13, marginBottom: 12 },
  btn: { display: "flex", alignItems: "center", gap: 8, justifyContent: "center", width: "100%", padding: "13px 0", borderRadius: 10, background: "var(--accent)", color: "white", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", boxShadow: "0 4px 14px rgba(200,75,47,0.25)" },
  spinner: { width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", display: "inline-block", animation: "spin 0.8s linear infinite" },
  output: { background: "var(--paper-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-sm)" },
  outputHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--border)", background: "var(--paper-warm)" },
  outputLabel: { fontSize: 11, fontWeight: 700, color: "var(--ink-faint)", letterSpacing: "0.06em", textTransform: "uppercase" },
  actionBtn: { display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink-muted)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)" },
  actionPrimary: { background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" },
  resultBody: { padding: "20px 24px" },
  rewrittenText: { fontSize: 16, fontWeight: 600, color: "var(--ink)", lineHeight: 1.6, marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 10, flexWrap: "wrap" },
  verbBadge: { background: "var(--accent)", color: "white", padding: "2px 10px", borderRadius: 6, fontSize: 14, fontWeight: 700, flexShrink: 0 },
  explanation: { fontSize: 14, color: "var(--ink-muted)", lineHeight: 1.6, marginBottom: 16, padding: "12px 14px", background: "var(--paper-warm)", borderRadius: 8 },
  improvements: { marginBottom: 16 },
  improvLabel: { fontSize: 11, fontWeight: 700, color: "var(--ink-faint)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 },
  improvItem: { display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 },
  beforeAfter: { marginTop: 4 },
  beforeBox: { padding: "12px 14px", background: "var(--paper-warm)", borderRadius: 8, borderLeft: "3px solid var(--accent)" },
  baLabel: { fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em", marginBottom: 6 },
};