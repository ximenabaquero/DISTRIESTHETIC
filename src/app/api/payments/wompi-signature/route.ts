import { createHash } from "crypto";
import { NextResponse } from "next/server";

// Genera la firma de integridad requerida por Wompi
// SHA256(reference + amountInCents + "COP" + integritySecret)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference, amountInCents } = body;

    if (
      typeof reference !== "string" ||
      !/^DIST-[a-zA-Z0-9_-]{1,60}$/.test(reference)
    ) {
      return NextResponse.json({ error: "Referencia inválida" }, { status: 400 });
    }
    if (
      typeof amountInCents !== "number" ||
      !Number.isInteger(amountInCents) ||
      amountInCents <= 0 ||
      amountInCents > 100_000_000_00
    ) {
      return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
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
