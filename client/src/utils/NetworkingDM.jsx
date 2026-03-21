import { useState } from "react";
import { Linkedin, Sparkles, Copy, RefreshCw, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import { callAI } from "./aiHelper";

const GOALS = [
  { id: "job",       label: "Job Opportunity",    emoji: "💼" },
  { id: "advice",    label: "Career Advice",       emoji: "🧭" },
  { id: "referral",  label: "Referral Request",    emoji: "🤝" },
  { id: "collab",    label: "Collaboration",       emoji: "⚡" },
  { id: "mentor",    label: "Find a Mentor",       emoji: "🎓" },
  { id: "network",   label: "Just Networking",     emoji: "🌐" },
];

const TONES = ["Warm & Genuine", "Professional", "Bold & Direct", "Curious"];
const LENGTHS = ["Short (under 60 words)", "Medium (60–100 words)", "Long (100–150 words)"];

export default function NetworkingDM({ analysis }) {
  const [goal, setGoal]             = useState("job");
  const [tone, setTone]             = useState("Warm & Genuine");
  const [length, setLength]         = useState("Short (under 60 words)");
  const [recipientName, setRecipientName] = useState("");
  const [recipientRole, setRecipientRole] = useState("");
  const [company, setCompany]       = useState("");
  const [context, setContext]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState(null);
  const [error, setError]           = useState("");
  const [copied, setCopied]         = useState(false);
  const [copiedAlt, setCopiedAlt]   = useState(null);
  const [showAlts, setShowAlts]     = useState(false);

  const senderName    = analysis?.candidate?.name || "the sender";
  const senderRole    = analysis?.experience?.[0]?.role || "";
  const senderCompany = analysis?.experience?.[0]?.company || "";
  const skills        = analysis?.skills ? Object.values(analysis.skills).flat().slice(0, 6).join(", ") : "";
  const strengths     = analysis?.strengths?.slice(0, 2).join("; ") || "";

  const goalLabel = GOALS.find(g => g.id === goal)?.label || goal;

  const generate = async () => {
    if (!recipientRole.trim() && !company.trim()) {
      setError("Please enter at least a recipient role or company.");
      return;
    }
    setError(""); setLoading(true); setResult(null);

    const prompt = `You are a world-class LinkedIn connection message writer. Write a LinkedIn DM that sounds like a real human wrote it — not a template.

Sender: ${senderName}${senderRole ? `, ${senderRole}` : ""}${senderCompany ? ` at ${senderCompany}` : ""}
${skills ? `Skills: ${skills}` : ""}
${strengths ? `Strengths: ${strengths}` : ""}

Recipient: ${recipientName ? recipientName : "a professional"}${recipientRole ? `, ${recipientRole}` : ""}${company ? ` at ${company}` : ""}

Goal: ${goalLabel}
Tone: ${tone}
Length: ${length}
${context ? `Extra context: ${context}` : ""}

Rules:
- NO generic openers like "I hope this message finds you well" or "I came across your profile"
- Start with something specific and human — a genuine observation, shared interest, or direct ask
- Sound like a real person, not a bot
- One clear, low-friction CTA at the end
- DO NOT mention you're using AI
- Write 3 variations so the user can pick the best one

Return ONLY valid JSON. No markdown, no explanation, no backticks.
{
  "messages": [
    { "label": "Version A", "text": "the full DM text" },
    { "label": "Version B", "text": "the full DM text" },
    { "label": "Version C", "text": "the full DM text" }
  ],
  "tip": "One specific tip to increase acceptance/reply rate for this exact outreach"
}`;

    try {
      const raw = await callAI(prompt, 900);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean.slice(clean.indexOf("{"), clean.lastIndexOf("}") + 1));
      setResult(parsed);
      setShowAlts(false);
    } catch (e) {
      setError("Generation failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyMain = () => {
    navigator.clipboard.writeText(result.messages[0].text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAlt = (i) => {
    navigator.clipboard.writeText(result.messages[i].text);
    setCopiedAlt(i);
    setTimeout(() => setCopiedAlt(null), 2000);
  };

  return (
    <>
      <style>{`
        @keyframes ndm-spin { to { transform: rotate(360deg); } }
        @keyframes ndm-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .ndm-root { padding: 4px 0 32px; }

        /* ── Form card ── */
        .ndm-form {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .ndm-section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 12px;
        }

        /* Goal pills */
        .ndm-goals {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 24px;
        }
        .ndm-goal-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          color: #64748b;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .ndm-goal-btn:hover { border-color: rgba(255,255,255,0.15); color: #e2e8f0; }
        .ndm-goal-btn.active {
          border-color: var(--goal-color, #a78bfa);
          background: var(--goal-bg, rgba(167,139,250,0.1));
          color: var(--goal-color, #a78bfa);
        }
        .ndm-goal-emoji { font-size: 14px; line-height: 1; }

        /* Grid fields */
        .ndm-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .ndm-grid-1 { margin-bottom: 14px; }

        .ndm-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 7px;
        }
        .ndm-opt { font-weight: 400; text-transform: none; letter-spacing: 0; color: #334155; }

        .ndm-input, .ndm-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #e2e8f0;
          outline: none;
          transition: border-color 0.18s, background 0.18s;
          box-sizing: border-box;
        }
        .ndm-input::placeholder, .ndm-textarea::placeholder { color: #334155; }
        .ndm-input:focus, .ndm-textarea:focus {
          border-color: rgba(167,139,250,0.4);
          background: rgba(167,139,250,0.05);
        }
        .ndm-textarea { resize: vertical; min-height: 72px; line-height: 1.6; }

        /* Tone + length chips */
        .ndm-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 20px; }
        .ndm-chip {
          padding: 6px 13px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: #64748b;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .ndm-chip:hover { border-color: rgba(255,255,255,0.2); color: #cbd5e1; }
        .ndm-chip.active {
          background: rgba(167,139,250,0.15);
          border-color: rgba(167,139,250,0.5);
          color: #a78bfa;
        }

        /* Error */
        .ndm-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          color: #fca5a5;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          margin-bottom: 14px;
        }

        /* Generate button */
        .ndm-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 14px;
          background: linear-gradient(135deg, #0077b5 0%, #005885 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(0,119,181,0.3);
          position: relative;
          overflow: hidden;
        }
        .ndm-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
        }
        .ndm-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(0,119,181,0.4);
        }
        .ndm-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .ndm-spinner {
          width: 15px; height: 15px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          animation: ndm-spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        /* ── Output ── */
        .ndm-output { animation: ndm-fadein 0.4s ease; }

        .ndm-tip {
          display: flex;
          gap: 10px;
          background: rgba(0,119,181,0.08);
          border: 1px solid rgba(0,119,181,0.2);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 13px;
          color: #93c5fd;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .ndm-tip-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }

        /* Main message card */
        .ndm-main-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 18px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .ndm-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }

        .ndm-version-badge {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ndm-version-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0077b5, #38bdf8);
        }
        .ndm-version-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #475569;
        }

        .ndm-actions { display: flex; gap: 8px; }

        .ndm-action-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: #64748b;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .ndm-action-btn:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }
        .ndm-action-btn.primary {
          background: rgba(0,119,181,0.15);
          border-color: rgba(0,119,181,0.3);
          color: #38bdf8;
        }
        .ndm-action-btn.primary:hover { background: rgba(0,119,181,0.25); }
        .ndm-action-btn.success { color: #34d399; border-color: rgba(52,211,153,0.3); background: rgba(52,211,153,0.08); }

        .ndm-msg-body {
          padding: 20px 18px;
          font-size: 14px;
          line-height: 1.85;
          color: #cbd5e1;
          white-space: pre-wrap;
          font-family: 'DM Sans', sans-serif;
        }

        .ndm-word-count {
          padding: 0 18px 14px;
          font-size: 11px;
          color: #334155;
          font-family: 'Geist Mono', monospace;
        }

        /* Alt versions accordion */
        .ndm-alts-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 12px 18px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          color: #475569;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          margin-bottom: 8px;
        }
        .ndm-alts-toggle:hover { background: rgba(255,255,255,0.05); color: #94a3b8; }
        .ndm-chevron { margin-left: auto; transition: transform 0.2s; }
        .ndm-chevron.open { transform: rotate(180deg); }

        .ndm-alt-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          margin-bottom: 8px;
          overflow: hidden;
          animation: ndm-fadein 0.3s ease;
        }
        .ndm-alt-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ndm-alt-label { font-size: 11px; font-weight: 600; color: #475569; letter-spacing: 0.08em; text-transform: uppercase; }
        .ndm-alt-body { padding: 14px 16px; font-size: 13px; line-height: 1.8; color: #94a3b8; white-space: pre-wrap; }

        @media (max-width: 600px) {
          .ndm-goals { grid-template-columns: repeat(2, 1fr); }
          .ndm-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ndm-root">

        {/* ── Form ── */}
        <div className="ndm-form">

          {/* Goal selector */}
          <div className="ndm-section-label">What's your goal?</div>
          <div className="ndm-goals">
            {GOALS.map(({ id, label, emoji }) => {
              const colors = {
                job:     ['#a78bfa', 'rgba(167,139,250,0.1)'],
                advice:  ['#38bdf8', 'rgba(56,189,248,0.1)'],
                referral:['#34d399', 'rgba(52,211,153,0.1)'],
                collab:  ['#fb923c', 'rgba(251,146,60,0.1)'],
                mentor:  ['#f472b6', 'rgba(244,114,182,0.1)'],
                network: ['#818cf8', 'rgba(129,140,248,0.1)'],
              };
              const [c, bg] = colors[id] || ['#a78bfa', 'rgba(167,139,250,0.1)'];
              return (
                <button
                  key={id}
                  className={`ndm-goal-btn${goal === id ? ' active' : ''}`}
                  style={{ '--goal-color': c, '--goal-bg': bg }}
                  onClick={() => setGoal(id)}
                >
                  <span className="ndm-goal-emoji">{emoji}</span>
                  {label}
                </button>
              );
            })}
          </div>

          {/* Recipient fields */}
          <div className="ndm-section-label">Who are you messaging?</div>
          <div className="ndm-grid-2">
            <div>
              <label className="ndm-label">
                Their Name <span className="ndm-opt">(optional)</span>
              </label>
              <input
                className="ndm-input"
                placeholder="e.g. Priya Sharma"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
              />
            </div>
            <div>
              <label className="ndm-label">Their Role *</label>
              <input
                className="ndm-input"
                placeholder="e.g. Engineering Manager"
                value={recipientRole}
                onChange={e => setRecipientRole(e.target.value)}
              />
            </div>
          </div>

          <div className="ndm-grid-1">
            <label className="ndm-label">Their Company *</label>
            <input
              className="ndm-input"
              placeholder="e.g. Google, Zepto, a startup…"
              value={company}
              onChange={e => setCompany(e.target.value)}
            />
          </div>

          <div className="ndm-grid-1">
            <label className="ndm-label">
              Context / Hook <span className="ndm-opt">(optional — makes it 10x better)</span>
            </label>
            <textarea
              className="ndm-textarea"
              placeholder='e.g. "Loved your talk at JSConf" · "We share a mutual connection in Rahul" · "Saw your post about scaling infra"'
              value={context}
              onChange={e => setContext(e.target.value)}
              rows={3}
            />
          </div>

          {/* Tone */}
          <div className="ndm-section-label">Tone</div>
          <div className="ndm-chips" style={{ marginBottom: 16 }}>
            {TONES.map(t => (
              <button
                key={t}
                className={`ndm-chip${tone === t ? ' active' : ''}`}
                onClick={() => setTone(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Length */}
          <div className="ndm-section-label">Message length</div>
          <div className="ndm-chips">
            {LENGTHS.map(l => (
              <button
                key={l}
                className={`ndm-chip${length === l ? ' active' : ''}`}
                onClick={() => setLength(l)}
              >
                {l}
              </button>
            ))}
          </div>

          {error && (
            <div className="ndm-error">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button className="ndm-btn" onClick={generate} disabled={loading}>
            {loading
              ? <><span className="ndm-spinner" /> Crafting your message…</>
              : <><Linkedin size={15} /> Generate LinkedIn DM</>
            }
          </button>
        </div>

        {/* ── Output ── */}
        {result && !loading && (
          <div className="ndm-output">

            {result.tip && (
              <div className="ndm-tip">
                <span className="ndm-tip-icon">💡</span>
                <span><strong style={{ color: '#7dd3fc' }}>Pro tip:</strong> {result.tip}</span>
              </div>
            )}

            {/* Best version */}
            <div className="ndm-main-card">
              <div className="ndm-card-header">
                <div className="ndm-version-badge">
                  <div className="ndm-version-dot" />
                  <span className="ndm-version-label">Best Version</span>
                </div>
                <div className="ndm-actions">
                  <button className="ndm-action-btn" onClick={generate}>
                    <RefreshCw size={11} /> Regenerate
                  </button>
                  <button
                    className={`ndm-action-btn primary${copied ? ' success' : ''}`}
                    onClick={copyMain}
                  >
                    {copied
                      ? <><CheckCircle size={11} /> Copied!</>
                      : <><Copy size={11} /> Copy DM</>
                    }
                  </button>
                </div>
              </div>
              <div className="ndm-msg-body">{result.messages[0].text}</div>
              <div className="ndm-word-count">
                {result.messages[0].text.trim().split(/\s+/).length} words
              </div>
            </div>

            {/* Alt versions */}
            {result.messages.length > 1 && (
              <>
                <button
                  className="ndm-alts-toggle"
                  onClick={() => setShowAlts(v => !v)}
                >
                  <Sparkles size={13} />
                  {showAlts ? 'Hide' : 'Show'} {result.messages.length - 1} alternative versions
                  <ChevronDown size={13} className={`ndm-chevron${showAlts ? ' open' : ''}`} />
                </button>

                {showAlts && result.messages.slice(1).map((msg, i) => (
                  <div className="ndm-alt-card" key={i}>
                    <div className="ndm-alt-header">
                      <span className="ndm-alt-label">{msg.label}</span>
                      <button
                        className={`ndm-action-btn${copiedAlt === i + 1 ? ' success' : ''}`}
                        onClick={() => copyAlt(i + 1)}
                      >
                        {copiedAlt === i + 1
                          ? <><CheckCircle size={11} /> Copied</>
                          : <><Copy size={11} /> Copy</>
                        }
                      </button>
                    </div>
                    <div className="ndm-alt-body">{msg.text}</div>
                  </div>
                ))}
              </>
            )}

          </div>
        )}
      </div>
    </>
  );
}