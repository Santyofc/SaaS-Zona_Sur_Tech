import { NextResponse } from "next/server";

/**
 * Dummy NextAuth session handler for the web app.
 * 
 * Satisfies client-side SessionProvider fetches to avoid 404 HTML responses
 * which cause "Unexpected token '<'" JSON parsing errors.
 */
export async function GET() {
  return NextResponse.json(null);
}

export const POST = GET;
