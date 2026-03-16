'use client';

import Image from 'next/image';
import { useState } from 'react';

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

function Spinner() {
  return (
    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

// ── Tarjeta móvil ─────────────────────────────────────────────────────────────
function ProductCard({
  p,
  onChange,
  onUploadImage,
  onRemoveImage,
  onEdit,
  onDelete,
  uploadingImageId,
  removingImageId,
  deletingId,
  updating,
  editingId,
}: {
  p: ProductoEditable;
  onChange: MassEditTableProps['onChange'];
  onUploadImage: MassEditTableProps['onUploadImage'];
  onRemoveImage: MassEditTableProps['onRemoveImage'];
  onEdit: MassEditTableProps['onEdit'];
  onDelete: MassEditTableProps['onDelete'];
  uploadingImageId: number | null;
  removingImageId: number | null;
  deletingId: number | null;
  updating: boolean;
  editingId: number | null;
}) {
  const [localImage, setLocalImage] = useState<string | null>(null);
  const isUploading = uploadingImageId === p.id;
  const isRemoving = removingImageId === p.id;
  const isDeleting = deletingId === p.id;
  const isEditing = editingId === p.id;
  const isBusy = isUploading || isRemoving || isDeleting;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLocalImage(ev.target?.result as string);
    reader.readAsDataURL(file);
    onUploadImage(p.id, file);
    e.target.value = '';
  };

  const imgSrc = localImage || p.imagenUrl;

  return (
    <div className={`rounded-xl border bg-white shadow-sm overflow-hidden ${p.dirty ? 'border-orange-400 border-l-4' : 'border-gray-200'}`}>
      {/* Cabecera: imagen + info */}
      <div className="flex gap-3 p-3">
        {/* Imagen */}
        <div className="relative flex-shrink-0">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={p.nombre}
              width={72}
              height={72}
              className="w-18 h-18 rounded-lg object-cover border border-gray-200"
              style={{ width: 72, height: 72 }}
              onError={() => setLocalImage(null)}
            />
          ) : (
            <div className="w-[72px] h-[72px] rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-[10px] text-gray-400 text-center leading-tight px-1">
              Sin imagen
            </div>
          )}
          {(isUploading || isRemoving) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <Spinner />
            </div>
          )}
        </div>

        {/* Nombre + categoría + estado */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-snug">{p.nombre}</p>
          <p className="text-xs text-gray-400 capitalize mt-0.5">{p.categoria}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
              p.disponible ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}>
              {p.disponible ? 'Disponible' : 'No disponible'}
            </span>
            {p.dirty && (
              <span className="text-xs font-medium text-blue-500">● Modificado</span>
            )}
          </div>
        </div>

        {/* ID */}
        <span className="text-[10px] font-mono text-gray-300 flex-shrink-0">#{p.id}</span>
      </div>

      {/* Precio + Stock */}
      <div className="flex gap-3 px-3 pb-3">
        <div className="flex-1">
          <label className="text-xs text-gray-400 font-medium block mb-1">Precio ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full border rounded-lg px-3 py-2 text-sm text-right text-slate-900 font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={p.precio ?? ''}
            onChange={e => onChange(p.id, 'precio', e.target.value === '' ? null : Number(e.target.value))}
            disabled={isBusy}
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-400 font-medium block mb-1">Stock</label>
          <input
            type="number"
            min="0"
            className={`w-full border rounded-lg px-3 py-2 text-sm text-right font-semibold transition-colors focus:ring-1 ${
              p.stock === 0
                ? 'bg-red-50 border-red-200 text-red-700 focus:border-red-400 focus:ring-red-200'
                : p.stock > 0 && p.stock < 10
                ? 'bg-amber-50 border-amber-200 text-amber-700 focus:border-amber-400 focus:ring-amber-200'
                : 'border-gray-200 text-slate-900 focus:border-blue-500 focus:ring-blue-200'
            }`}
            value={p.stock}
            onChange={e => onChange(p.id, 'stock', Number(e.target.value))}
            disabled={isBusy}
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-2 px-3 pb-3">
        {/* Cambiar imagen */}
        <label className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
          isBusy
            ? 'opacity-40 pointer-events-none bg-gray-50 border-gray-200 text-gray-400'
            : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
        }`}>
          {isUploading ? <><Spinner />Subiendo...</> : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {p.imagenUrl ? 'Cambiar' : 'Agregar foto'}
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={isBusy} />
        </label>

        {/* Quitar imagen */}
        {p.imagenUrl && (
          <button
            type="button"
            onClick={() => onRemoveImage(p.id)}
            disabled={isBusy}
            className="flex items-center justify-center w-10 h-9 rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-40"
          >
            {isRemoving ? <Spinner /> : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        )}

        {/* Editar */}
        <button
          type="button"
          onClick={() => onEdit(p)}
          disabled={isBusy || (updating && isEditing)}
          className="flex items-center justify-center w-10 h-9 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors disabled:opacity-40"
        >
          {updating && isEditing ? <Spinner /> : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          )}
        </button>

        {/* Eliminar (solo extras) */}
        {p.isExtra && (
          <button
            type="button"
            onClick={() => onDelete(p.id)}
            disabled={isBusy}
            className="flex items-center justify-center w-10 h-9 rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-40"
          >
            {isDeleting ? <Spinner /> : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
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
  if (productos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow text-center text-gray-500 py-10">
        Sin productos
      </div>
    );
  }

  return (
    <>
      {/* ── Vista cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {productos.map(p => (
          <ProductCard
            key={p.id}
            p={p}
            onChange={onChange}
            onUploadImage={onUploadImage}
            onRemoveImage={onRemoveImage}
            onEdit={onEdit}
            onDelete={onDelete}
            uploadingImageId={uploadingImageId}
            removingImageId={removingImageId}
            deletingId={deletingId}
            updating={updating}
            editingId={editingId}
          />
        ))}
      </div>

      {/* ── Vista tabla (oculta, mantenida como respaldo) ────────────────── */}
      <div className="hidden overflow-x-auto bg-white rounded-xl shadow">
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
                      <Image src={p.imagenUrl} alt={p.nombre} width={64} height={64} className="h-16 w-16 rounded object-cover border" />
                    ) : (
                      <div className="h-16 w-16 rounded border flex items-center justify-center text-xs text-gray-400 bg-gray-50">Sin imagen</div>
                    )}
                    <div className="flex gap-1.5 items-center justify-center mt-1">
                      <label title="Cambiar imagen" className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                        (uploadingImageId === p.id || removingImageId === p.id)
                          ? 'opacity-40 pointer-events-none bg-gray-50 border-gray-200 text-gray-400'
                          : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300'
                      }`}>
                        {uploadingImageId === p.id ? <><Spinner />Subiendo</> : (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Cambiar
                          </>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) onUploadImage(p.id, file); e.target.value = ''; }} disabled={uploadingImageId === p.id || removingImageId === p.id} />
                      </label>
                      {p.imagenUrl && (
                        <button type="button" title="Quitar imagen" onClick={() => onRemoveImage(p.id)} disabled={removingImageId === p.id || uploadingImageId === p.id} className="inline-flex items-center justify-center w-6 h-6 rounded-md border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-40">
                          {removingImageId === p.id ? <Spinner /> : (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-center">
                  <input type="number" className="w-28 border rounded px-2 py-1 text-right text-slate-900 font-semibold" value={p.precio ?? ''} onChange={e => onChange(p.id, 'precio', e.target.value === '' ? null : Number(e.target.value))} />
                </td>
                <td className="px-3 py-2 text-center">
                  <input type="number" className={`w-20 border rounded px-2 py-1 text-right font-semibold transition-colors ${p.stock === 0 ? 'bg-red-50 border-red-200 text-red-700' : p.stock > 0 && p.stock < 10 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'border-gray-200 text-slate-900'}`} min={0} value={p.stock} onChange={e => onChange(p.id, 'stock', Number(e.target.value))} />
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${p.disponible ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {p.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                    {p.dirty && <span className="text-xs font-medium text-blue-500">● Modificado</span>}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-1">
                    <button type="button" title="Editar producto" onClick={() => onEdit(p)} disabled={updating || deletingId === p.id} className="flex items-center justify-center w-7 h-7 rounded text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-40">
                      {updating && editingId === p.id ? <Spinner /> : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      )}
                    </button>
                    {p.isExtra ? (
                      <button type="button" title="Eliminar producto" onClick={() => onDelete(p.id)} disabled={deletingId === p.id || updating} className="flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40">
                        {deletingId === p.id ? <Spinner /> : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
      </div>
    </>
  );
}
