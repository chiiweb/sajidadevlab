/**
 * Sajida Khan Dev Lab — AI Proxy Worker (Fixed)
 * Handles GET, POST, and OPTIONS
 */

const MODEL = 'google/gemma-3-12b-it:free';
const API_KEY = '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';

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '*';

    // 1. Handle CORS Preflight (Important for browser security)
    if (request.method === 'OPTIONS') {
      return corsResponse(null, 204, origin);
    }

    // 2. Handle GET Request (To stop the 405 error when visiting via browser)
    if (request.method === 'GET') {
      return corsResponse(JSON.stringify({ 
        status: 'online', 
        message: 'Sajida Khan Dev Lab Worker is active. Send a POST request to chat.' 
      }), 200, origin);
    }

    // 3. Handle POST Request (The actual API call)
    if (request.method === 'POST') {
      let body;
      try {
        body = await request.json();
      } catch {
        return corsResponse(JSON.stringify({ error: 'Invalid JSON body' }), 400, origin);
      }

      const { messages, max_tokens = 1500, temperature = 0.7 } = body;

      if (!messages || !Array.isArray(messages)) {
        return corsResponse(JSON.stringify({ error: 'Messages array is required' }), 400, origin);
      }

      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://sajidakhan.devlab',
            'X-Title': 'Sajida Khan Dev Lab',
          },
          body: JSON.stringify({ model: MODEL, messages, max_tokens, temperature }),
        });

        const data = await res.json();

        if (!res.ok) {
          return corsResponse(JSON.stringify({ error: data?.error?.message || 'Upstream error' }), res.status, origin);
        }

        return corsResponse(JSON.stringify(data), 200, origin);
      } catch (err) {
        return corsResponse(JSON.stringify({ error: 'Failed to fetch from OpenRouter' }), 500, origin);
      }
    }

    // Fallback for other methods
    return corsResponse(JSON.stringify({ error: 'Method not allowed' }), 405, origin);
  },
};

function corsResponse(body, status, origin) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin, // Allows your frontend to talk to the worker
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  return new Response(body, { status, headers });
}
