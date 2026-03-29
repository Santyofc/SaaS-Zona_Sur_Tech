import { NextResponse } from 'next/server';

/**
 * ════════════════════════════════════════════════════════════
 * ZS HEALTH API — ZonaSur Tech
 * Propósito: Monitoreo de pulso y estatus del sistema
 * ════════════════════════════════════════════════════════════
 */

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = {
      status: 'operational',
      timestamp: new Date().toISOString(),
      service: 'zonasurtech-web',
      region: 'us-east-2', // AWS Ohio
      version: '3.2.0',
    };

    return NextResponse.json(status, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'degraded', error: 'Internal system error' },
      { status: 500 }
    );
  }
}
