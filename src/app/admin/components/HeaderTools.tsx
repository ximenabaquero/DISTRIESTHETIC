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

export default function HeaderTools({
  filter, onFilter, onlyDirty, onOnlyDirty,
  onSave, saving, hasDirty, onAddProduct, hasExtras,
}: HeaderToolsProps) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-4 mb-6 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">

      {/* Left — filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            value={filter}
            onChange={e => onFilter(e.target.value)}
            placeholder="Filtrar productos..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Checkbox toggle */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none group">
          <div className="relative flex-shrink-0">
            <input
              type="checkbox"
              checked={onlyDirty}
              onChange={e => onOnlyDirty(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 rounded-full bg-gray-200 peer-checked:bg-blue-500 transition-colors duration-200" />
            <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
          </div>
          <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
            Solo modificados
          </span>
        </label>
      </div>

      {/* Right — actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

        {/* Hint */}
        {hasExtras && (
          <p className="hidden lg:flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
            </svg>
            Puedes eliminar los productos agregados manualmente.
          </p>
        )}

        {/* Add product */}
        <button
          onClick={onAddProduct}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all duration-150 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Agregar producto
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          disabled={!hasDirty || saving}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 shadow-sm active:scale-95 ${
            !hasDirty
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
              : saving
              ? 'bg-blue-400 text-white cursor-wait'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {saving ? (
            <>
              <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Guardando...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
              Guardar cambios
            </>
          )}
        </button>
      </div>
    </div>
  );
}