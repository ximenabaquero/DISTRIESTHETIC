import { NextResponse } from "next/server";
import { getAllProductos } from "@/lib/productosStore";
import { requireAdmin } from "@/lib/adminAuth";
import * as XLSX from "xlsx";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }
  try {
    const productos = await getAllProductos();
    const sheet = XLSX.utils.json_to_sheet(productos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Productos");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="productos.xlsx"',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error inesperado";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}