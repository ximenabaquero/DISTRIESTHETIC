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
        <thead className="bg-blue-600 text-white">
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
          {productos.map(p => (
            <tr key={p.id} className={p.dirty ? 'bg-blue-50' : ''}>
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
                  <div className="flex gap-2">
                    <label className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700">
                      <span>{uploadingImageId === p.id ? 'Subiendo...' : 'Cambiar'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onUploadImage(p.id, file);
                          }
                          e.target.value = '';
                        }}
                        disabled={uploadingImageId === p.id || removingImageId === p.id}
                      />
                    </label>
                    {p.imagenUrl && (
                      <button
                        type="button"
                        onClick={() => onRemoveImage(p.id)}
                        disabled={removingImageId === p.id || uploadingImageId === p.id}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        {removingImageId === p.id ? 'Eliminando...' : 'Quitar'}
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
                  className="w-20 border rounded px-2 py-1 text-right text-slate-900 font-semibold"
                  min={0}
                  value={p.stock}
                  onChange={e => onChange(p.id, 'stock', Number(e.target.value))}
                />
              </td>
              <td className="px-3 py-2 text-center">
                {p.dirty ? <span className="text-xs font-semibold text-blue-600">MODIFICADO</span> : <span className="text-xs text-gray-400">—</span>}
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(p)}
                    disabled={updating || deletingId === p.id}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-60"
                  >
                    {updating && editingId === p.id ? 'Actualizando...' : 'Editar'}
                  </button>
                  {p.isExtra ? (
                    <button
                      type="button"
                      onClick={() => onDelete(p.id)}
                      disabled={deletingId === p.id || updating}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-60"
                    >
                      {deletingId === p.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
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