'use client';

import type { Pedido } from '@/lib/pedidosStore';
import type { Producto } from '@/data/productos';

interface ProductoEditable extends Producto {
  dirty?: boolean;
  isExtra?: boolean;
}

interface DashboardViewProps {
  productos: ProductoEditable[];
  pedidos: Pedido[];
  loadingPedidos: boolean;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

export default function DashboardView({ productos, pedidos, loadingPedidos }: DashboardViewProps) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const monthStr = now.toISOString().slice(0, 7);

  const pedidosHoy = pedidos.filter(p => p.createdAt.slice(0, 10) === todayStr);
  const pedidosMes = pedidos.filter(p => p.createdAt.slice(0, 7) === monthStr);
  const ingresosMes = pedidosMes
    .filter(p => p.estado !== 'cancelado')
    .reduce((sum, p) => sum + p.total, 0);

  const stats = [
    {
      label: 'Total productos',
      value: String(productos.length),
      sub: `${productos.filter(p => p.disponible).length} disponibles`,
      color: 'blue',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
    },
    {
      label: 'Pedidos hoy',
      value: loadingPedidos ? '—' : String(pedidosHoy.length),
      sub: loadingPedidos ? 'Cargando...' : `${pedidosHoy.filter(p => p.metodoPago === 'wompi').length} Wompi · ${pedidosHoy.filter(p => p.metodoPago === 'whatsapp').length} WhatsApp`,
      color: 'green',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
    },
    {
      label: 'Pedidos este mes',
      value: loadingPedidos ? '—' : String(pedidosMes.length),
      sub: loadingPedidos ? 'Cargando...' : `${pedidosMes.filter(p => p.estado === 'pagado').length} pagados · ${pedidosMes.filter(p => p.estado === 'pendiente').length} pendientes`,
      color: 'purple',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
        </svg>
      ),
    },
    {
      label: 'Ingresos este mes',
      value: loadingPedidos ? '—' : fmt(ingresosMes),
      sub: loadingPedidos ? 'Cargando...' : 'Pedidos no cancelados',
      color: 'amber',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
        </svg>
      ),
    },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  const recentPedidos = pedidos.slice(0, 5);
  const STOCK_BAJO = 5;
  const productosStockBajo = productos.filter(p => p.stock <= STOCK_BAJO && p.disponible).sort((a, b) => a.stock - b.stock);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[stat.color]}`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 truncate">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1 truncate">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Alerta bajo stock */}
      {productosStockBajo.length > 0 && (
        <div className="bg-white rounded-xl border border-orange-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-orange-100 flex items-center gap-2 bg-orange-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-orange-500 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <h3 className="font-semibold text-orange-800 text-sm">
              Bajo stock — {productosStockBajo.length} producto{productosStockBajo.length !== 1 ? 's' : ''} con ≤ {STOCK_BAJO} unidades
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {productosStockBajo.map(p => (
              <div key={p.id} className="px-5 py-2.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.nombre}</p>
                  <p className="text-xs text-gray-400">{p.categoria}</p>
                </div>
                <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                  p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {p.stock === 0 ? 'Sin stock' : `${p.stock} uds`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pedidos recientes */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Pedidos recientes</h3>
        </div>
        {loadingPedidos ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">Cargando pedidos...</div>
        ) : recentPedidos.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">Aún no hay pedidos registrados.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentPedidos.map(p => (
              <div key={p.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {p.items.length} {p.items.length === 1 ? 'producto' : 'productos'}
                    {p.items[0] && ` — ${p.items[0].nombre}${p.items.length > 1 ? ` +${p.items.length - 1}` : ''}`}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(p.createdAt).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    p.metodoPago === 'wompi' ? 'bg-indigo-50 text-indigo-700' : 'bg-green-50 text-green-700'
                  }`}>
                    {p.metodoPago === 'wompi' ? 'Wompi' : 'WhatsApp'}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    p.estado === 'pagado' ? 'bg-green-50 text-green-700' :
                    p.estado === 'cancelado' ? 'bg-red-50 text-red-700' :
                    'bg-yellow-50 text-yellow-700'
                  }`}>
                    {p.estado}
                  </span>
                  <span className="text-sm font-bold text-gray-800">{fmt(p.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
