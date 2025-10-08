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
        const res = await fetch('/api/productos');
        const json = await res.json();
        if (json.ok) {
          const merged: ProductoEditable[] = json.productos.map((p: Producto) => ({ ...p, dirty: false }));
          setProductos(merged);
        }
      } catch (e) {
        console.error('Error cargando productos', e);
      } finally {
        // setLoadingData(false);
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
          <div>
            <HeaderTools
              filter={filter}
              onFilter={setFilter}
              onlyDirty={onlyDirty}
              onOnlyDirty={setOnlyDirty}
              onSave={saveAll}
              saving={saving}
              hasDirty={hasDirty}
            />
            <MassEditTable productos={visibleProductos} onChange={markDirtyAndUpdate} />
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

function MassEditTable({ productos, onChange }: { productos: ProductoEditable[]; onChange: (id: number, field: 'precio' | 'stock', value: number | null) => void }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-3 py-2 text-left">ID</th>
            <th className="px-3 py-2 text-left">Nombre</th>
            <th className="px-3 py-2">Categoría</th>
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
