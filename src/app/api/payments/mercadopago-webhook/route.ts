import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getPedidoByReferencia, updatePedidoEstadoByReferencia } from "@/lib/pedidosStore";

/**
 * Webhook server-to-server de Mercado Pago.
 * MP llama a esta ruta con cada evento de pago (IPN).
 *
 * Configurar en el panel de MP:
 *   URL: https://tudominio.com/api/payments/mercadopago-webhook
 *   Variable de entorno: MP_WEBHOOK_SECRET → "Clave secreta" del panel de MP
 *   Variable de entorno: MP_ACCESS_TOKEN   → para consultar el pago completo
 *
 * Formato del header x-signature: "ts=<timestamp>,v1=<hmac-sha256>"
 * Manifest para HMAC: "id:<notification_id>;request-id:<x-request-id>;ts:<timestamp>;"
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.MP_WEBHOOK_SECRET;
  const accessToken = process.env.MP_ACCESS_TOKEN;

  let bodyText: string;
  try {
    bodyText = await request.text();
  } catch {
    return NextResponse.json({ error: "Body ilegible" }, { status: 400 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(bodyText);
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  // Verificar firma HMAC si el secreto está configurado
  if (webhookSecret) {
    const xSignature = request.headers.get("x-signature") ?? "";
    const xRequestId = request.headers.get("x-request-id") ?? "";

    // Parsear "ts=xxx,v1=yyy" → { ts: "xxx", v1: "yyy" }
    const parts = Object.fromEntries(
      xSignature.split(",").flatMap((p) => {
        const [k, v] = p.split("=");
        return k && v ? [[k.trim(), v.trim()]] : [];
      })
    );
    const ts = parts["ts"] ?? "";
    const receivedHash = parts["v1"] ?? "";

    // El notification_id es el campo "id" del body del evento
    const notificationId = String(event?.id ?? "");
    const manifest = `id:${notificationId};request-id:${xRequestId};ts:${ts};`;
    const expectedHash = createHmac("sha256", webhookSecret).update(manifest).digest("hex");

    if (!receivedHash || expectedHash !== receivedHash) {
      return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    }
  }

  // Solo procesar eventos de pago
  const action = event?.action as string | undefined;
  if (action !== "payment.updated" && action !== "payment.created") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const paymentId = (event?.data as Record<string, unknown>)?.id as string | undefined;
  if (!paymentId || !accessToken) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  try {
    // Consultar el pago completo para obtener external_reference y status
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[mp-webhook] No se pudo consultar el pago:", res.status);
      return NextResponse.json({ ok: false, error: "Error consultando pago" }, { status: 500 });
    }

    const payment = await res.json();
    const status = payment?.status as string | undefined;
    const reference = payment?.external_reference as string | undefined;

    // Solo procesar referencias propias del sistema
    if (!reference || !reference.startsWith("DIST-")) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    if (status === "approved") {
      const pedido = await getPedidoByReferencia(reference);
      if (pedido) {
        await updatePedidoEstadoByReferencia(reference, "entregado");
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[mp-webhook] Error:", e);
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}
