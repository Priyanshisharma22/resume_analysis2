const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function callGroq(prompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set');

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq error (${response.status}): ${err}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Groq returned empty response');

  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = jsonMatch ? jsonMatch[1].trim() : text;

  const start = jsonText.indexOf('{');
  const end = jsonText.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('No valid JSON found. Raw: ' + text.slice(0, 300));
  }

  try {
    return JSON.parse(jsonText.slice(start, end + 1));
  } catch (e) {
    throw new Error('Failed to parse JSON. Raw: ' + text.slice(0, 300));
  }
}

async function analyzeResume(resumeText) {
  const truncatedResume = resumeText.slice(0, 2000);

  const prompt = `Analyze this resume. Respond ONLY with a valid JSON object, no extra text.

JSON structure:
{"candidate":{"name":"string","email":"string or null","phone":"string or null","location":"string or null","linkedIn":"string or null","summary":"string"},"skills":{"technical":[],"soft":[],"languages":[],"tools":[]},"experience":[{"company":"string","role":"string","duration":"string","highlights":[]}],"education":[{"institution":"string","degree":"string","year":"string or null"}],"score":{"overall":75,"breakdown":{"formatting":70,"impact":65,"skills":80,"experience":75,"education":70},"grade":"B+"},"strengths":[],"improvements":[{"category":"string","issue":"string","suggestion":"string","priority":"high"}],"keywords":[],"missingKeywords":[]}

RESUME:
${truncatedResume}

JSON:`;

  return await callGroq(prompt);
}

async function matchJobDescription(resumeText, jobDescription) {
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

  return await callGroq(prompt);
}

module.exports = { analyzeResume, matchJobDescription };
```

Now do these steps:

**1. Add key to Render:**
- Render → resume_analysis2-1 → Environment → Add:
```
GROQ_API_KEY = your-groq-api-key
