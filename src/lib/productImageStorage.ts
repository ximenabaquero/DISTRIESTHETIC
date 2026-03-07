import path from 'path';
import { randomUUID } from 'crypto';
import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET = 'product-images';

let supabase: SupabaseClient | null = null;

async function getSupabase(): Promise<SupabaseClient | null> {
  if (supabase) return supabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const { createClient } = await import('@supabase/supabase-js');
  supabase = createClient(url, key, { auth: { persistSession: false } });
  return supabase;
}

function guessExtension(file: File): string {
  const ext = path.extname(file.name || '').toLowerCase().replace(/[^a-z0-9.]/g, '');
  if (ext) return ext;
  const mime = (file.type || '').split('/')[1];
  return mime ? `.${mime.split(';')[0]}` : '.bin';
}

/**
 * Sube la imagen de un producto.
 * Primario: Supabase Storage (funciona en producción/Vercel).
 * Fallback: filesystem local (solo sirve en desarrollo).
 */
export async function saveProductImage(file: File, productId: number): Promise<string> {
  const ext = guessExtension(file);
  const fileName = `producto-${productId}/${Date.now()}-${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const sb = await getSupabase();
  if (sb) {
    const { error } = await sb.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });

    if (!error) {
      const { data } = sb.storage.from(BUCKET).getPublicUrl(fileName);
      return data.publicUrl;
    }
    console.error('[productImageStorage] Error subiendo a Supabase Storage:', error.message);
  }

  // Fallback local (solo desarrollo)
  const { promises: fs } = await import('fs');
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const localName = `producto-${productId}-${Date.now()}-${randomUUID()}${ext}`;
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, localName), buffer);
  return `/uploads/${localName}`;
}

/**
 * Elimina la imagen de un producto.
 * Detecta automáticamente si es una URL de Supabase Storage o local.
 */
export async function deleteProductImage(url: string | null | undefined): Promise<void> {
  if (!url) return;

  const sb = await getSupabase();
  if (sb && !url.startsWith('/uploads/')) {
    // URL de Supabase Storage: extraer el path dentro del bucket
    try {
      const urlObj = new URL(url);
      const marker = `/storage/v1/object/public/${BUCKET}/`;
      const parts = urlObj.pathname.split(marker);
      if (parts.length > 1) {
        const storagePath = decodeURIComponent(parts[1]);
        await sb.storage.from(BUCKET).remove([storagePath]);
      }
    } catch {
      console.warn('[productImageStorage] No se pudo parsear la URL de imagen:', url);
    }
    return;
  }

  // URL local /uploads/...
  if (url.startsWith('/uploads/')) {
    const { promises: fs } = await import('fs');
    const relative = url.replace(/^\/+/, '').replace(/\.\.+/g, '');
    const filePath = path.join(process.cwd(), 'public', relative);
    try {
      await fs.unlink(filePath);
    } catch (e) {
      const err = e as NodeJS.ErrnoException;
      if (err.code !== 'ENOENT') {
        console.warn('[productImageStorage] No se pudo eliminar:', filePath);
      }
    }
  }
}

// Aliases de compatibilidad con el código existente en imagen/route.ts
export { saveProductImage as saveProductImageToLocal };
export { deleteProductImage as deleteLocalProductImage };
