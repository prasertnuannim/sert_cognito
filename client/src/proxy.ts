import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken, type GetTokenParams } from "next-auth/jwt";
import {
  canAccessPath,
  getDefaultPathForRoles,
  normalizeRoles,
} from "@/features/auth/domain/auth-access-control";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/confirm-account",
  "/forgot-password",
  "/reset-password",
];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const token = await getToken({
    req: request as unknown as GetTokenParams["req"],
    secret: process.env.NEXTAUTH_SECRET,
  });
  const roles = normalizeRoles(token?.roles);
  const defaultAuthenticatedPath = getDefaultPathForRoles(roles);

  // ล็อกอินแล้ว แต่ยังเข้าหน้า auth ซ้ำ
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL(defaultAuthenticatedPath, request.url));
  }

  // ยังไม่ล็อกอิน แต่พยายามเข้าหน้าที่ต้องป้องกัน
  if (!token && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (token && !isPublicPath && !canAccessPath(pathname, roles)) {
    return NextResponse.redirect(new URL(defaultAuthenticatedPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      ป้องกันทุกหน้า ยกเว้น:
      - api
      - _next/static
      - _next/image
      - favicon.ico
      - ไฟล์ static ต่าง ๆ
    */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
