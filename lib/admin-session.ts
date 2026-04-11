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

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_TOKEN_DURATION_SECONDS,
  };
}
