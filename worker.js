/**
 * Sajida Khan Dev Lab — AI Proxy Worker
 * Deploy to Cloudflare Workers (free tier)
 * 
 * Setup:
 *   1. Go to https://workers.cloudflare.com and sign up (free)
 *   2. Create a new Worker, paste this file
 *   3. Go to Settings → Variables → add Secret:
 *        Name:  OPENROUTER_KEY
 *        Value: sk-or-v1-... (your openrouter key)
 *   4. Deploy — you'll get a URL like https://sk-proxy.YOUR-NAME.workers.dev
 *   5. Put that URL in config.js as PROXY_URL
 */

const ALLOWED_ORIGINS = [
  // add your github pages URL here, e.g.:
  // 'https://yourusername.github.io',
  // also works with any origin during local dev:
];

const MODEL = 'google/gemma-3-12b-it:free';

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return corsResponse(null, 204, origin);
    }

    // only POST allowed
    if (request.method !== 'POST') {
      return corsResponse(JSON.stringify({ error: 'method not allowed' }), 405, origin);
    }

    // parse body
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

    // call openrouter with the secret key (never exposed to browser)
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENROUTER_KEY}`,
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
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  return new Response(body, { status, headers });
}
