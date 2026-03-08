import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@repo/auth";
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const session = token ? await decrypt(token) : null;
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/dashboard")) {
    if (!session) return NextResponse.redirect(new URL("/login", request.url));
    if (!session.organizationId)
      return NextResponse.redirect(new URL("/onboarding", request.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*"] };
