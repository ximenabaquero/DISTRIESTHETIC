"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type Producto } from '@/data/productos';

interface ProductoEditable extends Producto { dirty?: boolean }

export default function AdminPage() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [productos, setProductos] = useState<ProductoEditable[]>([]);
  // const [loadingData, setLoadingData] = useState(true); // se puede reintroducir si se muestra un spinner específico
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');
  const [onlyDirty, setOnlyDirty] = useState(false);
  const [uploadingImageId, setUploadingImageId] = useState<number | null>(null);
  const [removingImageId, setRemovingImageId] = useState<number | null>(null);
  const [contactInfo, setContactInfo] = useState({ telefono: '', whatsapp: '' });
  const [contactDirty, setContactDirty] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

  const rawAdminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'charliegil2704@gmail.com';
  const allowedAdminEmails = useMemo(() => (
    rawAdminEmails
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(Boolean)
  ), [rawAdminEmails]);
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sarita15';
  const loggedIn = !!sessionEmail;
  const isAdmin = loggedIn && allowedAdminEmails.includes(sessionEmail?.toLowerCase() ?? '');

  // Cargar overrides desde API existente
  useEffect(() => {
    if (!isAdmin) return;
    const fetchAll = async () => {
      try {
        const [productosRes, contactoRes] = await Promise.all([
          fetch('/api/productos'),
          fetch('/api/contacto-info'),
        ]);
        const productosJson = await productosRes.json();
        if (productosJson.ok) {
          setProductos(productosJson.productos.map((p: Producto) => ({ ...p, dirty: false })));
        }
        if (contactoRes.ok) {
          const contactoJson = await contactoRes.json();
          setContactInfo({
            telefono: contactoJson?.contact?.telefono ?? '',
            whatsapp: contactoJson?.contact?.whatsapp ?? '',
          });
          setContactDirty(false);
        }
      } catch (error) {
        console.error('Error cargando datos admin', error);
        alert('Error cargando datos del administrador');
      }
    };
    fetchAll();
  }, [isAdmin]);

  const visibleProductos = useMemo(() => {
    return productos.filter(p => {
      if (onlyDirty && !p.dirty) return false;
      if (!filter) return true;
      const f = filter.toLowerCase();
      return p.nombre.toLowerCase().includes(f) || p.descripcion.toLowerCase().includes(f) || p.categoria.toLowerCase().includes(f);
    });
  }, [productos, filter, onlyDirty]);

  const markDirtyAndUpdate = (id: number, field: 'precio' | 'stock', value: number | null) => {
    setProductos(prev => prev.map(p => p.id === id ? { ...p, [field]: value, dirty: true } : p));
  };

  const updateProductoImagenLocal = (id: number, imagenUrl: string | null) => {
    setProductos(prev => prev.map(p => p.id === id ? { ...p, imagenUrl } : p));
  };

  const uploadProductoImagen = async (id: number, file: File) => {
    setUploadingImageId(id);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`/api/productos/${id}/imagen`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (!json.ok) {
        throw new Error(json.error || 'No se pudo actualizar la imagen');
      }
      updateProductoImagenLocal(id, json.producto?.imagenUrl ?? null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado subiendo la imagen';
      alert(message);
    } finally {
      setUploadingImageId(null);
    }
  };

  const removeProductoImagen = async (id: number) => {
    setRemovingImageId(id);
    try {
      const res = await fetch(`/api/productos/${id}/imagen`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.ok) {
        throw new Error(json.error || 'No se pudo eliminar la imagen');
      }
      updateProductoImagenLocal(id, null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado eliminando la imagen';
      alert(message);
    } finally {
      setRemovingImageId(null);
    }
  };

  const hasDirty = productos.some(p => p.dirty);

  const saveAll = async () => {
    if (!hasDirty) return;
    setSaving(true);
    try {
      const payload = productos.filter(p => p.dirty).map(p => ({ id: p.id, precio: p.precio, stock: p.stock }));
      const res = await fetch('/api/productos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (json.ok) {
        const updated: ProductoEditable[] = json.productos.map((p: Producto) => ({ ...p, dirty: false }));
        setProductos(updated);
      }
    } catch (e) {
      console.error('Error guardando en lote', e);
    } finally {
      setSaving(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (allowedAdminEmails.includes(normalizedEmail) && password === adminPassword) {
      setSessionEmail(email.trim());
      alert('Login exitoso');
    } else {
      alert('Correo o contraseña incorrectos');
    }
  };

  const handleLogout = async () => {
    setSessionEmail(null);
  };

  const handleContactField = (field: 'telefono' | 'whatsapp', value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
    setContactDirty(true);
  };

  const saveContactInfo = async () => {
    if (!contactDirty) return;
    setSavingContact(true);
    try {
      const res = await fetch('/api/contacto-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactInfo),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || 'No se pudo guardar');
      setContactInfo(json.contact);
      setContactDirty(false);
      alert('Información de contacto actualizada');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Error guardando contacto');
    } finally {
      setSavingContact(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Image src="/logodistsin.png" alt="logo" width={150} height={60} />
            <span className="font-bold text-xl text-blue-600">DISTRIESTHETIC Admin</span>
          </div>
          <div className="flex gap-4 items-center text-sm">
            <Link href="/" className="text-gray-600 hover:text-blue-600">Inicio</Link>
            <Link href="/productos" className="text-gray-600 hover:text-blue-600">Productos</Link>
            {loggedIn && <button onClick={handleLogout} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Salir</button>}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10">
        {!loggedIn && (
          <LoginPanel onLogin={handleLogin} />
        )}
        {loggedIn && !isAdmin && (
          <div className="max-w-xl mx-auto bg-white shadow p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Acceso restringido</h2>
            <p className="mb-4">Tu correo (<strong>{sessionEmail}</strong>) no está autorizado como administrador.</p>
            <button onClick={handleLogout} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">Cerrar sesión</button>
          </div>
        )}

        {loggedIn && isAdmin && (
          <div className="space-y-6">
            <ContactInfoCard
              contacto={contactInfo}
              dirty={contactDirty}
              saving={savingContact}
              onFieldChange={handleContactField}
              onSave={saveContactInfo}
            />
            <HeaderTools
              filter={filter}
              onFilter={setFilter}
              onlyDirty={onlyDirty}
              onOnlyDirty={setOnlyDirty}
              onSave={saveAll}
              saving={saving}
              hasDirty={hasDirty}
              />
            <div className="flex justify-end gap-3">
              <a
                href="/api/productos/export"
                className="inline-flex items-center rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
              >
                Descargar CSV
              </a>
              <a
                href="/api/productos/export/excel"
                className="inline-flex items-center rounded-md border border-green-600 px-4 py-2 text-sm font-semibold text-green-600 hover:bg-green-50"
              >
                Descargar Excel
              </a>
            </div>
            <MassEditTable
              productos={visibleProductos}
              onChange={markDirtyAndUpdate}
              onUploadImage={uploadProductoImagen}
              onRemoveImage={removeProductoImagen}
              uploadingImageId={uploadingImageId}
              removingImageId={removingImageId}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function LoginPanel({ onLogin }: { onLogin: (email: string, password: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = () => {
    if (!email || !password) {
      alert('Por favor completa ambos campos.');
      return;
    }
    onLogin(email, password);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Acceso Administrador</h2>
      <p className="text-sm text-gray-600 mb-6">Ingresa tu correo y contraseña.</p>
      <input 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
        type="email" 
        placeholder="Correo electrónico" 
        className="w-full border px-4 py-2 rounded mb-4 text-gray-900 placeholder:text-gray-700" 
      />
      <input 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        type="password" 
        placeholder="Contraseña" 
        className="w-full border px-4 py-2 rounded mb-4 text-gray-900 placeholder:text-gray-700" 
      />
      <button 
        onClick={handleSubmit} 
        disabled={!email || !password} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-40"
      >
        Iniciar sesión
      </button>
    </div>
  );
}

function HeaderTools({ filter, onFilter, onlyDirty, onOnlyDirty, onSave, saving, hasDirty }: { filter: string; onFilter: (v: string) => void; onlyDirty: boolean; onOnlyDirty: (v: boolean) => void; onSave: () => void; saving: boolean; hasDirty: boolean; }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
      <div className="flex items-center gap-4 w-full lg:w-auto">
        <input value={filter} onChange={e => onFilter(e.target.value)} placeholder="Filtrar..." className="border px-4 py-2 rounded w-full lg:w-64" />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={onlyDirty} onChange={e => onOnlyDirty(e.target.checked)} /> Solo modificados
        </label>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onSave} disabled={!hasDirty || saving} className={`px-4 py-2 rounded font-semibold text-sm ${!hasDirty ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : saving ? 'bg-blue-300 text-white animate-pulse' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
      </div>
    </div>
  );
}

function MassEditTable({
  productos,
  onChange,
  onUploadImage,
  onRemoveImage,
  uploadingImageId,
  removingImageId,
}: {
  productos: ProductoEditable[];
  onChange: (id: number, field: 'precio' | 'stock', value: number | null) => void;
  onUploadImage: (id: number, file: File) => void;
  onRemoveImage: (id: number) => void;
  uploadingImageId: number | null;
  removingImageId: number | null;
}) {
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

function ContactInfoCard({
  contacto,
  dirty,
  saving,
  onFieldChange,
  onSave,
}: {
  contacto: { telefono: string; whatsapp: string };
  dirty: boolean;
  saving: boolean;
  onFieldChange: (field: 'telefono' | 'whatsapp', value: string) => void;
  onSave: () => void;
}) {
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
