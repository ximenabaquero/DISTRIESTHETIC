import { NextResponse } from 'next/server';
import { getAllPedidos } from '@/lib/pedidosStore';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }

  const pedidos = await getAllPedidos();
  const { utils, write } = await import('xlsx');

  const rows = pedidos.map(p => ({
    ID: p.id,
    Fecha: new Date(p.createdAt).toLocaleString('es-CO'),
    Productos: p.items.map(i => `${i.nombre} x${i.cantidad}`).join(' | '),
    'Total (COP)': p.total,
    Método: p.metodoPago,
    Estado: p.estado,
    Referencia: p.referencia ?? '',
  }));

  const ws = utils.json_to_sheet(rows);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Pedidos');

  // Ancho de columnas
  ws['!cols'] = [
    { wch: 6 }, { wch: 20 }, { wch: 50 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 30 },
  ];

  const buf = write(wb, { type: 'buffer', bookType: 'xlsx' });
  const now = new Date().toISOString().slice(0, 10);

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="pedidos-${now}.xlsx"`,
    },
  });
}
