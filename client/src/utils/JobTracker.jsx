import { useState, useEffect, useRef } from "react";
import {
  Plus, X, ExternalLink, Calendar, Building2,
  DollarSign, MapPin, ChevronDown, Trash2, Edit2,
  Check, BarChart2, Briefcase, Star, Clock, TrendingUp
} from "lucide-react";

// ── COLUMNS ───────────────────────────────────────────────────────────────

const COLUMNS = [
  { id: "wishlist",  label: "Wishlist",   color: "#64748b", glow: "rgba(100,116,139,0.2)",  dot: "#94a3b8", num: 0 },
  { id: "applied",   label: "Applied",    color: "#818cf8", glow: "rgba(129,140,248,0.2)",  dot: "#818cf8", num: 1 },
  { id: "interview", label: "Interview",  color: "#fb923c", glow: "rgba(251,146,60,0.2)",   dot: "#fb923c", num: 2 },
  { id: "offer",     label: "Offer",      color: "#34d399", glow: "rgba(52,211,153,0.2)",   dot: "#34d399", num: 3 },
  { id: "rejected",  label: "Rejected",   color: "#f87171", glow: "rgba(248,113,113,0.15)", dot: "#f87171", num: 4 },
];

const PRIORITIES = ["Low", "Medium", "High"];
const PRIORITY_COLORS = { Low: "#475569", Medium: "#fb923c", High: "#f87171" };

const STORAGE_KEY = "job_tracker_v2";

function loadJobs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveJobs(jobs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs)); } catch {}
}

function newJob(overrides = {}) {
  return {
    id: Date.now().toString(),
    company: "",
    role: "",
    location: "",
    salary: "",
    url: "",
    notes: "",
    priority: "Medium",
    status: "wishlist",
    applied: "",
    starred: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// ── CARD MODAL ────────────────────────────────────────────────────────────

function JobModal({ job, onSave, onClose, onDelete }) {
  const [form, setForm] = useState({ ...job });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <style>{`
        .jm-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: jm-fade 0.15s ease;
        }
        @keyframes jm-fade { from { opacity: 0; } to { opacity: 1; } }
        .jm-box {
          background: #13131f;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          width: 100%; max-width: 520px;
          max-height: 90vh; overflow-y: auto;
          padding: 28px;
          animation: jm-up 0.2s cubic-bezier(0.22,1,0.36,1);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
        }
        @keyframes jm-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .jm-input {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 10px 13px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: #e2e8f0; outline: none; transition: border-color 0.18s;
          box-sizing: border-box;
        }
        .jm-input::placeholder { color: #334155; }
        .jm-input:focus { border-color: rgba(129,140,248,0.5); background: rgba(129,140,248,0.05); }
        .jm-textarea { min-height: 80px; resize: vertical; line-height: 1.6; }
        .jm-label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #475569; margin-bottom: 6px; }
        .jm-field { margin-bottom: 14px; }
        .jm-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      `}</style>
      <div className="jm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="jm-box">

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}>
                {job.id && job.company ? job.company : "New Application"}
              </div>
              <div style={{ fontSize: 13, color: "#475569", marginTop: 3 }}>
                {job.role || "Add job details below"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => set("starred", !form.starred)}
                style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: form.starred ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <Star size={14} color={form.starred ? "#fbbf24" : "#475569"} fill={form.starred ? "#fbbf24" : "none"} />
              </button>
              <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#475569" }}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Status selector */}
          <div className="jm-field">
            <label className="jm-label">Status</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {COLUMNS.map(col => (
                <button
                  key={col.id}
                  onClick={() => set("status", col.id)}
                  style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${form.status === col.id ? col.color : "rgba(255,255,255,0.08)"}`, background: form.status === col.id ? `${col.color}20` : "rgba(255,255,255,0.03)", color: form.status === col.id ? col.color : "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                >
                  {col.label}
                </button>
              ))}
            </div>
          </div>

          <div className="jm-row2">
            <div className="jm-field">
              <label className="jm-label">Company *</label>
              <input className="jm-input" placeholder="Google" value={form.company} onChange={e => set("company", e.target.value)} />
            </div>
            <div className="jm-field">
              <label className="jm-label">Role *</label>
              <input className="jm-input" placeholder="Software Engineer" value={form.role} onChange={e => set("role", e.target.value)} />
            </div>
          </div>

          <div className="jm-row2">
            <div className="jm-field">
              <label className="jm-label">Location</label>
              <input className="jm-input" placeholder="Remote / NYC" value={form.location} onChange={e => set("location", e.target.value)} />
            </div>
            <div className="jm-field">
              <label className="jm-label">Salary Range</label>
              <input className="jm-input" placeholder="₹12–18 LPA" value={form.salary} onChange={e => set("salary", e.target.value)} />
            </div>
          </div>

          <div className="jm-row2">
            <div className="jm-field">
              <label className="jm-label">Applied Date</label>
              <input className="jm-input" type="date" value={form.applied} onChange={e => set("applied", e.target.value)} style={{ colorScheme: "dark" }} />
            </div>
            <div className="jm-field">
              <label className="jm-label">Priority</label>
              <div style={{ display: "flex", gap: 6 }}>
                {PRIORITIES.map(p => (
                  <button key={p} onClick={() => set("priority", p)} style={{ flex: 1, padding: "8px 4px", borderRadius: 8, border: `1px solid ${form.priority === p ? PRIORITY_COLORS[p] : "rgba(255,255,255,0.08)"}`, background: form.priority === p ? `${PRIORITY_COLORS[p]}20` : "rgba(255,255,255,0.03)", color: form.priority === p ? PRIORITY_COLORS[p] : "#475569", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="jm-field">
            <label className="jm-label">Job URL</label>
            <input className="jm-input" placeholder="https://careers.company.com/..." value={form.url} onChange={e => set("url", e.target.value)} />
          </div>

          <div className="jm-field">
            <label className="jm-label">Notes</label>
            <textarea className={`jm-input jm-textarea`} placeholder="Recruiter name, interview round, follow-up needed..." value={form.notes} onChange={e => set("notes", e.target.value)} />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            {job.id ? (
              <button onClick={() => onDelete(job.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(248,113,113,0.2)", background: "rgba(248,113,113,0.06)", color: "#f87171", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                <Trash2 size={12} /> Delete
              </button>
            ) : <div />}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={onClose} style={{ padding: "9px 16px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#64748b", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                Cancel
              </button>
              <button
                onClick={() => { if (!form.company.trim() || !form.role.trim()) return; onSave(form); }}
                style={{ padding: "9px 20px", borderRadius: 9, border: "none", background: "linear-gradient(135deg, #818cf8, #a78bfa)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(129,140,248,0.3)" }}
              >
                <Check size={13} style={{ marginRight: 5, verticalAlign: "middle" }} />
                {job.id ? "Save Changes" : "Add Application"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── JOB CARD ──────────────────────────────────────────────────────────────

function JobCard({ job, colColor, onEdit, onMove, columns }) {
  const [dragging, setDragging] = useState(false);
  const daysAgo = job.applied
    ? Math.floor((Date.now() - new Date(job.applied)) / 86400000)
    : null;

  return (
    <div
      draggable
      onDragStart={e => { e.dataTransfer.setData("jobId", job.id); setDragging(true); }}
      onDragEnd={() => setDragging(false)}
      onClick={() => onEdit(job)}
      style={{
        background: dragging ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${dragging ? colColor + "60" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 14,
        padding: "14px 16px",
        cursor: "pointer",
        transition: "all 0.18s",
        opacity: dragging ? 0.4 : 1,
        transform: dragging ? "rotate(2deg) scale(0.97)" : "none",
        marginBottom: 8,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = colColor + "50"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.2)`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${colColor}, transparent)`, borderRadius: "14px 14px 0 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.company}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.role}</div>
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {job.starred && <Star size={12} color="#fbbf24" fill="#fbbf24" />}
          {job.url && (
            <a href={job.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ color: "#475569", display: "flex" }}>
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
        {job.location && (
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#475569", background: "rgba(255,255,255,0.04)", padding: "2px 7px", borderRadius: 5 }}>
            <MapPin size={9} /> {job.location}
          </span>
        )}
        {job.salary && (
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#475569", background: "rgba(255,255,255,0.04)", padding: "2px 7px", borderRadius: 5 }}>
            <DollarSign size={9} /> {job.salary}
          </span>
        )}
        {daysAgo !== null && (
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#475569", background: "rgba(255,255,255,0.04)", padding: "2px 7px", borderRadius: 5 }}>
            <Clock size={9} /> {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
          </span>
        )}
      </div>

      {job.priority !== "Low" && (
        <div style={{ marginTop: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: PRIORITY_COLORS[job.priority], background: `${PRIORITY_COLORS[job.priority]}15`, padding: "2px 7px", borderRadius: 5 }}>
            {job.priority} Priority
          </span>
        </div>
      )}

      {job.notes && (
        <div style={{ marginTop: 8, fontSize: 11, color: "#334155", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {job.notes}
        </div>
      )}
    </div>
  );
}

// ── STATS BAR ─────────────────────────────────────────────────────────────

function StatsBar({ jobs }) {
  const total = jobs.length;
  const byStatus = Object.fromEntries(COLUMNS.map(c => [c.id, jobs.filter(j => j.status === c.id).length]));
  const responseRate = total > 0
    ? Math.round(((byStatus.interview || 0) + (byStatus.offer || 0)) / Math.max(byStatus.applied || 1, 1) * 100)
    : 0;

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
      {[
        { label: "Total", value: total, icon: Briefcase, color: "#818cf8" },
        { label: "Applied", value: byStatus.applied || 0, icon: TrendingUp, color: "#818cf8" },
        { label: "Interviews", value: byStatus.interview || 0, icon: Calendar, color: "#fb923c" },
        { label: "Offers", value: byStatus.offer || 0, icon: Star, color: "#34d399" },
        { label: "Response %", value: `${responseRate}%`, icon: BarChart2, color: "#a78bfa" },
      ].map(({ label, value, icon: Icon, color }) => (
        <div key={label} style={{ flex: "1 1 100px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}15`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon size={14} color={color} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", fontFamily: "Syne, sans-serif", lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 10, color: "#475569", marginTop: 2, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────

export default function JobTracker() {
  const [jobs, setJobs] = useState(loadJobs);
  const [modal, setModal] = useState(null); // null | { job, isNew }
  const [dragOver, setDragOver] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "starred"
  const [search, setSearch] = useState("");

  useEffect(() => { saveJobs(jobs); }, [jobs]);

  const saveJob = (form) => {
    setJobs(prev => {
      const exists = prev.find(j => j.id === form.id);
      return exists ? prev.map(j => j.id === form.id ? form : j) : [...prev, form];
    });
    setModal(null);
  };

  const deleteJob = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    setModal(null);
  };

  const moveJob = (jobId, newStatus) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
  };

  const onDrop = (e, colId) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData("jobId");
    if (jobId) moveJob(jobId, colId);
    setDragOver(null);
  };

  const filtered = jobs.filter(j => {
    if (filter === "starred" && !j.starred) return false;
    if (search && !`${j.company} ${j.role}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .jt-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .jt-root { padding: 4px 0 40px; font-family: 'DM Sans', sans-serif; }
        .jt-search { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 9px 13px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #e2e8f0; outline: none; width: 200px; transition: all 0.18s; }
        .jt-search::placeholder { color: #334155; }
        .jt-search:focus { border-color: rgba(129,140,248,0.4); width: 260px; }
        .jt-col { flex: 1; min-width: 220px; max-width: 280px; display: flex; flex-direction: column; }
        .jt-col-body { flex: 1; min-height: 120px; border-radius: 12px; padding: 8px; transition: background 0.15s; }
        .jt-col-body.drag-over { background: rgba(129,140,248,0.06); outline: 2px dashed rgba(129,140,248,0.3); outline-offset: -2px; }
        .jt-add-col { display: flex; align-items: center; gap: 5px; width: 100%; padding: 9px; border-radius: 10px; border: 1px dashed rgba(255,255,255,0.08); background: none; color: #334155; font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer; justify-content: center; transition: all 0.15s; margin-top: 4px; }
        .jt-add-col:hover { border-color: rgba(129,140,248,0.3); color: #818cf8; background: rgba(129,140,248,0.04); }
        @keyframes jt-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .jt-root { animation: jt-fadein 0.35s ease; }
      `}</style>

      <div className="jt-root">

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(163,230,53,0.12)", border: "1px solid rgba(163,230,53,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Briefcase size={17} color="#a3e635" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}>Job Tracker</div>
              <div style={{ fontSize: 12, color: "#475569" }}>{jobs.length} application{jobs.length !== 1 ? "s" : ""} tracked</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <input
              className="jt-search"
              placeholder="Search company or role…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 9, padding: 3, border: "1px solid rgba(255,255,255,0.07)" }}>
              {[["all", "All"], ["starred", "⭐ Starred"]].map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => setFilter(val)}
                  style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: filter === val ? "rgba(255,255,255,0.08)" : "none", color: filter === val ? "#e2e8f0" : "#475569", fontFamily: "inherit", fontSize: 12, fontWeight: 500, cursor: "pointer" }}
                >
                  {lbl}
                </button>
              ))}
            </div>

            <button
              onClick={() => setModal({ job: newJob(), isNew: true })}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, border: "none", background: "linear-gradient(135deg, #818cf8, #a78bfa)", color: "white", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(129,140,248,0.3)", whiteSpace: "nowrap" }}
            >
              <Plus size={14} /> Add Job
            </button>
          </div>
        </div>

        {/* Stats */}
        <StatsBar jobs={jobs} />

        {/* Kanban board */}
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12, alignItems: "flex-start" }}>
          {COLUMNS.map(col => {
            const colJobs = filtered.filter(j => j.status === col.id);
            return (
              <div key={col.id} className="jt-col">

                {/* Column header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "0 4px" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.dot, boxShadow: `0 0 8px ${col.dot}` }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: col.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>{col.label}</span>
                  <span style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: 6, background: `${col.color}20`, border: `1px solid ${col.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: col.color }}>
                    {colJobs.length}
                  </span>
                </div>

                {/* Drop zone */}
                <div
                  className={`jt-col-body${dragOver === col.id ? " drag-over" : ""}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={e => onDrop(e, col.id)}
                >
                  {colJobs.length === 0 && (
                    <div style={{ padding: "24px 12px", textAlign: "center", color: "#2d3748", fontSize: 12 }}>
                      Drop cards here
                    </div>
                  )}
                  {colJobs.map(job => (
                    <JobCard
                      key={job.id}
                      job={job}
                      colColor={col.color}
                      onEdit={j => setModal({ job: j, isNew: false })}
                      onMove={moveJob}
                      columns={COLUMNS}
                    />
                  ))}
                </div>

                {/* Add to this column */}
                <button
                  className="jt-add-col"
                  onClick={() => setModal({ job: newJob({ status: col.id }), isNew: true })}
                >
                  <Plus size={11} /> Add
                </button>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {jobs.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 24px", color: "#334155" }}>
            <Briefcase size={40} color="#1e293b" style={{ margin: "0 auto 16px" }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: "#475569", marginBottom: 8 }}>No applications yet</div>
            <div style={{ fontSize: 13, marginBottom: 20 }}>Start tracking your job search — add your first application</div>
            <button
              onClick={() => setModal({ job: newJob(), isNew: true })}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #818cf8, #a78bfa)", color: "white", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              <Plus size={14} /> Add First Application
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <JobModal
          job={modal.job}
          onSave={saveJob}
          onClose={() => setModal(null)}
          onDelete={deleteJob}
        />
      )}
    </>
  );
}