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

  // --- Subdomain Routing Logic ---
  const isCMS = host?.startsWith("cms.");
  const isFacturas = host?.startsWith("facturas.");

  // Si estamos en un subdominio, reescribimos internamente
  if (isCMS) {
    // Evitamos bucles si ya estamos en /admin
    if (!pathname.startsWith("/admin")) {
      return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url));
    }
  }

  if (isFacturas) {
    // Reservado para portal de facturación
    if (!pathname.startsWith("/facturas")) {
       return NextResponse.rewrite(new URL(`/facturas${pathname}`, request.url));
    }
  }

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

  // ─── Dashboard ────────────────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // ─── Admin panel — super-admin only ───────────────────────────────────────
  // Note: Since we are rewriting cms -> /admin, this check still applies to the mapped path
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    const isSuperAdmin =
      user.email === "admin@zonasurtech.online" ||
      !!user.app_metadata?.is_super_admin;
    if (!isSuperAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // ─── Auth routes — redirect already-authed users ──────────────────────────
  const isAuthRoute =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");
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
