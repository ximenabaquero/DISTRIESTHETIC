import { NextResponse } from "next/server";

// Esta ruta fue reemplazada por Mercado Pago Checkout Pro.
// La firma ya no es necesaria en el frontend; el servidor crea la preferencia directamente.
export async function POST() {
  return NextResponse.json(
    { error: "Wompi fue reemplazado por Mercado Pago. Ver /api/payments/mercadopago-preference" },
    { status: 410 }
  );
}

