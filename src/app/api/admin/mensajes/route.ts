import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getPool } from "@/lib/dbClient";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }

  const pool = getPool();
  const { rows } = await pool.query(
    `SELECT id, nombre, email, telefono, mensaje, leido, created_at
     FROM mensajes_contacto
     ORDER BY created_at DESC
     LIMIT 200`,
  );

  return NextResponse.json({ ok: true, mensajes: rows });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }

  const { id, leido } = await req.json();
  if (typeof id !== "number" || typeof leido !== "boolean") {
    return NextResponse.json({ ok: false, error: "Parámetros inválidos." }, { status: 400 });
  }

  const pool = getPool();
  const { rows } = await pool.query(
    'UPDATE mensajes_contacto SET leido=$1 WHERE id=$2 RETURNING *',
    [leido, id],
  );

  return NextResponse.json({ ok: true, mensaje: rows[0] ?? null });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ ok: false, error: "ID requerido." }, { status: 400 });

  const pool = getPool();
  await pool.query('DELETE FROM mensajes_contacto WHERE id=$1', [id]);

  return NextResponse.json({ ok: true });
}
