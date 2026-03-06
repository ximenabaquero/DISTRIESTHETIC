"use client";

import Link from "next/link";
import Image from "next/image";
import { type Producto } from "@/data/productos";
import { WhatsAppButton } from "./WhatsAppButton";
import { useCart } from "@/context/CartContext";

// Clases estáticas para que Tailwind no las purgue en producción
const colorMap: Record<string, {
  card: string;
  border: string;
  badge: string;
  badgeText: string;
  placeholder: string;
  placeholderText: string;
  tag: string;
  tagText: string;
}> = {
  // Medicamentos — azul clásico (salud/farmacia)
  blue: {
    card: "from-white to-blue-50",
    border: "border-blue-300",
    badge: "bg-blue-100",
    badgeText: "text-blue-700",
    placeholder: "border-blue-200",
    placeholderText: "text-blue-500",
    tag: "bg-blue-50",
    tagText: "text-blue-700",
  },
  // Soluciones — verde agua (líquidos/sueros)
  teal: {
    card: "from-white to-teal-50",
    border: "border-teal-300",
    badge: "bg-teal-100",
    badgeText: "text-teal-700",
    placeholder: "border-teal-200",
    placeholderText: "text-teal-500",
    tag: "bg-teal-50",
    tagText: "text-teal-700",
  },
  // Insumos — violeta (suministros médicos)
  violet: {
    card: "from-white to-violet-50",
    border: "border-violet-300",
    badge: "bg-violet-100",
    badgeText: "text-violet-700",
    placeholder: "border-violet-200",
    placeholderText: "text-violet-500",
    tag: "bg-violet-50",
    tagText: "text-violet-700",
  },
  // Químicos — ámbar (precaución/reacciones)
  amber: {
    card: "from-white to-amber-50",
    border: "border-amber-300",
    badge: "bg-amber-100",
    badgeText: "text-amber-700",
    placeholder: "border-amber-200",
    placeholderText: "text-amber-500",
    tag: "bg-amber-50",
    tagText: "text-amber-700",
  },
  // Ropa — rosa (moda/indumentaria)
  rose: {
    card: "from-white to-rose-50",
    border: "border-rose-300",
    badge: "bg-rose-100",
    badgeText: "text-rose-700",
    placeholder: "border-rose-200",
    placeholderText: "text-rose-500",
    tag: "bg-rose-50",
    tagText: "text-rose-700",
  },
  // Protección — verde (seguridad/EPP)
  green: {
    card: "from-white to-green-50",
    border: "border-green-300",
    badge: "bg-green-100",
    badgeText: "text-green-700",
    placeholder: "border-green-200",
    placeholderText: "text-green-500",
    tag: "bg-green-50",
    tagText: "text-green-700",
  },
};

const fallbackColor = colorMap.blue;

// Función para convertir nombre a slug
function toSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface ProductCardProps {
  producto: Producto;
  color: string;
  icono: React.ReactNode;
  categoriaNombre: string;
}

export function ProductCard({ producto, color, icono, categoriaNombre }: ProductCardProps) {
  const { addItem, updateQuantity, items } = useCart();
  const enCarrito = items.find(i => i.producto.id === producto.id);
  const c = colorMap[color] ?? fallbackColor;

  return (
    <div
      className={`bg-gradient-to-br ${c.card} p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 border-l-4 ${c.border} group`}
    >
      <div className="mb-4">
        {producto.imagenUrl ? (
          <Link href={`/productos/${toSlug(producto.nombre)}`}>
            <div className="relative h-40 w-full overflow-hidden rounded-xl border border-white/60 bg-white cursor-pointer">
              <Image
                src={producto.imagenUrl}
                alt={`Imagen de ${producto.nombre}`}
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 18rem, (min-width: 1024px) 16rem, 100vw"
              />
            </div>
          </Link>
        ) : (
          <Link href={`/productos/${toSlug(producto.nombre)}`}>
            <div className={`flex h-40 w-full items-center justify-center rounded-xl border-2 border-dashed ${c.placeholder} bg-white/50 text-sm font-semibold ${c.placeholderText} uppercase tracking-wide cursor-pointer`}>
              Sin imagen
            </div>
          </Link>
        )}
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
          <div className="text-gray-600">
            {icono}
          </div>
        </div>
        <span className={`${c.badge} ${c.badgeText} text-xs px-3 py-1 rounded-full font-bold`}>
          {producto.etiqueta}
        </span>
      </div>
      
      <Link href={`/productos/${toSlug(producto.nombre)}`}>
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
          {producto.nombre}
        </h3>
      </Link>
      <p className="text-gray-600 text-sm mb-4">
        {producto.descripcion}
      </p>

      {/* Precio y stock */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-gray-700">Precio:</span>
          <span className="text-gray-800 font-bold">
            {producto.precio != null ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(producto.precio) : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-gray-700">Stock:</span>
          <span className={
            producto.stock === 0
              ? 'text-red-500 font-semibold'
              : producto.stock <= 10
              ? 'text-amber-500 font-semibold'
              : 'text-gray-500 font-medium'
          }>
            {producto.stock === 0
              ? 'Sin stock'
              : producto.stock <= 10
              ? `¡Solo ${producto.stock} unid.!`
              : `${producto.stock} unid.`}
          </span>
        </div>
      </div>
      
      {/* Agregar al carrito / controles de cantidad */}
      {producto.stock === 0 ? (
        <div className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          Sin stock
        </div>
      ) : enCarrito ? (
        <div className="w-full flex items-center justify-between gap-2 py-1.5 px-3 rounded-xl bg-blue-50 ring-1 ring-blue-200 mb-3">
          <button
            onClick={() => updateQuantity(producto.id, enCarrito.cantidad - 1)}
            className="w-7 h-7 rounded-lg bg-white border border-blue-200 text-blue-600 hover:bg-blue-100 flex items-center justify-center font-bold text-base transition-colors"
            aria-label="Reducir cantidad"
          >
            −
          </button>
          <span className="text-sm font-bold text-blue-700 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {enCarrito.cantidad} en carrito
          </span>
          <button
            onClick={() => updateQuantity(producto.id, enCarrito.cantidad + 1)}
            className="w-7 h-7 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center font-bold text-base transition-colors"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      ) : (
        <button
          onClick={() => addItem(producto)}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all duration-200 mb-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          Agregar al carrito
        </button>
      )}

      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold px-2 py-1 ${c.tag} ${c.tagText} rounded-full flex items-center gap-1.5`}>
          <span className="text-gray-500">{icono}</span>
          {categoriaNombre}
        </span>
        {!enCarrito && <WhatsAppButton producto={producto} />}
      </div>
    </div>
  );
}
