import { NextResponse } from "next/server";

// Consulta el estado de una transacción con la API de Wompi
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get("id");

  if (!transactionId) {
    return NextResponse.json({ error: "ID de transacción requerido" }, { status: 400 });
  }

  const privateKey = process.env.WOMPI_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json({ error: "Wompi no configurado" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://production.wompi.co/v1/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${privateKey}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Error consultando transacción" }, { status: res.status });
    }

    const data = await res.json();
    const tx = data.data;

    return NextResponse.json({
      id: tx.id,
      status: tx.status,           // APPROVED | DECLINED | VOIDED | ERROR | PENDING
      reference: tx.reference,
      amountInCents: tx.amount_in_cents,
      currency: tx.currency,
      createdAt: tx.created_at,
    });
  } catch {
    return NextResponse.json({ error: "Error de conexión con Wompi" }, { status: 500 });
  }
}
