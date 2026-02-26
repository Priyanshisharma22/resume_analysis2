import { useState } from "react";
import { Heart, Sparkles, Copy, RefreshCw, CheckCircle } from "lucide-react";
import { callAI } from "./aiHelper";

const INTERVIEW_TYPES = ["Phone Screen", "Technical Round", "Panel Interview", "Final Round", "Hiring Manager"];
const TIMINGS = ["Same day (within hours)", "Next morning", "24–48 hours later"];

export default function ThankYouEmail({ analysis }) {
  const [interviewerName, setInterviewerName] = useState("");
  const [interviewerTitle, setInterviewerTitle] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [interviewType, setInterviewType] = useState("Hiring Manager");
  const [highlight, setHighlight] = useState("");
  const [timing, setTiming] = useState("Same day (within hours)");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState({ subject: false, body: false });
  const [error, setError] = useState("");

  const candidateName = analysis?.candidate?.name || "the candidate";
  const skills = analysis?.skills ? Object.values(analysis.skills).flat().slice(0, 8).join(", ") : "";
  const recentRole = analysis?.experience?.[0]?.role || "";

  const generate = async () => {
    if (!company.trim() || !role.trim()) { setError("Please enter company and role."); return; }
    setError(""); setLoading(true); setResult(null);

    const prompt = `You are an expert career coach. Write a thank-you email after a job interview.

Context:
- Candidate: ${candidateName}
- Interviewer: ${interviewerName || "the interviewer"}${interviewerTitle ? `, ${interviewerTitle}` : ""}
- Company: ${company}
- Role: ${role}
- Interview type: ${interviewType}
- Timing: ${timing}
- Memorable moment/topic from interview: ${highlight || "a great conversation about the role and team"}
- Candidate's background: ${recentRole}, skills: ${skills}

Rules:
- Subject line: specific and warm, not generic
- Reference the specific highlight/topic discussed — make it feel personal
- Reiterate enthusiasm for ONE specific thing about the role/company
- Briefly reinforce one strength relevant to the role
- End with a clear, confident next step
- Keep under 150 words
- Sound genuine and warm, not corporate

Return ONLY valid JSON starting with { and ending with }. No markdown.
{
  "subject": "the subject line",
  "body": "the full thank-you email body",
  "followUpLine": "A one-line follow-up to send if no response in 5 days",
  "tip": "One specific tip to make this email stand out"
}`;

    try {
      const text = await callAI(prompt, 700);
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
        <div style={st.iconWrap}><Heart size={22} color="#e85d7a" /></div>
        <div>
          <h2 style={st.title}>Thank You Email</h2>
          <p style={st.subtitle}>Post-interview follow-ups that keep you top of mind</p>
        </div>
      </div>

      <div style={st.form}>
        <div style={st.row}>
          <div style={st.field}>
            <label style={st.label}>Company *</label>
            <input style={st.input} placeholder="e.g. Airbnb" value={company} onChange={e => setCompany(e.target.value)} />
          </div>
          <div style={st.field}>
            <label style={st.label}>Role *</label>
            <input style={st.input} placeholder="e.g. UX Designer" value={role} onChange={e => setRole(e.target.value)} />
          </div>
        </div>

        <div style={st.row}>
          <div style={st.field}>
            <label style={st.label}>Interviewer Name <span style={st.opt}>(optional)</span></label>
            <input style={st.input} placeholder="e.g. Marcus Johnson" value={interviewerName} onChange={e => setInterviewerName(e.target.value)} />
          </div>
          <div style={st.field}>
            <label style={st.label}>Their Title <span style={st.opt}>(optional)</span></label>
            <input style={st.input} placeholder="e.g. Engineering Manager" value={interviewerTitle} onChange={e => setInterviewerTitle(e.target.value)} />
          </div>
        </div>

        <div style={st.field}>
          <label style={st.label}>Interview Type</label>
          <div style={st.chipRow}>
            {INTERVIEW_TYPES.map(t => (
              <button key={t} style={{ ...st.chip, ...(interviewType === t ? st.chipActive : {}) }} onClick={() => setInterviewType(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div style={st.field}>
          <label style={st.label}>Something specific you discussed <span style={st.opt}>(optional but powerful)</span></label>
          <input style={st.input} placeholder='e.g. "Their plan to expand into APAC" or "The team culture discussion"' value={highlight} onChange={e => setHighlight(e.target.value)} />
        </div>

        <div style={st.field}>
          <label style={st.label}>When are you sending this?</label>
          <div style={st.chipRow}>
            {TIMINGS.map(t => (
              <button key={t} style={{ ...st.chip, ...(timing === t ? st.chipPink : {}) }} onClick={() => setTiming(t)}>{t}</button>
            ))}
          </div>
        </div>

        {error && <p style={st.error}>{error}</p>}

        <button style={st.btn} onClick={generate} disabled={loading}>
          {loading ? <><span style={st.spinner} /> Writing your email...</> : <><Sparkles size={16} /> Generate Thank You Email</>}
        </button>
      </div>

      {result && !loading && (
        <div style={st.output}>
          {result.tip && (
            <div style={st.tipBox}>💡 <strong>Stand-out tip:</strong> {result.tip}</div>
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

            {result.followUpLine && (
              <>
                <div style={st.divider} />
                <div style={st.emailField}>
                  <div style={st.emailFieldHeader}>
                    <span style={st.fieldLabel}>5-DAY FOLLOW-UP (if no reply)</span>
                    <button style={st.copyBtn} onClick={() => navigator.clipboard.writeText(result.followUpLine)}>
                      <Copy size={12} /> Copy
                    </button>
                  </div>
                  <p style={{ ...st.bodyText, fontSize: 13, color: "var(--ink-muted)" }}>{result.followUpLine}</p>
                </div>
              </>
            )}
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
  iconWrap: { width: 48, height: 48, borderRadius: 12, background: "#fde8ef", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
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
  chipPink: { background: "#e85d7a", color: "white", borderColor: "#e85d7a" },
  error: { color: "var(--accent)", fontSize: 13, marginBottom: 12 },
  btn: { display: "flex", alignItems: "center", gap: 8, justifyContent: "center", width: "100%", padding: "13px 0", borderRadius: 10, background: "#e85d7a", color: "white", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", boxShadow: "0 4px 14px rgba(232,93,122,0.3)" },
  spinner: { width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", display: "inline-block", animation: "spin 0.8s linear infinite" },
  output: {},
  tipBox: { padding: "12px 16px", background: "#fde8ef", border: "1px solid #e85d7a", borderRadius: 8, fontSize: 14, color: "var(--ink)", marginBottom: 16, lineHeight: 1.6 },
  emailCard: { background: "var(--paper-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-sm)" },
  emailField: { padding: "16px 20px" },
  emailFieldHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  fieldLabel: { fontSize: 11, fontWeight: 700, color: "var(--ink-faint)", letterSpacing: "0.06em", textTransform: "uppercase" },
  copyBtn: { display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink-muted)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
  copyPrimary: { background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" },
  subjectText: { fontSize: 16, fontWeight: 600, color: "var(--ink)", margin: 0 },
  divider: { height: 1, background: "var(--border)" },
  bodyText: { fontSize: 14, lineHeight: 1.8, color: "var(--ink)", margin: 0, whiteSpace: "pre-wrap" },
};