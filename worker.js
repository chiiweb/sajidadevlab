const API_KEY = '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';
const MODEL = 'google/gemma-3-12b-it:free';

export default {
  async fetch(request, env) {
    // we must define the allowed origin clearly
    const origin = "https://chiiweb.github.io";

    // handle cors preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // handle GET (for debugging)
    if (request.method === 'GET') {
      return new Response(JSON.stringify({ status: "ready" }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin 
        },
      });
    }

    // handle POST
    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://sajidakhan.devlab',
          },
          body: JSON.stringify({
            model: MODEL,
            messages: body.messages,
          }),
        });

        const data = await res.json();
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': origin 
          },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { 
          status: 500, 
          headers: { 'Access-Control-Allow-Origin': origin } 
        });
      }
    }

    return new Response('not allowed', { status: 405 });
  },
};
