const express = require('express');
const http = require('http');

const router = express.Router();

function ollamaRequest(body) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);

    const options = {
      hostname: '127.0.0.1',
      port: 11434,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          reject(new Error('Failed to parse Ollama response: ' + data));
        }
      });
    });

    req.on('error', (err) => reject(err));

    req.setTimeout(120000, () => {
      req.destroy();
      reject(new Error('Ollama request timed out'));
    });

    req.write(postData);
    req.end();
  });
}

// GET /api/ai/test
router.get('/test', async (req, res) => {
  try {
    const model = process.env.OLLAMA_MODEL || 'llama3.2';
    console.log('[AI] Test - model:', model);
    const result = await ollamaRequest({
      model,
      prompt: 'Reply with exactly: Ollama is working!',
      stream: false,
      options: { num_predict: 20 },
    });
    console.log('[AI] Test result:', result.status, result.body);
    res.json({ ok: true, model, status: result.status, response: result.body.response });
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

    const model = process.env.OLLAMA_MODEL || 'llama3.2';
    console.log('[AI] Generate - model:', model, '| prompt length:', prompt.length);

    const result = await ollamaRequest({
      model,
      prompt,
      stream: false,
      options: {
        num_predict: max_tokens,
        temperature: 0.7,
      },
    });

    console.log('[AI] Ollama responded - status:', result.status);

    if (result.status !== 200) {
      console.error('[AI] Non-200 from Ollama:', result.body);
      return res.status(500).json({ error: 'Ollama error', details: result.body });
    }

    const text = result.body.response || '';
    if (!text) {
      console.error('[AI] Empty response body:', result.body);
      return res.status(500).json({ error: 'Empty response from Ollama', raw: result.body });
    }

    console.log('[AI] Success - response length:', text.length);
    res.json({ text });

  } catch (error) {
    console.error('[AI] Generate error:', error.message, error.code);

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'Ollama is not running. Run: ollama serve' });
    }
    if (error.message.includes('timed out')) {
      return res.status(504).json({ error: 'Ollama timed out. Is the model loaded?' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;