"use client";

import { useEffect, useState, useMemo, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type Producto, productosBase } from '@/data/productos';

interface ProductoEditable extends Producto { dirty?: boolean; isExtra?: boolean }

interface ProductEditPayload {
  nombre: string;
  descripcion: string;
  etiqueta: string;
  disponible: boolean;
}

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductoEditable | null>(null);
  const [updatingProduct, setUpdatingProduct] = useState(false);

  const baseProductsSet = useMemo(() => new Set(productosBase.map(p => p.id)), []);

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
          setProductos(productosJson.productos.map((p: Producto) => ({ ...p, dirty: false, isExtra: !baseProductsSet.has(p.id) })));
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
  }, [isAdmin, baseProductsSet]);

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

  const handleCreateProducto = async (payload: Omit<Producto, 'id'>) => {
    setCreatingProduct(true);
    try {
      const res = await fetch('/api/productos/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'No se pudo crear el producto');
      }
      setProductos(prev => {
        const updated = [...prev, { ...json.producto, dirty: false, isExtra: !baseProductsSet.has(json.producto.id) }];
        return updated.sort((a, b) => a.id - b.id);
      });
      setShowCreateModal(false);
      alert(`Producto "${json.producto.nombre}" creado con éxito`);
    } catch (error) {
      console.error('Error creando producto', error);
      alert(error instanceof Error ? error.message : 'Error inesperado creando producto');
    } finally {
      setCreatingProduct(false);
    }
  };

  const openEditModal = (producto: ProductoEditable) => {
    setEditingProduct(producto);
  };

  const handleUpdateProductoInfo = async (id: number, payload: ProductEditPayload) => {
    setUpdatingProduct(true);
    try {
      const body = {
        nombre: payload.nombre.trim(),
        descripcion: payload.descripcion.trim(),
        etiqueta: payload.etiqueta.trim().toUpperCase(),
        disponible: payload.disponible,
      };
      const res = await fetch(`/api/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'No se pudo actualizar el producto');
      }
      setProductos(prev => {
        const updatedList = prev.map(p => p.id === id ? { ...p, ...json.producto, dirty: false, isExtra: !baseProductsSet.has(json.producto.id) } : p);
        return updatedList.sort((a, b) => a.id - b.id);
      });
      setEditingProduct(null);
      alert(`Producto "${json.producto.nombre}" actualizado`);
    } catch (error) {
      console.error('Error actualizando producto', error);
      alert(error instanceof Error ? error.message : 'Error inesperado actualizando producto');
    } finally {
      setUpdatingProduct(false);
    }
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

  const handleDeleteProducto = async (id: number) => {
    const productoTarget = productos.find(p => p.id === id);
    if (!productoTarget?.isExtra) {
      alert('Solo se pueden eliminar los productos agregados manualmente.');
      return;
    }
    if (!confirm('¿Deseas eliminar este producto? Esta acción no se puede deshacer.')) return;
    setDeletingProductId(id);
    try {
      const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'No se pudo eliminar el producto');
      }
      setProductos(prev => prev.filter(p => p.id !== id));
      alert(`Producto "${json.producto.nombre}" eliminado`);
    } catch (error) {
      console.error('Error eliminando producto', error);
      alert(error instanceof Error ? error.message : 'Error inesperado eliminando producto');
    } finally {
      setDeletingProductId(null);
    }
  };

  const saveAll = async () => {
    if (!hasDirty) return;
    setSaving(true);
    try {
      const payload = productos.filter(p => p.dirty).map(p => ({ id: p.id, precio: p.precio, stock: p.stock }));
      const res = await fetch('/api/productos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (json.ok) {
        const updated: ProductoEditable[] = json.productos.map((p: Producto) => ({ ...p, dirty: false, isExtra: !baseProductsSet.has(p.id) }));
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
            <div className="flex flex-col gap-4">
              <p className="w-full max-w-4xl px-4 text-lg font-semibold text-gray-700">
                Administra el catálogo de DISTRIESTHETIC con controles intuitivos y accesibles desde este panel.
              </p>
            </div>
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
              onAddProduct={() => setShowCreateModal(true)}
              hasExtras={productos.some(p => p.isExtra)}
              />
            <div className="flex justify-end gap-3">
              <Link
                href="/api/productos/export"
                prefetch={false}
                className="inline-flex items-center rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                target="_blank"
              >
                Descargar CSV
              </Link>
              <Link
                href="/api/productos/export/excel"
                prefetch={false}
                className="inline-flex items-center rounded-md border border-green-600 px-4 py-2 text-sm font-semibold text-green-600 hover:bg-green-50"
                target="_blank"
              >
                Descargar Excel
              </Link>
            </div>
            <MassEditTable
              productos={visibleProductos}
              onChange={markDirtyAndUpdate}
              onUploadImage={uploadProductoImagen}
              onRemoveImage={removeProductoImagen}
              uploadingImageId={uploadingImageId}
              removingImageId={removingImageId}
              onDelete={handleDeleteProducto}
              deletingId={deletingProductId}
              onEdit={openEditModal}
              updating={updatingProduct}
              editingId={editingProduct?.id ?? null}
            />
            <CreateProductModal
              open={showCreateModal}
              onClose={() => !creatingProduct && setShowCreateModal(false)}
              onCreate={handleCreateProducto}
              loading={creatingProduct}
            />
            <EditProductModal
              open={!!editingProduct}
              product={editingProduct}
              onClose={() => !updatingProduct && setEditingProduct(null)}
              onSave={handleUpdateProductoInfo}
              loading={updatingProduct}
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

function HeaderTools({ filter, onFilter, onlyDirty, onOnlyDirty, onSave, saving, hasDirty, onAddProduct, hasExtras }: { filter: string; onFilter: (v: string) => void; onlyDirty: boolean; onOnlyDirty: (v: boolean) => void; onSave: () => void; saving: boolean; hasDirty: boolean; onAddProduct: () => void; hasExtras: boolean; }) {
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

function MassEditTable({
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
}: {
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

const categoriaOptions = [
  { value: 'medicamentos', label: 'Medicamentos' },
  { value: 'soluciones', label: 'Soluciones' },
  { value: 'insumos', label: 'Insumos' },
  { value: 'quimicos', label: 'Químicos' },
  { value: 'ropa', label: 'Ropa' },
  { value: 'proteccion', label: 'Protección' },
];

function CreateProductModal({ open, onClose, onCreate, loading }: { open: boolean; onClose: () => void; onCreate: (data: Omit<Producto, 'id'>) => void; loading: boolean; }) {
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

function EditProductModal({ open, product, onClose, onSave, loading }: { open: boolean; product: ProductoEditable | null; onClose: () => void; onSave: (id: number, data: ProductEditPayload) => void; loading: boolean; }) {
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
