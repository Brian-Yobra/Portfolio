export const SESSION_COOKIE = 'admin_session';

/**
 * Derives the expected session token using Web Crypto (HMAC-SHA256).
 * Uses SubtleCrypto so it works in both the Edge runtime (middleware)
 * and Node.js (API routes / server components).
 */
export async function deriveToken(): Promise<string> {
  const secret = process.env.ADMIN_SECRET ?? 'fallback-secret';
  const password = process.env.ADMIN_PASSWORD ?? '';

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(password));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Returns true when the raw cookie header contains a valid admin session */
export async function isValidSession(cookieHeader: string | null): Promise<boolean> {
  if (!cookieHeader) return false;
  const expected = await deriveToken();
  return cookieHeader
    .split(';')
    .some((part) => {
      const [name, ...rest] = part.trim().split('=');
      return name.trim() === SESSION_COOKIE && rest.join('=').trim() === expected;
    });
}
