/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  Sajida Khan Dev Lab — Site Config                          ║
 * ║                                                              ║
 * ║  SETUP (one-time, ~5 minutes):                              ║
 * ║  1. Deploy worker.js to Cloudflare Workers (free)           ║
 * ║     → https://workers.cloudflare.com                        ║
 * ║  2. Add your OpenRouter key as a Secret called              ║
 * ║     OPENROUTER_KEY in the worker's Settings → Variables     ║
 * ║  3. Copy your worker URL and paste it below                 ║
 * ║  4. Push to GitHub — done! Key is never in your repo ✅     ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

const SKDL_CONFIG = {
  // ← paste your Cloudflare Worker URL here (no trailing slash)
  // example: 'https://sk-proxy.yourname.workers.dev'
  PROXY_URL: 'https://sajidadevlab.netlify.app/.netlify/functions/ai-proxy',

  // model settings (worker handles the actual key — safe!)
  MODEL: 'google/gemma-3-12b-it:free',
  MAX_TOKENS: 1500,
  TEMPERATURE: 0.7,
  
  // Timeout in ms for fetch calls
  FETCH_TIMEOUT: 30000,
};

// freeze so nothing can accidentally overwrite it
Object.freeze(SKDL_CONFIG);
