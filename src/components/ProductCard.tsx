"use client";

import Link from "next/link";
import Image from "next/image";
import { type Producto } from "@/data/productos";
import { WhatsAppButton } from "./WhatsAppButton";
import { useCart } from "@/context/CartContext";

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
  const { addItem, items } = useCart();
  const enCarrito = items.find(i => i.producto.id === producto.id);

  return (
    <div
      className={`bg-gradient-to-br from-white to-${color}-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 border-l-4 border-${color}-300 group`}
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
            <div className={`flex h-40 w-full items-center justify-center rounded-xl border-2 border-dashed border-${color}-200 bg-white/50 text-sm font-semibold text-${color}-500 uppercase tracking-wide cursor-pointer`}>
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
        <span className={`bg-${color}-100 text-${color}-700 text-xs px-3 py-1 rounded-full font-bold`}>
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
          <span className={producto.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
            {producto.stock > 0 ? `${producto.stock} unid.` : 'Sin stock'}
          </span>
        </div>
      </div>
      
      {/* Agregar al carrito */}
      <button
        onClick={() => addItem(producto)}
        disabled={producto.stock === 0}
        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 mb-3 ${
          producto.stock === 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : enCarrito
            ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200 hover:bg-blue-100"
            : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        {producto.stock === 0
          ? "Sin stock"
          : enCarrito
          ? `En carrito (${enCarrito.cantidad})`
          : "Agregar al carrito"}
      </button>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold px-2 py-1 bg-${color}-50 text-${color}-700 rounded-full flex items-center gap-1.5`}>
          <span className="text-gray-500">{icono}</span>
          {categoriaNombre}
        </span>
        <WhatsAppButton producto={producto} />
      </div>
    </div>
  );
}
