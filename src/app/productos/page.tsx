"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";

export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Catálogo completo de productos
  const productos = [
    // Medicamentos e insumos médicos
    { id: 1, nombre: "Lidocaína 50 ml", descripcion: "unidad | caja x20", categoria: "medicamentos", disponible: true, etiqueta: "NUEVO" },
    { id: 2, nombre: "Wypall Yumbo", descripcion: "890 paños", categoria: "medicamentos", disponible: true, etiqueta: "STOCK" },
    { id: 3, nombre: "Adrenalina", descripcion: "ampolla", categoria: "medicamentos", disponible: true, etiqueta: "DISPONIBLE" },
    { id: 4, nombre: "Bicarbonato", descripcion: "ampolla", categoria: "medicamentos", disponible: true, etiqueta: "STOCK" },
    { id: 5, nombre: "Clindamicina 600 mg", descripcion: "ampolla", categoria: "medicamentos", disponible: true, etiqueta: "600mg" },
    { id: 6, nombre: "Gentamicina 80 mg", descripcion: "ampolla", categoria: "medicamentos", disponible: true, etiqueta: "80mg" },
    { id: 7, nombre: "Enoxaparina sódica 40 mg", descripcion: "40 mg", categoria: "medicamentos", disponible: true, etiqueta: "40mg" },
    { id: 8, nombre: "Cefalexina 500 mg", descripcion: "caja x10", categoria: "medicamentos", disponible: true, etiqueta: "x10" },
    { id: 9, nombre: "Propofol 20 ml", descripcion: "20 ml", categoria: "medicamentos", disponible: true, etiqueta: "20ml" },
    { id: 10, nombre: "Tramadol clorhidrato 50 mg/ml", descripcion: "50 mg/ml", categoria: "medicamentos", disponible: true, etiqueta: "50mg" },
    { id: 11, nombre: "Dexametazona 8 mg/2 ml", descripcion: "caja x100", categoria: "medicamentos", disponible: true, etiqueta: "x100" },
    { id: 12, nombre: "Diclofenaco 75 mg", descripcion: "caja x100", categoria: "medicamentos", disponible: true, etiqueta: "x100" },

    // Soluciones y líquidos
    { id: 13, nombre: "Frasco 2.5 L", descripcion: "sin tapa | con tapa", categoria: "soluciones", disponible: true, etiqueta: "2.5L" },
    { id: 14, nombre: "Solución salina 500 ml", descripcion: "500 ml", categoria: "soluciones", disponible: true, etiqueta: "500ml" },
    { id: 15, nombre: "Solución salina 1.000 ml", descripcion: "1.000 ml", categoria: "soluciones", disponible: true, etiqueta: "1L" },
    { id: 16, nombre: "Lactato de Ringer 500 ml", descripcion: "500 ml", categoria: "soluciones", disponible: true, etiqueta: "500ml" },

    // Insumos médicos
    { id: 17, nombre: "Microbrush", descripcion: "x100 unidades", categoria: "insumos", disponible: true, etiqueta: "x100" },
    { id: 18, nombre: "Jeringas 3 ml", descripcion: "caja x100", categoria: "insumos", disponible: true, etiqueta: "3ml" },
    { id: 19, nombre: "Jeringas 5 ml", descripcion: "caja x100", categoria: "insumos", disponible: true, etiqueta: "5ml" },
    { id: 20, nombre: "Jeringas 10 ml", descripcion: "caja x100", categoria: "insumos", disponible: true, etiqueta: "10ml" },
    { id: 21, nombre: "Jeringas 20 ml", descripcion: "caja x50", categoria: "insumos", disponible: true, etiqueta: "20ml" },
    { id: 22, nombre: "Agujas 30G x ½", descripcion: "caja completa", categoria: "insumos", disponible: true, etiqueta: "30G" },
    { id: 23, nombre: "Yelcos #22", descripcion: "caja x50", categoria: "insumos", disponible: true, etiqueta: "#22" },
    { id: 24, nombre: "Tubos para plasma", descripcion: "100 unid., tapa azul", categoria: "insumos", disponible: true, etiqueta: "x100" },

    // Desinfectantes y químicos
    { id: 25, nombre: "Glutamida", descripcion: "galón 4.000 ml", categoria: "quimicos", disponible: true, etiqueta: "4L" },
    { id: 26, nombre: "Benzaldina", descripcion: "galón 4.000 ml", categoria: "quimicos", disponible: true, etiqueta: "4L" },

    // Ropa e indumentaria médica
    { id: 27, nombre: "Medias antiembólicas", descripcion: "par", categoria: "ropa", disponible: true, etiqueta: "PAR" },
    { id: 28, nombre: "Bata cirujano manga larga", descripcion: "manga larga", categoria: "ropa", disponible: true, etiqueta: "CIRUJANO" },
    { id: 29, nombre: "Bata paciente manga sisa", descripcion: "manga sisa", categoria: "ropa", disponible: true, etiqueta: "PACIENTE" },
    { id: 30, nombre: "Polainas", descripcion: "50 pares", categoria: "ropa", disponible: true, etiqueta: "x50" },
    { id: 31, nombre: "Gorros tipo oruga", descripcion: "100 unidades", categoria: "ropa", disponible: true, etiqueta: "x100" },
    { id: 32, nombre: "Sábana desechable para camilla", descripcion: "para camilla", categoria: "ropa", disponible: true, etiqueta: "DESECHABLE" },

    // Protección personal
    { id: 33, nombre: "Tapabocas empaque individual", descripcion: "empaque x50", categoria: "proteccion", disponible: true, etiqueta: "x50" },
    { id: 34, nombre: "Guantes de nitrilo", descripcion: "caja x50 pares", categoria: "proteccion", disponible: true, etiqueta: "NITRILO" },
    { id: 35, nombre: "Guantes estériles", descripcion: "caja x50 pares", categoria: "proteccion", disponible: true, etiqueta: "ESTÉRIL" },
    { id: 36, nombre: "Guantes de látex", descripcion: "caja completa", categoria: "proteccion", disponible: true, etiqueta: "LÁTEX" },
    { id: 37, nombre: "Campo estéril 1x1", descripcion: "1x1 metro", categoria: "proteccion", disponible: true, etiqueta: "1x1" },
  ];

  const categorias = [
    { id: "medicamentos", nombre: "💉 Medicamentos", emoji: "💉", count: productos.filter(p => p.categoria === "medicamentos").length },
    { id: "soluciones", nombre: "🧴 Soluciones", emoji: "🧴", count: productos.filter(p => p.categoria === "soluciones").length },
    { id: "insumos", nombre: "🧰 Insumos", emoji: "🧰", count: productos.filter(p => p.categoria === "insumos").length },
    { id: "quimicos", nombre: "🧪 Químicos", emoji: "🧪", count: productos.filter(p => p.categoria === "quimicos").length },
    { id: "ropa", nombre: "👕 Ropa", emoji: "👕", count: productos.filter(p => p.categoria === "ropa").length },
    { id: "proteccion", nombre: "🧤 Protección", emoji: "🧤", count: productos.filter(p => p.categoria === "proteccion").length },
  ];

  // Filtrar productos
  const productosFiltrados = useMemo(() => {
    return productos.filter(producto => {
      const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || producto.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const getCategoryColor = (categoria) => {
    const colors = {
      medicamentos: "blue",
      soluciones: "sky", 
      insumos: "cyan",
      quimicos: "blue",
      ropa: "sky",
      proteccion: "cyan"
    };
    return colors[categoria] || "blue";
  };

  const getProductIcon = (categoria) => {
    const icons = {
      medicamentos: "💊",
      soluciones: "💧",
      insumos: "🪥",
      quimicos: "🧪",
      ropa: "👔",
      proteccion: "🧤"
    };
    return icons[categoria] || "📦";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src="/logodistsin.png"
                alt="DISTRIESTHETIC Logo"
                width={200}
                height={80}
                className="h-16 w-auto"
              />
              <span className="text-2xl font-bold text-blue-600 ml-3">
                DISTRIESTHETIC
              </span>
            </div>
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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Catálogo de Productos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encuentra todos nuestros productos médicos con registro INVIMA y garantía de calidad
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border-t-4 border-blue-300">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos (ej: lidocaína, jeringas, guantes...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all text-lg"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="lg:w-80">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all text-lg bg-white"
              >
                <option value="">🔍 Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre} ({categoria.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Search Results Counter */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-lg">
              {productosFiltrados.length === productos.length 
                ? `Mostrando todos los ${productos.length} productos`
                : `Encontrados ${productosFiltrados.length} de ${productos.length} productos`
              }
              {selectedCategory && (
                <span className="ml-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {categorias.find(c => c.id === selectedCategory)?.nombre}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {productosFiltrados.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {productosFiltrados.map((producto) => {
              const color = getCategoryColor(producto.categoria);
              return (
                <div
                  key={producto.id}
                  className={`bg-gradient-to-br from-white to-${color}-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 border-l-4 border-${color}-300 group`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl group-hover:scale-110 transition-transform">
                      {getProductIcon(producto.categoria)}
                    </span>
                    <span className={`bg-${color}-100 text-${color}-700 text-xs px-3 py-1 rounded-full font-bold`}>
                      {producto.etiqueta}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {producto.nombre}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {producto.descripcion}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-2 py-1 bg-${color}-50 text-${color}-700 rounded-full`}>
                      {categorias.find(c => c.id === producto.categoria)?.emoji} {categorias.find(c => c.id === producto.categoria)?.nombre.replace(/^.+? /, '')}
                    </span>
                    <button
                      onClick={() => {
                        const whatsappNumber = "3246614270";
                        const message = `Hola, me interesa el producto: ${producto.nombre} - ${producto.descripcion}`;
                        const whatsappUrl = `https://wa.me/57${whatsappNumber}?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, "_blank");
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      Pedir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              No se encontraron productos
            </h2>
            <p className="text-gray-600 mb-8 text-lg max-w-lg mx-auto">
              No hay productos que coincidan con tu búsqueda &ldquo;{searchTerm}&rdquo;. 
              Intenta con otros términos o explora todas las categorías.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
              className="bg-blue-500 text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition-colors text-lg font-semibold"
            >
              Ver todos los productos
            </button>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-20 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white p-12 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h3>
            <p className="text-blue-100 text-lg mb-8">Contáctanos directamente por WhatsApp</p>
            <a
              href="https://wa.me/573246614270"
              className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="text-2xl mr-3">📱</span>
              WhatsApp: 324 6614270
            </a>
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