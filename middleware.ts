import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_TOKEN_COOKIE, verifyAdminToken } from "@/lib/admin-session";

const ADMIN_LOGIN_PATH = "/admin/login";
const PUBLIC_ADMIN_API_PATHS = new Set(["/api/admin/login", "/api/admin/logout"]);

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  const token = request.cookies.get(ADMIN_TOKEN_COOKIE)?.value;
  const session = token ? await verifyAdminToken(token) : null;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isPublicAdminApi = PUBLIC_ADMIN_API_PATHS.has(pathname);

  if (pathname === ADMIN_LOGIN_PATH && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if ((isAdminPage || isAdminApi) && pathname !== ADMIN_LOGIN_PATH && !isPublicAdminApi && !session) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/api/admin/:path*"],
};
