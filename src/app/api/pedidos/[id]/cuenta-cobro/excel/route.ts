import { getPedidoById } from '@/lib/pedidosStore';
import { getContactInfo } from '@/lib/contactInfoStore';
import * as XLSX from 'xlsx';

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pedidoId = Number(id);

  if (isNaN(pedidoId)) {
    return new Response('ID inválido', { status: 400 });
  }

  const [pedido, contacto] = await Promise.all([
    getPedidoById(pedidoId),
    getContactInfo(),
  ]);

  if (!pedido) {
    return new Response('Pedido no encontrado', { status: 404 });
  }

  const fecha = new Date(pedido.createdAt).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const wb = XLSX.utils.book_new();

  // --- Hoja: Cuenta de cobro ---
  const rows: (string | number)[][] = [];

  // Encabezado empresa
  rows.push(['DISTRIESTHETIC - Distribución de productos estéticos']);
  rows.push([`Teléfono: ${contacto.telefono}   |   WhatsApp: +${contacto.whatsapp}`]);
  rows.push([]);

  // Info del pedido
  rows.push(['CUENTA DE COBRO']);
  rows.push(['Número de pedido', `#${String(pedidoId).padStart(4, '0')}`]);
  rows.push(['Fecha', fecha]);
  rows.push(['Método de pago', pedido.metodoPago === 'wompi' ? 'Wompi (pago en línea)' : 'WhatsApp']);
  rows.push(['Estado', pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)]);
  if (pedido.referencia) rows.push(['Referencia', pedido.referencia]);
  rows.push([]);

  // Tabla de items
  rows.push(['Producto', 'Cantidad', 'Precio unitario', 'Subtotal']);
  for (const item of pedido.items) {
    const precio = item.precio ?? 0;
    rows.push([item.nombre, item.cantidad, fmt(precio), fmt(precio * item.cantidad)]);
  }
  rows.push([]);
  rows.push(['', '', 'TOTAL', fmt(pedido.total)]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Anchos de columna
  ws['!cols'] = [{ wch: 40 }, { wch: 12 }, { wch: 20 }, { wch: 20 }];

  // Merge encabezado empresa (fila 0: A1:D1, fila 1: A2:D2, fila 3: A4:D4)
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Cuenta de Cobro');

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  return new Response(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="cuenta-cobro-${pedidoId}.xlsx"`,
      'Cache-Control': 'no-store',
    },
  });
}
