import { NextResponse } from 'next/server';

export async function GET() {
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
      hasUrl,
      hasServiceKey, // indica si la variable existe (no revela su valor)
      reachable,
      overridesCount,
      error: errorMessage,
    }
  });
}
