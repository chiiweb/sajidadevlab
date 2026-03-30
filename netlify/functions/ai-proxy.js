// ╔══════════════════════════════════════════════════════════════╗
// ║  Sajida Khan Dev Lab — AI Proxy (Netlify Function)          ║
// ║                                                              ║
// ║  Deploy: put this file in /netlify/functions/ai-proxy.js    ║
// ║  Add OPENROUTER_KEY to Netlify → Site Settings → Env Vars   ║
// ╚══════════════════════════════════════════════════════════════╝
const MODEL = 'google/gemma-3-12b-it:free';
const ALLOWED_ORIGIN = 'https://sajidadevlab.netlify.app'; // ✅ fixed
const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};
exports.handler = async function (event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ready', model: MODEL }),
    };
  }
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'method not allowed' }),
    };
  }
  const API_KEY = process.env.OPENROUTER_KEY;
  if (!API_KEY) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'OPENROUTER_KEY env var not set in Netlify' }),
    };
  }
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'invalid JSON body' }),
    };
  }
  if (!body.messages || !Array.isArray(body.messages)) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'missing messages array' }),
    };
  }
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://sajidadevlab.netlify.app', // ✅ fixed
      },
      body: JSON.stringify({
        model: MODEL,
        messages: body.messages,
        max_tokens: body.max_tokens || 1500,
        temperature: body.temperature !== undefined ? body.temperature : 0.7,
      }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      return {
        statusCode: res.status || 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: data.error?.message || `OpenRouter error: ${res.status}` }),
      };
    }
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
