import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { encrypt } from "@repo/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Protocolo Email y Llave son requeridos" },
        { status: 400 },
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
       return NextResponse.json(
        { error: error?.message || "No se pudo autenticar al usuario" },
        { status: 401 },
      );
    }

    const token = await encrypt({
      userId: data.user.id,
      organizationId: null,
      role: "member",
    });

    cookies().set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ message: "Sincronización exitosa", user: data.user });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Error en el Kernel de Autenticación" },
      { status: 500 },
    );
  }
}
