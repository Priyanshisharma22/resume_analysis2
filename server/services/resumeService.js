// Uses Google Gemini API for AI inference (free tier available)
// Get your free API key at: https://aistudio.google.com/app/apikey

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent`;

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1000 },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error('Gemini returned empty response');

  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = jsonMatch ? jsonMatch[1].trim() : text;

  const start = jsonText.indexOf('{');
  const end = jsonText.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('No valid JSON found in response. Raw: ' + text.slice(0, 300));
  }

  try {
    return JSON.parse(jsonText.slice(start, end + 1));
  } catch (e) {
    throw new Error('Failed to parse JSON from Gemini. Raw: ' + text.slice(0, 300));
  }
}

async function analyzeResume(resumeText) {
  // Truncate resume to max 2000 chars to save tokens
  const truncatedResume = resumeText.slice(0, 2000);

  const prompt = `Analyze this resume. Respond ONLY with a valid JSON object, no extra text.

JSON structure:
{"candidate":{"name":"string","email":"string or null","phone":"string or null","location":"string or null","linkedIn":"string or null","summary":"string"},"skills":{"technical":[],"soft":[],"languages":[],"tools":[]},"experience":[{"company":"string","role":"string","duration":"string","highlights":[]}],"education":[{"institution":"string","degree":"string","year":"string or null"}],"score":{"overall":75,"breakdown":{"formatting":70,"impact":65,"skills":80,"experience":75,"education":70},"grade":"B+"},"strengths":[],"improvements":[{"category":"string","issue":"string","suggestion":"string","priority":"high"}],"keywords":[],"missingKeywords":[]}

RESUME:
${truncatedResume}

JSON:`;

  return await callGemini(prompt);
}

async function matchJobDescription(resumeText, jobDescription) {
  // Truncate to save tokens
  const truncatedResume = resumeText.slice(0, 1500);
  const truncatedJob = jobDescription.slice(0, 1000);

  const prompt = `Compare this resume to the job description. Respond ONLY with a valid JSON object, no extra text.

JSON structure:
{"matchScore":72,"matchGrade":"B","verdict":"string","matchedKeywords":[],"missingKeywords":[],"matchedRequirements":[{"requirement":"string","evidence":"string"}],"missingRequirements":[{"requirement":"string","gap":"string","howToAddress":"string"}],"tailoringTips":[{"section":"string","tip":"string"}],"atsOptimization":{"score":65,"tips":[]}}

RESUME:
${truncatedResume}

JOB DESCRIPTION:
${truncatedJob}

JSON:`;

  return await callGemini(prompt);
}

module.exports = { analyzeResume, matchJobDescription };