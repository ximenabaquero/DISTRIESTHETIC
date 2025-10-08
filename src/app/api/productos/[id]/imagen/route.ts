import { NextResponse } from 'next/server';
import { deleteLocalProductImage, saveProductImageToLocal } from '@/lib/productImageStorage';
import { getAllProductos, setProductoImagen } from '@/lib/productosStore';

type RouteParams = { params: Promise<{ id: string }> } | { params: { id: string } };

function isPromise<T>(value: unknown): value is Promise<T> {
  return typeof value === 'object' && value !== null && typeof (value as Promise<T>).then === 'function';
}

async function resolveProductId(context: RouteParams): Promise<number | null> {
  const params = isPromise(context.params) ? await context.params : context.params;
  return parseProductId(params.id);
}

function parseProductId(raw: string): number | null {
  const value = Number(raw);
  if (Number.isFinite(value) && value > 0) return value;
  return null;
}

export async function POST(request: Request, context: RouteParams) {
  const productId = await resolveProductId(context);
  if (!productId) {
    return NextResponse.json({ ok: false, error: 'ID inválido' }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ ok: false, error: 'Archivo no encontrado' }, { status: 400 });
  }

  const productos = await getAllProductos();
  const current = productos.find(p => p.id === productId);
  if (!current) {
    return NextResponse.json({ ok: false, error: 'Producto no encontrado' }, { status: 404 });
  }

  try {
    const { url } = await saveProductImageToLocal(file, productId);
    const updated = await setProductoImagen(productId, url);

    if (!updated) {
      await deleteLocalProductImage(url);
      return NextResponse.json({ ok: false, error: 'No se pudo actualizar la imagen' }, { status: 500 });
    }

    if (current.imagenUrl && current.imagenUrl !== url) {
      await deleteLocalProductImage(current.imagenUrl);
    }

    return NextResponse.json({ ok: true, producto: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado guardando la imagen';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteParams) {
  const productId = await resolveProductId(context);
  if (!productId) {
    return NextResponse.json({ ok: false, error: 'ID inválido' }, { status: 400 });
  }

  const productos = await getAllProductos();
  const current = productos.find(p => p.id === productId);
  if (!current) {
    return NextResponse.json({ ok: false, error: 'Producto no encontrado' }, { status: 404 });
  }

  const previousUrl = current.imagenUrl;

  const updated = await setProductoImagen(productId, null);
  if (!updated) {
    return NextResponse.json({ ok: false, error: 'No se pudo limpiar la imagen' }, { status: 500 });
  }

  if (previousUrl) {
    await deleteLocalProductImage(previousUrl);
  }

  return NextResponse.json({ ok: true, producto: updated });
}
