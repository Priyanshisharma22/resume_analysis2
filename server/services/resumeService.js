// Uses Google Gemini API for AI inference (free tier available)
// Get your free API key at: https://aistudio.google.com/app/apikey

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set');

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 3000 },
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
  const prompt = `You are an expert resume analyst. Analyze the resume below and respond ONLY with a valid JSON object. No explanation, no markdown, no text before or after the JSON.

Required JSON structure:
{
  "candidate": {
    "name": "full name or Unknown",
    "email": "email or null",
    "phone": "phone or null",
    "location": "city/country or null",
    "linkedIn": "url or null",
    "summary": "2-3 sentence professional summary"
  },
  "skills": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"],
    "languages": ["language1"],
    "tools": ["tool1", "tool2"]
  },
  "experience": [
    {
      "company": "company name",
      "role": "job title",
      "duration": "e.g. 2021-2023",
      "highlights": ["achievement1", "achievement2"]
    }
  ],
  "education": [
    {
      "institution": "school name",
      "degree": "degree name",
      "year": "graduation year or null"
    }
  ],
  "score": {
    "overall": 75,
    "breakdown": {
      "formatting": 70,
      "impact": 65,
      "skills": 80,
      "experience": 75,
      "education": 70
    },
    "grade": "B+"
  },
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": [
    {
      "category": "category name",
      "issue": "specific problem",
      "suggestion": "actionable fix",
      "priority": "high"
    }
  ],
  "keywords": ["keyword1", "keyword2"],
  "missingKeywords": ["missing1", "missing2"]
}

RESUME:
${resumeText}

JSON:`;

  return await callGemini(prompt);
}

async function matchJobDescription(resumeText, jobDescription) {
  const prompt = `You are an ATS specialist. Compare the resume to the job description and respond ONLY with a valid JSON object. No explanation, no markdown, no text before or after the JSON.

Required JSON structure:
{
  "matchScore": 72,
  "matchGrade": "B",
  "verdict": "One sentence summary of the match quality",
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["missing1", "missing2"],
  "matchedRequirements": [
    {
      "requirement": "requirement from job description",
      "evidence": "how the resume satisfies it"
    }
  ],
  "missingRequirements": [
    {
      "requirement": "requirement from job description",
      "gap": "what is missing",
      "howToAddress": "suggestion to close the gap"
    }
  ],
  "tailoringTips": [
    {
      "section": "Summary",
      "tip": "specific advice for this section"
    }
  ],
  "atsOptimization": {
    "score": 65,
    "tips": ["tip1", "tip2"]
  }
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

JSON:`;

  return await callGemini(prompt);
}

module.exports = { analyzeResume, matchJobDescription };
