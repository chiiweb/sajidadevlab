const MODEL = 'google/gemma-3-12b-it:free';

export default {
  async fetch(request, env) {
    // Get API key from environment variable (never hardcode!)
    const API_KEY = env.OPENROUTER_KEY;
    if (!API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENROUTER_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
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
            max_tokens: body.max_tokens || 1500,
            temperature: body.temperature !== undefined ? body.temperature : 0.7,
          }),
        });

        const data = await res.json();
        
        // Check if OpenRouter returned an error
        if (!res.ok || data.error) {
          return new Response(JSON.stringify({ error: data.error?.message || `OpenRouter API error: ${res.status}` }), {
            status: res.status || 400,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': origin 
            },
          });
        }
        
        // Success response
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
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': origin 
          }
        });
      }
    }

    return new Response('not allowed', { status: 405 });
  },
};
