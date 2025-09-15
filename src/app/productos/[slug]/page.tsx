"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ProductoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  categoria: string;
  sku: string;
  stock: number;
  imagenes: string[];
  especificaciones: string[];
  usos: string[];
}

// TODO: Replace with actual product data fetching
function getProducto(slug: string): Producto | null {
  // Simulated product data - replace with actual API call
  const productos: Record<string, Producto> = {
    "producto-ejemplo": {
      id: "1",
      nombre: "Producto Ejemplo",
      descripcion: "Descripción detallada del producto ejemplo para centros estéticos.",
      precio: "$150.000",
      categoria: "Medicamentos",
      sku: "PRD-001",
      stock: 10,
      imagenes: ["/placeholder-product.jpg"],
      especificaciones: [
        "Especificación 1",
        "Especificación 2", 
        "Especificación 3"
      ],
      usos: [
        "Uso recomendado 1",
        "Uso recomendado 2"
      ]
    }
  };

  return productos[slug] || null;
}

export default function ProductoPage({ params }: ProductoPageProps) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      const resolvedParams = await params;
      const productSlug = resolvedParams.slug;
      
      const productData = getProducto(productSlug);
      setProducto(productData);
      setLoading(false);
    }
    
    loadProduct();
  }, [params]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!producto) {
    return <ProductNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              DISTRIESTHETIC
            </Link>
            <div className="flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Inicio
              </Link>
              <Link href="/productos" className="text-gray-700 hover:text-blue-600">
                Productos
              </Link>
              <Link href="/contacto" className="text-gray-700 hover:text-blue-600">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
              <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                {/* TODO: Replace with actual product image */}
                <div className="text-center">
                  <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500">Imagen del producto</p>
                  <p className="text-sm text-gray-400">TODO: Agregar imagen real</p>
                </div>
              </div>
            </div>
            
            {/* Thumbnail Images - TODO: Implement when multiple images available */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded border-2 border-transparent hover:border-blue-500 cursor-pointer">
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {producto.nombre}
                </h1>
                <p className="text-blue-600 font-medium">{producto.categoria}</p>
                <p className="text-sm text-gray-500">SKU: {producto.sku}</p>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold text-blue-600 mb-4">
                  {producto.precio}
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
                <WhatsAppButton producto={producto} />
                
                <Link
                  href="/contacto"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors block text-center"
                >
                  Solicitar Cotización
                </Link>
              </div>

              {/* Product Specifications */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Especificaciones</h3>
                <ul className="space-y-2">
                  {producto.especificaciones.map((spec: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Usage Instructions */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Usos Recomendados</h3>
                <ul className="space-y-2">
                  {producto.usos.map((uso: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600">{uso}</span>
                    </li>
                  ))}
                </ul>
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-xl font-bold">DISTRIESTHETIC</h3>
            <p className="text-gray-400">Distribución de productos estéticos</p>
          </div>
          <div className="flex justify-center space-x-6 mb-4">
            <Link href="/" className="text-gray-400 hover:text-white">
              Inicio
            </Link>
            <Link href="/productos" className="text-gray-400 hover:text-white">
              Productos
            </Link>
            <Link href="/contacto" className="text-gray-400 hover:text-white">
              Contacto
            </Link>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 DISTRIESTHETIC. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Product not found component
function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              DISTRIESTHETIC
            </Link>
            <div className="flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Inicio
              </Link>
              <Link href="/productos" className="text-gray-700 hover:text-blue-600">
                Productos
              </Link>
              <Link href="/contacto" className="text-gray-700 hover:text-blue-600">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Producto No Encontrado
          </h1>
          
          <p className="text-gray-600 mb-8">
            {/* TODO: Update message when product catalog is available */}
            El producto que buscas no existe o aún no está disponible en nuestro catálogo. 
            Nuestro equipo está trabajando para ampliar la oferta de productos.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/productos"
              className="block bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ver Todos los Productos
            </Link>
            
            <button
              onClick={() => {
                const whatsappNumber = "573046831493";
                const message = `Hola, estoy buscando un producto específico en DISTRIESTHETIC. ¿Podrían ayudarme?`;
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, "_blank");
              }}
              className="block w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Consultar por WhatsApp
            </button>
            
            <Link
              href="/"
              className="block text-blue-600 hover:underline"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Client component for WhatsApp button
function WhatsAppButton({ producto }: { 
  producto: {
    nombre: string;
    sku: string;
  }
}) {
  const handleWhatsAppClick = () => {
    const whatsappNumber = "573046831493";
    const message = `Hola, estoy interesado en el producto: ${producto.nombre} (${producto.sku}). ¿Podrías darme más información?`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
    >
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 16.894c-.893.893-1.984 1.534-3.242 1.9-.646.188-1.321.206-2.002.206-2.734 0-5.25-1.063-7.166-3.006L3.612 17.86l1.866-1.872c1.942 1.9 4.432 2.956 7.166 2.956.681 0 1.356-.018 2.002-.206 1.258-.366 2.349-1.007 3.242-1.9.893-.893 1.534-1.984 1.9-3.242.188-.646.206-1.321.206-2.002 0-2.734-1.056-5.224-2.956-7.166L15.166 3.556l1.872-1.866c1.943 1.916 3.006 4.432 3.006 7.166 0 .681-.018 1.356-.206 2.002-.366 1.258-1.007 2.349-1.9 3.242z"/>
      </svg>
      Consultar por WhatsApp
    </button>
  );
}