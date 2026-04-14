import path from 'path';
import { randomUUID } from 'crypto';

// Detecta la extensión del archivo (ej: ".jpg", ".png")
// Primero intenta leerla del nombre del archivo, luego del tipo MIME.
function guessExtension(file: File): string {
  const ext = path.extname(file.name || '').toLowerCase().replace(/[^a-z0-9.]/g, '');
  if (ext) return ext;
  const mime = (file.type || '').split('/')[1]; // "image/jpeg" → "jpeg"
  return mime ? `.${mime.split(';')[0]}` : '.bin';
}

/**
 * Sube la imagen de un producto al filesystem local en /public/uploads.
 *
 * El nombre incluye timestamp + UUID para evitar colisiones y problemas de caché.
 */
export async function saveProductImage(file: File, productId: number): Promise<string> {
  const ext = guessExtension(file);
  const localName = `producto-${productId}-${Date.now()}-${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { promises: fs } = await import('fs');
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, localName), buffer);

  return `/uploads/${localName}`;
}

/**
 * Elimina la imagen de un producto del filesystem local.
 */
export async function deleteProductImage(url: string | null | undefined): Promise<void> {
  if (!url || !url.startsWith('/uploads/')) return;

  const { promises: fs } = await import('fs');
  // Defensa contra path traversal: limpiar "/" iniciales y "../"
  const relative = url.replace(/^\/+/, '').replace(/\.\.+/g, '');
  const filePath = path.join(process.cwd(), 'public', relative);

  try {
    await fs.unlink(filePath);
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    // ENOENT = archivo no encontrado → no es un error real, ignorar
    if (err.code !== 'ENOENT') {
      console.warn('[productImageStorage] No se pudo eliminar:', filePath);
    }
  }
}

// Aliases de compatibilidad con el código existente en imagen/route.ts
export { saveProductImage as saveProductImageToLocal };
export { deleteProductImage as deleteLocalProductImage };
