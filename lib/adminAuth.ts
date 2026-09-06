import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'gumti_admin_session';

// Secrets & credentials with safe defaults
const getJwtSecret = () => {
  const secret = process.env.ADMIN_JWT_SECRET || 'gumti_fallback_secret_key_2026_cafe_secure';
  return new TextEncoder().encode(secret);
};

export const getExpectedAdminCredentials = () => {
  return {
    username: (process.env.ADMIN_USERNAME || 'admin').trim(),
    password: (process.env.ADMIN_PASSWORD || 'gumti@admin2026').trim(),
  };
};

/**
 * Timing-safe string comparison using SHA-256 hashes to prevent timing attacks
 * and length leakage.
 */
function timingSafeCompare(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export function verifyAdminCredentials(providedUser: string, providedPass: string): boolean {
  const { username, password } = getExpectedAdminCredentials();
  
  const userMatches = timingSafeCompare(providedUser.trim(), username);
  const passMatches = timingSafeCompare(providedPass.trim(), password);

  return userMatches && passMatches;
}

export interface AdminTokenPayload {
  username: string;
  role: 'admin';
  rememberMe?: boolean;
}

/**
 * Generate a cryptographically signed JWT session token
 */
export async function createAdminSessionToken(payload: AdminTokenPayload): Promise<string> {
  const secretKey = getJwtSecret();
  const expiration = payload.rememberMe ? '7d' : '8h';

  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(secretKey);
}

/**
 * Verify signed JWT session token
 */
export async function verifyAdminSessionToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const secretKey = getJwtSecret();
    const { payload } = await jwtVerify(token, secretKey);
    if (payload.role === 'admin' && typeof payload.username === 'string') {
      return {
        username: payload.username,
        role: 'admin',
        rememberMe: Boolean(payload.rememberMe),
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Get cookie options for session cookie
 */
export function getAdminCookieOptions(rememberMe: boolean = false) {
  const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 8; // 7 days or 8 hours
  return {
    name: ADMIN_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

// ==========================================
// In-Memory Rate Limiting for Brute Force Protection
// ==========================================
interface RateLimitEntry {
  attempts: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

// Periodic cleanup of stale entries
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitMap.entries()) {
      if (data.lockedUntil && data.lockedUntil < now) {
        rateLimitMap.delete(ip);
      } else if (!data.lockedUntil && now - data.firstAttemptAt > WINDOW_MS) {
        rateLimitMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number; attemptsLeft?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    return { allowed: true, attemptsLeft: MAX_ATTEMPTS };
  }

  // Check if locked out
  if (entry.lockedUntil && entry.lockedUntil > now) {
    const retryAfter = Math.ceil((entry.lockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  // Reset if window has elapsed
  if (now - entry.firstAttemptAt > WINDOW_MS) {
    rateLimitMap.delete(ip);
    return { allowed: true, attemptsLeft: MAX_ATTEMPTS };
  }

  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - entry.attempts);
  return { allowed: entry.attempts < MAX_ATTEMPTS, attemptsLeft };
}

export function recordFailedAttempt(ip: string): { locked: boolean; retryAfterSeconds?: number; attemptsLeft: number } {
  const now = Date.now();
  let entry = rateLimitMap.get(ip);

  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    entry = { attempts: 1, firstAttemptAt: now };
  } else {
    entry.attempts += 1;
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
    rateLimitMap.set(ip, entry);
    return { locked: true, retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000), attemptsLeft: 0 };
  }

  rateLimitMap.set(ip, entry);
  return { locked: false, attemptsLeft: MAX_ATTEMPTS - entry.attempts };
}

export function resetRateLimit(ip: string): void {
  rateLimitMap.delete(ip);
}
