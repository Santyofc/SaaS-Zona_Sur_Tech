import { createClient as createBrowserClient } from "@/utils/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const ACTIVE_ORG_CACHE_KEY = "zs.activeOrganizationId";

interface MeResponse {
  organization?: {
    id: string;
    name: string;
  } | null;
}

async function resolveActiveOrganizationId(
  _type: "browser",
): Promise<string | null> {
  if (typeof window !== "undefined") {
    const cached = window.sessionStorage.getItem(ACTIVE_ORG_CACHE_KEY);
    if (cached) {
      return cached;
    }
  }

  const response = await fetch("/api/auth/me", {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as MeResponse;
  const organizationId = payload.organization?.id ?? null;

  if (organizationId && typeof window !== "undefined") {
    window.sessionStorage.setItem(ACTIVE_ORG_CACHE_KEY, organizationId);
  }

  return organizationId;
}

/**
 * Universal API client for NestJS backend.
 * Automatically injects the Supabase JWT and active workspace header.
 */
export async function apiFetch<T>(
  path: string, 
  options: RequestInit = {},
  type: "browser" = "browser"
): Promise<{ data: T | null; error: string | null; status: number }> {
  try {
    const supabase = createBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers = new Headers(options.headers);
    if (session?.access_token) {
      headers.set("Authorization", `Bearer ${session.access_token}`);
    }
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (!headers.has("X-Organization-Id")) {
      const organizationId = await resolveActiveOrganizationId(type);
      if (organizationId) {
        headers.set("X-Organization-Id", organizationId);
      }
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    const status = response.status;
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        data: null, 
        error: errorData.message || response.statusText, 
        status 
      };
    }

    const data = await response.json();
    return { data, error: null, status };
  } catch (error: any) {
    return { 
      data: null, 
      error: error.message || "Unknown error connecting to API", 
      status: 500 
    };
  }
}

/**
 * Convenience wrapper for Browser-side calls (use in useEffect or event handlers)
 */
export async function clientFetcher<T>(path: string, options: RequestInit = {}) {
  return apiFetch<T>(path, options, "browser");
}
