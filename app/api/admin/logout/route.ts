import { NextResponse } from 'next/server';
import { ADMIN_TOKEN_COOKIE, getAdminCookieOptions } from '@/lib/admin-session';

export async function POST(req: Request) {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_TOKEN_COOKIE, '', {
    ...getAdminCookieOptions(req),
    maxAge: 0,
  });
  return response;
}
