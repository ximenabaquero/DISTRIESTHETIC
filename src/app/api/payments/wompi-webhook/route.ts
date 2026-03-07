import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { getPedidoByReferencia, updatePedidoEstadoByReferencia } from "@/lib/pedidosStore";

/**
 * Webhook server-to-server de Wompi.
 * Wompi llama a esta ruta con cada cambio de estado de transacción.
 * Solo se acepta si el checksum es válido (firma HMAC de Wompi).
 *
 * Configurar en el panel de Wompi:
 *   URL: https://tudominio.com/api/payments/wompi-webhook
 *   Evento: transaction.updated
 *
 * Variable de entorno requerida:
 *   WOMPI_EVENTS_SECRET  → "Secreto de eventos" del panel de Wompi
 */
export async function POST(request: NextRequest) {
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET;
  if (!eventsSecret) {
    // Si no está configurado aún, respondemos 200 para que Wompi no reintente
    console.warn("[wompi-webhook] WOMPI_EVENTS_SECRET no configurado.");
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ error: "Body ilegible" }, { status: 400 });
  }

  // Verificar checksum: SHA256(body + timestamp + eventsSecret)
  const receivedChecksum = request.headers.get("x-event-checksum") ?? "";
  const timestamp = request.headers.get("x-event-timestamp") ?? "";

  const expectedChecksum = createHash("sha256")
    .update(`${body}${timestamp}${eventsSecret}`)
    .digest("hex");

  if (
    !receivedChecksum ||
    !timestamp ||
    expectedChecksum !== receivedChecksum
  ) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  // Solo procesar eventos de transacción aprobada
  const eventType = event?.event as string | undefined;
  if (eventType !== "transaction.updated") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const tx = (event?.data as Record<string, unknown>)
    ?.transaction as Record<string, unknown> | undefined;

  if (!tx || tx.status !== "APPROVED") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const reference = typeof tx.reference === "string" ? tx.reference : null;

  // Solo procesar referencias de este sistema
  if (!reference || !reference.startsWith("DIST-")) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  try {
    // Si el pedido ya fue creado al iniciar el pago, solo actualizamos el estado
    const existente = await getPedidoByReferencia(reference);
    if (existente) {
      await updatePedidoEstadoByReferencia(reference, "entregado");
    }
    // Si no existe (caso edge), no creamos uno vacío — el pedido se creó client-side
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    console.error("[wompi-webhook] Error procesando pedido:", msg);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
