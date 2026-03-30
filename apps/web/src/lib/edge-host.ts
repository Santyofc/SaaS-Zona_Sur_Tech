const RESERVED_SUBDOMAINS = new Set([
  "",
  "www",
  "app",
  "api",
  "cms",
  "facturas",
]);

export type PublicSurface =
  | "root"
  | "app"
  | "api"
  | "cms"
  | "facturas"
  | "tenant";

export type HostContext = {
  host: string;
  hostname: string;
  baseDomain?: string;
  surface: PublicSurface;
  tenantSlug?: string;
  isReservedTenant: boolean;
};

export function normalizeHost(rawHost: string | null | undefined): string {
  return (rawHost ?? "").trim().toLowerCase().replace(/:\d+$/, "");
}

export function getBaseDomain(host: string | null | undefined): string | undefined {
  const hostname = normalizeHost(host);
  if (!hostname) return undefined;

  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    /^\d+\.\d+\.\d+\.\d+$/.test(hostname)
  ) {
    return undefined;
  }

  if (hostname.endsWith(".zonasurtech.online") || hostname === "zonasurtech.online") {
    return ".zonasurtech.online";
  }

  return undefined;
}

export function resolveHostContext(host: string | null | undefined): HostContext {
  const hostname = normalizeHost(host);
  const baseDomain = getBaseDomain(hostname);

  if (!hostname) {
    return {
      host: "",
      hostname: "",
      surface: "root",
      isReservedTenant: true,
    };
  }

  if (!baseDomain) {
    return {
      host: hostname,
      hostname,
      surface: "root",
      isReservedTenant: true,
    };
  }

  const root = hostname.replace(/\.zonasurtech\.online$/, "");
  const labels = root === "zonasurtech.online" ? [] : root.split(".");
  const subdomain = hostname === "zonasurtech.online" ? "" : labels[0];

  switch (subdomain) {
    case "":
    case "www":
      return { host: hostname, hostname, baseDomain, surface: "root", isReservedTenant: true };
    case "app":
      return { host: hostname, hostname, baseDomain, surface: "app", isReservedTenant: true };
    case "api":
      return { host: hostname, hostname, baseDomain, surface: "api", isReservedTenant: true };
    case "cms":
      return { host: hostname, hostname, baseDomain, surface: "cms", isReservedTenant: true };
    case "facturas":
      return { host: hostname, hostname, baseDomain, surface: "facturas", isReservedTenant: true };
    default:
      return {
        host: hostname,
        hostname,
        baseDomain,
        surface: "tenant",
        tenantSlug: subdomain,
        isReservedTenant: RESERVED_SUBDOMAINS.has(subdomain),
      };
  }
}

type CookieShape = {
  name: string;
  value: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none" | boolean;
  path?: string;
  maxAge?: number;
  expires?: Date;
  domain?: string;
};

export function withSharedCookieDomain<T extends CookieShape>(cookie: T, host: string | null | undefined): T {
  const domain = getBaseDomain(host);
  return {
    ...cookie,
    ...(domain ? { domain } : {}),
  };
}

export function setSharedCookie(
  store: { set: (cookie: CookieShape) => void },
  cookie: CookieShape,
  host: string | null | undefined,
) {
  store.set(withSharedCookieDomain(cookie, host));
}
