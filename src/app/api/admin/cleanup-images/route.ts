import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { getPool } from '@/lib/dbClient';
import path from 'path';

export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }

  const { promises: fs } = await import('fs');
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  // 1. Obtener todas las URLs de imagen activas en la BD
  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT imagen_url FROM productos WHERE imagen_url IS NOT NULL`,
  );
  const urlsActivas = new Set(
    rows.map((r: Record<string, unknown>) => r.imagen_url as string).filter(Boolean),
  );

  // 2. Listar archivos en /public/uploads
  let archivos: string[] = [];
  try {
    archivos = await fs.readdir(uploadsDir);
  } catch {
    // La carpeta puede no existir si nunca se subió ninguna imagen
    return NextResponse.json({ ok: true, eliminados: 0, mensaje: 'No hay carpeta de uploads.' });
  }

  // 3. Detectar archivos huérfanos (no referenciados en la BD)
  const huerfanos: string[] = [];
  for (const archivo of archivos) {
    const urlRelativa = `/uploads/${archivo}`;
    if (!urlsActivas.has(urlRelativa)) {
      huerfanos.push(archivo);
    }
  }

  if (huerfanos.length === 0) {
    return NextResponse.json({ ok: true, eliminados: 0, mensaje: 'No hay imágenes huérfanas.' });
  }

  // 4. Borrar los huérfanos
  const errores: string[] = [];
  for (const archivo of huerfanos) {
    try {
      await fs.unlink(path.join(uploadsDir, archivo));
    } catch {
      errores.push(archivo);
    }
  }

  return NextResponse.json({
    ok: true,
    eliminados: huerfanos.length - errores.length,
    archivos: huerfanos,
    ...(errores.length > 0 ? { errores } : {}),
    mensaje: `Se eliminaron ${huerfanos.length - errores.length} imagen(es) huérfana(s).`,
  });
}
