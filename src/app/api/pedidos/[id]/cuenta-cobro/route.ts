import { NextResponse } from 'next/server';
import { getPedidoById } from '@/lib/pedidosStore';
import { getContactInfo } from '@/lib/contactInfoStore';

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pedidoId = Number(id);

  if (isNaN(pedidoId)) {
    return NextResponse.json({ ok: false, error: 'ID inválido.' }, { status: 400 });
  }

  const [pedido, contacto] = await Promise.all([
    getPedidoById(pedidoId),
    getContactInfo(),
  ]);

  if (!pedido) {
    return NextResponse.json({ ok: false, error: 'Pedido no encontrado.' }, { status: 404 });
  }

  const fecha = new Date(pedido.createdAt).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const itemsRows = pedido.items.map(item => {
    const precio = item.precio ?? 0;
    const subtotal = precio * item.cantidad;
    return `
      <tr>
        <td>${item.nombre}</td>
        <td class="center">${item.cantidad}</td>
        <td class="right">${fmt(precio)}</td>
        <td class="right bold">${fmt(subtotal)}</td>
      </tr>`;
  }).join('');

  const metodoPago = pedido.metodoPago === 'wompi' ? 'Wompi (pago en línea)' : 'WhatsApp';

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cuenta de Cobro #${pedido.id} - DISTRIESTHETIC</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 13px;
      color: #1a1a2e;
      background: #f5f7fb;
      padding: 32px 16px;
    }
    .page {
      max-width: 720px;
      margin: 0 auto;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    /* Header */
    .header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: #fff;
      padding: 28px 36px 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }
    .header-brand h1 {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .header-brand p {
      font-size: 11px;
      opacity: 0.8;
      margin-top: 3px;
    }
    .header-doc {
      text-align: right;
    }
    .header-doc .doc-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.75;
    }
    .header-doc .doc-number {
      font-size: 28px;
      font-weight: 800;
      line-height: 1;
    }
    /* Body */
    .body { padding: 28px 36px; }
    /* Meta grid */
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .meta-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 16px;
    }
    .meta-card .label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #64748b;
      margin-bottom: 4px;
    }
    .meta-card .value {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
    }
    /* Table */
    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #64748b;
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    thead tr {
      background: #1e40af;
      color: #fff;
    }
    thead th {
      padding: 10px 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    thead th:first-child { border-radius: 6px 0 0 6px; text-align: left; }
    thead th:last-child { border-radius: 0 6px 6px 0; }
    tbody tr { border-bottom: 1px solid #f1f5f9; }
    tbody tr:last-child { border-bottom: none; }
    tbody td { padding: 10px 12px; color: #374151; }
    tbody tr:hover { background: #f8fafc; }
    .center { text-align: center; }
    .right { text-align: right; }
    .bold { font-weight: 700; }
    /* Totales */
    .totales {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 24px;
    }
    .totales-box {
      width: 280px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
    }
    .totales-row {
      display: flex;
      justify-content: space-between;
      padding: 9px 16px;
      font-size: 13px;
      border-bottom: 1px solid #e2e8f0;
    }
    .totales-row:last-child { border-bottom: none; }
    .totales-row.total {
      background: #1e40af;
      color: #fff;
      font-weight: 700;
      font-size: 15px;
    }
    /* Footer */
    .footer {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 18px 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #64748b;
      gap: 12px;
      flex-wrap: wrap;
    }
    .footer .contact-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
    }
    .badge-sin_entregar { background: #fef9c3; color: #854d0e; }
    .badge-entregado    { background: #dcfce7; color: #166534; }
    .badge-cancelado    { background: #fee2e2; color: #991b1b; }
    /* Print */
    .print-btn-row {
      display: flex;
      justify-content: center;
      gap: 12px;
      padding: 20px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: opacity 0.15s;
    }
    .btn:hover { opacity: 0.85; }
    .btn-primary { background: #1e40af; color: #fff; }
    .btn-excel { background: #166534; color: #fff; text-decoration: none; }
    .btn-secondary { background: #f1f5f9; color: #374151; }
    @media print {
      body { background: #fff; padding: 0; }
      .page { box-shadow: none; border-radius: 0; max-width: 100%; }
      .print-btn-row { display: none; }
      .footer { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Botones (solo pantalla) -->
    <div class="print-btn-row">
      <button class="btn btn-primary" onclick="window.print()">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
        </svg>
        Guardar PDF
      </button>
      <a class="btn btn-excel" href="/api/pedidos/${pedido.id}/cuenta-cobro/excel" download="cuenta-cobro-${pedido.id}.xlsx">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Descargar Excel
      </a>
      <button class="btn btn-secondary" onclick="window.close()">Cerrar</button>
    </div>

    <!-- Header -->
    <div class="header">
      <div class="header-brand">
        <h1>DISTRIESTHETIC</h1>
        <p>Distribución de productos estéticos</p>
        <p style="margin-top:10px; font-size:12px; opacity:0.9;">Tel: ${contacto.telefono}</p>
      </div>
      <div class="header-doc">
        <p class="doc-label">Cuenta de Cobro</p>
        <p class="doc-number">#${String(pedido.id).padStart(4, '0')}</p>
        <p style="font-size:12px; opacity:0.85; margin-top:6px;">${fecha}</p>
      </div>
    </div>

    <!-- Body -->
    <div class="body">
      <!-- Meta -->
      <div class="meta-grid">
        <div class="meta-card">
          <p class="label">Método de pago</p>
          <p class="value">${metodoPago}</p>
        </div>
        <div class="meta-card">
          <p class="label">Estado</p>
          <p class="value">
            <span class="badge badge-${pedido.estado}">${
              pedido.estado === 'sin_entregar' ? 'Sin entregar' :
              pedido.estado === 'entregado'    ? 'Entregado' : 'Cancelado'
            }</span>
          </p>
        </div>
        ${pedido.nombre ? `
        <div class="meta-card">
          <p class="label">Nombre del destinatario</p>
          <p class="value">${pedido.nombre}</p>
        </div>` : ''}
        ${pedido.telefono ? `
        <div class="meta-card">
          <p class="label">Teléfono</p>
          <p class="value">${pedido.telefono}</p>
        </div>` : ''}
        ${pedido.ciudad ? `
        <div class="meta-card">
          <p class="label">Ciudad</p>
          <p class="value">${pedido.ciudad}</p>
        </div>` : ''}
        ${pedido.direccion ? `
        <div class="meta-card" style="grid-column: 1 / -1">
          <p class="label">Dirección de entrega</p>
          <p class="value">${pedido.direccion}</p>
        </div>` : ''}
        ${pedido.notas ? `
        <div class="meta-card" style="grid-column: 1 / -1">
          <p class="label">Instrucciones de entrega</p>
          <p class="value" style="font-style: italic; color: #475569;">${pedido.notas}</p>
        </div>` : ''}
        ${pedido.referencia ? `
        <div class="meta-card" style="grid-column: 1 / -1">
          <p class="label">Referencia de pago</p>
          <p class="value" style="font-family: monospace; font-size:13px;">${pedido.referencia}</p>
        </div>` : ''}
      </div>

      <!-- Items -->
      <p class="section-title">Detalle de productos</p>
      <table>
        <thead>
          <tr>
            <th style="text-align:left">Producto</th>
            <th class="center">Cant.</th>
            <th class="right">Precio unit.</th>
            <th class="right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <!-- Total -->
      <div class="totales">
        <div class="totales-box">
          <div class="totales-row">
            <span>Subtotal</span>
            <span>${fmt(pedido.total)}</span>
          </div>
          <div class="totales-row total">
            <span>TOTAL</span>
            <span>${fmt(pedido.total)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="contact-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
        ${contacto.telefono}
      </div>
      <div class="contact-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        WhatsApp: +${contacto.whatsapp}
      </div>
      <span style="color:#94a3b8; font-size:11px;">Generado por DISTRIESTHETIC &bull; Pedido #${pedido.id}</span>
    </div>
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
