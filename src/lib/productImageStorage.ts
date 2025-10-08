import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

function ensureLeadingDot(ext: string): string {
  if (!ext) return '';
  return ext.startsWith('.') ? ext : `.${ext}`;
}

function guessExtension(file: File): string {
  const originalExt = path.extname(file.name || '')
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '');
  if (originalExt) return originalExt;
  const mimeType = file.type || '';
  const guessed = mimeType.split('/')[1];
  if (guessed) {
    return ensureLeadingDot(guessed.split(';')[0]);
  }
  return '.bin';
}

function buildFileName(productId: number, extension: string): string {
  const safeExt = ensureLeadingDot(extension.toLowerCase().replace(/[^a-z0-9.]/g, '')) || '.bin';
  return `producto-${productId}-${Date.now()}-${randomUUID()}${safeExt}`;
}

function resolveLocalPathFromUrl(url: string | null | undefined): string | null {
  if (!url || !url.startsWith('/uploads/')) return null;
  const relative = url.replace(/^\/+/, '').replace(/\.\.+/g, '');
  return path.join(process.cwd(), 'public', relative);
}

export async function saveProductImageToLocal(file: File, productId: number): Promise<{ url: string; savedPath: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = buildFileName(productId, guessExtension(file));
  await fs.mkdir(uploadsDir, { recursive: true });
  const targetPath = path.join(uploadsDir, fileName);
  await fs.writeFile(targetPath, buffer);
  return { url: `/uploads/${fileName}`, savedPath: targetPath };
}

export async function deleteLocalProductImage(url: string | null | undefined): Promise<void> {
  const filePath = resolveLocalPathFromUrl(url);
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== 'ENOENT') {
      console.warn(`[productImageStorage] No se pudo eliminar la imagen ${filePath}:`, err.message);
    }
  }
}
