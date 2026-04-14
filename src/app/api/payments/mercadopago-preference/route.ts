import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

/**
 * POST /api/payments/mercadopago-preference
 *
 * Crea una preferencia de pago en Mercado Pago (Checkout Pro).
 * Devuelve { checkout_url, reference } para que el frontend redirija al usuario.
 *
 * Variable de entorno requerida:
 *   MP_ACCESS_TOKEN → Access token de MP (TEST-xxx en sandbox, APP_USR-xxx en producción)
 */
export async function POST(request: NextRequest) {
  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json({ error: "Mercado Pago no configurado" }, { status: 503 });
  }

  let body: {
    items: { id: number; nombre: string; precio: number | null; cantidad: number }[];
    total: number;
    delivery: { nombre: string; telefono: string; ciudad: string; direccion: string; notas?: string };
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { items, total, delivery } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Items inválidos" }, { status: 400 });
  }
  if (typeof total !== "number" || total <= 0 || total > 100_000_000) {
    return NextResponse.json({ error: "Total inválido" }, { status: 400 });
  }

  // Referencia única — el servidor la genera para que sea confiable
  const reference = `DIST-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;

  // Construir ítems de MP — solo productos con precio definido
  const mpItems = items
    .filter((i) => typeof i.precio === "number" && i.precio > 0)
    .map((i) => ({
      id: String(i.id),
      title: i.nombre.slice(0, 256),
      quantity: i.cantidad,
      unit_price: i.precio as number,
      currency_id: "COP",
    }));

  // Si no hay ítems con precio individual, usar un ítem genérico con el total
  const finalItems =
    mpItems.length > 0
      ? mpItems
      : [
          {
            id: "pedido",
            title: "Pedido DistriEsthetic",
            quantity: 1,
            unit_price: total,
            currency_id: "COP",
          },
        ];

  // Detectar la base URL desde los headers de la request
  const host = request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const baseUrl = `${proto}://${host}`;

  try {
    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: finalItems,
        payer: {
          name: delivery?.nombre ?? "",
          phone: { number: delivery?.telefono ?? "" },
        },
        external_reference: reference,
        back_urls: {
          success: `${baseUrl}/pago?status=approved`,
          failure: `${baseUrl}/pago?status=rejected`,
          pending: `${baseUrl}/pago?status=pending`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/payments/mercadopago-webhook`,
        statement_descriptor: "DISTRIESTHETIC",
        expires: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[mp-preference] Error de MP:", err);
      return NextResponse.json({ error: "Error creando preferencia de pago" }, { status: 500 });
    }

    const data = await res.json();

    // Usar sandbox_init_point cuando MP_SANDBOX=true (checkout de pruebas sin dinero real)
    const isSandbox = process.env.MP_SANDBOX === "true";
    const checkout_url = isSandbox ? data.sandbox_init_point : data.init_point;

    return NextResponse.json({
      checkout_url,
      preferenceId: data.id,
      reference,
    });
  } catch (e) {
    console.error("[mp-preference] Error de conexión:", e);
    return NextResponse.json({ error: "Error de conexión con Mercado Pago" }, { status: 500 });
  }
}
