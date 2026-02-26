import { useState } from "react";
import { MessageSquare, Sparkles, ChevronDown, ChevronUp, RefreshCw, Lightbulb } from "lucide-react";
import { callAI } from "./aiHelper";

const CATEGORIES = ["Behavioral", "Technical", "Situational", "Role-specific", "Culture Fit"];
const DIFFICULTIES = ["Entry Level", "Mid Level", "Senior Level"];

function QACard({ qa, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div style={cardStyles.wrapper}>
      <button style={cardStyles.question} onClick={() => setOpen(!open)}>
        <div style={cardStyles.questionLeft}>
          <span style={cardStyles.qNum}>{String(index + 1).padStart(2, "0")}</span>
          <span style={cardStyles.qText}>{qa.question}</span>
        </div>
        <div style={cardStyles.qMeta}>
          <span style={{ ...cardStyles.badge, ...categoryBadge(qa.category) }}>{qa.category}</span>
          {open ? <ChevronUp size={16} color="var(--ink-faint)" /> : <ChevronDown size={16} color="var(--ink-faint)" />}
        </div>
      </button>
      {open && (
        <div style={cardStyles.answerWrap}>
          <div style={cardStyles.answerSection}>
            <div style={cardStyles.answerLabel}><Lightbulb size={13} color="var(--gold)" /> Suggested Answer</div>
            <p style={cardStyles.answerText}>{qa.answer}</p>
          </div>
          {qa.tip && <div style={cardStyles.tipBox}><strong>💡 Tip:</strong> {qa.tip}</div>}
        </div>
      )}
    </div>
  );
}

function categoryBadge(cat) {
  const map = {
    Behavioral: { background: "var(--blue-light, #deeaf7)", color: "var(--blue)" },
    Technical: { background: "var(--green-light, #d8f0e2)", color: "var(--green)" },
    Situational: { background: "var(--gold-light, #fdf3d7)", color: "var(--gold)" },
    "Role-specific": { background: "var(--accent-light, #fde8e3)", color: "var(--accent)" },
    "Culture Fit": { background: "#e8e4f8", color: "#6b4fbb" },
  };
  return map[cat] || { background: "var(--paper-warm)", color: "var(--ink-muted)" };
}

export default function InterviewPrepGenerator({ analysis }) {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [difficulty, setDifficulty] = useState("Mid Level");
  const [selectedCats, setSelectedCats] = useState(["Behavioral", "Technical", "Role-specific"]);
  const [questionCount, setQuestionCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const [qaList, setQAList] = useState([]);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const skills = analysis?.skills ? Object.values(analysis.skills).flat().slice(0, 15).join(", ") : "";
  const experience = analysis?.experience?.map((e) => `${e.role} at ${e.company} (${e.duration || ""})`).slice(0, 4).join("; ") || "";

  const toggleCat = (cat) => setSelectedCats((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);

  const generate = async () => {
    if (!jobTitle.trim()) { setError("Please enter a job title."); return; }
    if (selectedCats.length === 0) { setError("Please select at least one category."); return; }
    setError(""); setLoading(true); setQAList([]);

    const prompt = `You are an expert interview coach preparing a candidate for a ${difficulty} "${jobTitle}" role${company ? ` at ${company}` : ""}.

Candidate profile:
- Skills: ${skills || "General professional"}
- Experience: ${experience || "Not specified"}

Generate exactly ${questionCount} interview questions across these categories: ${selectedCats.join(", ")}.

Return ONLY a valid JSON array with no markdown, no preamble, no explanation. Start your response with [ and end with ]. Format:
[
  {
    "question": "...",
    "category": "Behavioral",
    "answer": "A strong 3-4 sentence model answer",
    "tip": "One concise coaching tip"
  }
]`;

    try {
      const text = await callAI(prompt, 1000);
      const clean = text.replace(/```json|```/g, "").trim();
      const jsonStart = clean.indexOf('[');
      const jsonEnd = clean.lastIndexOf(']');
      const jsonStr = clean.slice(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonStr);
      setQAList(parsed);
    } catch (e) {
      setError("Generation failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const allCategories = ["All", ...new Set(qaList.map((q) => q.category))];
  const filtered = activeFilter === "All" ? qaList : qaList.filter((q) => q.category === activeFilter);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.iconWrap}><MessageSquare size={22} color="var(--blue)" /></div>
          <div>
            <h2 style={styles.title}>Interview Q&A Prep</h2>
            <p style={styles.subtitle}>AI-generated questions & model answers tailored to your resume</p>
          </div>
        </div>

        <div style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Job Title *</label>
              <input style={styles.input} placeholder="e.g. Product Manager" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Company <span style={styles.optional}>(optional)</span></label>
              <input style={styles.input} placeholder="e.g. Google" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Seniority Level</label>
            <div style={styles.chipRow}>
              {DIFFICULTIES.map((d) => (
                <button key={d} style={{ ...styles.chip, ...(difficulty === d ? styles.chipActive : {}) }} onClick={() => setDifficulty(d)}>{d}</button>
              ))}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Question Categories</label>
            <div style={styles.chipRow}>
              {CATEGORIES.map((cat) => (
                <button key={cat} style={{ ...styles.chip, ...(selectedCats.includes(cat) ? styles.chipActive : {}) }} onClick={() => toggleCat(cat)}>{cat}</button>
              ))}
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Number of Questions: <strong>{questionCount}</strong></label>
            <input type="range" min={4} max={15} step={1} value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} style={styles.slider} />
            <div style={styles.sliderLabels}><span>4</span><span>15</span></div>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.generateBtn} onClick={generate} disabled={loading}>
            {loading ? <><span style={styles.spinner} /> Generating questions...</>
              : qaList.length > 0 ? <><RefreshCw size={16} /> Regenerate</>
              : <><Sparkles size={16} /> Generate Interview Questions</>}
          </button>
        </div>

        {loading && (
          <div style={styles.skeleton}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={styles.skeletonCard}>
                <div style={{ ...styles.skeletonLine, width: "70%", animationDelay: `${i * 0.15}s` }} />
                <div style={{ ...styles.skeletonLine, width: "40%", height: 8, animationDelay: `${i * 0.2}s` }} />
              </div>
            ))}
          </div>
        )}

        {qaList.length > 0 && !loading && (
          <>
            <div style={styles.filterBar}>
              <span style={styles.resultCount}>{qaList.length} questions generated</span>
              <div style={styles.chipRow}>
                {allCategories.map((cat) => (
                  <button key={cat} style={{ ...styles.filterChip, ...(activeFilter === cat ? styles.filterChipActive : {}) }} onClick={() => setActiveFilter(cat)}>{cat}</button>
                ))}
              </div>
            </div>
            <div>{filtered.map((qa, i) => <QACard key={i} qa={qa} index={i} />)}</div>
          </>
        )}
      </div>
      <style>{`@keyframes shimmer{0%,100%{opacity:.4}50%{opacity:.8}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

const cardStyles = {
  wrapper: { background: "var(--paper-card)", border: "1px solid var(--border)", borderRadius: 12, marginBottom: 12, overflow: "hidden", boxShadow: "var(--shadow-sm)" },
  question: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", gap: 16, textAlign: "left" },
  questionLeft: { display: "flex", alignItems: "flex-start", gap: 14, flex: 1 },
  qNum: { fontSize: 11, fontWeight: 800, color: "var(--ink-faint)", letterSpacing: "0.08em", flexShrink: 0, marginTop: 2 },
  qText: { fontSize: 15, fontWeight: 600, color: "var(--ink)", lineHeight: 1.4 },
  qMeta: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
  badge: { padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600 },
  answerWrap: { borderTop: "1px solid var(--border)", padding: "16px 20px 20px" },
  answerSection: { marginBottom: 12 },
  answerLabel: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 },
  answerText: { fontSize: 14, lineHeight: 1.7, color: "var(--ink-muted)", margin: 0 },
  tipBox: { background: "var(--paper-warm)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--ink-muted)", lineHeight: 1.6 },
};

const styles = {
  page: { padding: "32px 0" },
  container: { maxWidth: 760, margin: "0 auto" },
  header: { display: "flex", alignItems: "center", gap: 16, marginBottom: 28 },
  iconWrap: { width: 48, height: 48, borderRadius: 12, background: "var(--blue-light, #deeaf7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title: { fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "var(--ink-muted)", margin: 0 },
  form: { background: "var(--paper-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 28px", marginBottom: 20, boxShadow: "var(--shadow-sm)" },
  row: { display: "flex", gap: 16 },
  field: { flex: 1, marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink-muted)", marginBottom: 8 },
  optional: { fontWeight: 400, color: "var(--ink-faint)" },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none", boxSizing: "border-box" },
  slider: { width: "100%", accentColor: "var(--blue)", cursor: "pointer" },
  sliderLabels: { display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-faint)", marginTop: 4 },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { padding: "6px 14px", borderRadius: 100, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink-muted)", fontSize: 13, cursor: "pointer", fontFamily: "var(--font-body)" },
  chipActive: { background: "var(--blue)", color: "white", borderColor: "var(--blue)" },
  error: { color: "var(--accent)", fontSize: 13, marginBottom: 12 },
  generateBtn: { display: "flex", alignItems: "center", gap: 8, justifyContent: "center", width: "100%", padding: "13px 0", borderRadius: 10, background: "var(--blue)", color: "white", border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)", boxShadow: "0 4px 14px rgba(43,95,142,0.25)" },
  spinner: { width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", display: "inline-block", animation: "spin 0.8s linear infinite" },
  skeleton: { display: "flex", flexDirection: "column", gap: 12 },
  skeletonCard: { background: "var(--paper-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px", display: "flex", flexDirection: "column", gap: 10 },
  skeletonLine: { height: 14, borderRadius: 6, background: "var(--paper-warm)", animation: "shimmer 1.4s ease infinite" },
  filterBar: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 },
  resultCount: { fontSize: 13, color: "var(--ink-faint)", fontWeight: 600 },
  filterChip: { padding: "4px 12px", borderRadius: 100, border: "1px solid var(--border)", background: "var(--paper)", color: "var(--ink-muted)", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-body)" },
  filterChipActive: { background: "var(--ink)", color: "var(--paper)", borderColor: "var(--ink)" },
};