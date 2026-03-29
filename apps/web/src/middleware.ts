import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getCookieDomain } from "./utils/supabase/cookie-config";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { pathname } = request.nextUrl;
  const host = request.headers.get("host");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          const cookieDomain = getCookieDomain(host);
          // request.cookies.set is used for passing cookies to RSC, only name and value are needed/supported
          request.cookies.set({ name, value });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({
            name,
            value,
            ...options,
            domain: cookieDomain,
          });
        },
        remove(name: string, options: CookieOptions) {
          const cookieDomain = getCookieDomain(host);
          request.cookies.set({ name, value: "" });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
            domain: cookieDomain,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- Subdomain & Auth Routing Logic ---
  const isCMS = host?.startsWith("cms.") || pathname.startsWith("/admin");
  const isFacturas = host?.startsWith("facturas.") || pathname.startsWith("/facturas");
  const isDashboard = pathname.startsWith("/dashboard");

  // 4. Auth routes logic
  const isAuthRoute = pathname.startsWith("/signin") || pathname.startsWith("/signup");
  
  // 1. Protection: Dashboard
  if (isDashboard && !user && !isAuthRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 2. Protection: Admin / CMS
  if (isCMS && !isAuthRoute) {
    if (!user) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    const isSuperAdmin =
      user.email === "admin@zonasurtech.online" ||
      !!user.app_metadata?.is_super_admin;
    if (!isSuperAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // Internal Rewrite for cms. -> /admin
    if (host?.startsWith("cms.") && !pathname.startsWith("/admin")) {
      return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url));
    }
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .png, .jpg, .jpeg, .gif, .svg (public images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
