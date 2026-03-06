import { NextRequest, NextResponse } from "next/server";

// Rate limiting: 20 consultas / 5 min por IP (clientes legítimos consultan pocas veces)
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX = 20;
const WINDOW = 5 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > MAX;
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// Consulta el estado de una transacción con la API de Wompi.
// Solo se aceptan referencias propias del sistema (prefijo DIST-).
export async function GET(request: NextRequest) {
  if (isRateLimited(getIp(request))) {
    return NextResponse.json(
      { error: "Demasiadas consultas. Intenta más tarde." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get("id");

  if (!transactionId || !/^[a-zA-Z0-9_-]{1,64}$/.test(transactionId)) {
    return NextResponse.json({ error: "ID de transacción inválido" }, { status: 400 });
  }

  const privateKey = process.env.WOMPI_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json({ error: "Servicio de pago no disponible" }, { status: 503 });
  }

  try {
    const res = await fetch(
      `https://production.wompi.co/v1/transactions/${encodeURIComponent(transactionId)}`,
      {
        headers: { Authorization: `Bearer ${privateKey}` },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Error consultando transacción" }, { status: res.status });
    }

    const data = await res.json();
    const tx = data.data;

    // Solo exponer campos necesarios para el flujo de pago del cliente.
    // La referencia debe pertenecer a este sistema (prefijo DIST-).
    if (typeof tx?.reference === "string" && !tx.reference.startsWith("DIST-")) {
      return NextResponse.json({ error: "Transacción no pertenece a este sistema" }, { status: 403 });
    }

    return NextResponse.json({
      id: tx.id,
      status: tx.status,
      reference: tx.reference,
      amountInCents: tx.amount_in_cents,
      currency: tx.currency,
      createdAt: tx.created_at,
    });
  } catch {
    return NextResponse.json({ error: "Error de conexión con el servicio de pago" }, { status: 500 });
  }
}
