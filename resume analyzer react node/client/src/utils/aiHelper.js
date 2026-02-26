// Calls your local Express backend which proxies to Ollama
// Make sure Ollama is running: ollama serve
// And your model is pulled: ollama pull llama3.2

export async function callAI(prompt, max_tokens = 1000) {
  const response = await fetch('/api/ai/generate', {
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