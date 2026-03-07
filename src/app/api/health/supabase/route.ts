import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasUrl = Boolean(supabaseUrl);
  const hasServiceKey = Boolean(serviceKey);
  let reachable = false;
  let overridesCount: number | null = null;
  let errorMessage: string | null = null;

  if (hasUrl && hasServiceKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const client = createClient(supabaseUrl as string, serviceKey as string, { auth: { persistSession: false } });
      const { count, error } = await client
        .from('productos_overrides')
        .select('id', { count: 'exact', head: true });
      if (error) {
        errorMessage = error.message;
      } else {
        reachable = true;
        overridesCount = count ?? 0;
      }
    } catch (e) {
      errorMessage = e instanceof Error ? e.message : 'Error desconocido';
    }
  }

  return NextResponse.json({
    ok: true,
    supabase: {
      configured: hasUrl && hasServiceKey,
      reachable,
      overridesCount,
      // error se omite en producción para no filtrar detalles internos
      ...(process.env.NODE_ENV !== 'production' && errorMessage ? { error: errorMessage } : {}),
    }
  });
}
