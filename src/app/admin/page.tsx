'use client';

import { useState } from 'react';
import { useAdmin } from './components/hooks/useAdmin';
import AdminLayout from './components/AdminLayout';
import LoginPanel from './components/LoginPanel';
import ContactInfoCard from './components/ContactInfoCard';
import HeaderTools from './components/HeaderTools';
import MassEditTable from './components/MassEditTable';
import CreateProductModal from './components/CreateProductModal';
import EditProductModal from './components/EditProductModal';
import DashboardView from './components/DashboardView';
import PedidosView from './components/PedidosView';
import MensajesView from './components/MensajesView';
import BlogView from './components/BlogView';
import Link from 'next/link';

type Section = 'dashboard' | 'productos' | 'pedidos' | 'mensajes' | 'blog' | 'configuracion';

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    id: 'productos',
    label: 'Productos',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
  {
    id: 'pedidos',
    label: 'Pedidos',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    id: 'mensajes',
    label: 'Mensajes',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    id: 'blog',
    label: 'Blog',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.66V6.75a9 9 0 0 1-9 9e-6V6.708c0-.227-.035-.45-.1-.66M9 20.25h9a2.25 2.25 0 0 0 2.25-2.25v-12c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0H9.25" />
      </svg>
    ),
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
];

export default function AdminPage() {
  const [section, setSection] = useState<Section>('dashboard');

  const {
    sessionEmail,
    productos,
    saving,
    filter,
    categoryFilter,
    categories,
    onlyDirty,
    uploadingImageId,
    removingImageId,
    contactInfo,
    contactDirty,
    savingContact,
    showCreateModal,
    creatingProduct,
    deletingProductId,
    editingProduct,
    updatingProduct,
    pedidos,
    loadingPedidos,
    updatingPedidoId,
    mensajes,
    loadingMensajes,
    deletingMensajeId,
    updatingMensajeId,
    visibleProductos,
    hasDirty,
    loggedIn,
    isAdmin,
    setFilter,
    setCategoryFilter,
    setOnlyDirty,
    setShowCreateModal,
    setEditingProduct,
    markDirtyAndUpdate,
    handleCreateProducto,
    openEditModal,
    handleUpdateProductoInfo,
    uploadProductoImagen,
    removeProductoImagen,
    handleDeleteProducto,
    handleUpdatePedidoEstado,
    handleMarcarMensajeLeido,
    handleEliminarMensaje,
    saveAll,
    handleLogin,
    handleLogout,
    handleContactField,
    saveContactInfo,
  } = useAdmin();

  return (
    <AdminLayout loggedIn={loggedIn} onLogout={handleLogout} sessionEmail={sessionEmail}>
      {!loggedIn && <LoginPanel onLogin={handleLogin} />}

      {loggedIn && !isAdmin && (
        <div className="max-w-xl mx-auto bg-white shadow p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Acceso restringido</h2>
          <p className="mb-4">Tu correo (<strong>{sessionEmail}</strong>) no está autorizado como administrador.</p>
          <button onClick={handleLogout} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">Cerrar sesión</button>
        </div>
      )}

      {loggedIn && isAdmin && (
        <div className="space-y-6">
          {/* Navegación por tabs — scrollable en móvil */}
          <nav className="-mx-4 sm:mx-0 overflow-x-auto border-b border-gray-200">
            <div className="flex min-w-max px-4 sm:px-0">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`relative flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
                    section === item.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.id === 'pedidos' && pedidos.filter(p => p.estado === 'sin_entregar').length > 0 && (
                    <span className="absolute top-1 right-1 sm:static sm:ml-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold bg-yellow-400 text-yellow-900 rounded-full">
                      {pedidos.filter(p => p.estado === 'sin_entregar').length}
                    </span>
                  )}
                  {item.id === 'mensajes' && mensajes.filter(m => !m.leido).length > 0 && (
                    <span className="absolute top-1 right-1 sm:static sm:ml-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold bg-blue-500 text-white rounded-full">
                      {mensajes.filter(m => !m.leido).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Dashboard */}
          {section === 'dashboard' && (
            <DashboardView
              productos={productos}
              pedidos={pedidos}
              loadingPedidos={loadingPedidos}
            />
          )}

          {/* Productos */}
          {section === 'productos' && (
            <div className="space-y-6">
              <HeaderTools
                filter={filter}
                onFilter={setFilter}
                categoryFilter={categoryFilter}
                onCategoryFilter={setCategoryFilter}
                categories={categories}
                onlyDirty={onlyDirty}
                onOnlyDirty={setOnlyDirty}
                onSave={saveAll}
                saving={saving}
                hasDirty={hasDirty}
                onAddProduct={() => setShowCreateModal(true)}
                hasExtras={productos.some((p) => p.isExtra)}
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

          {/* Pedidos */}
          {section === 'pedidos' && (
            <PedidosView
              pedidos={pedidos}
              loading={loadingPedidos}
              onUpdateEstado={handleUpdatePedidoEstado}
              updatingId={updatingPedidoId}
            />
          )}

          {/* Mensajes */}
          {section === 'mensajes' && (
            <MensajesView
              mensajes={mensajes}
              loading={loadingMensajes}
              onMarcarLeido={handleMarcarMensajeLeido}
              onEliminar={handleEliminarMensaje}
              deletingId={deletingMensajeId}
              updatingId={updatingMensajeId}
            />
          )}

          {/* Blog */}
          {section === 'blog' && <BlogView />}

          {/* Configuración */}
          {section === 'configuracion' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Configuración</h2>
                <p className="text-sm text-gray-400">Ajustes generales del sitio público.</p>
              </div>
              <ContactInfoCard
                contacto={contactInfo}
                dirty={contactDirty}
                saving={savingContact}
                onFieldChange={handleContactField}
                onSave={saveContactInfo}
              />
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
