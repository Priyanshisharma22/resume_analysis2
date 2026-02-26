import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, Clock, Trash2, ChevronDown, ChevronUp, Award, BarChart2 } from "lucide-react";

const STORAGE_KEY = "resume_analysis_history";

// ── helpers ────────────────────────────────────────────────────────────────

export function saveSnapshot(analysis) {
  const history = loadHistory();
  const snapshot = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    label: `Version ${history.length + 1}`,
    score: analysis.score,
    candidate: analysis.candidate,
    improvements: analysis.improvements,
    strengths: analysis.strengths,
  };
  const updated = [snapshot, ...history].slice(0, 10); // keep last 10
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return snapshot;
}

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

// ── sub-components ─────────────────────────────────────────────────────────

function Delta({ value, size = 14 }) {
  if (value === 0 || value === null || value === undefined)
    return <span style={{ ...d.badge, ...d.neutral }}><Minus size={size - 2} /> 0</span>;
  const up = value > 0;
  return (
    <span style={{ ...d.badge, ...(up ? d.up : d.down) }}>
      {up ? <TrendingUp size={size - 2} /> : <TrendingDown size={size - 2} />}
      {up ? "+" : ""}{value}
    </span>
  );
}

const d = {
  badge: { display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 100, fontSize: 12, fontWeight: 700 },
  up: { background: "var(--green-light, #d8f0e2)", color: "var(--green)" },
  down: { background: "var(--accent-light, #fde8e3)", color: "var(--accent)" },
  neutral: { background: "var(--paper-warm)", color: "var(--ink-faint)" },
};

function ScoreBar({ label, value, prev }) {
  const delta = prev !== undefined ? value - prev : null;
  const color = value >= 80 ? "var(--green)" : value >= 60 ? "var(--gold)" : "var(--accent)";
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, fontSize: 13 }}>
        <span style={{ color: "var(--ink)" }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {delta !== null && <Delta value={delta} />}
          <span style={{ fontWeight: 700, color, minWidth: 28, textAlign: "right" }}>{value}</span>
        </div>
      </div>
      <div style={{ height: 6, background: "var(--paper-warm)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 3, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function SnapshotCard({ snap, prev, index, onDelete, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const overallDelta = prev ? snap.score.overall - prev.score.overall : null;
  const date = new Date(snap.timestamp);
  const timeStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " · " +
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div style={s.snapCard}>
      <div style={s.snapHeader}>
        <div style={s.snapLeft}>
          <div style={s.snapVersion}>{snap.label}</div>
          <div style={s.snapMeta}>
            <Clock size={12} /> {timeStr}
          </div>
        </div>
        <div style={s.snapRight}>
          <div style={s.snapScore}>{snap.score.overall}</div>
          {overallDelta !== null && <Delta value={overallDelta} size={13} />}
          <button style={s.iconBtn} onClick={() => setOpen(!open)} title="Expand">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button style={{ ...s.iconBtn, color: "var(--accent)" }} onClick={() => onDelete(snap.id)} title="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {open && (
        <div style={s.snapBody}>
          <div style={s.breakdownGrid}>
            {Object.entries(snap.score.breakdown).map(([key, val]) => (
              <ScoreBar
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={val}
                prev={prev?.score?.breakdown?.[key]}
              />
            ))}
          </div>

          {snap.improvements?.length > 0 && (
            <div style={s.subsection}>
              <div style={s.subsectionTitle}>Issues at this version</div>
              {snap.improvements.slice(0, 3).map((item, i) => (
                <div key={i} style={{ ...s.pill, borderLeft: `3px solid ${item.priority === "high" ? "var(--accent)" : item.priority === "medium" ? "var(--gold)" : "var(--blue)"}` }}>
                  <span style={s.pillPriority}>{item.priority}</span> {item.issue}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CompareView({ history }) {
  if (history.length < 2) return null;
  const latest = history[0];
  const earliest = history[history.length - 1];
  const delta = latest.score.overall - earliest.score.overall;

  return (
    <div style={s.compareCard}>
      <div style={s.compareHeader}>
        <BarChart2 size={18} color="var(--accent)" />
        <span style={s.compareTitle}>Overall Progress</span>
        <span style={s.compareSub}>{earliest.label} → {latest.label}</span>
      </div>
      <div style={s.compareScores}>
        <div style={s.compareScore}>
          <div style={s.compareScoreNum}>{earliest.score.overall}</div>
          <div style={s.compareScoreLabel}>Starting Score</div>
        </div>
        <div style={s.compareArrow}>
          <Delta value={delta} size={16} />
        </div>
        <div style={s.compareScore}>
          <div style={{ ...s.compareScoreNum, color: delta >= 0 ? "var(--green)" : "var(--accent)" }}>{latest.score.overall}</div>
          <div style={s.compareScoreLabel}>Latest Score</div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        {Object.keys(latest.score.breakdown).map((key) => {
          const latestVal = latest.score.breakdown[key];
          const earliestVal = earliest.score.breakdown[key];
          const diff = latestVal - earliestVal;
          return (
            <div key={key} style={s.compareRow}>
              <span style={s.compareRowLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <div style={s.compareRowRight}>
                <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>{earliestVal}</span>
                <span style={{ fontSize: 12, color: "var(--ink-faint)", margin: "0 4px" }}>→</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{latestVal}</span>
                <Delta value={diff} size={13} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────

export default function ImprovementTracker() {
  const [history, setHistory] = useState([]);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleDelete = (id) => {
    const updated = history.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setHistory(updated);
  };

  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  if (history.length === 0) {
    return (
      <div style={s.empty}>
        <Award size={36} color="var(--ink-faint)" />
        <div style={s.emptyTitle}>No history yet</div>
        <div style={s.emptySub}>
          Analyze your resume to save a snapshot. Re-analyze after editing to track your score improvements over time.
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.topRow}>
        <div>
          <h2 style={s.title}>Improvement Tracker</h2>
          <p style={s.subtitle}>{history.length} version{history.length !== 1 ? "s" : ""} saved</p>
        </div>
        <button style={s.clearBtn} onClick={handleClearAll}>
          <Trash2 size={14} /> {cleared ? "Cleared!" : "Clear All"}
        </button>
      </div>

      <CompareView history={history} />

      <div style={s.timeline}>
        {history.map((snap, i) => (
          <SnapshotCard
            key={snap.id}
            snap={snap}
            prev={history[i + 1]}
            index={i}
            onDelete={handleDelete}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { padding: "32px 0" },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "var(--ink-muted)" },
  clearBtn: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "8px 14px", borderRadius: 8, border: "1px solid var(--border)",
    background: "var(--paper)", color: "var(--ink-muted)", fontSize: 13,
    cursor: "pointer", fontFamily: "var(--font-body)",
  },

  // compare card
  compareCard: {
    background: "var(--paper-card)", border: "1px solid var(--border)",
    borderRadius: 12, padding: "20px 24px", marginBottom: 20,
    boxShadow: "var(--shadow-sm)",
  },
  compareHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 16 },
  compareTitle: { fontWeight: 700, fontSize: 15, color: "var(--ink)" },
  compareSub: { fontSize: 12, color: "var(--ink-faint)", marginLeft: "auto" },
  compareScores: { display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 20 },
  compareScore: { textAlign: "center" },
  compareScoreNum: { fontSize: 40, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--ink)", lineHeight: 1 },
  compareScoreLabel: { fontSize: 12, color: "var(--ink-faint)", marginTop: 4 },
  compareArrow: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  compareRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" },
  compareRowLabel: { fontSize: 13, color: "var(--ink)" },
  compareRowRight: { display: "flex", alignItems: "center", gap: 8 },

  // timeline
  timeline: { display: "flex", flexDirection: "column", gap: 12 },

  // snapshot card
  snapCard: {
    background: "var(--paper-card)", border: "1px solid var(--border)",
    borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-sm)",
  },
  snapHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 20px", cursor: "default",
  },
  snapLeft: { display: "flex", flexDirection: "column", gap: 4 },
  snapVersion: { fontWeight: 700, fontSize: 15, color: "var(--ink)" },
  snapMeta: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--ink-faint)" },
  snapRight: { display: "flex", alignItems: "center", gap: 10 },
  snapScore: { fontSize: 28, fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--ink)" },
  iconBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "var(--ink-faint)", display: "flex", alignItems: "center", padding: 4,
  },
  snapBody: { padding: "0 20px 20px", borderTop: "1px solid var(--border)" },
  breakdownGrid: { paddingTop: 16 },

  subsection: { marginTop: 16 },
  subsectionTitle: { fontSize: 11, fontWeight: 700, color: "var(--ink-faint)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 },
  pill: {
    padding: "8px 12px", background: "var(--paper-warm)", borderRadius: 6,
    fontSize: 13, color: "var(--ink)", marginBottom: 6, lineHeight: 1.5,
  },
  pillPriority: { fontWeight: 700, textTransform: "uppercase", fontSize: 11, color: "var(--ink-faint)" },

  // empty
  empty: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "60px 24px", textAlign: "center", gap: 12,
  },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: "var(--ink)" },
  emptySub: { fontSize: 14, color: "var(--ink-muted)", maxWidth: 380, lineHeight: 1.6 },
};