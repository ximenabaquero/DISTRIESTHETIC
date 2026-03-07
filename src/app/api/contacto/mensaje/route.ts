import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

async function getSupabase(): Promise<SupabaseClient | null> {
  if (supabase) return supabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const { createClient } = await import("@supabase/supabase-js");
  supabase = createClient(url, key, { auth: { persistSession: false } });
  return supabase;
}

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

    const sb = await getSupabase();
    if (!sb) {
      return NextResponse.json(
        { ok: false, error: "Servicio temporalmente no disponible." },
        { status: 503 },
      );
    }

    const { error } = await sb.from("mensajes_contacto").insert({
      nombre,
      email,
      telefono: telefono || null,
      mensaje,
    });

    if (error) {
      console.error("[contacto/mensaje] Error guardando mensaje:", error.message);
      return NextResponse.json(
        { ok: false, error: "No se pudo guardar el mensaje. Intenta de nuevo." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
