import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
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

export async function GET(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }

  const sb = await getSupabase();
  if (!sb) return NextResponse.json({ ok: false, error: "Sin configuración de base de datos." }, { status: 503 });

  const { data, error } = await sb
    .from("mensajes_contacto")
    .select("id, nombre, email, telefono, mensaje, leido, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, mensajes: data });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }

  const { id, leido } = await req.json();
  if (typeof id !== "number" || typeof leido !== "boolean") {
    return NextResponse.json({ ok: false, error: "Parámetros inválidos." }, { status: 400 });
  }

  const sb = await getSupabase();
  if (!sb) return NextResponse.json({ ok: false, error: "Sin configuración." }, { status: 503 });

  const { data, error } = await sb
    .from("mensajes_contacto")
    .update({ leido })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, mensaje: data });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: 'No autorizado.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ ok: false, error: "ID requerido." }, { status: 400 });

  const sb = await getSupabase();
  if (!sb) return NextResponse.json({ ok: false, error: "Sin configuración." }, { status: 503 });

  const { error } = await sb.from("mensajes_contacto").delete().eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
