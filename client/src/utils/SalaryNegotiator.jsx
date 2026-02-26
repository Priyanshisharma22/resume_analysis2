import { useState } from "react";
import { DollarSign, Sparkles, Copy, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { callAI } from "./aiHelper";

const SCENARIOS = ["Initial offer response", "Counter offer", "After promotion", "New job negotiation", "Raise request"];

function ScriptBlock({ title, content, accent = "var(--green)" }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(true);
  const copy = () => { navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ ...sb.wrapper, borderLeft: `3px solid ${accent}` }}>
      <div style={sb.header}>
        <button style={sb.toggle} onClick={() => setOpen(!open)}>
          <span style={sb.title}>{title}</span>
          {open ? <ChevronUp size={15} color="var(--ink-faint)" /> : <ChevronDown size={15} color="var(--ink-faint)" />}
        </button>
        <button style={sb.copyBtn} onClick={copy}>
          {copied ? <><CheckCircle size={12} color="var(--green)" /> Copied</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      {open && <p style={sb.content}>{content}</p>}
    </div>
  );
}

const sb = {
  wrapper: { background: "var(--paper-warm)", borderRadius: 8, marginBottom: 12, overflow: "hidden" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid var(--border)" },
  toggle: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", flex: 1, textAlign: "left" },
  title: { fontSize: 13, fontWeight: 700, color: "var(--ink)" },
  copyBtn: { display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink-muted)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
  content: { padding: "14px 16px", fontSize: 14, lineHeight: 1.75, color: "var(--ink)", margin: 0, whiteSpace: "pre-wrap" },
};

export default function SalaryNegotiator({ analysis }) {
  const [role, setRole] = useState("");
  const [currentSalary, setCurrentSalary] = useState("");
  const [targetSalary, setTargetSalary] = useState("");
  const [scenario, setScenario] = useState("New job negotiation");
  const [yearsExp, setYearsExp] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const skills = analysis?.skills ? Object.values(analysis.skills).flat().slice(0, 10).join(", ") : "";
  const strengths = analysis?.strengths?.slice(0, 3).join("; ") || "";

  const generate = async () => {
    if (!role.trim()) { setError("Please enter the role."); return; }
    setError(""); setLoading(true); setResult(null);

    const prompt = `You are an expert salary negotiation coach. Generate a complete negotiation script.

Details:
- Role: ${role}
- Scenario: ${scenario}
- Current salary: ${currentSalary || "not specified"}
- Target salary: ${targetSalary || "not specified"}
- Years of experience: ${yearsExp || "not specified"}
- Key skills: ${skills || "general professional"}
- Strengths: ${strengths || "not specified"}

Return ONLY valid JSON starting with { and ending with }. No markdown.

{
  "openingStatement": "The opening line to start the conversation confidently",
  "valueProposition": "2-3 sentences articulating their value and why they deserve the target salary",
  "counterScript": "What to say when they push back or say the budget is fixed",
  "closingStatement": "How to wrap up and next steps",
  "talkingPoints": ["point 1", "point 2", "point 3", "point 4"],
  "thingsToAvoid": ["mistake 1", "mistake 2", "mistake 3"],
  "salaryRange": "Suggested range to anchor with based on the info given",
  "tip": "One powerful coaching tip specific to this scenario"
}`;

    try {
      const text = await callAI(prompt, 1000);
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean.slice(clean.indexOf('{'), clean.lastIndexOf('}') + 1));
      setResult(parsed);
    } catch (e) {
      setError("Generation failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={st.page}>
      <div style={st.header}>
        <div style={st.iconWrap}><DollarSign size={22} color="var(--green)" /></div>
        <div>
          <h2 style={st.title}>Salary Negotiation Script</h2>
          <p style={st.subtitle}>AI-generated talking points so you never leave money on the table</p>
        </div>
      </div>

      <div style={st.form}>
        <div style={st.row}>
          <div style={st.field}>
            <label style={st.label}>Role / Position *</label>
            <input style={st.input} placeholder="e.g. Senior Engineer" value={role} onChange={e => setRole(e.target.value)} />
          </div>
          <div style={st.field}>
            <label style={st.label}>Years of Experience</label>
            <input style={st.input} placeholder="e.g. 5" value={yearsExp} onChange={e => setYearsExp(e.target.value)} />
          </div>
        </div>

        <div style={st.row}>
          <div style={st.field}>
            <label style={st.label}>Current / Offered Salary</label>
            <input style={st.input} placeholder="e.g. $85,000" value={currentSalary} onChange={e => setCurrentSalary(e.target.value)} />
          </div>
          <div style={st.field}>
            <label style={st.label}>Target Salary</label>
            <input style={st.input} placeholder="e.g. $100,000" value={targetSalary} onChange={e => setTargetSalary(e.target.value)} />
          </div>
        </div>

        <div style={st.field}>
          <label style={st.label}>Scenario</label>
          <div style={st.chipRow}>
            {SCENARIOS.map(s => (
              <button key={s} style={{ ...st.chip, ...(scenario === s ? st.chipActive : {}) }} onClick={() => setScenario(s)}>{s}</button>
            ))}
          </div>
        </div>

        {error && <p style={st.error}>{error}</p>}

        <button style={st.btn} onClick={generate} disabled={loading}>
          {loading ? <><span style={st.spinner} /> Building your script...</> : <><Sparkles size={16} /> Generate Negotiation Script</>}
        </button>
      </div>

      {loading && (
        <div style={st.skeleton}>
          {[75, 90, 60, 80].map((w, i) => (
            <div key={i} style={{ ...st.skelLine, width: `${w}%`, animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      )}

      {result && !loading && (
        <div style={st.results}>
          {result.salaryRange && (
            <div style={st.rangeBanner}>
              <DollarSign size={16} color="var(--green)" />
              <span style={st.rangeText}>Suggested anchor range: <strong>{result.salaryRange}</strong></span>
            </div>
          )}

          {result.tip && (
            <div style={st.tipBox}>💡 <strong>Coach tip:</strong> {result.tip}</div>
          )}

          <ScriptBlock title="Opening Statement" content={result.openingStatement} accent="var(--blue)" />
          <ScriptBlock title="Your Value Proposition" content={result.valueProposition} accent="var(--green)" />
          <ScriptBlock title="When They Push Back" content={result.counterScript} accent="var(--gold)" />
          <ScriptBlock title="Closing Statement" content={result.closingStatement} accent="var(--accent)" />

          {result.talkingPoints?.length > 0 && (
            <div style={st.card}>
              <div style={st.cardLabel}>KEY TALKING POINTS</div>
              {result.talkingPoints.map((p, i) => (
                <div key={i} style={st.tpItem}>
                  <span style={st.tpNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          )}

          {result.thingsToAvoid?.length > 0 && (
            <div style={st.card}>
              <div style={st.cardLabel}>THINGS TO AVOID</div>
              {result.thingsToAvoid.map((p, i) => (
                <div key={i} style={{ ...st.tpItem, borderLeft: "3px solid var(--accent)", paddingLeft: 12 }}>
                  <span style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.5 }}>❌ {p}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes shimmer{0%,100%{opacity:.4}50%{opacity:.8}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

const st = {
  page: { padding: "32px 0" },
  header: { display: "flex", alignItems: "center", gap: 16, marginBottom: 28 },
  iconWrap: { width: 48, height: 48, borderRadius: 12, background: "var(--green-light, #d8f0e2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title: { fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "var(--ink-muted)", margin: 0 },
  form: { background: "var(--paper-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 28px", marginBottom: 20, boxShadow: "var(--shadow-sm)" },
  row: { display: "flex", gap: 16 },
  field: { flex: 1, marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-muted)", marginBottom: 8 },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none", boxSizing: "border-box" },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { padding: "6px 14px", borderRadius: 100, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink-muted)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" },
  chipActive: { background: "var(--green)", color: "white", borderColor: "var(--green)" },
  error: { color: "var(--accent)", fontSize: 13, marginBottom: 12 },
  btn: { display: "flex", alignItems: "center", gap: 8, justifyContent: "center", width: "100%", padding: "13px 0", borderRadius: 10, background: "var(--green)", color: "white", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", boxShadow: "0 4px 14px rgba(34,139,80,0.25)" },
  spinner: { width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", display: "inline-block", animation: "spin 0.8s linear infinite" },
  skeleton: { display: "flex", flexDirection: "column", gap: 12, padding: "8px 0" },
  skelLine: { height: 14, borderRadius: 6, background: "var(--paper-warm)", animation: "shimmer 1.4s ease infinite" },
  results: {},
  rangeBanner: { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--green-light, #d8f0e2)", border: "1px solid var(--green)", borderRadius: 8, marginBottom: 14 },
  rangeText: { fontSize: 14, color: "var(--ink)" },
  tipBox: { padding: "12px 16px", background: "var(--gold-light, #fdf3d7)", border: "1px solid var(--gold)", borderRadius: 8, fontSize: 14, color: "var(--ink)", marginBottom: 16, lineHeight: 1.6 },
  card: { background: "var(--paper-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px", marginBottom: 12, boxShadow: "var(--shadow-sm)" },
  cardLabel: { fontSize: 11, fontWeight: 700, color: "var(--ink-faint)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 },
  tpItem: { display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--border)" },
  tpNum: { fontSize: 11, fontWeight: 800, color: "var(--ink-faint)", flexShrink: 0, marginTop: 2, letterSpacing: "0.06em" },
};