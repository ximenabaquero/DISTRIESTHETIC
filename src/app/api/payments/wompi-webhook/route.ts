import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createPedido } from "@/lib/pedidosStore";

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

  const amountInCents =
    typeof tx.amount_in_cents === "number" ? tx.amount_in_cents : 0;

  // Los ítems no están en el webhook de Wompi — los recuperamos de la metadata
  // que se guarda al generar la firma (reference lleva el ID de la sesión).
  // Por ahora guardamos el pedido con la información disponible del webhook.
  // La solución completa requiere persistir el carrito server-side al generar la referencia.
  try {
    await createPedido({
      items: [],  // se actualizan cuando se implementa persistencia de carrito server-side
      total: amountInCents / 100,
      metodoPago: "wompi",
      referencia: reference,
    });
  } catch (err) {
    // Si el pedido ya existe (reintento de Wompi), ignorar gracefully
    const msg = err instanceof Error ? err.message : "";
    if (!msg.includes("duplicate") && !msg.includes("unique")) {
      console.error("[wompi-webhook] Error creando pedido:", msg);
      return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
