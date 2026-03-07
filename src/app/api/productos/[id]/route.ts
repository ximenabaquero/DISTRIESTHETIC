import { NextRequest, NextResponse } from 'next/server';
import { deleteProducto, updateProductoInfo, type ProductoInfoUpdate } from '@/lib/productosStore';
import { requireAdmin } from '@/lib/adminAuth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const allowedCategorias = new Set(['medicamentos', 'soluciones', 'insumos', 'quimicos', 'ropa', 'proteccion']);

function sanitizeUpdatePayload(data: unknown): ProductoInfoUpdate | { error: string } {
  if (!data || typeof data !== 'object') {
    return { error: 'Cuerpo de la petición inválido' };
  }

  const record = data as Record<string, unknown>;
  const payload: ProductoInfoUpdate = {};

  if ('nombre' in record) {
    const nombre = typeof record.nombre === 'string' ? record.nombre.trim() : '';
    if (!nombre) return { error: 'El nombre no puede estar vacío' };
    payload.nombre = nombre;
  }

  if ('descripcion' in record) {
    const descripcion = typeof record.descripcion === 'string' ? record.descripcion.trim() : '';
    if (!descripcion) return { error: 'La descripción no puede estar vacía' };
    payload.descripcion = descripcion;
  }

  if ('etiqueta' in record) {
    const etiqueta = typeof record.etiqueta === 'string' ? record.etiqueta.trim().toUpperCase() : '';
    if (!etiqueta) return { error: 'La etiqueta no puede estar vacía' };
    payload.etiqueta = etiqueta;
  }

  if ('categoria' in record) {
    const categoria = typeof record.categoria === 'string' ? record.categoria.trim().toLowerCase() : '';
    if (!allowedCategorias.has(categoria)) return { error: 'Categoría inválida' };
    payload.categoria = categoria as ProductoInfoUpdate['categoria'];
  }

  if ('disponible' in record) {
    if (typeof record.disponible !== 'boolean') return { error: 'Disponible debe ser booleano' };
    payload.disponible = record.disponible;
  }

  if (Object.keys(payload).length === 0) {
    return { error: 'No se proporcionaron campos para actualizar' };
  }

  return payload;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }
  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ ok: false, error: 'ID inválido' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const sanitized = sanitizeUpdatePayload(body);
    if ('error' in sanitized) {
      return NextResponse.json({ ok: false, error: sanitized.error }, { status: 400 });
    }

    const updated = await updateProductoInfo(id, sanitized);
    if (!updated) {
      return NextResponse.json({ ok: false, error: 'Producto no encontrado' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, producto: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }
  const { id: rawId } = await context.params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ ok: false, error: 'ID inválido' }, { status: 400 });
  }

  try {
    const removed = await deleteProducto(id);
    if (!removed) {
      return NextResponse.json({ ok: false, error: 'El producto no puede eliminarse o no existe' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, producto: removed });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
