"use client";

import Link from "next/link";
import Image from "next/image";
import { type Producto } from "@/data/productos";
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
    card: "",
    border: "border-blue-500",
    badge: "bg-blue-500/20",
    badgeText: "text-blue-300",
    placeholder: "border-blue-500/30",
    placeholderText: "text-blue-400",
    tag: "bg-blue-500/15",
    tagText: "text-blue-300",
  },
  // Soluciones — verde agua
  teal: {
    card: "",
    border: "border-teal-500",
    badge: "bg-teal-500/20",
    badgeText: "text-teal-300",
    placeholder: "border-teal-500/30",
    placeholderText: "text-teal-400",
    tag: "bg-teal-500/15",
    tagText: "text-teal-300",
  },
  // Insumos — violeta
  violet: {
    card: "",
    border: "border-violet-500",
    badge: "bg-violet-500/20",
    badgeText: "text-violet-300",
    placeholder: "border-violet-500/30",
    placeholderText: "text-violet-400",
    tag: "bg-violet-500/15",
    tagText: "text-violet-300",
  },
  // Químicos — ámbar
  amber: {
    card: "",
    border: "border-amber-500",
    badge: "bg-amber-500/20",
    badgeText: "text-amber-300",
    placeholder: "border-amber-500/30",
    placeholderText: "text-amber-400",
    tag: "bg-amber-500/15",
    tagText: "text-amber-300",
  },
  // Ropa — rosa
  rose: {
    card: "",
    border: "border-rose-500",
    badge: "bg-rose-500/20",
    badgeText: "text-rose-300",
    placeholder: "border-rose-500/30",
    placeholderText: "text-rose-400",
    tag: "bg-rose-500/15",
    tagText: "text-rose-300",
  },
  // Protección — verde
  green: {
    card: "",
    border: "border-green-500",
    badge: "bg-green-500/20",
    badgeText: "text-green-300",
    placeholder: "border-green-500/30",
    placeholderText: "text-green-400",
    tag: "bg-green-500/15",
    tagText: "text-green-300",
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
      className={`bg-[#1a2845] p-6 rounded-2xl transform hover:-translate-y-2 transition-all duration-300 border-l-4 ${c.border} group`}
      style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10), 0 4px 24px rgba(0,0,0,0.25)" }}
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
            <div className={`flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed ${c.placeholder} bg-white/5 cursor-pointer`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className={`w-10 h-10 ${c.placeholderText} opacity-30`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <span className={`text-xs font-medium ${c.placeholderText} opacity-40 tracking-wide`}>Sin imagen</span>
            </div>
          </Link>
        )}
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.10] transition-colors">
          <div className="text-slate-400">
            {icono}
          </div>
        </div>
        {producto.etiqueta && producto.etiqueta.toUpperCase() === 'NUEVO' && (
          <span className={`${c.badge} ${c.badgeText} text-xs px-3 py-1 rounded-full font-bold`}>
            NUEVO
          </span>
        )}
      </div>
      
      <Link href={`/productos/${toSlug(producto.nombre)}`}>
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 hover:text-blue-400 transition-colors cursor-pointer">
          {producto.nombre}
        </h3>
      </Link>
      <p className="text-slate-400 text-sm mb-4">
        {producto.descripcion}
      </p>

      {/* Precio y stock */}
      <div className="mb-4">
        <p className="text-xl font-bold text-white mb-1">
          {producto.precio != null
            ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(producto.precio)
            : <span className="text-sm text-gray-400 italic font-normal">Precio a consultar</span>
          }
        </p>
        <p className={`text-xs font-medium ${
          producto.stock === 0
            ? 'text-red-500'
            : producto.stock <= 10
            ? 'text-amber-500'
            : 'text-slate-500'
        }`}>
          {producto.stock === 0
            ? 'Sin stock'
            : producto.stock <= 10
            ? `¡Solo ${producto.stock} unid. disponibles!`
            : `${producto.stock} unid. disponibles`}
        </p>
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
        <div className="w-full flex items-center justify-between gap-2 py-1.5 px-3 rounded-xl bg-blue-500/15 ring-1 ring-blue-500/30 mb-3">
          <button
            onClick={() => updateQuantity(producto.id, enCarrito.cantidad - 1)}
            className="w-7 h-7 rounded-lg bg-white border border-blue-200 text-blue-600 hover:bg-blue-100 flex items-center justify-center font-bold text-base transition-colors"
            aria-label="Reducir cantidad"
          >
            −
          </button>
          <span className="text-sm font-bold text-blue-400 flex items-center gap-1.5">
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
          <span className="text-slate-500">{icono}</span>
          {categoriaNombre}
        </span>
      </div>
    </div>
  );
}
