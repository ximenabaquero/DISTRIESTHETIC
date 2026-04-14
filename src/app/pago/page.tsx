"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

// Mercado Pago Checkout Pro devuelve estos parámetros en la URL de retorno:
//   ?status=approved&external_reference=DIST-xxx&payment_id=123456789
//   ?status=rejected&...
//   ?status=pending&...
// No necesita polling — el status llega directamente en la URL.

type MpStatus = "approved" | "rejected" | "pending" | null;

function PagoContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") as MpStatus;
  const reference = searchParams.get("external_reference");
  const { clearCart } = useCart();
  const cartCleared = useRef(false);

  // Limpiar carrito al llegar con pago aprobado
  // El estado del pedido lo actualiza el webhook de MP en el servidor
  useEffect(() => {
    if (status === "approved" && !cartCleared.current) {
      cartCleared.current = true;
      clearCart();
    }
  }, [status, clearCart]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 py-16 max-w-md">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center">

          {/* Sin parámetros: acceso directo sin pago */}
          {!status && (
            <>
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-gray-800 mb-1">No se encontró el pago</h1>
              <p className="text-sm text-gray-500 mb-6">
                Si completaste la transacción, escríbenos por WhatsApp con el número de referencia.
              </p>
              <Link href="/carrito" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                Volver al carrito
              </Link>
            </>
          )}

          {/* Pago aprobado */}
          {status === "approved" && (
            <>
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">¡Pago exitoso!</h1>
              <p className="text-sm text-gray-500 mb-4">Tu pedido fue recibido correctamente.</p>
              {reference && (
                <div className="bg-green-50 rounded-xl p-4 text-left mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Referencia</span>
                    <span className="font-mono text-xs text-gray-700">{reference}</span>
                  </div>
                </div>
              )}
              <Link href="/productos" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                Seguir comprando
              </Link>
            </>
          )}

          {/* Pago pendiente */}
          {status === "pending" && (
            <>
              <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-gray-800 mb-1">Pago en proceso</h1>
              <p className="text-sm text-gray-500 mb-4">Tu pago está siendo procesado. Te notificaremos cuando sea confirmado.</p>
              {reference && (
                <p className="text-xs text-gray-400 mb-6 font-mono">Ref: {reference}</p>
              )}
              <Link href="/productos" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                Volver al catálogo
              </Link>
            </>
          )}

          {/* Pago rechazado */}
          {status === "rejected" && (
            <>
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-gray-800 mb-1">Pago no completado</h1>
              <p className="text-sm text-gray-500 mb-4">
                Tu pago fue rechazado. Verifica los datos de tu tarjeta o intenta con otro método.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/carrito" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                  Intentar de nuevo
                </Link>
                <Link href="/contacto" className="text-sm text-gray-500 hover:text-gray-700 transition-colors py-1">
                  Contactar soporte
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default function PagoPage() {
  return (
    <Suspense>
      <PagoContent />
    </Suspense>
  );
}
