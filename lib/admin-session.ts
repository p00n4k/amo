import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

export const ADMIN_TOKEN_COOKIE = 'amo_admin_token';

const ADMIN_TOKEN_DURATION_SECONDS = 60 * 60 * 12;

export type AdminTokenPayload = JWTPayload & {
  sub: string;
  username: string;
  role: 'admin';
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || 'development-admin-secret-change-me';
  return new TextEncoder().encode(secret);
}

export async function createAdminToken(user: { id: number; username: string }) {
  return new SignJWT({ username: user.username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_TOKEN_DURATION_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (payload.role !== 'admin' || !payload.sub || !payload.username) {
      return null;
    }

    return payload as AdminTokenPayload;
  } catch {
    return null;
  }
}

function shouldUseSecureCookie(request?: Request) {
  if (!request) {
    return process.env.NODE_ENV === 'production';
  }

  const forwardedProto = request.headers.get('x-forwarded-proto');
  if (forwardedProto) {
    return forwardedProto.split(',')[0].trim() === 'https';
  }

  const url = new URL(request.url);
  const isLocalhost =
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.hostname === '::1';

  if (isLocalhost) {
    return false;
  }

  return url.protocol === 'https:';
}

export function getAdminCookieOptions(request?: Request) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: shouldUseSecureCookie(request),
    path: '/',
    maxAge: ADMIN_TOKEN_DURATION_SECONDS,
  };
}
