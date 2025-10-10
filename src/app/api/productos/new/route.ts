import { NextResponse } from 'next/server';
import { createProducto } from '@/lib/productosStore';
import type { Producto } from '@/data/productos';

type ProductoPayload = Omit<Producto, 'id'>;

const allowedCategorias = new Set(['medicamentos', 'soluciones', 'insumos', 'quimicos', 'ropa', 'proteccion']);

function sanitizePayload(data: unknown): ProductoPayload | { error: string } {
  if (!data || typeof data !== 'object') {
    return { error: 'Cuerpo de la petición inválido' };
  }

  const record = data as Record<string, unknown>;
  const nombre = typeof record.nombre === 'string' ? record.nombre.trim() : '';
  const descripcion = typeof record.descripcion === 'string' ? record.descripcion.trim() : '';
  const categoriaRaw = typeof record.categoria === 'string' ? record.categoria.trim().toLowerCase() : '';
  const etiqueta = typeof record.etiqueta === 'string' ? record.etiqueta.trim().toUpperCase() : '';
  const disponible = typeof record.disponible === 'boolean' ? record.disponible : true;
  const precioRaw = record.precio;
  const stockRaw = record.stock;

  if (!nombre) return { error: 'El nombre es obligatorio' };
  if (!descripcion) return { error: 'La descripción es obligatoria' };
  if (!allowedCategorias.has(categoriaRaw)) return { error: 'Categoría inválida' };
  if (!etiqueta) return { error: 'La etiqueta es obligatoria' };

  let precio: number | null = null;
  if (precioRaw !== null && precioRaw !== undefined && precioRaw !== '') {
    const parsedPrecio = Number(precioRaw);
    if (Number.isNaN(parsedPrecio) || parsedPrecio < 0) {
      return { error: 'Precio inválido' };
    }
    precio = parsedPrecio;
  }

  let stock = 0;
  if (stockRaw !== null && stockRaw !== undefined && stockRaw !== '') {
    const parsedStock = Number(stockRaw);
    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      return { error: 'Stock inválido' };
    }
    stock = parsedStock;
  }

  const imagenUrl = typeof record.imagenUrl === 'string' && record.imagenUrl.trim() ? record.imagenUrl.trim() : null;

  return {
    nombre,
    descripcion,
    categoria: categoriaRaw,
    etiqueta,
    disponible,
    precio,
    stock,
    imagenUrl,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sanitized = sanitizePayload(body);

    if ('error' in sanitized) {
      return NextResponse.json({ ok: false, error: sanitized.error }, { status: 400 });
    }

    const nuevo = await createProducto(sanitized);
    return NextResponse.json({ ok: true, producto: nuevo }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
