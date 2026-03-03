import { createHash } from "crypto";
import { NextResponse } from "next/server";

// Genera la firma de integridad requerida por Wompi
// SHA256(reference + amountInCents + "COP" + integritySecret)
export async function POST(request: Request) {
  try {
    const { reference, amountInCents } = await request.json();

    if (!reference || !amountInCents) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;
    if (!integritySecret) {
      return NextResponse.json(
        { error: "Wompi no configurado" },
        { status: 500 }
      );
    }

    const stringToHash = `${reference}${amountInCents}COP${integritySecret}`;
    const signature = createHash("sha256").update(stringToHash).digest("hex");

    return NextResponse.json({ signature, reference });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
