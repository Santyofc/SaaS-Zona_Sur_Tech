import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const supabaseAdmin = createAdminClient();
    
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (error) {
      console.error("[CHECK_EMAIL] Error accessing database:", error);
      return NextResponse.json({ error: "Internal Database Error" }, { status: 500 });
    }

    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error("[CHECK_EMAIL] Unexpected Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
