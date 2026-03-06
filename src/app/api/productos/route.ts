import { NextResponse } from 'next/server';
import { getAllProductos, bulkUpdate } from '@/lib/productosStore';
import { requireAdmin } from '@/lib/adminAuth';

function toSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// GET /api/productos        -> lista completa
// GET /api/productos?slug=x -> producto único por slug
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    const productos = await getAllProductos();

    if (slug) {
      const producto = productos.find(p => toSlug(p.nombre) === slug) ?? null;
      if (!producto) {
        return NextResponse.json({ ok: false, error: 'Producto no encontrado.' }, { status: 404 });
      }
      return NextResponse.json({ ok: true, producto });
    }

    return NextResponse.json({ ok: true, productos });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Error inesperado';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

// POST /api/productos -> bulk update [{id, precio, stock}]
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ ok: false, error: 'Formato inválido. Debe ser un array.' }, { status: 400 });
    }
    const sanitized = body.map(item => ({
      id: Number(item.id),
      precio: item.precio === null || item.precio === '' ? null : Number(item.precio),
      stock: Number(item.stock) || 0,
    }));
    const updated = await bulkUpdate(sanitized);
    return NextResponse.json({ ok: true, productos: updated });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Error inesperado';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}