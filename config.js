/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  Sajida Khan Dev Lab — Site Config                          ║
 * ║                                                              ║
 * ║  SETUP:                                                     ║
 * ║  1. Put ai-proxy.js inside /netlify/functions/              ║
 * ║  2. Add OPENROUTER_KEY to Netlify env vars                  ║
 * ║     → Site Settings → Environment Variables                 ║
 * ║  3. Replace YOUR-SITE-NAME below with your netlify name     ║
 * ║  4. Deploy — key is never in your repo ✅                   ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * HOW TO FIND YOUR-SITE-NAME:
 * → go to netlify.com → open your site dashboard
 * → your site name is shown e.g. "sajidadevlab" or "chiiweb"
 * → full url looks like: sajidadevlab.netlify.app
 */

const SKDL_CONFIG = {
  // ↓ replace YOUR-SITE-NAME with your actual netlify site name!
  // example: 'https://sajidadevlab.netlify.app/.netlify/functions/ai-proxy'
  PROXY_URL: 'https://YOUR-SITE-NAME.netlify.app/.netlify/functions/ai-proxy',

  MODEL: 'google/gemma-3-12b-it:free',
  MAX_TOKENS: 1500,
  TEMPERATURE: 0.7,
  FETCH_TIMEOUT: 30000,
};

Object.freeze(SKDL_CONFIG);
