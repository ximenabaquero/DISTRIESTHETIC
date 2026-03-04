import { NextResponse } from 'next/server';
import { createPedido, getAllPedidos, type CreatePedidoData } from '@/lib/pedidosStore';
import { requireAdmin } from '@/lib/adminAuth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, metodo_pago, referencia } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: 'Items requeridos.' }, { status: 400 });
    }
    if (typeof total !== 'number' || total < 0) {
      return NextResponse.json({ ok: false, error: 'Total inválido.' }, { status: 400 });
    }
    if (!['whatsapp', 'wompi'].includes(metodo_pago)) {
      return NextResponse.json({ ok: false, error: 'Método de pago inválido.' }, { status: 400 });
    }

    const data: CreatePedidoData = {
      items,
      total,
      metodoPago: metodo_pago,
      referencia: typeof referencia === 'string' ? referencia : undefined,
    };

    const pedido = await createPedido(data);
    return NextResponse.json({ ok: true, pedido });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }
  try {
    const pedidos = await getAllPedidos();
    return NextResponse.json({ ok: true, pedidos });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
