// app/admin/components/ProductRow.tsx
import { useState } from 'react';
import Image from 'next/image';

import { Producto } from '@/data/productos';

interface ProductoEditable extends Producto {
  dirty?: boolean;
  isExtra?: boolean;
}

interface ProductRowProps {
  producto: ProductoEditable;
  onChange: (id: number, field: 'precio' | 'stock', value: number | null) => void;
  onUploadImage: (id: number, file: File) => void;
  onRemoveImage: (id: number) => void;
  onEdit: (producto: ProductoEditable) => void;
  onDelete: (id: number) => void;
  uploadingImageId: number | null;
  removingImageId: number | null;
  deletingId: number | null;
  updating: boolean;
  editingId: number | null;
}

export default function ProductRow({
  producto,
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
}: ProductRowProps) {
  const [localImage, setLocalImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        setLocalImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Subir al servidor
      onUploadImage(producto.id, file);
    }
    e.target.value = ''; // Reset input
  };

  const isUploading = uploadingImageId === producto.id;
  const isRemoving = removingImageId === producto.id;
  const isDeleting = deletingId === producto.id;
  const isEditing = editingId === producto.id;
  const isBusy = isUploading || isRemoving || isDeleting;

  return (
    <tr key={producto.id} className={producto.dirty ? 'bg-blue-50' : ''}>
      {/* ID */}
      <td className="px-3 py-2 font-mono text-xs text-slate-800 font-semibold">
        {producto.id}
      </td>

      {/* Nombre */}
      <td className="px-3 py-2 whitespace-pre-wrap max-w-xs text-slate-900 font-medium">
        {producto.nombre}
      </td>

      {/* Categoría */}
      <td className="px-3 py-2 text-center text-slate-800">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {producto.categoria}
        </span>
      </td>

      {/* Imagen */}
      <td className="px-3 py-2 text-center align-middle">
        <div className="flex flex-col items-center gap-2">
          <div className="relative h-16 w-16">
            {localImage || producto.imagenUrl ? (
              <Image
                src={localImage || producto.imagenUrl!}
                alt={producto.nombre}
                width={64}
                height={64}
                className="h-16 w-16 rounded object-cover border"
                onError={() => setLocalImage(null)}
              />
            ) : (
              <div className="h-16 w-16 rounded border flex items-center justify-center text-xs text-gray-400 bg-gray-50">
                Sin imagen
              </div>
            )}
            {(isUploading || isRemoving) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {/* Botón Cambiar Imagen */}
            <label className={`cursor-pointer text-xs font-semibold ${
              isBusy 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-blue-600 hover:text-blue-700'
            }`}>
              <span>{isUploading ? 'Subiendo...' : 'Cambiar'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isBusy}
              />
            </label>

            {/* Botón Quitar Imagen */}
            {producto.imagenUrl && (
              <button
                type="button"
                onClick={() => onRemoveImage(producto.id)}
                disabled={isBusy}
                className={`text-xs font-semibold ${
                  isBusy 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-red-600 hover:text-red-700'
                }`}
              >
                {isRemoving ? 'Eliminando...' : 'Quitar'}
              </button>
            )}
          </div>
        </div>
      </td>

      {/* Precio */}
      <td className="px-3 py-2 text-center">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            $
          </div>
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-28 border rounded pl-7 pr-2 py-1 text-right text-slate-900 font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={producto.precio ?? ''}
            onChange={e => onChange(producto.id, 'precio', e.target.value === '' ? null : Number(e.target.value))}
            disabled={isBusy}
            title="Precio en COP"
          />
        </div>
      </td>

      {/* Stock */}
      <td className="px-3 py-2 text-center">
        <input
          type="number"
          min="0"
          className="w-20 border rounded px-2 py-1 text-right text-slate-900 font-semibold focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={producto.stock}
          onChange={e => onChange(producto.id, 'stock', Number(e.target.value))}
          disabled={isBusy}
        />
      </td>

      {/* Estado */}
      <td className="px-3 py-2 text-center">
        {producto.dirty ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            MODIFICADO
          </span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>

      {/* Acciones */}
      <td className="px-3 py-2">
        <div className="flex items-center justify-center gap-2">
          {/* Botón Editar */}
          <button
            type="button"
            onClick={() => onEdit(producto)}
            disabled={isBusy || (updating && isEditing)}
            className={`text-xs font-semibold flex items-center gap-1 ${
              isBusy || (updating && isEditing)
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            {updating && isEditing ? (
              <>
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Actualizando...
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </>
            )}
          </button>

          {/* Separador */}
          <span className="text-gray-300">|</span>

          {/* Botón Eliminar (solo para productos extras) */}
          {producto.isExtra ? (
            <button
              type="button"
              onClick={() => onDelete(producto.id)}
              disabled={isBusy || isDeleting}
              className={`text-xs font-semibold flex items-center gap-1 ${
                isBusy || isDeleting
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-red-600 hover:text-red-700'
              }`}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Eliminando...
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </>
              )}
            </button>
          ) : (
            <span className="text-xs text-gray-400" title="No se pueden eliminar productos base">
              —
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}