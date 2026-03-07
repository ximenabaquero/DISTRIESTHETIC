'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Producto } from '@/data/productos';


const categoriaOptions = [
  { value: 'medicamentos', label: 'Medicamentos' },
  { value: 'soluciones', label: 'Soluciones' },
  { value: 'insumos', label: 'Insumos' },
  { value: 'quimicos', label: 'Químicos' },
  { value: 'ropa', label: 'Ropa' },
  { value: 'proteccion', label: 'Protección' },
];

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: Omit<Producto, 'id'>) => void;
  loading: boolean;
}

export default function CreateProductModal({ open, onClose, onCreate, loading }: CreateProductModalProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('medicamentos');
  const [etiqueta, setEtiqueta] = useState('');
  const [disponible, setDisponible] = useState(true);
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('0');

  useEffect(() => {
    if (open) {
      setNombre('');
      setDescripcion('');
      setCategoria('medicamentos');
      setEtiqueta('');
      setDisponible(true);
      setPrecio('');
      setStock('0');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: Omit<Producto, 'id'> = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      categoria,
      etiqueta: etiqueta.trim().toUpperCase(),
      disponible,
      precio: precio === '' ? null : Number(precio),
      stock: stock === '' ? 0 : Number(stock),
      imagenUrl: null,
    };
    onCreate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Agregar nuevo producto</h3>
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
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Nombre*</span>
              <input
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
                className="rounded-md border px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Etiqueta*</span>
              <input
                value={etiqueta}
                onChange={e => setEtiqueta(e.target.value)}
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
              <span className="text-sm font-medium text-gray-700">Categoría*</span>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                className="rounded-md border px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {categoriaOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
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
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Precio (COP)</span>
              <input
                type="number"
                min={0}
                value={precio}
                onChange={e => setPrecio(e.target.value)}
                className="rounded-md border px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Stock</span>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={e => setStock(e.target.value)}
                className="rounded-md border px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
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
              {loading ? 'Creando...' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}