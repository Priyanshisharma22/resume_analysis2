const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function callAI(prompt, max_tokens = 1000) {
  let response;

  try {
    response = await fetch(`${API_URL}/api/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, max_tokens }),
    });
  } catch (networkErr) {
    throw new Error('Network error: Could not reach the server');
  }

  // Read as text first (safe — avoids "Unexpected end of JSON input")
  const rawText = await response.text();

  if (!rawText || rawText.trim() === '') {
    throw new Error('Empty response from server. Check your GROQ_API_KEY in Vercel environment variables.');
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    console.error('Server returned invalid JSON:', rawText);
    throw new Error('Invalid response from server: ' + rawText.slice(0, 100));
  }

  if (!response.ok) {
    throw new Error(data.error || `Server error: ${response.status}`);
  }

  return data.text || '';
}