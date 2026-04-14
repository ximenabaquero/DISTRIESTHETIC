import { NextResponse } from "next/server";

// Esta ruta fue reemplazada por /api/payments/mercadopago-webhook.
export async function POST() {
  return NextResponse.json(
    { error: "Wompi fue reemplazado por Mercado Pago. Ver /api/payments/mercadopago-webhook" },
    { status: 410 }
  );
}

