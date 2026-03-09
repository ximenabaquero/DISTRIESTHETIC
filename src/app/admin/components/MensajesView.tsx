'use client';

import { useState, useMemo } from 'react';

export interface MensajeContacto {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  mensaje: string;
  leido: boolean;
  created_at: string;
}

interface MensajesViewProps {
  mensajes: MensajeContacto[];
  loading: boolean;
  onMarcarLeido: (id: number, leido: boolean) => void;
  onEliminar: (id: number) => void;
  deletingId: number | null;
  updatingId: number | null;
}

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
};

export default function MensajesView({ mensajes, loading, onMarcarLeido, onEliminar, deletingId, updatingId }: MensajesViewProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filtro, setFiltro] = useState<'todos' | 'leidos' | 'no_leidos'>('todos');

  const visible = useMemo(() => {
    if (filtro === 'leidos') return mensajes.filter(m => m.leido);
    if (filtro === 'no_leidos') return mensajes.filter(m => !m.leido);
    return mensajes;
  }, [mensajes, filtro]);

  const noLeidos = mensajes.filter(m => !m.leido).length;

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Mensajes de contacto
            {noLeidos > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                {noLeidos} nuevos
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-400">{mensajes.length} mensaje{mensajes.length !== 1 ? 's' : ''} en total</p>
        </div>

        {/* Filtro */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium self-start sm:self-auto">
          {(['todos', 'no_leidos', 'leidos'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 transition-colors ${filtro === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              {f === 'todos' ? 'Todos' : f === 'no_leidos' ? 'No leídos' : 'Leídos'}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-sm font-medium">No hay mensajes {filtro !== 'todos' ? 'en esta categoría' : 'aún'}</p>
        </div>
      )}

      <div className="space-y-2">
        {visible.map(m => {
          const isExpanded = expanded === m.id;
          const isDeleting = deletingId === m.id;
          const isUpdating = updatingId === m.id;

          return (
            <div
              key={m.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                m.leido
                  ? 'bg-white border-gray-100'
                  : 'bg-blue-50 border-blue-100'
              }`}
            >
              {/* Row header */}
              <button
                className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-black/[0.02] transition-colors"
                onClick={() => {
                  setExpanded(isExpanded ? null : m.id);
                  if (!m.leido && !isExpanded) onMarcarLeido(m.id, true);
                }}
              >
                {/* Dot unread */}
                <span className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${m.leido ? 'bg-gray-200' : 'bg-blue-500'}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <span className={`text-sm font-semibold ${m.leido ? 'text-gray-700' : 'text-gray-900'}`}>
                      {m.nombre}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{fmtDate(m.created_at)}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{m.email}{m.telefono ? ` · ${m.telefono}` : ''}</p>
                  {!isExpanded && (
                    <p className="text-sm text-gray-600 truncate mt-0.5">{m.mensaje}</p>
                  )}
                </div>

                <svg
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded body */}
              {isExpanded && (
                <div className="px-9 pb-4 space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {m.mensaje}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`mailto:${m.email}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Responder por email
                    </a>
                    {m.telefono && (
                      <a
                        href={`https://wa.me/${m.telefono.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        WhatsApp
                      </a>
                    )}
                    <button
                      onClick={() => onMarcarLeido(m.id, !m.leido)}
                      disabled={isUpdating}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? 'Actualizando...' : m.leido ? 'Marcar no leído' : 'Marcar leído'}
                    </button>
                    <button
                      onClick={() => onEliminar(m.id)}
                      disabled={isDeleting}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors disabled:opacity-50 ml-auto"
                    >
                      {isDeleting ? (
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      )}
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
