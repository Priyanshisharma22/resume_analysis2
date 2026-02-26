import { useState } from "react";
import { Mail, Sparkles, Copy, RefreshCw, CheckCircle } from "lucide-react";
import { callAI } from "./aiHelper";

const TARGETS = ["Recruiter", "Hiring Manager", "Founder/CEO", "Team Lead", "HR Director"];
const TONES = ["Professional", "Warm & Personal", "Bold & Direct", "Curious & Thoughtful"];

export default function ColdOutreach({ analysis }) {
  const [targetName, setTargetName] = useState("");
  const [targetTitle, setTargetTitle] = useState(TARGETS[0]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState("Professional");
  const [mutual, setMutual] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState({ subject: false, body: false });
  const [error, setError] = useState("");

  const candidateName = analysis?.candidate?.name || "the candidate";
  const skills = analysis?.skills ? Object.values(analysis.skills).flat().slice(0, 10).join(", ") : "";
  const recentRole = analysis?.experience?.[0]?.role || "";
  const recentCompany = analysis?.experience?.[0]?.company || "";
  const strengths = analysis?.strengths?.slice(0, 2).join("; ") || "";

  const generate = async () => {
    if (!company.trim() || !role.trim()) { setError("Please enter company and target role."); return; }
    setError(""); setLoading(true); setResult(null);

    const prompt = `You are an expert at writing cold outreach emails that get responses.

Write a cold outreach email from ${candidateName} to a ${targetTitle}${targetName ? ` named ${targetName}` : ""} at ${company} about the ${role} role.

Sender profile:
- Current/recent role: ${recentRole} at ${recentCompany}
- Key skills: ${skills}
- Strengths: ${strengths}
${mutual ? `- Mutual connection/context: ${mutual}` : ""}

Tone: ${tone}

Rules:
- Subject line: punchy, under 8 words, no "Following up" or "Reaching out"
- Opening: reference something specific about the company (infer something plausible)
- Middle: 2-3 sentences on what they bring, not what they want
- CTA: one clear, low-friction ask
- Total body: under 150 words
- Sound human, not templated

Return ONLY valid JSON starting with { and ending with }. No markdown.
{
  "subject": "the email subject line",
  "body": "the full email body",
  "subjectAlternatives": ["alt subject 1", "alt subject 2"],
  "tip": "One specific tip to improve response rate for this outreach"
}`;

    try {
      const text = await callAI(prompt, 800);
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean.slice(clean.indexOf('{'), clean.lastIndexOf('}') + 1));
      setResult(parsed);
    } catch (e) {
      setError("Generation failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = (field) => {
    navigator.clipboard.writeText(field === "subject" ? result.subject : result.body);
    setCopied(prev => ({ ...prev, [field]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [field]: false })), 2000);
  };

  return (
    <div style={st.page}>
      <div style={st.header}>
        <div style={st.iconWrap}><Mail size={22} color="var(--blue)" /></div>
        <div>
          <h2 style={st.title}>Cold Outreach Email</h2>
          <p style={st.subtitle}>Personalized emails that get responses from recruiters & hiring managers</p>
        </div>
      </div>

      <div style={st.form}>
        <div style={st.row}>
          <div style={st.field}>
            <label style={st.label}>Company *</label>
            <input style={st.input} placeholder="e.g. Stripe" value={company} onChange={e => setCompany(e.target.value)} />
          </div>
          <div style={st.field}>
            <label style={st.label}>Target Role *</label>
            <input style={st.input} placeholder="e.g. Product Manager" value={role} onChange={e => setRole(e.target.value)} />
          </div>
        </div>

        <div style={st.row}>
          <div style={st.field}>
            <label style={st.label}>Recipient Name <span style={st.opt}>(optional)</span></label>
            <input style={st.input} placeholder="e.g. Sarah Chen" value={targetName} onChange={e => setTargetName(e.target.value)} />
          </div>
          <div style={st.field}>
            <label style={st.label}>Their Title</label>
            <div style={st.chipRow}>
              {TARGETS.map(t => (
                <button key={t} style={{ ...st.chip, ...(targetTitle === t ? st.chipActive : {}) }} onClick={() => setTargetTitle(t)}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={st.field}>
          <label style={st.label}>Mutual Connection / Context <span style={st.opt}>(optional)</span></label>
          <input style={st.input} placeholder='e.g. "Met at TechCrunch Disrupt" or "Saw your LinkedIn post about..."' value={mutual} onChange={e => setMutual(e.target.value)} />
        </div>

        <div style={st.field}>
          <label style={st.label}>Tone</label>
          <div style={st.chipRow}>
            {TONES.map(t => (
              <button key={t} style={{ ...st.chip, ...(tone === t ? st.chipBlue : {}) }} onClick={() => setTone(t)}>{t}</button>
            ))}
          </div>
        </div>

        {error && <p style={st.error}>{error}</p>}

        <button style={st.btn} onClick={generate} disabled={loading}>
          {loading ? <><span style={st.spinner} /> Crafting email...</> : <><Sparkles size={16} /> Generate Outreach Email</>}
        </button>
      </div>

      {result && !loading && (
        <div style={st.output}>
          {result.tip && (
            <div style={st.tipBox}>💡 <strong>Response tip:</strong> {result.tip}</div>
          )}

          <div style={st.emailCard}>
            <div style={st.emailField}>
              <div style={st.emailFieldHeader}>
                <span style={st.fieldLabel}>SUBJECT</span>
                <button style={st.copyBtn} onClick={() => copy("subject")}>
                  {copied.subject ? <><CheckCircle size={12} color="var(--green)" /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
              <p style={st.subjectText}>{result.subject}</p>
              {result.subjectAlternatives?.length > 0 && (
                <div style={st.altSubjects}>
                  <span style={st.altLabel}>Alternatives: </span>
                  {result.subjectAlternatives.map((s, i) => (
                    <span key={i} style={st.altChip} onClick={() => navigator.clipboard.writeText(s)}>{s}</span>
                  ))}
                </div>
              )}
            </div>

            <div style={st.divider} />

            <div style={st.emailField}>
              <div style={st.emailFieldHeader}>
                <span style={st.fieldLabel}>BODY</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={st.copyBtn} onClick={generate}><RefreshCw size={12} /> Redo</button>
                  <button style={{ ...st.copyBtn, ...st.copyPrimary }} onClick={() => copy("body")}>
                    {copied.body ? <><CheckCircle size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
              </div>
              <p style={st.bodyText}>{result.body}</p>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

const st = {
  page: { padding: "32px 0" },
  header: { display: "flex", alignItems: "center", gap: 16, marginBottom: 28 },
  iconWrap: { width: 48, height: 48, borderRadius: 12, background: "var(--blue-light, #deeaf7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title: { fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "var(--ink-muted)", margin: 0 },
  form: { background: "var(--paper-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 28px", marginBottom: 20, boxShadow: "var(--shadow-sm)" },
  row: { display: "flex", gap: 16 },
  field: { flex: 1, marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-muted)", marginBottom: 8 },
  opt: { fontWeight: 400, color: "var(--ink-faint)" },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none", boxSizing: "border-box" },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { padding: "6px 14px", borderRadius: 100, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink-muted)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" },
  chipActive: { background: "var(--accent)", color: "white", borderColor: "var(--accent)" },
  chipBlue: { background: "var(--blue)", color: "white", borderColor: "var(--blue)" },
  error: { color: "var(--accent)", fontSize: 13, marginBottom: 12 },
  btn: { display: "flex", alignItems: "center", gap: 8, justifyContent: "center", width: "100%", padding: "13px 0", borderRadius: 10, background: "var(--blue)", color: "white", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", boxShadow: "0 4px 14px rgba(43,95,142,0.25)" },
  spinner: { width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", display: "inline-block", animation: "spin 0.8s linear infinite" },
  output: {},
  tipBox: { padding: "12px 16px", background: "var(--blue-light, #deeaf7)", border: "1px solid var(--blue)", borderRadius: 8, fontSize: 14, color: "var(--ink)", marginBottom: 16, lineHeight: 1.6 },
  emailCard: { background: "var(--paper-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-sm)" },
  emailField: { padding: "16px 20px" },
  emailFieldHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  fieldLabel: { fontSize: 11, fontWeight: 700, color: "var(--ink-faint)", letterSpacing: "0.06em", textTransform: "uppercase" },
  copyBtn: { display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink-muted)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
  copyPrimary: { background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" },
  subjectText: { fontSize: 16, fontWeight: 600, color: "var(--ink)", margin: 0, lineHeight: 1.5 },
  altSubjects: { marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" },
  altLabel: { fontSize: 12, color: "var(--ink-faint)" },
  altChip: { padding: "3px 10px", borderRadius: 6, background: "var(--paper-warm)", fontSize: 12, color: "var(--ink-muted)", cursor: "pointer", border: "1px solid var(--border)" },
  divider: { height: 1, background: "var(--border)" },
  bodyText: { fontSize: 14, lineHeight: 1.8, color: "var(--ink)", margin: 0, whiteSpace: "pre-wrap" },
};