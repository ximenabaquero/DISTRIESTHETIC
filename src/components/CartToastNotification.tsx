"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function CartToastNotification() {
  const { cartToast } = useCart();

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        cartToast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      {cartToast && (
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl shadow-xl px-4 py-3 max-w-xs">
          {/* Imagen o icono */}
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {cartToast.imagenUrl ? (
              <Image
                src={cartToast.imagenUrl}
                alt={cartToast.nombre}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            )}
          </div>

          {/* Texto */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-green-700 flex items-center gap-1 mb-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
              </svg>
              Agregado al carrito
            </p>
            <p className="text-xs text-gray-600 truncate">{cartToast.nombre}</p>
          </div>

          {/* Link al carrito */}
          <Link
            href="/carrito"
            className="flex-shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
          >
            Ver →
          </Link>
        </div>
      )}
    </div>
  );
}
