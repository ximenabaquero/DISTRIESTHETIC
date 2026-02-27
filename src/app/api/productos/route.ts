import { NextResponse } from 'next/server';
import { getAllProductos, bulkUpdate } from '@/lib/productosStore';
import { requireAdmin } from '@/lib/adminAuth';

// GET /api/productos -> lista completa
export async function GET() {
  try {
    const productos = await getAllProductos();
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