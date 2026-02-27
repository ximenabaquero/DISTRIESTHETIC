import { useEffect, useState, useMemo, useCallback } from 'react';
import { type Producto, productosBase } from '@/data/productos';

interface ProductoEditable extends Producto { dirty?: boolean; isExtra?: boolean }
interface ProductEditPayload {
  nombre: string;
  descripcion: string;
  etiqueta: string;
  disponible: boolean;
}

export function useAdmin() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [productos, setProductos] = useState<ProductoEditable[]>([]);
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

  const loggedIn = !!sessionEmail;
  const isAdmin = loggedIn;

  // ──────────────────────────────────────────────────────────────
  // Restaurar sesión al montar (la cookie HTTP-only persiste entre recargas)
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const restore = async () => {
      try {
        const stored = sessionStorage.getItem('admin_email');
        if (!stored) return;
        const res = await fetch('/api/admin/verify');
        const json = await res.json();
        if (json.ok) {
          setSessionEmail(stored);
        } else {
          sessionStorage.removeItem('admin_email');
        }
      } catch {
        // Sin conectividad — no restaurar sesión
      }
    };
    restore();
  }, []);

  // ──────────────────────────────────────────────────────────────
  // Cargar datos cuando el admin está autenticado
  // ──────────────────────────────────────────────────────────────
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
          setProductos(productosJson.productos.map((p: Producto) => ({
            ...p,
            dirty: false,
            isExtra: !baseProductsSet.has(p.id),
          })));
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
      return (
        p.nombre.toLowerCase().includes(f) ||
        p.descripcion.toLowerCase().includes(f) ||
        p.categoria.toLowerCase().includes(f)
      );
    });
  }, [productos, filter, onlyDirty]);

  const markDirtyAndUpdate = useCallback((id: number, field: 'precio' | 'stock', value: number | null) => {
    setProductos(prev => prev.map(p => p.id === id ? { ...p, [field]: value, dirty: true } : p));
  }, []);

  const updateProductoImagenLocal = useCallback((id: number, imagenUrl: string | null) => {
    setProductos(prev => prev.map(p => p.id === id ? { ...p, imagenUrl } : p));
  }, []);

  const handleCreateProducto = useCallback(async (payload: Omit<Producto, 'id'>) => {
    setCreatingProduct(true);
    try {
      const res = await fetch('/api/productos/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || 'No se pudo crear el producto');
      setProductos(prev => {
        const updated = [
          ...prev,
          { ...json.producto, dirty: false, isExtra: !baseProductsSet.has(json.producto.id) },
        ];
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
  }, [baseProductsSet]);

  const openEditModal = useCallback((producto: ProductoEditable) => {
    setEditingProduct(producto);
  }, []);

  const handleUpdateProductoInfo = useCallback(async (id: number, payload: ProductEditPayload) => {
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
      if (!res.ok || !json.ok) throw new Error(json.error || 'No se pudo actualizar el producto');
      setProductos(prev => {
        const updatedList = prev.map(p =>
          p.id === id
            ? { ...p, ...json.producto, dirty: false, isExtra: !baseProductsSet.has(json.producto.id) }
            : p,
        );
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
  }, [baseProductsSet]);

  const uploadProductoImagen = useCallback(async (id: number, file: File) => {
    setUploadingImageId(id);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`/api/productos/${id}/imagen`, { method: 'POST', body: formData });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'No se pudo actualizar la imagen');
      updateProductoImagenLocal(id, json.producto?.imagenUrl ?? null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error inesperado subiendo la imagen');
    } finally {
      setUploadingImageId(null);
    }
  }, [updateProductoImagenLocal]);

  const removeProductoImagen = useCallback(async (id: number) => {
    setRemovingImageId(id);
    try {
      const res = await fetch(`/api/productos/${id}/imagen`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'No se pudo eliminar la imagen');
      updateProductoImagenLocal(id, null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error inesperado eliminando la imagen');
    } finally {
      setRemovingImageId(null);
    }
  }, [updateProductoImagenLocal]);

  const hasDirty = useMemo(() => productos.some(p => p.dirty), [productos]);

  const handleDeleteProducto = useCallback(async (id: number) => {
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
      if (!res.ok || !json.ok) throw new Error(json.error || 'No se pudo eliminar el producto');
      setProductos(prev => prev.filter(p => p.id !== id));
      alert(`Producto "${json.producto.nombre}" eliminado`);
    } catch (error) {
      console.error('Error eliminando producto', error);
      alert(error instanceof Error ? error.message : 'Error inesperado eliminando producto');
    } finally {
      setDeletingProductId(null);
    }
  }, [productos]);

  const saveAll = useCallback(async () => {
    if (!hasDirty) return;
    setSaving(true);
    try {
      const payload = productos
        .filter(p => p.dirty)
        .map(p => ({ id: p.id, precio: p.precio, stock: p.stock }));
      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.ok) {
        const updated: ProductoEditable[] = json.productos.map((p: Producto) => ({
          ...p,
          dirty: false,
          isExtra: !baseProductsSet.has(p.id),
        }));
        setProductos(updated);
      }
    } catch (e) {
      console.error('Error guardando en lote', e);
    } finally {
      setSaving(false);
    }
  }, [hasDirty, productos, baseProductsSet]);

  // ──────────────────────────────────────────────────────────────
  // Auth: login y logout via API (cookie HTTP-only)
  // ──────────────────────────────────────────────────────────────
  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        alert(json.error || 'Correo o contraseña incorrectos.');
        return;
      }
      sessionStorage.setItem('admin_email', json.email);
      setSessionEmail(json.email);
    } catch {
      alert('Error conectando con el servidor.');
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    sessionStorage.removeItem('admin_email');
    setSessionEmail(null);
    setProductos([]);
  }, []);

  // ──────────────────────────────────────────────────────────────
  // Info de contacto
  // ──────────────────────────────────────────────────────────────
  const handleContactField = useCallback((field: 'telefono' | 'whatsapp', value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
    setContactDirty(true);
  }, []);

  const saveContactInfo = useCallback(async () => {
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
  }, [contactDirty, contactInfo]);

  return {
    // Estado
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
    // Setters
    setFilter,
    setOnlyDirty,
    setShowCreateModal,
    setEditingProduct,
    // Funciones
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
  };
}
