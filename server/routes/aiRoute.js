const express = require('express');
const router = express.Router();

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function groqRequest(prompt, max_tokens = 800) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set');

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// GET /api/ai/test
router.get('/test', async (req, res) => {
  try {
    const text = await groqRequest('Reply with exactly: Groq is working!', 20);
    res.json({ ok: true, model: 'llama-3.1-8b-instant', response: text });
  } catch (err) {
    console.error('[AI] Test error:', err.message);
    res.status(503).json({ ok: false, error: err.message });
  }
});

// POST /api/ai/generate
router.post('/generate', async (req, res) => {
  try {
    const { prompt, max_tokens = 800 } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    console.log('[AI] Generate - prompt length:', prompt.length);
    const text = await groqRequest(prompt, max_tokens);

    if (!text) {
      return res.status(500).json({ error: 'Empty response from Groq' });
    }

    console.log('[AI] Success - response length:', text.length);
    res.json({ text });
  } catch (error) {
    console.error('[AI] Generate error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;