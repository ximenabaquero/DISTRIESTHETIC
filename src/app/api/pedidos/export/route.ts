import { NextResponse } from 'next/server';
import { getAllPedidos } from '@/lib/pedidosStore';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }

  const pedidos = await getAllPedidos();

  const rows: string[] = [
    ['ID', 'Fecha', 'Productos', 'Total', 'Método', 'Estado', 'Referencia'].join(','),
    ...pedidos.map(p => {
      const productosStr = p.items.map(i => `${i.nombre} x${i.cantidad}`).join(' | ');
      return [
        p.id,
        new Date(p.createdAt).toLocaleString('es-CO'),
        `"${productosStr}"`,
        p.total,
        p.metodoPago,
        p.estado,
        p.referencia ?? '',
      ].join(',');
    }),
  ];

  const csv = rows.join('\n');
  const now = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="pedidos-${now}.csv"`,
    },
  });
}
