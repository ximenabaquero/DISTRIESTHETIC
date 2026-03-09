"use client";

import { Suspense, useMemo, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { ProductCard } from "@/components/ProductCard";
import { type Producto } from "@/data/productos";
import { useContactInfo } from "@/hooks/useContactInfo";
import EkgDivider from "@/components/EkgDivider";

// ── Category icons (SVG) ──────────────────────────────────────────────────────

const categoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  medicamentos: {
    label: "Medicamentos",
    color: "blue",
    // HeartIcon — salud / farmacia
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 6.375 10.5 10.5 10.5 10.5S21 14.625 21 8.25Z" />
      </svg>
    ),
  },
  soluciones: {
    label: "Soluciones",
    color: "teal",
    // BeakerIcon — líquido / soluciones IV / suero
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.25 48.25 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  insumos: {
    label: "Insumos",
    color: "violet",
    // PlusCircleIcon — cruz médica universal
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  quimicos: {
    label: "Químicos",
    color: "amber",
    // SparklesIcon — reacciones / moléculas
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
  ropa: {
    label: "Ropa",
    color: "rose",
    // TagIcon — etiqueta de prenda
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
      </svg>
    ),
  },
  proteccion: {
    label: "Protección",
    color: "green",
    // ShieldCheckIcon — EPP / protección (se mantiene)
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
};

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

// ── Page ──────────────────────────────────────────────────────────────────────

function ProductosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchTerm = searchParams.get("q") ?? "";
  const selectedCategory = searchParams.get("cat") ?? "";
  const sortBy = searchParams.get("sort") ?? "";

  const [data, setData] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const { whatsapp } = useContactInfo();

  function setSearchTerm(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value); else params.delete("q");
    router.replace(`/productos?${params.toString()}`, { scroll: false });
  }

  function setSelectedCategory(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("cat", value); else params.delete("cat");
    router.replace(`/productos?${params.toString()}`, { scroll: false });
  }

  function setSortBy(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sort", value); else params.delete("sort");
    router.replace(`/productos?${params.toString()}`, { scroll: false });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/productos", { cache: "no-store" });
        const json = await res.json();
        if (json.ok) setData(json.productos as Producto[]);
      } catch (e) {
        console.error("Error cargando productos", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categorias = Object.entries(categoryConfig).map(([id, cfg]) => ({
    id,
    ...cfg,
    count: data.filter((p) => p.categoria === id).length,
  }));

  const productosFiltrados = useMemo(() => {
    const filtered = data.filter((p) => {
      const matchesSearch =
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || p.categoria === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "precio-asc":
          return (a.precio ?? Infinity) - (b.precio ?? Infinity);
        case "precio-desc":
          return (b.precio ?? -Infinity) - (a.precio ?? -Infinity);
        case "nombre":
          return a.nombre.localeCompare(b.nombre, "es");
        case "disponibles":
          return (b.stock > 0 ? 1 : 0) - (a.stock > 0 ? 1 : 0);
        default:
          return 0;
      }
    });
  }, [searchTerm, selectedCategory, sortBy, data]);

  return (
    <div className="min-h-screen bg-[#0b1221]">
      <SiteNav />

      <div className="container mx-auto px-4 sm:px-6 py-10">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">
            DISTRIESTHETIC
          </p>
          <div>
            <h1 className="text-3xl font-bold text-white">Catálogo de Productos</h1>
            <p className="text-slate-400 mt-1">
              Insumos médicos con registro INVIMA y garantía de calidad
            </p>
          </div>
        </div>

        {/* Search + filters */}
        <div className="bg-[#1a2845] border border-white/[0.10] rounded-2xl p-5 mb-8">

          {/* Search input */}
          <div className="relative mb-4">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#0b1221] border border-white/[0.08] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                !selectedCategory
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white/[0.06] text-slate-300 hover:bg-white/[0.10]"
              }`}
            >
              Todos
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${!selectedCategory ? "bg-blue-500 text-white" : "bg-white/[0.08] text-slate-400"}`}>
                {data.length}
              </span>
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id === selectedCategory ? "" : cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white/[0.06] text-slate-300 hover:bg-white/[0.10]"
                }`}
              >
                {cat.icon}
                {cat.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${selectedCategory === cat.id ? "bg-blue-500 text-white" : "bg-white/[0.08] text-slate-400"}`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.08]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-500 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
            </svg>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm text-slate-400 bg-transparent border-none outline-none cursor-pointer hover:text-white transition-colors [&>option]:bg-[#111c30] [&>option]:text-white"
            >
              <option value="">Ordenar: relevancia</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nombre">Nombre A–Z</option>
              <option value="disponibles">Disponibles primero</option>
            </select>
          </div>

          {/* Result count */}
          {(searchTerm || selectedCategory) && (
            <p className="mt-4 pt-4 border-t border-white/[0.08] text-sm text-slate-400">
              {productosFiltrados.length === 0
                ? "Sin resultados"
                : `${productosFiltrados.length} de ${data.length} productos`}
              {searchTerm && (
                <span className="ml-1">para <span className="font-medium text-slate-200">&quot;{searchTerm}&quot;</span></span>
              )}
            </p>
          )}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#1a2845] rounded-2xl p-6 border border-white/[0.10] animate-pulse">
                <div className="h-40 bg-white/[0.06] rounded-xl mb-4" />
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-white/[0.06] rounded-xl" />
                  <div className="w-16 h-5 bg-white/[0.06] rounded-full" />
                </div>
                <div className="h-5 bg-white/[0.06] rounded-lg mb-2 w-3/4" />
                <div className="h-4 bg-white/[0.06] rounded-lg mb-4 w-full" />
                <div className="h-4 bg-white/[0.06] rounded-lg mb-4 w-1/2" />
                <div className="h-9 bg-white/[0.06] rounded-xl mb-3" />
                <div className="h-5 bg-white/[0.06] rounded-lg w-2/3" />
              </div>
            ))}
          </div>
        ) : productosFiltrados.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {productosFiltrados.map((producto) => {
              const cfg = categoryConfig[producto.categoria];
              return (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  color={cfg?.color ?? "blue"}
                  icono={cfg?.icon ?? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>}
                  categoriaNombre={cfg?.label ?? producto.categoria}
                />
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-[#1a2845] border border-white/[0.10] rounded-2xl p-12 text-center">
            <div className="w-12 h-12 bg-white/[0.06] rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white mb-1">Sin resultados</h2>
            <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">
              No hay productos que coincidan con <span className="font-medium">&quot;{searchTerm}&quot;</span>.
              Intenta con otros términos.
            </p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedCategory(""); }}
              className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Ver todos los productos
            </button>
          </div>
        )}

        <EkgDivider className="mt-16 mb-8" />

        {/* WhatsApp CTA */}
        <div className="bg-gray-900 rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white text-xl font-bold mb-1">
              ¿No encuentras lo que buscas?
            </h3>
            <p className="text-gray-400 text-sm">
              Escríbenos directamente y te ayudamos a encontrarlo.
            </p>
          </div>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2.5 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors duration-200 text-sm shadow-sm"
          >
            <WhatsAppIcon />
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b1221] flex items-center justify-center">
        <svg className="w-5 h-5 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    }>
      <ProductosContent />
    </Suspense>
  );
}