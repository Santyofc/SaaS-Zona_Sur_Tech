import { NextResponse } from "next/server";
import { getEmailClient } from "@repo/email";
import { siteConfig } from "@/config/site";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Faltan campos requeridos en el payload" },
        { status: 400 }
      );
    }

    const resend = getEmailClient();
    
    // El correo "from" debe ser un dominio verificado en Resend (por defecto on-boarding@resend.dev si no tienes)
    const fromAddress = process.env.EMAIL_FROM || "onboarding@resend.dev";
    
    // Correo "to" es adonde el usuario quiere recibir los mensajes de contacto
    const toAddress = siteConfig.contact.emails.admin;

    const { data, error } = await resend.emails.send({
      from: `Zona Sur Tech Contacto <${fromAddress}>`,
      to: [toAddress],
      reply_to: email,
      subject: `Nuevo Lead [Zona Sur Tech]: ${subject}`,
      html: `
        <h2>Nuevo Mensaje de Contacto - Zona Sur Tech</h2>
        <p><strong>Identidad:</strong> ${name}</p>
        <p><strong>Protocolo Email:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <hr />
        <h3>Payload:</h3>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    });

    if (error) {
      console.error("[CONTACT_API] Error al intentar enviar correo:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Payload enviado y enrutado con éxito",
      dataId: data?.id 
    });
  } catch (error: any) {
    console.error("[CONTACT_API] Error de ejecución:", error);
    return NextResponse.json(
      { error: "Falla catastrófica en el servidor al despachar el mensaje." },
      { status: 500 }
    );
  }
}
