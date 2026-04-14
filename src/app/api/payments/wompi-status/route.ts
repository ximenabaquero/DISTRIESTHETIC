import { NextResponse } from "next/server";

// Esta ruta fue reemplazada por Mercado Pago.
// El estado de pago ahora llega como parámetro en la URL de retorno (/pago?status=...).
export async function GET() {
  return NextResponse.json(
    { error: "Wompi fue reemplazado por Mercado Pago. El estado llega en los parámetros de retorno." },
    { status: 410 }
  );
}

