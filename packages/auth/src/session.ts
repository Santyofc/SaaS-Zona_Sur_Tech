/**
 * JWT session utilities — encrypt/decrypt for the custom session cookie.
 *
 * These are used by the login/register routes to issue a lightweight session
 * cookie and by the Next.js middleware to validate route access at the edge.
 *
 * Note: The Supabase session (managed via @supabase/ssr) is the primary
 * identity source. This custom session cookie carries the organizationId
 * so that the middleware can perform redirects without a DB call.
 *
 * Security note:
 * - The JWT contains organizationId and role for routing purposes ONLY.
 * - Authorization decisions in API routes must ALWAYS use requireAuth() +
 *   requirePermission() which re-verify from the database, not this cookie.
 */

import { SignJWT, jwtVerify } from "jose";

export interface SessionPayload {
  userId: string;
  organizationId: string | null;
  role: "owner" | "admin" | "member" | "viewer" | "billing";
}

// Fail-fast: refuse to start if JWT_SECRET is not explicitly set.
const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  throw new Error(
    "[FATAL] JWT_SECRET environment variable is not set. " +
      "Set it in your .env file or deployment secrets. " +
      "Refusing to start to prevent forgeable JWT tokens."
  );
}
const secretKey = new TextEncoder().encode(rawSecret);

/**
 * Signs and returns a compact JWT string for the session cookie.
 * Expires in 24 hours.
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey);
}

/**
 * Verifies and decodes a session JWT string.
 * Returns null if the token is invalid or expired.
 */
export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, secretKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
