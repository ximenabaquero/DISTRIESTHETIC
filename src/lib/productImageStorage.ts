import path from 'path';
import { randomUUID } from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET = 'product-images'; // nombre del bucket en Supabase Storage

// Inicialización lazy: el cliente de Supabase se crea solo cuando se necesita
// por primera vez, no al importar el módulo.
let supabase: SupabaseClient | null = null;

async function getSupabase(): Promise<SupabaseClient | null> {
  if (supabase) return supabase; // ya fue creado → devolver el mismo
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null; // variables de entorno faltantes → no usar Supabase
  const { createClient } = await import('@supabase/supabase-js');
  supabase = createClient(url, key, { auth: { persistSession: false } });
  return supabase;
}

// Detecta la extensión del archivo (ej: ".jpg", ".png")
// Primero intenta leerla del nombre del archivo, luego del tipo MIME.
// Necesario porque algunos navegadores/dispositivos no siempre incluyen la extensión.
function guessExtension(file: File): string {
  const ext = path.extname(file.name || '').toLowerCase().replace(/[^a-z0-9.]/g, '');
  if (ext) return ext;
  const mime = (file.type || '').split('/')[1]; // "image/jpeg" → "jpeg"
  return mime ? `.${mime.split(';')[0]}` : '.bin';
}

/**
 * Sube la imagen de un producto.
 *
 * Flujo:
 * 1. Intenta subir a Supabase Storage (funciona en producción/Vercel)
 * 2. Si falla o no hay Supabase, guarda en /public/uploads (solo sirve en desarrollo local)
 *
 * El nombre del archivo incluye un UUID (identificador único) para evitar:
 * - Colisiones: dos archivos con el mismo nombre no se sobreescriben
 * - Caché: el navegador no sirve una versión vieja si el nombre cambia
 */
export async function saveProductImage(file: File, productId: number): Promise<string> {
  const ext = guessExtension(file);
  // Nombre único: "producto-5/1710000000000-a1b2c3d4.jpg"
  const fileName = `producto-${productId}/${Date.now()}-${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer()); // convertir File a bytes

  const sb = await getSupabase();
  if (sb) {
    // Intentar subir a Supabase Storage
    const { error } = await sb.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false, // no sobreescribir si ya existe (el UUID garantiza unicidad)
      });

    if (!error) {
      // Obtener la URL pública para guardarla en la base de datos
      const { data } = sb.storage.from(BUCKET).getPublicUrl(fileName);
      return data.publicUrl;
    }
    console.error('[productImageStorage] Error subiendo a Supabase Storage:', error.message);
  }

  // ── Fallback: guardar en filesystem local (solo funciona en desarrollo) ──
  const { promises: fs } = await import('fs');
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const localName = `producto-${productId}-${Date.now()}-${randomUUID()}${ext}`;
  await fs.mkdir(uploadsDir, { recursive: true }); // crear carpeta si no existe
  await fs.writeFile(path.join(uploadsDir, localName), buffer);
  return `/uploads/${localName}`; // URL relativa accesible desde el navegador
}

/**
 * Elimina la imagen de un producto.
 * Detecta automáticamente si la URL viene de Supabase Storage o de /uploads local
 * y usa el método de borrado correcto en cada caso.
 */
export async function deleteProductImage(url: string | null | undefined): Promise<void> {
  if (!url) return; // no hay imagen → nada que borrar

  const sb = await getSupabase();
  if (sb && !url.startsWith('/uploads/')) {
    // Es una URL de Supabase Storage → extraer el path dentro del bucket
    try {
      const urlObj = new URL(url);
      const marker = `/storage/v1/object/public/${BUCKET}/`;
      const parts = urlObj.pathname.split(marker);
      if (parts.length > 1) {
        const storagePath = decodeURIComponent(parts[1]); // decodificar %20, etc.
        await sb.storage.from(BUCKET).remove([storagePath]);
      }
    } catch {
      console.warn('[productImageStorage] No se pudo parsear la URL de imagen:', url);
    }
    return;
  }

  // Es una URL local /uploads/...
  if (url.startsWith('/uploads/')) {
    const { promises: fs } = await import('fs');
    // Defensa contra path traversal: limpiar "/" iniciales y "../"
    // Sin esto, un atacante podría poner "../../../etc/passwd" como URL
    // y borrar archivos del sistema fuera de /public/uploads.
    const relative = url.replace(/^\/+/, '').replace(/\.\.+/g, '');
    const filePath = path.join(process.cwd(), 'public', relative);
    try {
      await fs.unlink(filePath); // borrar el archivo
    } catch (e) {
      const err = e as NodeJS.ErrnoException;
      // ENOENT = archivo no encontrado → no es un error real, ignorar
      if (err.code !== 'ENOENT') {
        console.warn('[productImageStorage] No se pudo eliminar:', filePath);
      }
    }
  }
}

// Aliases de compatibilidad con el código existente en imagen/route.ts
export { saveProductImage as saveProductImageToLocal };
export { deleteProductImage as deleteLocalProductImage };
