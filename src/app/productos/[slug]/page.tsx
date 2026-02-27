"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type Producto } from "@/data/productos";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { WhatsAppButtonFull } from "@/components/WhatsAppButton";

interface ProductoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Función para convertir nombre a slug
function toSlug(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductoPage({ params }: ProductoPageProps) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadProduct() {
      try {
        const resolvedParams = await params;
        const productSlug = resolvedParams.slug;
        
        // Cargar todos los productos de la API
        const res = await fetch('/api/productos', { cache: 'no-store' });
        const json = await res.json();
        
        if (json.ok) {
          const productos = json.productos as Producto[];
          // Buscar el producto que coincida con el slug
          const found = productos.find(p => toSlug(p.nombre) === productSlug);
          
          if (!found) {
            // Redirigir a la página not-found si no se encuentra el producto
            router.push('/productos/' + productSlug + '/not-found');
          } else {
            setProducto(found);
          }
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
              <div className="space-y-4 mb-8">
                <WhatsAppButtonFull producto={producto} />
                
                <Link
                  href="/contacto"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors block text-center"
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
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Productos Relacionados</h2>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-600">
              {/* TODO: Implement related products when product catalog is available */}
              Los productos relacionados se mostrarán aquí cuando el catálogo esté disponible.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}