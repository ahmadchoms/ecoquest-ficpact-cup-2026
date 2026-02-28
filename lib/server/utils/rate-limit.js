/**
 * Simple In-Memory Rate Limiter
 * Uses a sliding window counter approach.
 * Suitable for single-instance deployments (Vercel Serverless has per-invocation isolation,
 * so this is a best-effort guard; for production, use Redis-backed solutions).
 */

const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute
const DEFAULT_MAX_REQUESTS = 60; // 60 requests per window

const rateLimitMap = new Map();

/**
 * Cleans up expired entries from the rate limit map.
 */
function cleanup() {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.windowStart > entry.windowMs) {
      rateLimitMap.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanup, 5 * 60 * 1000);
}

/**
 * Check if a request should be rate-limited.
 * @param {string} identifier - Unique key (e.g., IP address or user ID)
 * @param {object} options - { windowMs, maxRequests }
 * @returns {{ limited: boolean, remaining: number, resetIn: number }}
 */
export function checkRateLimit(
  identifier,
  { windowMs = DEFAULT_WINDOW_MS, maxRequests = DEFAULT_MAX_REQUESTS } = {}
) {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now - entry.windowStart > windowMs) {
    // New window
    rateLimitMap.set(identifier, {
      windowStart: now,
      windowMs,
      count: 1,
    });
    return { limited: false, remaining: maxRequests - 1, resetIn: windowMs };
  }

  entry.count += 1;

  if (entry.count > maxRequests) {
    const resetIn = windowMs - (now - entry.windowStart);
    return { limited: true, remaining: 0, resetIn };
  }

  return {
    limited: false,
    remaining: maxRequests - entry.count,
    resetIn: windowMs - (now - entry.windowStart),
  };
}

/**
 * Extract a client identifier from the request for rate limiting.
 * @param {Request} request
 * @returns {string}
 */
export function getClientIdentifier(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}
