import { NextRequest, NextResponse } from 'next/server';
import { createPedido, getAllPedidos, type CreatePedidoData } from '@/lib/pedidosStore';
import { requireAdmin } from '@/lib/adminAuth';

// Rate limiting: 5 pedidos / 10 min por IP (previene flood de órdenes falsas)
const orderAttempts = new Map<string, { count: number; resetAt: number }>();
const ORDER_MAX = 5;
const ORDER_WINDOW = 10 * 60 * 1000;

function isOrderRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = orderAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    orderAttempts.set(ip, { count: 1, resetAt: now + ORDER_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > ORDER_MAX;
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  if (isOrderRateLimited(getIp(request))) {
    return NextResponse.json(
      { ok: false, error: 'Demasiados pedidos. Intenta en unos minutos.' },
      { status: 429 },
    );
  }
  try {
    const body = await request.json();
    const { items, total, metodo_pago, referencia, nombre, telefono, ciudad, direccion, notas } = body;

    if (!items || !Array.isArray(items) || items.length === 0 || items.length > 50) {
      return NextResponse.json({ ok: false, error: 'Items inválidos.' }, { status: 400 });
    }
    // Validar cada item
    for (const item of items) {
      if (
        typeof item.nombre !== 'string' || item.nombre.length > 200 ||
        typeof item.cantidad !== 'number' || item.cantidad < 1 || item.cantidad > 999 ||
        (item.precio !== null && (typeof item.precio !== 'number' || item.precio < 0 || item.precio > 100_000_000))
      ) {
        return NextResponse.json({ ok: false, error: 'Datos de item inválidos.' }, { status: 400 });
      }
    }
    if (typeof total !== 'number' || total < 0 || total > 100_000_000) {
      return NextResponse.json({ ok: false, error: 'Total inválido.' }, { status: 400 });
    }
    if (!['whatsapp', 'mercadopago'].includes(metodo_pago)) {
      return NextResponse.json({ ok: false, error: 'Método de pago inválido.' }, { status: 400 });
    }
    if (
      referencia !== undefined &&
      (typeof referencia !== 'string' || referencia.length > 100)
    ) {
      return NextResponse.json({ ok: false, error: 'Referencia inválida.' }, { status: 400 });
    }
    if (nombre !== undefined && (typeof nombre !== 'string' || nombre.length > 200)) {
      return NextResponse.json({ ok: false, error: 'Nombre inválido.' }, { status: 400 });
    }
    if (telefono !== undefined && (typeof telefono !== 'string' || telefono.length > 20)) {
      return NextResponse.json({ ok: false, error: 'Teléfono inválido.' }, { status: 400 });
    }
    if (ciudad !== undefined && (typeof ciudad !== 'string' || ciudad.length > 100)) {
      return NextResponse.json({ ok: false, error: 'Ciudad inválida.' }, { status: 400 });
    }
    if (direccion !== undefined && (typeof direccion !== 'string' || direccion.length > 500)) {
      return NextResponse.json({ ok: false, error: 'Dirección inválida.' }, { status: 400 });
    }
    if (notas !== undefined && (typeof notas !== 'string' || notas.length > 500)) {
      return NextResponse.json({ ok: false, error: 'Notas inválidas.' }, { status: 400 });
    }

    const data: CreatePedidoData = {
      items,
      total,
      metodoPago: metodo_pago,
      referencia: typeof referencia === 'string' ? referencia : undefined,
      nombre: typeof nombre === 'string' ? nombre : undefined,
      telefono: typeof telefono === 'string' ? telefono : undefined,
      ciudad: typeof ciudad === 'string' ? ciudad : undefined,
      direccion: typeof direccion === 'string' ? direccion : undefined,
      notas: typeof notas === 'string' ? notas : undefined,
    };

    const pedido = await createPedido(data);
    return NextResponse.json({ ok: true, pedido });
  } catch (err) {
    console.error('[POST /api/pedidos] Error:', err);
    return NextResponse.json({ ok: false, error: 'Error al procesar el pedido.' }, { status: 500 });
  }
}

export async function GET(_request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }
  try {
    const pedidos = await getAllPedidos();
    return NextResponse.json({ ok: true, pedidos });
  } catch {
    return NextResponse.json({ ok: false, error: 'Error al obtener pedidos.' }, { status: 500 });
  }
}
