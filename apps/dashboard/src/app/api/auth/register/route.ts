import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { encrypt } from "@repo/auth";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Protocolo Email y Llave son requeridos" },
        { status: 400 },
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name || email.split("@")[0],
        },
      },
    });

    if (error) {
       return NextResponse.json(
        { error: error.message },
        { status: 400 },
      );
    }

    if (data.user && data.session) {
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
    }

    return NextResponse.json({
      message: "Identidad Creada Exitosamente",
      user: data.user,
      authenticated: Boolean(data.user && data.session),
    }, { status: 201 });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Fallo crítico en el registro del Kernel" },
      { status: 500 },
    );
  }
}
