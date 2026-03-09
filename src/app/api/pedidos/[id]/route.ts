import { NextResponse } from 'next/server';
import { getPedidoById, updatePedidoEstado, type PedidoEstado } from '@/lib/pedidosStore';
import { decrementarStock } from '@/lib/productosStore';
import { requireAdmin } from '@/lib/adminAuth';

type RouteParams = { params: Promise<{ id: string }> } | { params: { id: string } };

function isPromise<T>(value: unknown): value is Promise<T> {
  return typeof value === 'object' && value !== null && typeof (value as Promise<T>).then === 'function';
}

const VALID_ESTADOS: PedidoEstado[] = ['sin_entregar', 'entregado', 'cancelado'];

export async function PATCH(request: Request, context: RouteParams) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }

  const params = isPromise(context.params) ? await context.params : context.params;
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ ok: false, error: 'ID inválido.' }, { status: 400 });
  }

  const body = await request.json();
  const { estado } = body;

  if (!VALID_ESTADOS.includes(estado)) {
    return NextResponse.json({ ok: false, error: 'Estado inválido.' }, { status: 400 });
  }

  // Si se está marcando como entregado, decrementar stock (solo si estaba sin_entregar)
  if (estado === 'entregado') {
    const pedidoActual = await getPedidoById(id);
    if (pedidoActual && pedidoActual.estado !== 'entregado') {
      await decrementarStock(
        pedidoActual.items
          .filter(item => item.id && item.cantidad > 0)
          .map(item => ({ id: item.id, cantidad: item.cantidad })),
      ).catch(err => console.error('[pedidos] Error decrementando stock:', err));
    }
  }

  const pedido = await updatePedidoEstado(id, estado);
  if (!pedido) {
    return NextResponse.json({ ok: false, error: 'Pedido no encontrado.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, pedido });
}
