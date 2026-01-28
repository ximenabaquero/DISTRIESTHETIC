'use client';

import { useAdmin } from './components/hooks/useAdmin';
import AdminLayout from './components/AdminLayout';
import LoginPanel from './components/LoginPanel';
import ContactInfoCard from './components/ContactInfoCard';
import HeaderTools from './components/HeaderTools';
import MassEditTable from './components/MassEditTable';
import CreateProductModal from './components/CreateProductModal';
import EditProductModal from './components/EditProductModal';
import Link from 'next/link';

export default function AdminPage() {
  const {
    sessionEmail,
    productos,
    saving,
    filter,
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
    visibleProductos,
    hasDirty,
    loggedIn,
    isAdmin,
    setFilter,
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
    saveAll,
    handleLogin,
    handleLogout,
    handleContactField,
    saveContactInfo,
  } = useAdmin();

  return (
    <AdminLayout loggedIn={loggedIn} onLogout={handleLogout} sessionEmail={sessionEmail}>
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
    </AdminLayout>
  );
}