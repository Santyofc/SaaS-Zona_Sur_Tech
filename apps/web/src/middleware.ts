import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { resolveHostContext, withSharedCookieDomain } from "./lib/edge-host";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { pathname } = request.nextUrl;
  const host = request.headers.get("host");
  const hostContext = resolveHostContext(host);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  const canCheckAuth = Boolean(supabaseUrl && supabaseAnonKey);
  let user: any = null;
  if (canCheckAuth) {
    const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // request.cookies.set is used for passing cookies to RSC, only name and value are needed/supported
          request.cookies.set({ name, value });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set(withSharedCookieDomain({
            name,
            value,
            ...options,
          }, host));
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "" });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set(withSharedCookieDomain({
            name,
            value: "",
            ...options,
          }, host));
        },
      },
    });

    const authResult = await supabase.auth.getUser();
    user = authResult.data.user ?? null;
  }

  // --- Subdomain & Auth Routing Logic ---
  const isCMS = hostContext.surface === "cms" || pathname.startsWith("/admin");
  const isFacturas = hostContext.surface === "facturas" || pathname.startsWith("/facturas");
  const isDashboard = hostContext.surface === "app" || pathname.startsWith("/dashboard");
  const isTenantHost = hostContext.surface === "tenant" && !hostContext.isReservedTenant;
  const isPublicRoute =
    pathname.startsWith("/signin") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon");

  // 4. Auth routes logic
  const isAuthRoute = pathname.startsWith("/signin") || pathname.startsWith("/signup");
  
  // 1. Protection: Dashboard
  if (isDashboard && (!canCheckAuth || !user) && !isAuthRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 2. Protection: Admin / CMS
  if (isCMS && !isAuthRoute) {
    if (!canCheckAuth || !user) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    const isSuperAdmin =
      user.email === "admin@zonasurtech.online" ||
      !!user.app_metadata?.is_super_admin;
    if (!isSuperAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // Internal Rewrite for cms. -> /admin
    if (hostContext.surface === "cms" && !pathname.startsWith("/admin")) {
      return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url));
    }
  }

  if (hostContext.surface === "app" && !pathname.startsWith("/dashboard") && !isPublicRoute) {
    return NextResponse.rewrite(new URL(`/dashboard${pathname === "/" ? "" : pathname}`, request.url));
  }

  if (hostContext.surface === "app" && pathname === "/") {
    return NextResponse.rewrite(new URL("/dashboard", request.url));
  }

  if (isFacturas && !pathname.startsWith("/facturas") && !isPublicRoute) {
    // NOTE: Facturas is now a module within the Business OS, not a standalone surface.
    // Redirect to the unified dashboard.
    return NextResponse.rewrite(new URL(`/dashboard${pathname === "/" ? "" : pathname}`, request.url));
  }

  if (isTenantHost) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-zst-tenant-slug", hostContext.tenantSlug ?? "");
    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (canCheckAuth && isAuthRoute && user) {
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
