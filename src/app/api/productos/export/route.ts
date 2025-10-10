import { NextResponse } from "next/server";
import { getAllProductos } from "@/lib/productosStore";

export async function GET() {
  try {
    const productos = await getAllProductos();
    const headers = [
      "ID",
      "Nombre",
      "Categoría",
      "Precio",
      "Stock",
      "Descripción",
      "ImagenURL",
    ];
    const rows = productos.map((p) =>
      [
        p.id,
        `"${(p.nombre || "").replace(/"/g, '""')}"`,
        `"${(p.categoria || "").replace(/"/g, '""')}"`,
        p.precio ?? "",
        p.stock ?? "",
        `"${(p.descripcion || "").replace(/"/g, '""')}"`,
        p.imagenUrl ?? "",
      ].join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="productos.csv"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
