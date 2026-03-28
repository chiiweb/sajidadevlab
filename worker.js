/**
 * Sajida Khan Dev Lab — AI Proxy Worker
 * Updated to support GET and POST
 */

const MODEL = 'google/gemma-3-12b-it:free';
const API_KEY = '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';

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '*';

    // handle cors preflight
    if (request.method === 'OPTIONS') {
      return corsResponse(null, 204, origin);
    }

    // handle GET requests (for testing or simple pings)
    if (request.method === 'GET') {
      return corsResponse(JSON.stringify({ 
        status: 'online', 
        message: 'worker is active. use POST to send messages.' 
      }), 200, origin);
    }

    // only allow POST for actual api calls
    if (request.method !== 'POST') {
      return corsResponse(JSON.stringify({ error: 'method not allowed' }), 405, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return corsResponse(JSON.stringify({ error: 'invalid json body' }), 400, origin);
    }

    const { messages, max_tokens = 1500, temperature = 0.7 } = body;

    if (!messages || !Array.isArray(messages)) {
      return corsResponse(JSON.stringify({ error: 'messages array required' }), 400, origin);
    }

    // use the provided api key directly
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
      return corsResponse(JSON.stringify({ error: data?.error?.message || 'upstream error' }), res.status, origin);
    }

    return corsResponse(JSON.stringify(data), 200, origin);
  },
};

function corsResponse(body, status, origin) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  return new Response(body, { status, headers });
}
