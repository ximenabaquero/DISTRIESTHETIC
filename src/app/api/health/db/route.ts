import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { getPool } from '@/lib/dbClient';

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const configured = Boolean(
    process.env.AZURE_PG_HOST &&
    process.env.AZURE_PG_DATABASE &&
    process.env.AZURE_PG_USER &&
    process.env.AZURE_PG_PASSWORD,
  );

  let reachable = false;
  let errorMessage: string | null = null;

  if (configured) {
    try {
      await getPool().query('SELECT 1');
      reachable = true;
    } catch (e) {
      errorMessage = e instanceof Error ? e.message : 'Error desconocido';
    }
  }

  return NextResponse.json({
    ok: true,
    db: {
      configured,
      reachable,
      ...(process.env.NODE_ENV !== 'production' && errorMessage ? { error: errorMessage } : {}),
    },
  });
}
