import { NextResponse } from "next/server";
import { getPool } from "@/lib/dbClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const nombre = typeof body?.nombre === "string" ? body.nombre.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const telefono = typeof body?.telefono === "string" ? body.telefono.trim() : "";
    const mensaje = typeof body?.mensaje === "string" ? body.mensaje.trim() : "";

    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { ok: false, error: "Nombre, email y mensaje son obligatorios." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "El email no tiene un formato válido." },
        { status: 400 },
      );
    }

    const pool = getPool();
    await pool.query(
      `INSERT INTO mensajes_contacto (nombre, email, telefono, mensaje)
       VALUES ($1, $2, $3, $4)`,
      [nombre, email, telefono || null, mensaje],
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    console.error("[contacto/mensaje] Error guardando mensaje:", message);
    return NextResponse.json({ ok: false, error: "No se pudo guardar el mensaje. Intenta de nuevo." }, { status: 500 });
  }
}
