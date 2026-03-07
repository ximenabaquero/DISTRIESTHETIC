"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type Producto } from "@/data/productos";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { WhatsAppButtonFull } from "@/components/WhatsAppButton";
import { useCart } from "@/context/CartContext";

interface ProductoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function toSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const fmt = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export default function ProductoPage({ params }: ProductoPageProps) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [relacionados, setRelacionados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addItem, updateQuantity, items } = useCart();

  useEffect(() => {
    async function loadProduct() {
      try {
        const { slug } = await params;
        const res = await fetch(`/api/productos?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
        const json = await res.json();

        if (!json.ok || !json.producto) {
          router.push('/productos/' + slug + '/not-found');
          return;
        }
        const prod = json.producto as Producto;
        setProducto(prod);

        // Cargar relacionados (misma categoría, excluyendo el actual)
        const allRes = await fetch('/api/productos', { cache: 'no-store' });
        const allJson = await allRes.json();
        if (allJson.ok) {
          const rel = (allJson.productos as Producto[])
            .filter(p => p.categoria === prod.categoria && p.id !== prod.id)
            .slice(0, 4);
          setRelacionados(rel);
        }
      } catch (error) {
        console.error('Error cargando producto', error);
        setProducto(null);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!producto) {
    return null; // El router ya está redirigiendo a not-found
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNav />

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm">
            <Link href="/" className="text-blue-600 hover:underline">
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <Link href="/productos" className="text-blue-600 hover:underline">
              Productos
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-600">{producto.nombre}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                {producto.imagenUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={producto.imagenUrl}
                      alt={producto.nombre}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500">Sin imagen disponible</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-bold">
                    {producto.etiqueta}
                  </span>
                  {producto.disponible && (
                    <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-semibold">
                      ✓ Disponible
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {producto.nombre}
                </h1>
                <p className="text-blue-600 font-medium capitalize">{producto.categoria}</p>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold text-blue-600 mb-4">
                  {producto.precio != null 
                    ? new Intl.NumberFormat('es-CO', { 
                        style: 'currency', 
                        currency: 'COP', 
                        maximumFractionDigits: 0 
                      }).format(producto.precio)
                    : 'Precio a consultar'
                  }
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {producto.descripcion}
                </p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${producto.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`font-medium ${producto.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {producto.stock > 0 ? `En stock (${producto.stock} disponibles)` : 'Agotado'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-8">
                {/* Agregar al carrito */}
                {(() => {
                  const enCarrito = items.find(i => i.producto.id === producto.id);
                  const sinStock = producto.stock === 0;

                  if (sinStock) {
                    return (
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                        Sin stock
                      </button>
                    );
                  }

                  if (enCarrito) {
                    return (
                      <div className="flex items-center gap-3 p-1 bg-blue-50 border border-blue-100 rounded-xl">
                        <button
                          onClick={() => updateQuantity(producto.id, enCarrito.cantidad - 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-blue-200 text-blue-600 font-bold hover:bg-blue-100 transition-colors text-lg flex-shrink-0"
                          aria-label="Reducir cantidad"
                        >
                          −
                        </button>
                        <div className="flex-1 text-center">
                          <span className="text-sm font-bold text-blue-700">{enCarrito.cantidad} en carrito</span>
                          {producto.precio != null && (
                            <p className="text-xs text-blue-500">
                              {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(producto.precio * enCarrito.cantidad)} total
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => addItem(producto)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors text-lg flex-shrink-0"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
                    );
                  }

                  return (
                    <button
                      onClick={() => addItem(producto)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                      Agregar al carrito
                    </button>
                  );
                })()}

                {/* Ir al carrito (acceso rápido si ya tiene items) */}
                {items.length > 0 && (
                  <Link
                    href="/carrito"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-colors"
                  >
                    Ver carrito
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                )}

                <WhatsAppButtonFull producto={producto} />

                <Link
                  href="/contacto"
                  className="w-full bg-white text-blue-600 py-3 px-6 rounded-xl font-semibold hover:bg-blue-50 border border-blue-200 transition-colors block text-center text-sm"
                >
                  Solicitar Cotización
                </Link>
              </div>

              {/* Product Details */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Detalles del Producto</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span className="font-semibold text-gray-700">Categoría: </span>
                      <span className="text-gray-600 capitalize">{producto.categoria}</span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <div>
                      <span className="font-semibold text-gray-700">Código: </span>
                      <span className="text-gray-600">#{producto.id}</span>
                    </div>
                  </div>
                  {producto.precio != null && (
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <div>
                        <span className="font-semibold text-gray-700">Precio unitario </span>
                        <span className="text-gray-500 text-sm">(sin IVA)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relacionados.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Productos Relacionados</h2>
            <p className="text-sm text-gray-500 mb-6">Otros productos de la misma categoría</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relacionados.map(rel => (
                <Link
                  key={rel.id}
                  href={`/productos/${toSlug(rel.nombre)}`}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden group"
                >
                  {/* Imagen */}
                  <div className="h-36 bg-gray-50 relative overflow-hidden">
                    {rel.imagenUrl ? (
                      <Image
                        src={rel.imagenUrl}
                        alt={rel.nombre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(min-width: 1024px) 25vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {rel.nombre}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      {rel.precio != null ? (
                        <span className="text-sm font-bold text-blue-600">{fmt(rel.precio)}</span>
                      ) : (
                        <span className="text-xs text-gray-400">Consultar</span>
                      )}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${rel.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                        {rel.stock > 0 ? "En stock" : "Agotado"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}