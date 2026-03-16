'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Pedido, PedidoEstado, PedidoMetodo } from '@/lib/pedidosStore';

type RangoFecha = 'todo' | 'hoy' | 'semana' | 'mes';

interface PedidosViewProps {
  pedidos: Pedido[];
  loading: boolean;
  onUpdateEstado: (id: number, estado: PedidoEstado) => void;
  updatingId: number | null;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

const estadoBadge: Record<PedidoEstado, string> = {
  sin_entregar: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  entregado:    'bg-green-50 text-green-700 border-green-100',
  cancelado:    'bg-red-50 text-red-700 border-red-100',
};

const estadoLabel: Record<PedidoEstado, string> = {
  sin_entregar: 'Sin entregar',
  entregado:    'Entregado',
  cancelado:    'Cancelado',
};

const metodoBadge: Record<PedidoMetodo, string> = {
  wompi:    'bg-indigo-50 text-indigo-700',
  whatsapp: 'bg-green-50 text-green-700',
};

// ── Botones de acción reutilizables ───────────────────────────────────────────
function AccionButtons({
  p,
  isBusy,
  onUpdateEstado,
  compact = false,
}: {
  p: Pedido;
  isBusy: boolean;
  onUpdateEstado: (id: number, estado: PedidoEstado) => void;
  compact?: boolean;
}) {
  const base = compact
    ? 'text-xs font-medium px-2 py-1 rounded-lg transition-colors disabled:opacity-50'
    : 'text-sm font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50';

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <a
        href={`/api/pedidos/${p.id}/cuenta-cobro`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} bg-blue-50 text-blue-700 hover:bg-blue-100 inline-flex items-center gap-1`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
          <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clipRule="evenodd" />
        </svg>
        Cobro
      </a>
      {p.estado !== 'entregado' && (
        <button
          onClick={() => onUpdateEstado(p.id, 'entregado')}
          disabled={isBusy}
          className={`${base} bg-green-50 text-green-700 hover:bg-green-100`}
        >
          {isBusy ? '...' : 'Entregado'}
        </button>
      )}
      {p.estado !== 'cancelado' && (
        <button
          onClick={() => onUpdateEstado(p.id, 'cancelado')}
          disabled={isBusy}
          className={`${base} bg-red-50 text-red-700 hover:bg-red-100`}
        >
          {isBusy ? '...' : 'Cancelar'}
        </button>
      )}
      {p.estado !== 'sin_entregar' && (
        <button
          onClick={() => onUpdateEstado(p.id, 'sin_entregar')}
          disabled={isBusy}
          className={`${base} bg-yellow-50 text-yellow-700 hover:bg-yellow-100`}
        >
          {isBusy ? '...' : 'Sin entregar'}
        </button>
      )}
    </div>
  );
}

// ── Tarjeta móvil de pedido ───────────────────────────────────────────────────
function PedidoCard({
  p,
  isBusy,
  onUpdateEstado,
}: {
  p: Pedido;
  isBusy: boolean;
  onUpdateEstado: (id: number, estado: PedidoEstado) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isSinEntregar = p.estado === 'sin_entregar';
  const itemsToShow = expanded ? p.items : p.items.slice(0, 3);

  return (
    <div className={`rounded-xl border bg-white shadow-sm overflow-hidden ${
      isSinEntregar ? 'border-yellow-300 border-l-4' : 'border-gray-200'
    }`}>
      {/* Cabecera */}
      <div className="flex items-start justify-between px-4 pt-3 pb-2 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-gray-400">#{p.id}</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${estadoBadge[p.estado]}`}>
            {estadoLabel[p.estado]}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${metodoBadge[p.metodoPago]}`}>
            {p.metodoPago === 'wompi' ? 'Wompi' : 'WhatsApp'}
          </span>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
          {new Date(p.createdAt).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}
        </span>
      </div>

      {/* Productos */}
      <div className="px-4 pb-2">
        <div className="space-y-0.5">
          {itemsToShow.map((item, i) => (
            <p key={i} className="text-xs text-gray-700">
              {item.nombre} <span className="text-gray-400">x{item.cantidad}</span>
            </p>
          ))}
          {p.items.length > 3 && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="text-xs font-medium text-blue-500 hover:text-blue-700 mt-0.5"
            >
              {expanded ? '▲ Ver menos' : `+${p.items.length - 3} más`}
            </button>
          )}
        </div>
      </div>

      {/* Info entrega */}
      {(p.nombre || p.telefono || p.direccion || p.ciudad) && (
        <div className="px-4 pb-2 flex flex-wrap gap-x-3 gap-y-0.5">
          {p.nombre    && <span className="text-xs text-gray-600 font-medium">{p.nombre}</span>}
          {p.telefono  && <span className="text-xs text-gray-500">{p.telefono}</span>}
          {p.ciudad    && <span className="text-xs text-gray-500">{p.ciudad}</span>}
          {p.direccion && <span className="text-xs text-gray-400 w-full truncate">{p.direccion}</span>}
          {p.notas     && <span className="text-xs text-gray-400 italic w-full truncate">Nota: {p.notas}</span>}
        </div>
      )}

      {/* Total + acciones */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50">
        <span className="font-bold text-gray-800">{fmt(p.total)}</span>
        <AccionButtons p={p} isBusy={isBusy} onUpdateEstado={onUpdateEstado} compact />
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function PedidosView({ pedidos, loading, onUpdateEstado, updatingId }: PedidosViewProps) {
  const [filterMetodo, setFilterMetodo] = useState<'todos' | PedidoMetodo>('todos');
  const [filterEstado, setFilterEstado] = useState<'todos' | PedidoEstado>('todos');
  const [rangoFecha, setRangoFecha] = useState<RangoFecha>('todo');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleExpanded = (id: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const visible = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const monthStr = now.toISOString().slice(0, 7);

    return pedidos.filter(p => {
      if (filterMetodo !== 'todos' && p.metodoPago !== filterMetodo) return false;
      if (filterEstado !== 'todos' && p.estado !== filterEstado) return false;
      if (rangoFecha === 'hoy' && p.createdAt.slice(0, 10) !== todayStr) return false;
      if (rangoFecha === 'semana' && new Date(p.createdAt) < startOfWeek) return false;
      if (rangoFecha === 'mes' && p.createdAt.slice(0, 7) !== monthStr) return false;
      return true;
    });
  }, [pedidos, filterMetodo, filterEstado, rangoFecha]);

  const kpis = useMemo(() => {
    const totalPeriodo = visible.reduce((s, p) => s + p.total, 0);
    const ingresosEntregados = visible.filter(p => p.estado === 'entregado').reduce((s, p) => s + p.total, 0);
    const sinEntregar = visible.filter(p => p.estado === 'sin_entregar').length;
    return { totalPeriodo, ingresosEntregados, sinEntregar };
  }, [visible]);

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
          {(['todo', 'hoy', 'semana', 'mes'] as RangoFecha[]).map(r => (
            <button
              key={r}
              onClick={() => setRangoFecha(r)}
              className={`px-3 py-1.5 transition-colors ${
                rangoFecha === r ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {r === 'todo' ? 'Todo' : r === 'hoy' ? 'Hoy' : r === 'semana' ? 'Semana' : 'Mes'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-xs font-medium text-gray-500">Método:</label>
          <select
            value={filterMetodo}
            onChange={e => setFilterMetodo(e.target.value as typeof filterMetodo)}
            className="text-sm border rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="wompi">Wompi</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-xs font-medium text-gray-500">Estado:</label>
          <select
            value={filterEstado}
            onChange={e => setFilterEstado(e.target.value as typeof filterEstado)}
            className="text-sm border rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos</option>
            <option value="sin_entregar">Sin entregar</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div className="ml-auto flex gap-2">
          <Link
            href="/api/pedidos/export"
            prefetch={false}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            CSV
          </Link>
          <Link
            href="/api/pedidos/export/excel"
            prefetch={false}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-green-600 text-green-600 hover:bg-green-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Excel
          </Link>
        </div>
      </div>

      {/* KPIs */}
      {!loading && visible.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
            <p className="text-xs font-medium text-gray-400 mb-0.5">Total del período</p>
            <p className="text-base font-bold text-gray-800 truncate">{fmt(kpis.totalPeriodo)}</p>
            <p className="text-xs text-gray-400">{visible.length} pedido{visible.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="bg-white rounded-xl border border-green-100 shadow-sm px-4 py-3">
            <p className="text-xs font-medium text-gray-400 mb-0.5">Entregados</p>
            <p className="text-base font-bold text-green-700 truncate">{fmt(kpis.ingresosEntregados)}</p>
            <p className="text-xs text-gray-400">{visible.filter(p => p.estado === 'entregado').length} pedido{visible.filter(p => p.estado === 'entregado').length !== 1 ? 's' : ''}</p>
          </div>
          <div className={`rounded-xl border shadow-sm px-4 py-3 ${kpis.sinEntregar > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-100'}`}>
            <p className="text-xs font-medium text-gray-400 mb-0.5">Sin entregar</p>
            <p className={`text-base font-bold ${kpis.sinEntregar > 0 ? 'text-yellow-700' : 'text-gray-800'}`}>{kpis.sinEntregar}</p>
            <p className="text-xs text-gray-400">{kpis.sinEntregar > 0 ? 'Requieren atención' : 'Todo al día'}</p>
          </div>
        </div>
      )}

      {/* Contenido */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 text-center text-sm text-gray-400">
          Cargando pedidos...
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-16 text-center text-sm text-gray-400">
          {pedidos.length === 0 ? 'Aún no hay pedidos registrados.' : 'Sin resultados con los filtros aplicados.'}
        </div>
      ) : (
        <>
          {/* ── Vista móvil: cards ── */}
          <div className="lg:hidden space-y-3">
            {visible.map(p => (
              <PedidoCard
                key={p.id}
                p={p}
                isBusy={updatingId === p.id}
                onUpdateEstado={onUpdateEstado}
              />
            ))}
          </div>

          {/* ── Vista escritorio: tabla ── */}
          <div className="hidden lg:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Productos</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Entrega</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Método</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {visible.map(p => {
                    const isBusy = updatingId === p.id;
                    const isExpanded = expandedRows.has(p.id);
                    const isSinEntregar = p.estado === 'sin_entregar';
                    const itemsToShow = isExpanded ? p.items : p.items.slice(0, 2);
                    return (
                      <tr
                        key={p.id}
                        className={`transition-colors ${
                          isSinEntregar
                            ? 'bg-yellow-50 border-l-4 border-yellow-400 hover:bg-yellow-100'
                            : 'border-l-4 border-transparent hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">#{p.id}</td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {new Date(p.createdAt).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <div className="space-y-0.5">
                            {itemsToShow.map((item, i) => (
                              <p key={i} className="text-xs text-gray-700 truncate">
                                {item.nombre} <span className="text-gray-400">x{item.cantidad}</span>
                              </p>
                            ))}
                            {p.items.length > 2 && (
                              <button
                                onClick={() => toggleExpanded(p.id)}
                                className="text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors mt-0.5"
                              >
                                {isExpanded ? '▲ Ver menos' : `+${p.items.length - 2} más`}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 max-w-[160px]">
                          {(p.telefono || p.direccion) ? (
                            <div className="space-y-0.5">
                              {p.telefono && <p className="text-xs text-gray-700 font-medium">{p.telefono}</p>}
                              {p.direccion && <p className="text-xs text-gray-500 truncate" title={p.direccion}>{p.direccion}</p>}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-800 whitespace-nowrap">{fmt(p.total)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${metodoBadge[p.metodoPago]}`}>
                            {p.metodoPago === 'wompi' ? 'Wompi' : 'WhatsApp'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${estadoBadge[p.estado]}`}>
                            {estadoLabel[p.estado]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <AccionButtons p={p} isBusy={isBusy} onUpdateEstado={onUpdateEstado} compact />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
