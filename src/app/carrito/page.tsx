"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiteNav } from "@/components/SiteNav";
import { useCart } from "@/context/CartContext";
import { useContactInfo } from "@/hooks/useContactInfo";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);

function buildCartMessage(
  items: { producto: { nombre: string; precio: number | null }; cantidad: number }[]
): string {
  const lines = items.map(
    (i) =>
      `• ${i.producto.nombre} x${i.cantidad}${
        i.producto.precio != null ? ` — ${fmt(i.producto.precio * i.cantidad)}` : ""
      }`
  );
  const total = items.reduce(
    (sum, i) => sum + (i.producto.precio ?? 0) * i.cantidad,
    0
  );
  const totalLine = total > 0 ? `\n*Total estimado: ${fmt(total)}*` : "";
  return `Hola, quisiera hacer el siguiente pedido:\n\n${lines.join("\n")}${totalLine}`;
}

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const { whatsapp } = useContactInfo();
  const [wompiLoading, setWompiLoading] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<number | null>(null);

  const handleEnviarWhatsApp = async () => {
    if (whatsappLoading) return;
    setWhatsappLoading(true);

    // Registrar el pedido y obtener su ID
    let pedidoId: number | null = null;
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ id: i.producto.id, nombre: i.producto.nombre, precio: i.producto.precio, cantidad: i.cantidad })),
          total,
          metodo_pago: 'whatsapp',
        }),
      });
      const json = await res.json();
      if (json.ok) pedidoId = json.pedido.id;
    } catch {/* ignorar errores de red */}

    setWhatsappLoading(false);
    if (pedidoId) setPedidoConfirmado(pedidoId);

    const msg = buildCartMessage(items);
    setTimeout(() => {
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
      setTimeout(() => setPedidoConfirmado(null), 4000);
    }, pedidoId ? 1200 : 0);
  };

  const handlePagarWompi = async () => {
    if (total === 0 || wompiLoading) return;
    setWompiLoading(true);

    try {
      // Referencia única para la orden
      const reference = `DIST-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
      const amountInCents = total * 100;

      // Pedir firma al servidor
      const res = await fetch("/api/payments/wompi-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, amountInCents }),
      });

      if (!res.ok) {
        alert("Error al iniciar el pago. Intenta nuevamente.");
        return;
      }

      const { signature } = await res.json();

      const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
      if (!publicKey) {
        alert("Pago online no configurado. Usa la opción de WhatsApp.");
        return;
      }

      // Redirigir a Wompi checkout
      const params = new URLSearchParams({
        "public-key": publicKey,
        currency: "COP",
        "amount-in-cents": String(amountInCents),
        reference,
        "signature:integrity": signature,
        "redirect-url": `${window.location.origin}/pago`,
      });

      window.location.href = `https://checkout.wompi.co/p/?${params.toString()}`;
    } catch {
      alert("Error de conexión. Intenta nuevamente.");
    } finally {
      setWompiLoading(false);
    }
  };

  const wompiDisponible =
    total > 0 && !!process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNav />

      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/productos"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver al catálogo
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Tu carrito</h1>
          <p className="text-sm text-gray-500 mt-1">
            {itemCount === 0
              ? "No tienes productos en el carrito"
              : `${itemCount} ${itemCount === 1 ? "producto" : "productos"}`}
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="bg-white border border-gray-100 rounded-2xl p-14 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-8 h-8 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">El carrito está vacío</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
              Agrega productos desde el catálogo para armar tu pedido.
            </p>
            <Link
              href="/productos"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Items list */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm divide-y divide-gray-100">
              {items.map(({ producto, cantidad }) => (
                <div key={producto.id} className="flex items-center gap-4 p-4">
                  {/* Imagen */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    {producto.imagenUrl ? (
                      <Image
                        src={producto.imagenUrl}
                        alt={producto.nombre}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-7 h-7">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{producto.nombre}</p>
                    <p className="text-xs text-gray-500 truncate">{producto.descripcion}</p>
                    {producto.precio != null && (
                      <p className="text-xs text-blue-600 font-semibold mt-0.5">{fmt(producto.precio)} c/u</p>
                    )}
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(producto.id, cantidad - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors text-base"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-gray-800">{cantidad}</span>
                    <button
                      onClick={() => updateQuantity(producto.id, cantidad + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors text-base"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  {producto.precio != null && (
                    <p className="flex-shrink-0 w-24 text-right text-sm font-bold text-gray-800">
                      {fmt(producto.precio * cantidad)}
                    </p>
                  )}

                  {/* Eliminar */}
                  <button
                    onClick={() => removeItem(producto.id)}
                    className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    aria-label="Eliminar producto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Resumen total */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-500">Subtotal ({itemCount} productos)</span>
                <span className="text-sm text-gray-700">{total > 0 ? fmt(total) : "—"}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                <span className="font-bold text-gray-900">Total estimado</span>
                <span className="text-xl font-bold text-blue-600">
                  {total > 0 ? fmt(total) : "Sin precio definido"}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                * Los precios pueden variar según disponibilidad y cantidad.
              </p>
            </div>

            {/* ── Opciones de pago ───────────────────────────────────── */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-3">
              <p className="text-sm font-semibold text-gray-700 mb-1">¿Cómo quieres continuar?</p>

              {/* Wompi — pago online */}
              {wompiDisponible ? (
                <button
                  onClick={handlePagarWompi}
                  disabled={wompiLoading}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
                >
                  {wompiLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Redirigiendo...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                      </svg>
                      Pagar online con Wompi
                    </>
                  )}
                </button>
              ) : total > 0 ? (
                <div className="w-full flex items-center gap-2.5 px-5 py-3.5 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-sm text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                  </svg>
                  Pago online no configurado (agrega NEXT_PUBLIC_WOMPI_PUBLIC_KEY)
                </div>
              ) : null}

              {/* Confirmación de pedido registrado */}
              {pedidoConfirmado && (
                <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-100 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-800">Pedido #{pedidoConfirmado} registrado</p>
                    <p className="text-xs text-green-600">Abriendo WhatsApp...</p>
                  </div>
                </div>
              )}

              {/* WhatsApp — siempre disponible */}
              <button
                onClick={handleEnviarWhatsApp}
                disabled={whatsappLoading}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
              >
                {whatsappLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Registrando pedido...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                    Enviar pedido por WhatsApp
                  </>
                )}
              </button>

              {/* Vaciar carrito */}
              <button
                onClick={clearCart}
                className="w-full py-2.5 text-sm font-medium text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
