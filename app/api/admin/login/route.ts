import { NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/admin-auth';
import {
  ADMIN_TOKEN_COOKIE,
  createAdminToken,
  getAdminCookieOptions,
} from '@/lib/admin-session';

export const runtime = 'nodejs';

type LoginBody = {
  username?: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginBody;
    const username = body.username?.trim() || '';
    const password = body.password?.trim() || '';

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const admin = await authenticateAdmin(username, password);
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid admin credentials.' },
        { status: 401 }
      );
    }

    const token = await createAdminToken({ id: admin.id, username: admin.username });
    const response = NextResponse.json({
      ok: true,
      user: {
        id: admin.id,
        username: admin.username,
        displayName: admin.displayName,
      },
    });

    response.cookies.set(ADMIN_TOKEN_COOKIE, token, getAdminCookieOptions());
    return response;
  } catch (error: any) {
    console.error('POST /api/admin/login error:', error);
    return NextResponse.json(
      { error: 'Login failed.', details: error.message },
      { status: 500 }
    );
  }
}
