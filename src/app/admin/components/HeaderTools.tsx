'use client';

interface HeaderToolsProps {
  filter: string;
  onFilter: (v: string) => void;
  onlyDirty: boolean;
  onOnlyDirty: (v: boolean) => void;
  onSave: () => void;
  saving: boolean;
  hasDirty: boolean;
  onAddProduct: () => void;
  hasExtras: boolean;
}

export default function HeaderTools({ filter, onFilter, onlyDirty, onOnlyDirty, onSave, saving, hasDirty, onAddProduct, hasExtras }: HeaderToolsProps) {
  return (
    <div className="bg-white shadow rounded-xl p-6 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
      <div className="flex items-center gap-4 w-full lg:w-auto">
        <input value={filter} onChange={e => onFilter(e.target.value)} placeholder="Filtrar..." className="border px-4 py-2 rounded w-full lg:w-64" />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={onlyDirty} onChange={e => onOnlyDirty(e.target.checked)} /> Solo modificados
        </label>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onAddProduct}
          className="px-4 py-2 rounded font-semibold text-sm bg-green-600 text-white hover:bg-green-700"
        >
          Agregar producto
        </button>
        {hasExtras && (
          <span className="text-xs font-semibold text-gray-500 hidden lg:inline">
            Puedes eliminar los productos agregados manualmente.
          </span>
        )}
        <button onClick={onSave} disabled={!hasDirty || saving} className={`px-4 py-2 rounded font-semibold text-sm ${!hasDirty ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : saving ? 'bg-blue-300 text-white animate-pulse' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
      </div>
    </div>
  );
}