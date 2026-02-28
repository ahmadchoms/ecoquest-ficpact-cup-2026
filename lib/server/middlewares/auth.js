import { unauthorizedResponse } from "@/lib/server/utils/response";
import { logger } from "@/lib/server/utils/logger";

/**
 * Admin Authentication Middleware (Placeholder)
 *
 * This is a structural placeholder that enforces the auth check pattern.
 * In production, replace the body with real JWT/session verification
 * (e.g., NextAuth getServerSession, or manual JWT decode).
 *
 * For now, during development, it always passes through.
 * Set `ADMIN_AUTH_ENABLED=true` in .env to activate strict mode.
 */
export async function verifyAdminAuth(request) {
  const isAuthEnabled = process.env.ADMIN_AUTH_ENABLED === "true";

  if (!isAuthEnabled) {
    // Development bypass — no auth check
    logger.debug("Auth", "Auth bypass active (ADMIN_AUTH_ENABLED is not 'true')");
    return { authenticated: true, user: { id: "dev-admin", role: "ADMIN" } };
  }

  // --- Production Auth Logic (Placeholder) ---
  // Example: Check for a Bearer token or session cookie
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Auth", "Missing or malformed Authorization header");
    return { authenticated: false, response: unauthorizedResponse() };
  }

  const token = authHeader.split(" ")[1];

  // TODO: Replace with real token verification (e.g., JWT decode, DB session lookup)
  // For now, accept any non-empty token as valid in strict mode.
  if (!token) {
    logger.warn("Auth", "Empty token provided");
    return { authenticated: false, response: unauthorizedResponse() };
  }

  logger.info("Auth", "Token accepted (placeholder verification)");
  return { authenticated: true, user: { id: "placeholder-user", role: "ADMIN" } };
}

/**
 * Helper to run auth check and return early if unauthorized.
 * Usage in route handlers:
 *   const authResult = await requireAdmin(request);
 *   if (authResult) return authResult; // Returns the 401 response
 */
export async function requireAdmin(request) {
  const { authenticated, response } = await verifyAdminAuth(request);
  if (!authenticated) return response;
  return null; // Proceed
}
