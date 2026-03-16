// ── ¿Qué es un custom hook? ─────────────────────────────────────────────────
// Un hook es una función que empieza con "use" y puede usar useState, useEffect, etc.
// useAdmin extrae TODA la lógica del panel admin fuera del componente de la página,
// dejando admin/page.tsx limpio (solo JSX). Si algo falla, el error apunta aquí.
import { useEffect, useState, useMemo, useCallback } from 'react';
import { type Producto, productosBase } from '@/data/productos';
import type { Pedido, PedidoEstado } from '@/lib/pedidosStore';
import type { MensajeContacto } from '../MensajesView';

interface ProductoEditable extends Producto { dirty?: boolean; isExtra?: boolean }
interface ProductEditPayload {
  nombre: string;
  descripcion: string;
  etiqueta: string;
  disponible: boolean;
}

export function useAdmin() {
  // ── Estados del hook ────────────────────────────────────────────────────
  // Cada useState guarda un "pedacito" del estado del admin.
  // Cuando alguno cambia con su setter (ej: setSaving), React vuelve a dibujar.

  const [sessionEmail, setSessionEmail] = useState<string | null>(null); // null = no logueado
  const [productos, setProductos] = useState<ProductoEditable[]>([]);
  const [saving, setSaving] = useState(false);           // ¿está guardando cambios masivos?
  const [filter, setFilter] = useState('');              // texto del buscador de productos
  const [categoryFilter, setCategoryFilter] = useState(''); // filtro de categoría
  const [onlyDirty, setOnlyDirty] = useState(false);    // mostrar solo productos modificados
  const [uploadingImageId, setUploadingImageId] = useState<number | null>(null); // id del producto cuya imagen está subiendo
  const [removingImageId, setRemovingImageId] = useState<number | null>(null);
  const [contactInfo, setContactInfo] = useState({ telefono: '', whatsapp: '', email: '' });
  const [contactDirty, setContactDirty] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductoEditable | null>(null);
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [updatingPedidoId, setUpdatingPedidoId] = useState<number | null>(null);
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([]);
  const [loadingMensajes, setLoadingMensajes] = useState(false);
  const [deletingMensajeId, setDeletingMensajeId] = useState<number | null>(null);
  const [updatingMensajeId, setUpdatingMensajeId] = useState<number | null>(null);

  // useMemo con [] → se calcula UNA sola vez al montar.
  // Set es una colección sin duplicados con búsqueda O(1) (instantánea).
  // Lo usamos para saber rápidamente si un producto es "base" o "extra"
  // sin recorrer el array productosBase cada vez.
  const baseProductsSet = useMemo(() => new Set(productosBase.map(p => p.id)), []);

  // !! convierte cualquier valor a booleano (null → false, "email" → true)
  const loggedIn = !!sessionEmail;
  const isAdmin = loggedIn;

  // ── useEffect 1: restaurar sesión al abrir la página ─────────────────────
  // [] vacío = se ejecuta UNA SOLA VEZ cuando el hook se monta.
  //
  // Sistema de "doble sesión":
  // - Cookie HTTP-only (en el servidor): es la sesión real y segura.
  //   JavaScript no puede leerla, solo el servidor puede verificarla.
  // - sessionStorage (en el cliente): guarda el email para mostrarlo en pantalla.
  //   Se limpia al cerrar el tab (no persiste entre sesiones).
  //
  // Al recargar la página, verificamos con el servidor si la cookie sigue
  // válida. Si sí, restauramos el email en el estado.
  useEffect(() => {
    const restore = async () => {
      try {
        const stored = sessionStorage.getItem('admin_email');
        if (!stored) return; // sin email guardado → no intentar restaurar
        const res = await fetch('/api/admin/verify');
        const json = await res.json();
        if (json.ok) {
          setSessionEmail(stored); // cookie válida → restaurar sesión
        } else {
          sessionStorage.removeItem('admin_email'); // cookie expiró → limpiar
        }
      } catch {
        // Sin conexión → no restaurar sesión (falla segura)
      }
    };
    restore();
  }, []); // [] = solo al montar, no se repite

  // ── useEffect 2: cargar datos cuando el admin se loguea ──────────────────
  // [isAdmin] como dependencia = se ejecuta cuando isAdmin cambia.
  // Flujo: usuario se loguea → isAdmin pasa de false a true → este efecto corre
  // y carga todos los datos necesarios para el panel.
  useEffect(() => {
    if (!isAdmin) return; // si no está logueado, no cargar nada

    const fetchAll = async () => {
      try {
        // Promise.all ejecuta ambos fetch EN PARALELO.
        // Sin Promise.all sería: esperar productos (300ms) + esperar contacto (200ms) = 500ms
        // Con Promise.all: ambos corren al mismo tiempo = ~300ms (el más lento)
        const [productosRes, contactoRes] = await Promise.all([
          fetch('/api/productos'),
          fetch('/api/contacto-info'),
        ]);
        const productosJson = await productosRes.json();
        if (productosJson.ok) {
          setProductos(productosJson.productos.map((p: Producto) => ({
            ...p,          // spread: copiar todas las propiedades del producto
            dirty: false,  // dirty = false significa "sin cambios pendientes"
            isExtra: !baseProductsSet.has(p.id), // true si NO está en los productos base
          })));
        }
        if (contactoRes.ok) {
          const contactoJson = await contactoRes.json();
          setContactInfo({
            telefono: contactoJson?.contact?.telefono ?? '',
            whatsapp: contactoJson?.contact?.whatsapp ?? '',
            email:    contactoJson?.contact?.email    ?? '',
          });
          setContactDirty(false);
        }
      } catch (error) {
        console.error('Error cargando datos admin', error);
        alert('Error cargando datos del administrador');
      }
    };

    const fetchPedidos = async () => {
      // Patrón loading state con try/catch/finally:
      // - try: ejecutar la operación
      // - catch: manejar errores
      // - finally: SIEMPRE se ejecuta, incluso si hubo error → limpiar el loading
      setLoadingPedidos(true);
      try {
        const res = await fetch('/api/pedidos');
        const json = await res.json();
        if (json.ok) setPedidos(json.pedidos);
      } catch (error) {
        console.error('Error cargando pedidos', error);
      } finally {
        setLoadingPedidos(false); // siempre quitar el spinner
      }
    };

    fetchAll();
    fetchPedidos();

    const fetchMensajes = async () => {
      setLoadingMensajes(true);
      try {
        const res = await fetch('/api/admin/mensajes');
        const json = await res.json();
        if (json.ok) setMensajes(json.mensajes);
      } catch (error) {
        console.error('Error cargando mensajes', error);
      } finally {
        setLoadingMensajes(false);
      }
    };
    fetchMensajes();
  }, [isAdmin, baseProductsSet]); // se re-ejecuta si isAdmin o baseProductsSet cambian

  // ── useMemo: valores derivados del estado ─────────────────────────────────
  // useMemo memoriza el resultado de un cálculo. Solo lo recalcula cuando
  // cambian las dependencias indicadas en el array [].
  // Sin useMemo, el cálculo correría en cada render aunque no haya cambios.

  // Lista de categorías únicas y ordenadas, calculada desde los productos
  const categories = useMemo(
    () => Array.from(new Set(productos.map(p => p.categoria))).sort(),
    [productos], // recalcular solo si cambia la lista de productos
  );

  // Productos filtrados según búsqueda, categoría y flag onlyDirty
  const visibleProductos = useMemo(() => {
    return productos.filter(p => {
      // Filtro de "solo modificados": si está activo y el producto no fue modificado, ocultarlo
      if (onlyDirty && !p.dirty) return false;
      // Filtro de categoría
      if (categoryFilter && p.categoria !== categoryFilter) return false;
      // Sin texto de búsqueda → mostrar todos
      if (!filter) return true;
      // Buscar en nombre, descripción y categoría (case insensitive)
      const f = filter.toLowerCase();
      return (
        p.nombre.toLowerCase().includes(f) ||
        p.descripcion.toLowerCase().includes(f) ||
        p.categoria.toLowerCase().includes(f)
      );
    });
  }, [productos, filter, categoryFilter, onlyDirty]);

  // ── useCallback: memorizar funciones para no recrearlas en cada render ────
  // Similar a useMemo pero para funciones. Sin useCallback, React crearía
  // una función nueva en cada render, lo que puede causar renders innecesarios
  // en componentes hijos que reciben la función como prop.

  // Marca un producto como "dirty" (modificado pero no guardado) y actualiza su valor local
  // El flag dirty es visual: los productos dirty se resaltan y se incluyen en "Guardar cambios"
  const markDirtyAndUpdate = useCallback((id: number, field: 'precio' | 'stock', value: number | null) => {
    setProductos(prev => prev.map(p =>
      p.id === id
        ? { ...p, [field]: value, dirty: true } // spread + cambiar solo el campo indicado
        : p // los demás productos no cambian
    ));
  }, []); // sin dependencias → nunca se recrea

  const updateProductoImagenLocal = useCallback((id: number, imagenUrl: string | null) => {
    // Actualizar la URL de imagen en el estado local (sin llamar a la API otra vez)
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
        // Agregar el nuevo producto y reordenar por id
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
    setEditingProduct(producto); // guardar el producto a editar → abre el modal
  }, []);

  const handleUpdateProductoInfo = useCallback(async (id: number, payload: ProductEditPayload) => {
    setUpdatingProduct(true);
    try {
      const body = {
        nombre: payload.nombre.trim(),
        descripcion: payload.descripcion.trim(),
        etiqueta: payload.etiqueta.trim().toUpperCase(), // etiquetas siempre en mayúscula
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
      setEditingProduct(null); // cerrar el modal
      alert(`Producto "${json.producto.nombre}" actualizado`);
    } catch (error) {
      console.error('Error actualizando producto', error);
      alert(error instanceof Error ? error.message : 'Error inesperado actualizando producto');
    } finally {
      setUpdatingProduct(false);
    }
  }, [baseProductsSet]);

  const uploadProductoImagen = useCallback(async (id: number, file: File) => {
    setUploadingImageId(id); // mostrar spinner solo en ese producto
    try {
      const formData = new FormData();
      formData.append('file', file); // FormData es necesario para enviar archivos
      const res = await fetch(`/api/productos/${id}/imagen`, { method: 'POST', body: formData });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'No se pudo actualizar la imagen');
      updateProductoImagenLocal(id, json.producto?.imagenUrl ?? null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error inesperado subiendo la imagen');
    } finally {
      setUploadingImageId(null); // quitar spinner
    }
  }, [updateProductoImagenLocal]);

  const removeProductoImagen = useCallback(async (id: number) => {
    setRemovingImageId(id);
    try {
      const res = await fetch(`/api/productos/${id}/imagen`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || 'No se pudo eliminar la imagen');
      updateProductoImagenLocal(id, null); // limpiar la URL en el estado local
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error inesperado eliminando la imagen');
    } finally {
      setRemovingImageId(null);
    }
  }, [updateProductoImagenLocal]);

  // true si hay al menos un producto con dirty=true (tiene cambios sin guardar)
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
      // filter devuelve un nuevo array sin el producto eliminado
      setProductos(prev => prev.filter(p => p.id !== id));
      alert(`Producto "${json.producto.nombre}" eliminado`);
    } catch (error) {
      console.error('Error eliminando producto', error);
      alert(error instanceof Error ? error.message : 'Error inesperado eliminando producto');
    } finally {
      setDeletingProductId(null);
    }
  }, [productos]);

  // ── saveAll: guardar en lote todos los productos modificados ──────────────
  // Solo envía al servidor los productos con dirty=true.
  // Después de guardar, el servidor devuelve la lista completa actualizada
  // y se reemplaza el estado local (dirty pasa a false en todos).
  const saveAll = useCallback(async () => {
    if (!hasDirty) return; // nada que guardar
    setSaving(true);
    try {
      // Filtrar solo los productos con cambios y mapear a la estructura que espera la API
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
        // Reemplazar el estado completo con la respuesta del servidor
        // (incluye dirty: false para todos)
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

  const handleUpdatePedidoEstado = useCallback(async (id: number, estado: PedidoEstado) => {
    setUpdatingPedidoId(id);
    try {
      const res = await fetch(`/api/pedidos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || 'No se pudo actualizar el estado');
      // Actualizar solo el pedido modificado en el estado local (no recargar todos)
      setPedidos(prev => prev.map(p => p.id === id ? json.pedido : p));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error actualizando pedido');
    } finally {
      setUpdatingPedidoId(null);
    }
  }, []);

  const handleMarcarMensajeLeido = useCallback(async (id: number, leido: boolean) => {
    setUpdatingMensajeId(id);
    try {
      const res = await fetch('/api/admin/mensajes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, leido }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error);
      // Actualizar solo ese mensaje en el estado local
      setMensajes(prev => prev.map(m => m.id === id ? { ...m, leido } : m));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error actualizando mensaje');
    } finally {
      setUpdatingMensajeId(null);
    }
  }, []);

  const handleEliminarMensaje = useCallback(async (id: number) => {
    if (!confirm('¿Eliminar este mensaje? No se puede deshacer.')) return;
    setDeletingMensajeId(id);
    try {
      const res = await fetch(`/api/admin/mensajes?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error);
      // Quitar el mensaje del estado local con filter
      setMensajes(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error eliminando mensaje');
    } finally {
      setDeletingMensajeId(null);
    }
  }, []);

  // ── Auth: login y logout ──────────────────────────────────────────────────
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
      // Guardar email en sessionStorage para mostrarlo en la UI
      // La sesión real (cookie HTTP-only) ya fue creada por el servidor
      sessionStorage.setItem('admin_email', json.email);
      setSessionEmail(json.email); // esto dispara el useEffect 2 que carga los datos
    } catch {
      alert('Error conectando con el servidor.');
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await fetch('/api/admin/logout', { method: 'POST' }); // borrar cookie en servidor
    sessionStorage.removeItem('admin_email'); // borrar email del cliente
    setSessionEmail(null);  // isAdmin pasa a false → el useEffect 2 no vuelve a correr
    setProductos([]);        // limpiar datos sensibles de memoria
  }, []);

  // ── Info de contacto ──────────────────────────────────────────────────────
  const handleContactField = useCallback((field: 'telefono' | 'whatsapp' | 'email', value: string) => {
    // [field]: value → computed property name: actualizar solo el campo indicado
    setContactInfo(prev => ({ ...prev, [field]: value }));
    setContactDirty(true); // marcar que hay cambios sin guardar
  }, []);

  const saveContactInfo = useCallback(async () => {
    if (!contactDirty) return; // sin cambios → no hacer nada
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

  // ── Retornar todo lo que necesita admin/page.tsx ──────────────────────────
  // El hook devuelve un objeto con estados y funciones.
  // La página los desestructura: const { productos, saving, ... } = useAdmin()
  return {
    // Estado (valores para mostrar en pantalla)
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
    // Setters (para cambiar estado desde la página)
    setFilter,
    setCategoryFilter,
    setOnlyDirty,
    setShowCreateModal,
    setEditingProduct,
    // Funciones (acciones que llaman a la API)
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
  };
}
