'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Producto } from '@/data/productos';

interface ProductoEditable extends Producto {
  dirty?: boolean;
  isExtra?: boolean;
}

interface ProductEditPayload {
  nombre: string;
  descripcion: string;
  etiqueta: string;
  disponible: boolean;
}

interface EditProductModalProps {
  open: boolean;
  product: ProductoEditable | null;
  onClose: () => void;
  onSave: (id: number, data: ProductEditPayload) => void;
  loading: boolean;
}

export default function EditProductModal({ open, product, onClose, onSave, loading }: EditProductModalProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [etiqueta, setEtiqueta] = useState('');
  const [disponible, setDisponible] = useState(true);

  useEffect(() => {
    if (open && product) {
      setNombre(product.nombre ?? '');
      setDescripcion(product.descripcion ?? '');
      setEtiqueta(product.etiqueta ?? '');
      setDisponible(product.disponible);
    }
  }, [open, product]);

  if (!open || !product) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(product.id, {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      etiqueta: etiqueta.trim(),
      disponible,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Editar producto</h3>
            <p className="text-xs text-gray-500">ID #{product.id} • {product.isExtra ? 'Producto agregado manualmente' : 'Producto del catálogo base'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Nombre*</span>
              <input
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
                className="rounded-md border px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Descripción*</span>
              <textarea
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                required
                className="rounded-md border px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Etiqueta*</span>
              <input
                value={etiqueta}
                onChange={e => setEtiqueta(e.target.value.toUpperCase())}
                required
                className="rounded-md border px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Disponible</span>
              <select
                value={disponible ? 'true' : 'false'}
                onChange={e => setDisponible(e.target.value === 'true')}
                className="rounded-md border px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </label>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Categoría</span>
              <span className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 bg-gray-50">
                {product.categoria}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`rounded-md px-4 py-2 text-sm font-semibold text-white ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}