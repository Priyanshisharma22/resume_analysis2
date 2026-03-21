import { useState } from "react";
import { Award, Sparkles, Copy, RefreshCw, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import { callAI } from "./aiHelper";

const RELATIONSHIPS = ["Manager", "Senior Colleague", "Mentor", "Professor", "Client", "Team Lead", "Skip-level Manager"];
const PURPOSES = ["Job Application", "Graduate School", "Scholarship", "Promotion", "Visa / Immigration", "General Reference"];
const TONES = ["Warm & Personal", "Formal & Professional", "Enthusiastic", "Academic"];
const OUTPUT_TYPES = [
  { id: "request",  label: "Request Email",    desc: "Ask someone to write you a reference" },
  { id: "draft",    label: "Draft Letter",     desc: "Full reference letter they can use/edit" },
  { id: "both",     label: "Both",             desc: "Request email + full draft attached" },
];

export default function ReferenceLetter({ analysis }) {
  const [outputType, setOutputType]         = useState("both");
  const [refereeName, setRefereeName]       = useState("");
  const [refereeTitle, setRefereeTitle]     = useState("");
  const [relationship, setRelationship]     = useState("Manager");
  const [duration, setDuration]             = useState("");
  const [purpose, setPurpose]               = useState("Job Application");
  const [targetRole, setTargetRole]         = useState("");
  const [targetCompany, setTargetCompany]   = useState("");
  const [tone, setTone]                     = useState("Warm & Personal");
  const [achievements, setAchievements]     = useState("");
  const [qualities, setQualities]           = useState("");
  const [loading, setLoading]               = useState(false);
  const [result, setResult]                 = useState(null);
  const [error, setError]                   = useState("");
  const [copied, setCopied]                 = useState({});
  const [showDraft, setShowDraft]           = useState(false);

  const candidateName  = analysis?.candidate?.name  || "the candidate";
  const recentRole     = analysis?.experience?.[0]?.role    || "";
  const recentCompany  = analysis?.experience?.[0]?.company || "";
  const skills         = analysis?.skills
    ? Object.values(analysis.skills).flat().slice(0, 8).join(", ")
    : "";
  const strengths      = analysis?.strengths?.slice(0, 3).join(", ") || "";

  const generate = async () => {
    if (!refereeName.trim()) { setError("Please enter the referee's name."); return; }
    setError(""); setLoading(true); setResult(null);

    const sharedContext = `
Candidate: ${candidateName}
Current/Recent Role: ${recentRole}${recentCompany ? ` at ${recentCompany}` : ""}
Key Skills: ${skills || "not provided"}
Strengths: ${strengths || "not provided"}
Specific achievements to highlight: ${achievements || "not provided"}
Key qualities: ${qualities || "not provided"}

Referee: ${refereeName}${refereeTitle ? `, ${refereeTitle}` : ""}
Relationship: ${relationship} (worked together ${duration || "for some time"})
Purpose: ${purpose}
${targetRole ? `Target Role: ${targetRole}` : ""}
${targetCompany ? `Target Company/Institution: ${targetCompany}` : ""}
Tone: ${tone}`;

    const requestPrompt = `You are an expert career coach. Write a polished, personal email from ${candidateName} to ${refereeName} asking them to write a reference letter.

${sharedContext}

Rules for the REQUEST EMAIL:
- Open warmly — reference a specific shared memory or project
- Explain exactly what the reference is for (${purpose}${targetRole ? ` — ${targetRole}` : ""})
- Give them an easy out ("completely understand if you're too busy")
- Offer to send a draft they can edit (if outputType includes draft)
- Keep it under 180 words
- Sound genuine, not transactional
- Give a soft deadline if possible

Return ONLY valid JSON, no markdown:
{
  "requestSubject": "email subject line",
  "requestBody": "full email body",
  "tip": "one specific tip to increase the chance they say yes"
}`;

    const draftPrompt = `You are a senior professional writing a glowing reference letter on behalf of ${refereeName} for ${candidateName}.

${sharedContext}

Rules for the REFERENCE LETTER:
- Format: formal letter with [Date], [Referee Address], [Recipient/To Whom It May Concern]
- Opening: state relationship and duration immediately, set strong positive tone
- Body paragraph 1: concrete example of a project or achievement that shows their impact
- Body paragraph 2: 2-3 specific qualities with brief evidence
- Body paragraph 3: endorsement tied to the specific purpose (${purpose}${targetRole ? ` for ${targetRole}` : ""})
- Closing: strong unambiguous recommendation + referee contact offer
- Length: 300–400 words
- Tone: ${tone}
- Write in FIRST PERSON as ${refereeName}

Return ONLY valid JSON, no markdown:
{
  "letterBody": "the complete reference letter text",
  "strengthsHighlighted": ["strength 1", "strength 2", "strength 3"],
  "editSuggestion": "one thing the referee should personalise before sending"
}`;

    const bothPrompt = `You are an expert career coach. Generate BOTH a request email AND a full reference letter draft.

${sharedContext}

REQUEST EMAIL rules:
- From ${candidateName} to ${refereeName}
- Warm, specific, under 180 words
- Reference a shared memory
- Mention you're attaching a draft they can edit
- Give them an easy out

REFERENCE LETTER rules (written as ${refereeName}):
- Formal format, 300–400 words, tone: ${tone}
- Concrete achievement in body paragraph 1
- 2-3 specific qualities with evidence in paragraph 2
- Strong closing endorsement for ${purpose}${targetRole ? ` — ${targetRole}` : ""}

Return ONLY valid JSON, no markdown:
{
  "requestSubject": "email subject",
  "requestBody": "full request email",
  "letterBody": "full reference letter",
  "strengthsHighlighted": ["strength 1", "strength 2", "strength 3"],
  "tip": "one tip to make the request more likely to succeed",
  "editSuggestion": "one thing to personalise in the draft before sending"
}`;

    const promptMap = { request: requestPrompt, draft: draftPrompt, both: bothPrompt };

    try {
      const raw   = await callAI(promptMap[outputType], 1000);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean.slice(clean.indexOf("{"), clean.lastIndexOf("}") + 1));
      setResult(parsed);
      setShowDraft(false);
    } catch (e) {
      setError("Generation failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000);
  };

  const CopyBtn = ({ k, text, primary }) => (
    <button
      onClick={() => copy(k, text)}
      style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 7, border: `1px solid ${primary ? "transparent" : "rgba(255,255,255,0.1)"}`, background: primary ? "linear-gradient(135deg,#a78bfa,#818cf8)" : "rgba(255,255,255,0.04)", color: copied[k] ? "#34d399" : primary ? "white" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
    >
      {copied[k] ? <><CheckCircle size={11} /> Copied!</> : <><Copy size={11} /> {primary ? "Copy" : "Copy"}</>}
    </button>
  );

  return (
    <>
      <style>{`
        @keyframes rl-spin { to { transform: rotate(360deg); } }
        @keyframes rl-in   { from { opacity:0; transform:translateY(8px);} to { opacity:1; transform:translateY(0);} }

        .rl-root { padding: 4px 0 36px; }

        .rl-type-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 22px; }
        .rl-type-btn {
          padding: 12px 10px; border-radius: 13px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          cursor: pointer; text-align: left;
          transition: all 0.15s; font-family: 'DM Sans', sans-serif;
        }
        .rl-type-btn:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); }
        .rl-type-btn.active {
          border-color: rgba(167,139,250,0.5);
          background: rgba(167,139,250,0.1);
        }
        .rl-type-label { font-size: 13px; font-weight: 700; color: #e2e8f0; margin-bottom: 3px; }
        .rl-type-btn.active .rl-type-label { color: #a78bfa; }
        .rl-type-desc  { font-size: 11px; color: #475569; line-height: 1.4; }

        .rl-form { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 22px; margin-bottom: 18px; }
        .rl-section-label { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #475569; margin-bottom: 12px; }
        .rl-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
        .rl-field { margin-bottom: 14px; }
        .rl-label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: #475569; margin-bottom: 6px; }
        .rl-opt   { font-weight: 400; text-transform: none; letter-spacing: 0; color: #334155; }
        .rl-input, .rl-textarea {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;
          padding: 10px 13px; font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: #e2e8f0; outline: none;
          transition: border-color 0.18s, background 0.18s; box-sizing: border-box;
        }
        .rl-input::placeholder, .rl-textarea::placeholder { color: #334155; }
        .rl-input:focus, .rl-textarea:focus { border-color: rgba(167,139,250,0.45); background: rgba(167,139,250,0.05); }
        .rl-textarea { resize: vertical; min-height: 72px; line-height: 1.6; }

        .rl-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 18px; }
        .rl-chip {
          padding: 6px 13px; border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03); color: #64748b;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          cursor: pointer; transition: all 0.15s;
        }
        .rl-chip:hover  { border-color: rgba(255,255,255,0.2); color: #cbd5e1; }
        .rl-chip.active { background: rgba(167,139,250,0.15); border-color: rgba(167,139,250,0.5); color: #a78bfa; }

        .rl-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 0; }

        .rl-error { display: flex; align-items: center; gap: 8px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); color: #fca5a5; border-radius: 10px; padding: 10px 14px; font-size: 13px; margin-bottom: 14px; }

        .rl-btn {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 9px;
          padding: 14px; background: linear-gradient(135deg, #a78bfa 0%, #818cf8 100%);
          color: white; border: none; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(167,139,250,0.3);
          position: relative; overflow: hidden;
        }
        .rl-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%); }
        .rl-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(167,139,250,0.4); }
        .rl-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .rl-spinner { width: 15px; height: 15px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; animation: rl-spin 0.7s linear infinite; flex-shrink: 0; }

        /* Output */
        .rl-output { animation: rl-in 0.35s ease; }

        .rl-tip { display: flex; gap: 10px; background: rgba(167,139,250,0.08); border: 1px solid rgba(167,139,250,0.2); border-radius: 12px; padding: 14px 16px; font-size: 13px; color: #c4b5fd; line-height: 1.6; margin-bottom: 16px; }
        .rl-tip-icon { font-size: 15px; flex-shrink: 0; margin-top: 1px; }

        .rl-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; margin-bottom: 14px; }
        .rl-card-header { display: flex; justify-content: space-between; align-items: center; padding: 13px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); }
        .rl-card-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #475569; }
        .rl-card-body { padding: 18px; font-size: 14px; line-height: 1.85; color: #cbd5e1; white-space: pre-wrap; font-family: 'DM Sans', sans-serif; }

        .rl-subject { font-size: 15px; font-weight: 700; color: #f1f5f9; padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); }

        .rl-strengths { display: flex; flex-wrap: wrap; gap: 7px; padding: 14px 18px; border-top: 1px solid rgba(255,255,255,0.06); }
        .rl-strength-tag { padding: 4px 12px; border-radius: 7px; background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2); color: #34d399; font-size: 11px; font-weight: 600; }

        .rl-edit-note { display: flex; gap: 8px; padding: 12px 18px; background: rgba(251,146,60,0.06); border-top: 1px solid rgba(251,146,60,0.15); font-size: 12px; color: #fb923c; line-height: 1.5; }

        .rl-accordion-btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 12px 18px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; color: #475569; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; margin-bottom: 8px; }
        .rl-accordion-btn:hover { background: rgba(255,255,255,0.05); color: #94a3b8; }
        .rl-chevron { transition: transform 0.2s; }
        .rl-chevron.open { transform: rotate(180deg); }

        @media (max-width: 600px) {
          .rl-type-grid { grid-template-columns: 1fr; }
          .rl-grid2     { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="rl-root">

        {/* Output type selector */}
        <div className="rl-section-label" style={{ marginBottom: 10 }}>What do you need?</div>
        <div className="rl-type-grid">
          {OUTPUT_TYPES.map(ot => (
            <button
              key={ot.id}
              className={`rl-type-btn${outputType === ot.id ? " active" : ""}`}
              onClick={() => setOutputType(ot.id)}
            >
              <div className="rl-type-label">{ot.label}</div>
              <div className="rl-type-desc">{ot.desc}</div>
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="rl-form">

          {/* Referee */}
          <div className="rl-section-label">Referee Details</div>
          <div className="rl-grid2">
            <div className="rl-field">
              <label className="rl-label">Their Name *</label>
              <input className="rl-input" placeholder="e.g. Dr. Anjali Mehta" value={refereeName} onChange={e => setRefereeName(e.target.value)} />
            </div>
            <div className="rl-field">
              <label className="rl-label">Their Title <span className="rl-opt">(optional)</span></label>
              <input className="rl-input" placeholder="e.g. VP Engineering" value={refereeTitle} onChange={e => setRefereeTitle(e.target.value)} />
            </div>
          </div>

          <div className="rl-grid2">
            <div className="rl-field">
              <label className="rl-label">Your Relationship</label>
              <div className="rl-chips" style={{ marginBottom: 0 }}>
                {RELATIONSHIPS.map(r => (
                  <button key={r} className={`rl-chip${relationship === r ? " active" : ""}`} onClick={() => setRelationship(r)}>{r}</button>
                ))}
              </div>
            </div>
            <div className="rl-field">
              <label className="rl-label">How long did you work together?</label>
              <input className="rl-input" placeholder="e.g. 2 years, 6 months…" value={duration} onChange={e => setDuration(e.target.value)} />
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "6px 0 18px" }} />

          {/* Purpose */}
          <div className="rl-section-label">Purpose</div>
          <div className="rl-chips">
            {PURPOSES.map(p => (
              <button key={p} className={`rl-chip${purpose === p ? " active" : ""}`} onClick={() => setPurpose(p)}>{p}</button>
            ))}
          </div>

          <div className="rl-grid2">
            <div className="rl-field">
              <label className="rl-label">Target Role <span className="rl-opt">(optional)</span></label>
              <input className="rl-input" placeholder="e.g. Senior Product Manager" value={targetRole} onChange={e => setTargetRole(e.target.value)} />
            </div>
            <div className="rl-field">
              <label className="rl-label">Company / Institution <span className="rl-opt">(optional)</span></label>
              <input className="rl-input" placeholder="e.g. Meta, MIT, McKinsey" value={targetCompany} onChange={e => setTargetCompany(e.target.value)} />
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "6px 0 18px" }} />

          {/* Content hints */}
          <div className="rl-section-label">What to highlight <span style={{ color: "#334155", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(makes the letter 10× stronger)</span></div>
          <div className="rl-field">
            <label className="rl-label">Specific achievements / projects</label>
            <textarea className="rl-textarea" rows={2} placeholder='e.g. "Led the migration that cut load time by 60%" · "Mentored 3 junior devs who got promoted"' value={achievements} onChange={e => setAchievements(e.target.value)} />
          </div>
          <div className="rl-field">
            <label className="rl-label">Key qualities you want emphasised</label>
            <textarea className="rl-textarea" rows={2} placeholder='e.g. "ownership mindset, clear communicator, always delivers under pressure"' value={qualities} onChange={e => setQualities(e.target.value)} />
          </div>

          {/* Tone */}
          <div className="rl-section-label">Tone</div>
          <div className="rl-chips" style={{ marginBottom: 0 }}>
            {TONES.map(t => (
              <button key={t} className={`rl-chip${tone === t ? " active" : ""}`} onClick={() => setTone(t)}>{t}</button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rl-error"><AlertCircle size={14} />{error}</div>
        )}

        <button className="rl-btn" onClick={generate} disabled={loading}>
          {loading
            ? <><span className="rl-spinner" /> Drafting your reference…</>
            : <><Award size={15} /> Generate Reference {outputType === "request" ? "Request" : outputType === "draft" ? "Letter" : "Request + Letter"}</>
          }
        </button>

        {/* ── Output ── */}
        {result && !loading && (
          <div className="rl-output" style={{ marginTop: 20 }}>

            {/* Tip */}
            {result.tip && (
              <div className="rl-tip">
                <span className="rl-tip-icon">💡</span>
                <span><strong style={{ color: "#a78bfa" }}>Pro tip:</strong> {result.tip}</span>
              </div>
            )}

            {/* Request email */}
            {(outputType === "request" || outputType === "both") && result.requestBody && (
              <div className="rl-card">
                <div className="rl-card-header">
                  <span className="rl-card-label">✉ Request Email</span>
                  <div style={{ display: "flex", gap: 7 }}>
                    <button onClick={generate} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#475569", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                      <RefreshCw size={10} /> Redo
                    </button>
                    <CopyBtn k="reqBody" text={`Subject: ${result.requestSubject}\n\n${result.requestBody}`} primary />
                  </div>
                </div>
                {result.requestSubject && (
                  <div className="rl-subject">Subject: {result.requestSubject}</div>
                )}
                <div className="rl-card-body">{result.requestBody}</div>
              </div>
            )}

            {/* Draft letter — accordion if "both", full if "draft" */}
            {(outputType === "draft" || outputType === "both") && result.letterBody && (
              <>
                {outputType === "both" ? (
                  <>
                    <button className="rl-accordion-btn" onClick={() => setShowDraft(v => !v)}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Award size={13} color="#a78bfa" />
                        Reference Letter Draft
                        {result.strengthsHighlighted?.length > 0 && (
                          <span style={{ fontSize: 11, color: "#475569" }}>· {result.strengthsHighlighted.length} strengths highlighted</span>
                        )}
                      </span>
                      <ChevronDown size={14} className={`rl-chevron${showDraft ? " open" : ""}`} />
                    </button>
                    {showDraft && <DraftCard result={result} onRedo={generate} CopyBtn={CopyBtn} />}
                  </>
                ) : (
                  <DraftCard result={result} onRedo={generate} CopyBtn={CopyBtn} />
                )}
              </>
            )}

          </div>
        )}
      </div>
    </>
  );
}

function DraftCard({ result, onRedo, CopyBtn }) {
  return (
    <div className="rl-card" style={{ animation: "rl-in 0.3s ease" }}>
      <div className="rl-card-header">
        <span className="rl-card-label">📄 Reference Letter Draft</span>
        <div style={{ display: "flex", gap: 7 }}>
          <button onClick={onRedo} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#475569", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            <RefreshCw size={10} /> Redo
          </button>
          <CopyBtn k="letter" text={result.letterBody} primary />
        </div>
      </div>
      <div className="rl-card-body">{result.letterBody}</div>

      {result.strengthsHighlighted?.length > 0 && (
        <div className="rl-strengths">
          <span style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: 4 }}>Highlighted:</span>
          {result.strengthsHighlighted.map((s, i) => (
            <span key={i} className="rl-strength-tag">{s}</span>
          ))}
        </div>
      )}

      {result.editSuggestion && (
        <div className="rl-edit-note">
          <span style={{ fontSize: 14, flexShrink: 0 }}>✏️</span>
          <span><strong>Before sending:</strong> {result.editSuggestion}</span>
        </div>
      )}
    </div>
  );
}