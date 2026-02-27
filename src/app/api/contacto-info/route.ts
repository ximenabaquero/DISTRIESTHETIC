import { NextResponse } from "next/server";
import { getContactInfo, updateContactInfo } from "@/lib/contactInfoStore";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  try {
    const contact = await getContactInfo();
    return NextResponse.json({ ok: true, contact });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const telefono = (body?.telefono ?? "").toString().trim();
    const whatsapp = (body?.whatsapp ?? "").toString().trim();

    if (!telefono || !whatsapp) {
      return NextResponse.json(
        { ok: false, error: "Teléfono y WhatsApp son obligatorios." },
        { status: 400 }
      );
    }

    const contact = await updateContactInfo({ telefono, whatsapp });
    return NextResponse.json({ ok: true, contact });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}