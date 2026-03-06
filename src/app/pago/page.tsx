"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { useCart } from "@/context/CartContext";

type TxStatus = "APPROVED" | "DECLINED" | "VOIDED" | "ERROR" | "PENDING" | null;

interface TxData {
  status: TxStatus;
  reference: string;
  amountInCents: number;
}

export default function PagoPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("id");
  const { items, clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [tx, setTx] = useState<TxData | null>(null);
  const [error, setError] = useState(false);
  const cartCleared = useRef(false);

  useEffect(() => {
    if (!transactionId) {
      setLoading(false);
      setError(true);
      return;
    }

    fetch(`/api/payments/wompi-status?id=${transactionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(true);
        } else {
          setTx(data);
          if (data.status === "APPROVED" && !cartCleared.current) {
            cartCleared.current = true;
            // Registrar pedido antes de limpiar el carrito
            fetch('/api/pedidos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                items: items.map(i => ({ id: i.producto.id, nombre: i.producto.nombre, precio: i.producto.precio, cantidad: i.cantidad })),
                total: data.amountInCents / 100,
                metodo_pago: 'wompi',
                referencia: data.reference,
              }),
            }).catch(() => {});
            clearCart();
          }
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [transactionId, clearCart, items]);

  const fmt = (cents: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(cents / 100);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteNav />

      <div className="container mx-auto px-4 sm:px-6 py-16 max-w-md">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center">

          {loading && (
            <>
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-gray-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-gray-800 mb-1">Verificando pago...</h1>
              <p className="text-sm text-gray-500">Consultando el estado de tu transacción.</p>
            </>
          )}

          {!loading && (error || !tx) && (
            <>
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <h1 className="text-lg font-bold text-gray-800 mb-1">No se pudo verificar</h1>
              <p className="text-sm text-gray-500 mb-6">
                No encontramos información de tu pago. Si completaste la transacción, escríbenos por WhatsApp con el número de referencia.
              </p>
              <Link href="/carrito" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                Volver al carrito
              </Link>
            </>
          )}

          {!loading && tx && (
            <>
              {tx.status === "APPROVED" && (
                <>
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 mb-1">¡Pago exitoso!</h1>
                  <p className="text-sm text-gray-500 mb-4">Tu pedido fue recibido correctamente.</p>
                  <div className="bg-green-50 rounded-xl p-4 text-left mb-6 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total pagado</span>
                      <span className="font-bold text-green-700">{fmt(tx.amountInCents)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Referencia</span>
                      <span className="font-mono text-xs text-gray-700">{tx.reference}</span>
                    </div>
                  </div>
                  <Link href="/productos" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                    Seguir comprando
                  </Link>
                </>
              )}

              {tx.status === "PENDING" && (
                <>
                  <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-yellow-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <h1 className="text-lg font-bold text-gray-800 mb-1">Pago en proceso</h1>
                  <p className="text-sm text-gray-500 mb-4">Tu pago está siendo procesado. Te notificaremos cuando sea confirmado.</p>
                  <p className="text-xs text-gray-400 mb-6 font-mono">Ref: {tx.reference}</p>
                  <Link href="/productos" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                    Volver al catálogo
                  </Link>
                </>
              )}

              {(tx.status === "DECLINED" || tx.status === "VOIDED" || tx.status === "ERROR") && (
                <>
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h1 className="text-lg font-bold text-gray-800 mb-1">Pago no completado</h1>
                  <p className="text-sm text-gray-500 mb-4">
                    {tx.status === "DECLINED"
                      ? "Tu pago fue rechazado. Verifica los datos de tu tarjeta o intenta con otro método."
                      : "Hubo un problema con tu pago. Puedes intentarlo de nuevo o usar WhatsApp."}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
