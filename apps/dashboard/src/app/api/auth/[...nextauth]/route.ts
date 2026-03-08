import { NextResponse } from "next/server";

/**
 * Dummy NextAuth route handler for the dashboard app.
 * 
 * Since some shared UI components or providers may expect a NextAuth session
 * endpoint at /api/auth/session, we provide this to avoid 404 HTML responses
 * which cause "Unexpected token '<'" JSON parsing errors.
 */
export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  
  if (pathname.endsWith("/session")) {
    return NextResponse.json(null);
  }
  
  return NextResponse.json({}, { status: 404 });
}

export const POST = GET;
