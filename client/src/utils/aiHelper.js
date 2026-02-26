const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function callAI(prompt, max_tokens = 1000) {
  const response = await fetch(`${API_URL}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, max_tokens }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'AI request failed');
  }

  const data = await response.json();
  return data.text || '';
}