"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useContactInfo } from "@/hooks/useContactInfo";
import { ConfirmModal } from "@/components/ConfirmModal";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);

interface DeliveryInfo {
  nombre: string;
  telefono: string;
  ciudad: string;
  direccion: string;
  notas: string;
}

interface ConfirmedOrder {
  pedidoId: number | null;
  items: { nombre: string; precio: number | null; cantidad: number }[];
  total: number;
  delivery: DeliveryInfo;
  whatsappUrl: string;
}

function buildCartMessage(
  items: { producto: { nombre: string; precio: number | null }; cantidad: number }[],
  delivery: DeliveryInfo
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
  return (
    `Hola, quisiera hacer el siguiente pedido:\n\n${lines.join("\n")}${totalLine}` +
    `\n\n👤 *Nombre:* ${delivery.nombre}` +
    `\n📱 *Teléfono:* ${delivery.telefono}` +
    `\n🏙️ *Ciudad:* ${delivery.ciudad}` +
    `\n📦 *Dirección:* ${delivery.direccion}` +
    (delivery.notas ? `\n📝 *Notas:* ${delivery.notas}` : "")
  );
}

/* ── Indicador de pasos ─────────────────────────────────────────── */
function StepIndicator({ step }: { step: 1 | 2 | 3 | 4 }) {
  const steps = [
    { n: 1, label: "Resumen" },
    { n: 2, label: "Entrega" },
    { n: 3, label: "Pago" },
    { n: 4, label: "Listo" },
  ];
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, idx) => (
        <div key={s.n} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step > s.n
                  ? "bg-blue-600 text-white"
                  : step === s.n
                  ? "bg-blue-600 text-white ring-4 ring-blue-100"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {step > s.n ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : (
                s.n
              )}
            </div>
            <span
              className={`text-xs font-medium ${
                step >= s.n ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${
                step > s.n ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Paso 1: Resumen del pedido ─────────────────────────────────── */
function StepResumen({
  onNext,
  onClear,
}: {
  onNext: () => void;
  onClear: () => void;
}) {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  return (
    <div className="space-y-4">
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

            {/* Controles */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => updateQuantity(producto.id, cantidad - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors text-base"
              >−</button>
              <span className="w-6 text-center text-sm font-semibold text-gray-800">{cantidad}</span>
              <button
                onClick={() => updateQuantity(producto.id, cantidad + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors text-base"
              >+</button>
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

      {/* Total */}
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

      {/* Acciones */}
      <div className="flex gap-3">
        <button
          onClick={() => setConfirmClearOpen(true)}
          className="flex-1 py-2.5 text-sm font-medium text-gray-500 hover:text-red-600 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 rounded-xl transition-colors"
        >
          Vaciar carrito
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          Continuar
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>

      <ConfirmModal
        isOpen={confirmClearOpen}
        variant="danger"
        title="¿Vaciar el carrito?"
        message="Se eliminarán todos los productos. Esta acción no se puede deshacer."
        confirmLabel="Sí, vaciar"
        cancelLabel="Cancelar"
        onConfirm={() => { onClear(); setConfirmClearOpen(false); }}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  );
}

/* ── Paso 2: Datos de entrega ───────────────────────────────────── */
function StepEntrega({
  delivery,
  onChange,
  onNext,
  onBack,
}: {
  delivery: DeliveryInfo;
  onChange: (d: DeliveryInfo) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Partial<DeliveryInfo>>({});

  const validate = () => {
    const e: Partial<DeliveryInfo> = {};
    if (!delivery.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!delivery.telefono.trim()) e.telefono = "El teléfono es obligatorio";
    else if (!/^\+?[\d\s\-()]{7,20}$/.test(delivery.telefono.trim()))
      e.telefono = "Ingresa un número válido";
    if (!delivery.ciudad.trim()) e.ciudad = "La ciudad es obligatoria";
    if (!delivery.direccion.trim()) e.direccion = "La dirección es obligatoria";
    else if (delivery.direccion.trim().length < 5)
      e.direccion = "Ingresa una dirección completa";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) onNext();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-1">Datos de entrega</h2>
          <p className="text-xs text-gray-500">Necesitamos estos datos para coordinar tu pedido.</p>
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Nombre del destinatario <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Ej: María García"
              value={delivery.nombre}
              onChange={(e) => {
                onChange({ ...delivery, nombre: e.target.value });
                if (errors.nombre) setErrors((prev) => ({ ...prev, nombre: undefined }));
              }}
              className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none transition-colors ${
                errors.nombre
                  ? "border-red-300 bg-red-50 focus:border-red-400"
                  : "border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
              }`}
            />
          </div>
          {errors.nombre && (
            <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Número de teléfono <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            </span>
            <input
              type="tel"
              placeholder="Ej: 300 123 4567"
              value={delivery.telefono}
              onChange={(e) => {
                onChange({ ...delivery, telefono: e.target.value });
                if (errors.telefono) setErrors((prev) => ({ ...prev, telefono: undefined }));
              }}
              className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none transition-colors ${
                errors.telefono
                  ? "border-red-300 bg-red-50 focus:border-red-400"
                  : "border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
              }`}
            />
          </div>
          {errors.telefono && (
            <p className="text-xs text-red-500 mt-1">{errors.telefono}</p>
          )}
        </div>

        {/* Ciudad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Ciudad / Municipio <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Ej: Bogotá, Medellín, Cali…"
              value={delivery.ciudad}
              onChange={(e) => {
                onChange({ ...delivery, ciudad: e.target.value });
                if (errors.ciudad) setErrors((prev) => ({ ...prev, ciudad: undefined }));
              }}
              className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none transition-colors ${
                errors.ciudad
                  ? "border-red-300 bg-red-50 focus:border-red-400"
                  : "border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
              }`}
            />
          </div>
          {errors.ciudad && (
            <p className="text-xs text-red-500 mt-1">{errors.ciudad}</p>
          )}
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Dirección de entrega <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </span>
            <textarea
              rows={3}
              placeholder="Ej: Calle 45 # 23-10, Barrio El Centro"
              value={delivery.direccion}
              onChange={(e) => {
                onChange({ ...delivery, direccion: e.target.value });
                if (errors.direccion) setErrors((prev) => ({ ...prev, direccion: undefined }));
              }}
              className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl outline-none resize-none transition-colors ${
                errors.direccion
                  ? "border-red-300 bg-red-50 focus:border-red-400"
                  : "border-gray-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
              }`}
            />
          </div>
          {errors.direccion && (
            <p className="text-xs text-red-500 mt-1">{errors.direccion}</p>
          )}
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Instrucciones de entrega <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </span>
            <textarea
              rows={2}
              placeholder="Ej: Llamar antes de llegar, dejar en portería, apartamento 302…"
              value={delivery.notas}
              onChange={(e) => onChange({ ...delivery, notas: e.target.value })}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 bg-white rounded-xl outline-none resize-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
            />
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Atrás
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          Continuar
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── Paso 3: Forma de pago ──────────────────────────────────────── */
function StepPago({
  delivery,
  onBack,
  onWhatsAppSent,
}: {
  delivery: DeliveryInfo;
  onBack: () => void;
  onWhatsAppSent: (confirmed: ConfirmedOrder) => void;
}) {
  const { items, total, itemCount, clearCart } = useCart();
  const { whatsapp } = useContactInfo();
  const [wompiLoading, setWompiLoading] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(false);

  const wompiDisponible = total > 0 && !!process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;

  const handleEnviarWhatsApp = async () => {
    if (whatsappLoading) return;
    setWhatsappLoading(true);

    // Snapshot antes de limpiar el carrito
    const itemsSnapshot = items.map((i) => ({
      nombre: i.producto.nombre,
      precio: i.producto.precio,
      cantidad: i.cantidad,
    }));
    const totalSnapshot = total;

    let pedidoId: number | null = null;
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.producto.id,
            nombre: i.producto.nombre,
            precio: i.producto.precio,
            cantidad: i.cantidad,
          })),
          total,
          metodo_pago: "whatsapp",
          nombre: delivery.nombre,
          telefono: delivery.telefono,
          ciudad: delivery.ciudad,
          direccion: delivery.direccion,
          notas: delivery.notas || undefined,
        }),
      });
      const json = await res.json();
      if (json.ok) pedidoId = json.pedido.id;
    } catch {/* ignorar errores de red */}

    setWhatsappLoading(false);

    const msg = buildCartMessage(items, delivery);
    const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;

    // Abrir WhatsApp y pasar a confirmación
    window.open(waUrl, "_blank");
    clearCart();
    onWhatsAppSent({
      pedidoId,
      items: itemsSnapshot,
      total: totalSnapshot,
      delivery,
      whatsappUrl: waUrl,
    });
  };

  const handlePagarWompi = async () => {
    if (total === 0 || wompiLoading) return;
    setWompiLoading(true);

    try {
      const reference = `DIST-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
      const amountInCents = total * 100;

      // Generar firma
      const sigRes = await fetch("/api/payments/wompi-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, amountInCents }),
      });

      if (!sigRes.ok) {
        alert("Error al iniciar el pago. Intenta nuevamente.");
        return;
      }

      const { signature } = await sigRes.json();

      // Crear el pedido ANTES de redirigir a Wompi
      // (el webhook lo actualizará a 'pagado' al confirmar)
      await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.producto.id,
            nombre: i.producto.nombre,
            precio: i.producto.precio,
            cantidad: i.cantidad,
          })),
          total,
          metodo_pago: "wompi",
          referencia: reference,
          nombre: delivery.nombre,
          telefono: delivery.telefono,
          ciudad: delivery.ciudad,
          direccion: delivery.direccion,
          notas: delivery.notas || undefined,
        }),
      });

      // Limpiar carrito y redirigir
      clearCart();

      const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
      if (!publicKey) {
        alert("Pago online no configurado. Usa la opción de WhatsApp.");
        return;
      }

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

  return (
    <div className="space-y-4">
      {/* Resumen compacto del pedido */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Resumen del pedido</p>
        <div className="space-y-1.5 mb-3">
          {items.map(({ producto, cantidad }) => (
            <div key={producto.id} className="flex justify-between text-sm text-gray-700">
              <span className="truncate mr-2">{producto.nombre} <span className="text-gray-400">x{cantidad}</span></span>
              <span className="flex-shrink-0 font-medium">
                {producto.precio != null ? fmt(producto.precio * cantidad) : "—"}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-3 border-t border-gray-100">
          <span className="text-sm font-bold text-gray-800">Total ({itemCount} productos)</span>
          <span className="text-base font-bold text-blue-600">{total > 0 ? fmt(total) : "—"}</span>
        </div>
      </div>

      {/* Datos de entrega */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs font-semibold text-blue-700 mb-1">Datos de entrega</p>
          <p className="text-sm text-blue-800 font-semibold">{delivery.nombre}</p>
          <p className="text-sm text-blue-700">{delivery.telefono} · {delivery.ciudad}</p>
          <p className="text-sm text-blue-700 break-words">{delivery.direccion}</p>
          {delivery.notas && <p className="text-xs text-blue-600 italic">"{delivery.notas}"</p>}
        </div>
      </div>

      {/* Opciones de pago */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-3">
        <p className="text-sm font-semibold text-gray-700">¿Cómo quieres pagar?</p>

        {/* Wompi */}
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
            Pago online no configurado
          </div>
        ) : null}

        {/* WhatsApp */}
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
              Hablar con un asesor por WhatsApp
            </>
          )}
        </button>
      </div>

      {/* Atrás */}
      <button
        onClick={onBack}
        className="w-full py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Volver a datos de entrega
      </button>
    </div>
  );
}

/* ── Paso 4: Confirmación ───────────────────────────────────────── */
function StepConfirmacion({ confirmed }: { confirmed: ConfirmedOrder }) {
  const fmt2 = fmt; // reutilizar formateador
  return (
    <div className="space-y-4">
      {/* Éxito */}
      <div className="bg-white border border-green-100 rounded-2xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          ¡Pedido registrado!
        </h2>
        {confirmed.pedidoId && (
          <p className="text-sm text-gray-500 mb-1">
            Pedido <span className="font-semibold text-gray-700">#{confirmed.pedidoId}</span>
          </p>
        )}
        <p className="text-sm text-gray-500">
          Tu pedido fue enviado por WhatsApp. Un asesor te contactará pronto.
        </p>
      </div>

      {/* Resumen del pedido */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Productos pedidos</p>
        <div className="space-y-1.5 mb-3">
          {confirmed.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm text-gray-700">
              <span className="truncate mr-2">
                {item.nombre} <span className="text-gray-400">x{item.cantidad}</span>
              </span>
              <span className="flex-shrink-0 font-medium">
                {item.precio != null ? fmt2(item.precio * item.cantidad) : "—"}
              </span>
            </div>
          ))}
        </div>
        {confirmed.total > 0 && (
          <div className="flex justify-between pt-3 border-t border-gray-100">
            <span className="text-sm font-bold text-gray-800">Total estimado</span>
            <span className="text-base font-bold text-blue-600">{fmt2(confirmed.total)}</span>
          </div>
        )}
      </div>

      {/* Datos de entrega */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs font-semibold text-blue-700 mb-1">Datos de entrega</p>
          <p className="text-sm text-blue-800 font-semibold">{confirmed.delivery.nombre}</p>
          <p className="text-sm text-blue-700">{confirmed.delivery.telefono} · {confirmed.delivery.ciudad}</p>
          <p className="text-sm text-blue-700 break-words">{confirmed.delivery.direccion}</p>
          {confirmed.delivery.notas && <p className="text-xs text-blue-600 italic">"{confirmed.delivery.notas}"</p>}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col gap-3">
        <a
          href={confirmed.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          Continuar en WhatsApp
        </a>
        <Link
          href="/productos"
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 font-medium rounded-xl transition-colors text-sm"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}

/* ── Página principal ───────────────────────────────────────────── */
export default function CarritoPage() {
  const { items, itemCount, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [delivery, setDelivery] = useState<DeliveryInfo>({ nombre: "", telefono: "", ciudad: "", direccion: "", notas: "" });
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          {step !== 4 && (
            <Link
              href="/productos"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Volver al catálogo
            </Link>
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 4 ? "¡Pedido enviado!" : "Tu carrito"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {step === 4
              ? "Tu pedido fue registrado exitosamente"
              : itemCount === 0
              ? "No tienes productos en el carrito"
              : `${itemCount} ${itemCount === 1 ? "producto" : "productos"}`}
          </p>
        </div>

        {step === 4 && confirmedOrder ? (
          <>
            <StepIndicator step={4} />
            <StepConfirmacion confirmed={confirmedOrder} />
          </>
        ) : items.length === 0 ? (
          /* Carrito vacío */
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
          <>
            <StepIndicator step={step} />

            {step === 1 && (
              <StepResumen
                onNext={() => setStep(2)}
                onClear={() => { clearCart(); setStep(1); }}
              />
            )}
            {step === 2 && (
              <StepEntrega
                delivery={delivery}
                onChange={setDelivery}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <StepPago
                delivery={delivery}
                onBack={() => setStep(2)}
                onWhatsAppSent={(confirmed) => {
                  setConfirmedOrder(confirmed);
                  setStep(4);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
