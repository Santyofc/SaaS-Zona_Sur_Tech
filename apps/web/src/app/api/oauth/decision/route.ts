import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const decision = formData.get("decision") as string;
  const authorizationId = formData.get("authorization_id") as string;

  if (!authorizationId) {
    return NextResponse.json({ error: "authorization_id is required" }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  try {
    if (decision === "approve") {
      const { data, error } = await supabase.auth.oauth.approveAuthorization(authorizationId);
      if (error) throw error;
      
      return NextResponse.redirect(data.redirect_url);
    } else {
      const { data, error } = await supabase.auth.oauth.denyAuthorization(authorizationId);
      if (error) throw error;
      
      return NextResponse.redirect(data.redirect_url);
    }
  } catch (error: any) {
    console.error("OAuth Decision Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process decision" }, { status: 500 });
  }
}
