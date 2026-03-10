import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'product-images';

function getSupabase() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }

  const sb = getSupabase();

  // 1. Obtener todas las URLs de imagen guardadas en la tabla productos
  const { data: productos, error: prodError } = await sb
    .from('productos')
    .select('imagen_url')
    .not('imagen_url', 'is', null);

  if (prodError) {
    return NextResponse.json({ ok: false, error: prodError.message }, { status: 500 });
  }

  const urlsActivas = new Set(
    (productos ?? []).map(p => p.imagen_url).filter(Boolean)
  );

  // 2. Listar todas las carpetas (producto-1, producto-2, ...) en el bucket
  const { data: carpetas, error: carpetasError } = await sb.storage
    .from(BUCKET)
    .list('', { limit: 1000 });

  if (carpetasError) {
    return NextResponse.json({ ok: false, error: carpetasError.message }, { status: 500 });
  }

  const archivosHuerfanos: string[] = [];

  // 3. Por cada carpeta, listar sus archivos y detectar huérfanos
  for (const carpeta of carpetas ?? []) {
    const { data: archivos } = await sb.storage
      .from(BUCKET)
      .list(carpeta.name, { limit: 1000 });

    for (const archivo of archivos ?? []) {
      const storagePath = `${carpeta.name}/${archivo.name}`;
      const { data } = sb.storage.from(BUCKET).getPublicUrl(storagePath);
      const publicUrl = data.publicUrl;

      // Si la URL pública no está entre las activas → es huérfana
      if (!urlsActivas.has(publicUrl)) {
        archivosHuerfanos.push(storagePath);
      }
    }
  }

  if (archivosHuerfanos.length === 0) {
    return NextResponse.json({ ok: true, eliminados: 0, mensaje: 'No hay imágenes huérfanas.' });
  }

  // 4. Borrar los huérfanos
  const { error: deleteError } = await sb.storage
    .from(BUCKET)
    .remove(archivosHuerfanos);

  if (deleteError) {
    return NextResponse.json({ ok: false, error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    eliminados: archivosHuerfanos.length,
    archivos: archivosHuerfanos,
    mensaje: `Se eliminaron ${archivosHuerfanos.length} imagen(es) huérfana(s).`,
  });
}
