'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
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

const fmtShort = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
};

// ── Tooltip personalizado para la gráfica de ingresos ──────────────────────
function IngresoTooltip({ active, payload, label }: { active?: boolean; payload?: {value: number}[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-600 mb-0.5">{label}</p>
      <p className="text-blue-600 font-bold text-sm">{fmt(payload[0].value)}</p>
    </div>
  );
}

// ── Tooltip personalizado para top productos ────────────────────────────────
function ProductoTooltip({ active, payload, label }: { active?: boolean; payload?: {value: number}[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs max-w-[180px]">
      <p className="font-semibold text-gray-700 mb-0.5 truncate">{label}</p>
      <p className="text-violet-600 font-bold">{payload[0].value} pedido{payload[0].value !== 1 ? 's' : ''}</p>
    </div>
  );
}

export default function DashboardView({ productos, pedidos, loadingPedidos }: DashboardViewProps) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const monthStr = now.toISOString().slice(0, 7);

  // ── KPIs ────────────────────────────────────────────────────────────────
  const pedidosHoy = pedidos.filter(p => p.createdAt.slice(0, 10) === todayStr);
  const pedidosMes = pedidos.filter(p => p.createdAt.slice(0, 7) === monthStr);
  const pedidosSinEntregar = pedidos.filter(p => p.estado === 'sin_entregar');
  const ingresosMes = pedidosMes
    .filter(p => p.estado !== 'cancelado')
    .reduce((sum, p) => sum + p.total, 0);

  // Mes anterior
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthStr = prevMonth.toISOString().slice(0, 7);
  const ingresosMesAnterior = pedidos
    .filter(p => p.createdAt.slice(0, 7) === prevMonthStr && p.estado === 'entregado')
    .reduce((sum, p) => sum + p.total, 0);
  const pctCambio = ingresosMesAnterior > 0
    ? ((ingresosMes - ingresosMesAnterior) / ingresosMesAnterior) * 100
    : null;

  // ── Gráfica 1: ingresos por día — últimos 14 días ───────────────────────
  const ingresosXDia = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (13 - i));
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
    const total = pedidos
      .filter(p => p.createdAt.slice(0, 10) === key && p.estado !== 'cancelado')
      .reduce((sum, p) => sum + p.total, 0);
    return { label, total };
  });

  // ── Gráfica 2: top 5 productos del mes ──────────────────────────────────
  const conteoProductos: Record<string, number> = {};
  pedidosMes.filter(p => p.estado === 'entregado').forEach(pedido => {
    pedido.items.forEach(item => {
      conteoProductos[item.nombre] = (conteoProductos[item.nombre] ?? 0) + item.cantidad;
    });
  });
  const topProductos = Object.entries(conteoProductos)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([nombre, cantidad]) => ({
      nombre: nombre.length > 22 ? nombre.slice(0, 22) + '…' : nombre,
      cantidad,
    }));

  // ── Stock bajo ───────────────────────────────────────────────────────────
  const STOCK_BAJO = 5;
  const productosStockBajo = productos
    .filter(p => p.stock <= STOCK_BAJO && p.disponible)
    .sort((a, b) => a.stock - b.stock);

  // ── Pedidos recientes ────────────────────────────────────────────────────
  const recentPedidos = pedidos.slice(0, 5);

  const stats = [
    {
      label: 'Total productos',
      value: String(productos.length),
      sub: `${productos.filter(p => p.disponible).length} disponibles`,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
    },
    {
      label: 'Pedidos hoy',
      value: loadingPedidos ? '—' : String(pedidosHoy.length),
      sub: loadingPedidos ? 'Cargando...' : `${pedidosHoy.filter(p => p.metodoPago === 'wompi').length} Wompi · ${pedidosHoy.filter(p => p.metodoPago === 'whatsapp').length} WhatsApp`,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
    },
    {
      label: 'Sin entregar',
      value: loadingPedidos ? '—' : String(pedidosSinEntregar.length),
      sub: loadingPedidos ? 'Cargando...' : pedidosSinEntregar.length > 0 ? 'Requieren atención' : 'Todo al día',
      iconBg: pedidosSinEntregar.length > 0 ? 'bg-yellow-50' : 'bg-gray-50',
      iconColor: pedidosSinEntregar.length > 0 ? 'text-yellow-500' : 'text-gray-400',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Ingresos este mes',
      value: loadingPedidos ? '—' : fmt(ingresosMes),
      sub: loadingPedidos ? 'Cargando...' : pctCambio !== null
        ? `${pctCambio >= 0 ? '+' : ''}${pctCambio.toFixed(1)}% vs mes anterior`
        : 'Sin datos del mes anterior',
      subColor: pctCambio !== null ? (pctCambio >= 0 ? 'text-green-600' : 'text-red-500') : undefined,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide leading-tight">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${stat.iconBg} ${stat.iconColor}`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 truncate mb-0.5">{stat.value}</p>
            <p className={`text-xs truncate ${stat.subColor ?? 'text-gray-400'}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Gráficas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Ingresos diarios — ocupa 3 columnas */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Ingresos diarios</h3>
              <p className="text-xs text-gray-400 mt-0.5">Últimos 14 días · pedidos no cancelados</p>
            </div>
          </div>
          {loadingPedidos ? (
            <div className="h-48 flex items-center justify-center text-sm text-gray-400">Cargando...</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ingresosXDia} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  interval={1}
                />
                <YAxis
                  tickFormatter={fmtShort}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <Tooltip content={<IngresoTooltip />} cursor={{ fill: '#f1f5f9', radius: 6 }} />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top 5 productos — ocupa 2 columnas */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 text-sm">Top productos</h3>
            <p className="text-xs text-gray-400 mt-0.5">Este mes · por unidades pedidas</p>
          </div>
          {loadingPedidos ? (
            <div className="h-48 flex items-center justify-center text-sm text-gray-400">Cargando...</div>
          ) : topProductos.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-gray-400">Sin pedidos este mes</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={topProductos}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="nombre"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  width={90}
                />
                <Tooltip content={<ProductoTooltip />} cursor={{ fill: '#f5f3ff' }} />
                <Bar dataKey="cantidad" fill="#8b5cf6" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Fila inferior: bajo stock + pedidos recientes ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Bajo stock */}
        {productosStockBajo.length > 0 && (
          <div className="bg-white rounded-xl border border-orange-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-orange-100 bg-orange-50 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-orange-500 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <h3 className="font-semibold text-orange-800 text-sm">
                Bajo stock — {productosStockBajo.length} producto{productosStockBajo.length !== 1 ? 's' : ''} con ≤ {STOCK_BAJO} unidades
              </h3>
            </div>
            <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {productosStockBajo.map(p => (
                <div key={p.id} className="px-5 py-2.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.nombre}</p>
                    <p className="text-xs text-gray-400 capitalize">{p.categoria}</p>
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
        <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${productosStockBajo.length === 0 ? 'lg:col-span-2' : ''}`}>
          <div className="px-5 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">Pedidos recientes</h3>
          </div>
          {loadingPedidos ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Cargando pedidos...</div>
          ) : recentPedidos.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Aún no hay pedidos registrados.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentPedidos.map(p => (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {p.items[0]?.nombre ?? 'Pedido'}
                      {p.items.length > 1 && <span className="text-gray-400 font-normal"> +{p.items.length - 1} más</span>}
                    </p>
                    <p className="text-xs text-gray-400">
                      #{p.id} · {new Date(p.createdAt).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                      p.estado === 'entregado'    ? 'bg-green-50 text-green-700 border-green-100' :
                      p.estado === 'cancelado'    ? 'bg-red-50 text-red-700 border-red-100' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-100'
                    }`}>
                      {p.estado === 'entregado' ? 'Entregado' : p.estado === 'cancelado' ? 'Cancelado' : 'Sin entregar'}
                    </span>
                    <span className="text-sm font-bold text-gray-800">{fmt(p.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
