"use client";

import Link from "next/link";

export default function ProductosPage() {
  // TODO: Replace with actual product data from API/database
  const categorias = [
    { id: "medicamentos", nombre: "Medicamentos", count: 0 },
    { id: "soluciones", nombre: "Soluciones", count: 0 },
    { id: "insumos", nombre: "Insumos", count: 0 },
    { id: "quimicos", nombre: "Químicos", count: 0 },
    { id: "ropa", nombre: "Ropa", count: 0 },
    { id: "proteccion", nombre: "Protección", count: 0 },
  ];

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
              <Link href="/productos" className="text-blue-600 font-semibold">
                Productos
              </Link>
              <Link href="/contacto" className="text-gray-700 hover:text-blue-600">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Nuestros Productos
        </h1>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-48">
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Buscar
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{categoria.nombre}</h3>
                <p className="text-gray-600 mb-4">
                  {categoria.count} productos disponibles
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Ver Productos
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Catálogo en Construcción
          </h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            {/* TODO: Update message when products are available */}
            Estamos preparando nuestro catálogo de productos. Próximamente encontrarás aquí 
            toda nuestra gama de medicamentos, soluciones, insumos, químicos, ropa y protección 
            para centros estéticos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contactar Ventas
            </Link>
            <button
              onClick={() => {
                const whatsappNumber = "573046831493";
                const message = `Hola, me interesa conocer el catálogo de productos de DISTRIESTHETIC.`;
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, "_blank");
              }}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 16.894c-.893.893-1.984 1.534-3.242 1.9-.646.188-1.321.206-2.002.206-2.734 0-5.25-1.063-7.166-3.006L3.612 17.86l1.866-1.872c1.942 1.9 4.432 2.956 7.166 2.956.681 0 1.356-.018 2.002-.206 1.258-.366 2.349-1.007 3.242-1.9.893-.893 1.534-1.984 1.9-3.242.188-.646.206-1.321.206-2.002 0-2.734-1.056-5.224-2.956-7.166L15.166 3.556l1.872-1.866c1.943 1.916 3.006 4.432 3.006 7.166 0 .681-.018 1.356-.206 2.002-.366 1.258-1.007 2.349-1.9 3.242z"/>
              </svg>
              WhatsApp
            </button>
          </div>
        </div>

        {/* TODO: Product Grid Section (to be implemented when products are available) */}
        {/* 
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={producto.imagen} 
                alt={producto.nombre}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{producto.nombre}</h3>
                <p className="text-gray-600 text-sm mb-3">{producto.descripcion}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">{producto.precio}</span>
                  <Link 
                    href={`/productos/${producto.slug}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        */}
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