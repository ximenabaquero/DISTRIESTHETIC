"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useEffect, useRef } from "react";
import { type Producto } from "@/data/productos";

export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [adminMode, setAdminMode] = useState(false);
  const [data, setData] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const dirtyRef = useRef<Set<number>>(new Set());
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [pendingPassword, setPendingPassword] = useState("");

  // Fetch inicial desde API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/productos', { cache: 'no-store' });
        const json = await res.json();
        if (json.ok) setData(json.productos as Producto[]);
      } catch (e) {
        console.error('Error cargando productos', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Persistencia en lote (debounce 800ms)
  const scheduleSave = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      if (dirtyRef.current.size === 0) return;
      setSaving(true);
      try {
        const payload = data
          .filter(p => dirtyRef.current.has(p.id))
          .map(p => ({ id: p.id, precio: p.precio, stock: p.stock }));
        const res = await fetch('/api/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.ok) {
          setData(json.productos as Producto[]);
          dirtyRef.current.clear();
        }
      } catch (e) {
        console.error('Error guardando cambios', e);
      } finally {
        setSaving(false);
      }
    }, 800);
  };

  // Guardado inmediato (sin esperar debounce)
  const flushSave = async () => {
    if (saving || dirtyRef.current.size === 0) return;
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    setSaving(true);
    try {
      const payload = data
        .filter(p => dirtyRef.current.has(p.id))
        .map(p => ({ id: p.id, precio: p.precio, stock: p.stock }));
      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.ok) {
        setData(json.productos as Producto[]);
        dirtyRef.current.clear();
      }
    } catch (e) {
      console.error('Error guardando cambios (flush)', e);
    } finally {
      setSaving(false);
    }
  };

  // Catálogo completo de productos
  const productos = data;

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
  }, [searchTerm, selectedCategory, productos]);

  const getCategoryColor = (categoria: string) => {
    const colors: Record<string, string> = {
      medicamentos: "blue",
      soluciones: "sky", 
      insumos: "cyan",
      quimicos: "blue",
      ropa: "sky",
      proteccion: "cyan"
    };
    return colors[categoria] || "blue";
  };

  const getProductIcon = (categoria: string) => {
    const icons: Record<string, string> = {
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
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!adminMode && (
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  placeholder="Clave administrador"
                  value={pendingPassword}
                  onChange={(e) => setPendingPassword(e.target.value)}
                  className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  onClick={() => {
                    if (pendingPassword === "distri2025") {
                      setAdminMode(true);
                      setPendingPassword("");
                    } else {
                      alert("Clave incorrecta");
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                >
                  Entrar Admin
                </button>
              </div>
            )}
            {adminMode && (
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-blue-700 font-semibold text-sm">
                    Modo Admin {saving ? '— Guardando…' : dirtyRef.current.size > 0 ? '— Cambios pendientes' : '— Sin cambios'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={flushSave}
                    disabled={saving || dirtyRef.current.size === 0}
                    className={`text-xs px-3 py-1 rounded font-semibold transition-colors ${saving ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : dirtyRef.current.size === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    title={dirtyRef.current.size === 0 ? 'No hay cambios por guardar' : 'Guardar inmediatamente'}
                  >
                    Guardar ahora
                  </button>
                  <button
                    onClick={() => setAdminMode(false)}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >Salir</button>
                </div>
              </div>
            )}
          </div>
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
        {loading ? (
          <div className="text-center text-gray-500 py-20">Cargando productos...</div>
        ) : productosFiltrados.length > 0 ? (
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

                    {/* Precio y stock */}
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-gray-700">Precio:</span>
                        {!adminMode && (
                          <span className="text-gray-800 font-bold">
                            {producto.precio != null ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(producto.precio) : '—'}
                          </span>
                        )}
                        {adminMode && (
                          <input
                            type="number"
                            className="w-28 px-2 py-1 border rounded text-gray-800 text-right"
                            value={producto.precio ?? ''}
                            placeholder="Precio"
                            onChange={(e) => {
                              const value = e.target.value === '' ? null : Number(e.target.value);
                              const updated = data.map(p => p.id === producto.id ? { ...p, precio: value } : p);
                              setData(updated);
                              dirtyRef.current.add(producto.id);
                              scheduleSave();
                            }}
                          />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-gray-700">Stock:</span>
                        {!adminMode && (
                          <span className={producto.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                            {producto.stock > 0 ? `${producto.stock} unid.` : 'Sin stock'}
                          </span>
                        )}
                        {adminMode && (
                          <input
                            type="number"
                            className="w-20 px-2 py-1 border rounded text-gray-800 text-right"
                            value={producto.stock}
                            min={0}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              const updated = data.map(p => p.id === producto.id ? { ...p, stock: value } : p);
                              setData(updated);
                              dirtyRef.current.add(producto.id);
                              scheduleSave();
                            }}
                          />
                        )}
                      </div>
                    </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-2 py-1 bg-${color}-50 text-${color}-700 rounded-full`}>
                      {categorias.find(c => c.id === producto.categoria)?.emoji} {categorias.find(c => c.id === producto.categoria)?.nombre.replace(/^.+? /, '')}
                    </span>
                    <button
                      onClick={() => {
                        const whatsappNumber = "3246614270";
                        const message = `Hola, me interesa el producto: ${producto.nombre} - ${producto.descripcion}${producto.precio ? ` | Precio mostrado: ${new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(producto.precio)}` : ''}`;
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