import { NextResponse } from 'next/server';
import { ADMIN_TOKEN_COOKIE, getAdminCookieOptions } from '@/lib/admin-session';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_TOKEN_COOKIE, '', {
    ...getAdminCookieOptions(),
    maxAge: 0,
  });
  return response;
}
