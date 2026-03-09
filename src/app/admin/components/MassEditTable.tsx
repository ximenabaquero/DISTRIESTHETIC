'use client';

import Image from 'next/image';

import { Producto } from '@/data/productos';

interface ProductoEditable extends Producto {
  dirty?: boolean;
  isExtra?: boolean;
}

interface MassEditTableProps {
  productos: ProductoEditable[];
  onChange: (id: number, field: 'precio' | 'stock', value: number | null) => void;
  onUploadImage: (id: number, file: File) => void;
  onRemoveImage: (id: number) => void;
  uploadingImageId: number | null;
  removingImageId: number | null;
  onDelete: (id: number) => void;
  deletingId: number | null;
  onEdit: (producto: ProductoEditable) => void;
  updating: boolean;
  editingId: number | null;
}

export default function MassEditTable({
  productos,
  onChange,
  onUploadImage,
  onRemoveImage,
  uploadingImageId,
  removingImageId,
  onDelete,
  deletingId,
  onEdit,
  updating,
  editingId,
}: MassEditTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-[#1e2d4a] text-white">
          <tr>
            <th className="px-3 py-2 text-left">ID</th>
            <th className="px-3 py-2 text-left">Nombre</th>
            <th className="px-3 py-2">Categoría</th>
            <th className="px-3 py-2">Imagen</th>
            <th className="px-3 py-2">Precio</th>
            <th className="px-3 py-2">Stock</th>
            <th className="px-3 py-2">Estado</th>
            <th className="px-3 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p, rowIdx) => (
            <tr key={p.id} className={p.dirty ? 'bg-orange-50 border-l-4 border-orange-400' : `border-l-4 border-transparent ${rowIdx % 2 === 1 ? 'bg-[#f8f9fc]' : 'bg-white'}`}>
              <td className="px-3 py-2 font-mono text-xs text-slate-800 font-semibold">{p.id}</td>
              <td className="px-3 py-2 whitespace-pre-wrap max-w-xs text-slate-900 font-medium">{p.nombre}</td>
              <td className="px-3 py-2 text-center text-slate-800">{p.categoria}</td>
              <td className="px-3 py-2 text-center align-middle">
                <div className="flex flex-col items-center gap-2">
                  {p.imagenUrl ? (
                    <Image
                      src={p.imagenUrl}
                      alt={p.nombre}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded object-cover border"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded border flex items-center justify-center text-xs text-gray-400 bg-gray-50">
                      Sin imagen
                    </div>
                  )}
                  <div className="flex gap-1.5 items-center justify-center mt-1">
                    {/* Cambiar imagen */}
                    <label
                      title="Cambiar imagen"
                      className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                        (uploadingImageId === p.id || removingImageId === p.id)
                          ? 'opacity-40 pointer-events-none bg-gray-50 border-gray-200 text-gray-400'
                          : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300'
                      }`}
                    >
                      {uploadingImageId === p.id ? (
                        <>
                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                          </svg>
                          Subiendo
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                          </svg>
                          Cambiar
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) onUploadImage(p.id, file); e.target.value = ''; }} disabled={uploadingImageId === p.id || removingImageId === p.id}/>
                    </label>
                    {/* Quitar imagen */}
                    {p.imagenUrl && (
                      <button
                        type="button"
                        title="Quitar imagen"
                        onClick={() => onRemoveImage(p.id)}
                        disabled={removingImageId === p.id || uploadingImageId === p.id}
                        className="inline-flex items-center justify-center w-6 h-6 rounded-md border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-40"
                      >
                        {removingImageId === p.id ? (
                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 text-center">
                <input
                  type="number"
                  className="w-28 border rounded px-2 py-1 text-right text-slate-900 font-semibold"
                  value={p.precio ?? ''}
                  onChange={e => onChange(p.id, 'precio', e.target.value === '' ? null : Number(e.target.value))}
                />
              </td>
              <td className="px-3 py-2 text-center">
                <input
                  type="number"
                  className={`w-20 border rounded px-2 py-1 text-right font-semibold transition-colors ${
                    p.stock === 0
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : p.stock > 0 && p.stock < 10
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'border-gray-200 text-slate-900'
                  }`}
                  min={0}
                  value={p.stock}
                  onChange={e => onChange(p.id, 'stock', Number(e.target.value))}
                />
              </td>
              <td className="px-3 py-2 text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    p.disponible ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                  }`}>
                    {p.disponible ? 'Disponible' : 'No disponible'}
                  </span>
                  {p.dirty && (
                    <span className="text-xs font-medium text-blue-500">● Modificado</span>
                  )}
                </div>
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center justify-center gap-1">
                  {/* Editar */}
                  <button
                    type="button"
                    title="Editar producto"
                    onClick={() => onEdit(p)}
                    disabled={updating || deletingId === p.id}
                    className="flex items-center justify-center w-7 h-7 rounded text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-40"
                  >
                    {updating && editingId === p.id ? (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                      </svg>
                    )}
                  </button>
                  {/* Eliminar (solo productos extra) */}
                  {p.isExtra ? (
                    <button
                      type="button"
                      title="Eliminar producto"
                      onClick={() => onDelete(p.id)}
                      disabled={deletingId === p.id || updating}
                      className="flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                    >
                      {deletingId === p.id ? (
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      )}
                    </button>
                  ) : (
                    <div className="w-7 h-7" />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {productos.length === 0 && (
        <div className="text-center text-gray-500 py-10">Sin productos</div>
      )}
    </div>
  );
}