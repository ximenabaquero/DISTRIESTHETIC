"use client";

import Link from "next/link";

export default function NotFound() {
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