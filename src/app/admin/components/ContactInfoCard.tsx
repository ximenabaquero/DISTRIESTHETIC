'use client';

interface ContactInfoCardProps {
  contacto: { telefono: string; whatsapp: string };
  dirty: boolean;
  saving: boolean;
  onFieldChange: (field: 'telefono' | 'whatsapp', value: string) => void;
  onSave: () => void;
}

export default function ContactInfoCard({ contacto, dirty, saving, onFieldChange, onSave }: ContactInfoCardProps) {
  return (
    <section className="bg-white shadow rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Información de contacto público
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col space-y-2">
          <span className="text-sm font-medium text-gray-700">Teléfono</span>
          <input
            value={contacto.telefono}
            onChange={e => onFieldChange('telefono', e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="304 683 1493"
          />
        </label>
        <label className="flex flex-col space-y-2">
          <span className="text-sm font-medium text-gray-700">WhatsApp (con indicativo)</span>
          <input
            value={contacto.whatsapp}
            onChange={e => onFieldChange('whatsapp', e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="573046831493"
          />
        </label>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || saving}
          className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </section>
  );
}