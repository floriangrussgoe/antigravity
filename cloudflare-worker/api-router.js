// ============================================
// Cloudflare Worker - Stage 2 (Optional Upgrade)
// ============================================
// Deploy this when traffic exceeds client-side capacity
// Cost: $0/month up to 100k requests/day
// ============================================

const PRIMARY_API = 'https://YOUR_TUNNEL_ID.cfargotunnel.com';
const FALLBACK_API = 'https://antigravity-fallback.fly.dev';

// Health check cache (1 minute TTL)
let healthCache = {
    primary: { healthy: true, lastCheck: 0 },
    fallback: { healthy: true, lastCheck: 0 }
};

const HEALTH_CHECK_TTL = 60000; // 1 minute

async function checkHealth(url, cacheKey) {
    const now = Date.now();

    // Return cached result if fresh
    if (now - healthCache[cacheKey].lastCheck < HEALTH_CHECK_TTL) {
        return healthCache[cacheKey].healthy;
    }

    try {
        const response = await fetch(`${url}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000)
        });

        const healthy = response.ok;
        healthCache[cacheKey] = { healthy, lastCheck: now };
        return healthy;
    } catch {
        healthCache[cacheKey] = { healthy: false, lastCheck: now };
        return false;
    }
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
                    'Access-Control-Max-Age': '86400'
                }
            });
        }

        // Check primary health
        const primaryHealthy = await checkHealth(PRIMARY_API, 'primary');

        // Select target API
        const targetAPI = primaryHealthy ? PRIMARY_API : FALLBACK_API;
        const targetURL = new URL(url.pathname + url.search, targetAPI);

        // Forward request
        try {
            const response = await fetch(targetURL, {
                method: request.method,
                headers: request.headers,
                body: request.body
            });

            // Clone response and add CORS headers
            const newResponse = new Response(response.body, response);
            newResponse.headers.set('Access-Control-Allow-Origin', '*');
            newResponse.headers.set('X-Served-By', primaryHealthy ? 'primary' : 'fallback');

            return newResponse;
        } catch (error) {
            // If primary fails, try fallback
            if (primaryHealthy) {
                const fallbackURL = new URL(url.pathname + url.search, FALLBACK_API);
                const fallbackResponse = await fetch(fallbackURL, {
                    method: request.method,
                    headers: request.headers,
                    body: request.body
                });

                const newResponse = new Response(fallbackResponse.body, fallbackResponse);
                newResponse.headers.set('Access-Control-Allow-Origin', '*');
                newResponse.headers.set('X-Served-By', 'fallback-emergency');

                return newResponse;
            }

            // Both failed
            return new Response(JSON.stringify({
                error: 'Service Unavailable',
                message: 'All backend services are currently offline'
            }), {
                status: 503,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
    }
};
