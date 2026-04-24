'use client';

import { useEffect, useState } from 'react';

interface BlogPost {
  id: number;
  titulo: string;
  slug: string;
  contenido: string;
  imagenUrl: string | null;
  estado: 'borrador' | 'publicado' | 'archivado';
  createdAt: string;
  updatedAt: string;
}

export default function BlogView() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    imagenUrl: '',
    estado: 'publicado' as const,
  });

  // Cargar posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/blog?page=${page}&perPage=10&admin=true`);
        if (!res.ok) throw new Error('Error cargando posts');
        const data = await res.json();
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (e) {
        console.error('Error:', e);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  // Guardar post (crear o actualizar)
  const handleSave = async () => {
    if (!formData.titulo.trim() || !formData.contenido.trim()) {
      alert('Título y contenido son requeridos');
      return;
    }

    try {
      let res;

      if (editingId) {
        // Actualizar
        res = await fetch(`/api/blog/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo: formData.titulo,
            contenido: formData.contenido,
            imagenUrl: formData.imagenUrl || null,
            estado: formData.estado,
          }),
        });
      } else {
        // Crear
        res = await fetch('/api/blog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-n8n-secret': process.env.NEXT_PUBLIC_N8N_SECRET || '',
          },
          body: JSON.stringify({
            titulo: formData.titulo,
            contenido: formData.contenido,
            imagenUrl: formData.imagenUrl || undefined,
            estado: formData.estado,
          }),
        });
      }

      if (!res.ok) {
        const err = await res.json();
        alert(`Error: ${err.error}`);
        return;
      }

      // Recargar lista
      setFormData({ titulo: '', contenido: '', imagenUrl: '', estado: 'publicado' });
      setEditingId(null);
      setShowForm(false);
      setPage(1);

      // Recargar posts
      const reloadRes = await fetch('/api/blog?page=1&perPage=10&admin=true');
      if (reloadRes.ok) {
        const data = await reloadRes.json();
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      }
    } catch (e) {
      console.error('Error:', e);
      alert('Error guardando post');
    }
  };

  // Editar post
  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setFormData({
      titulo: post.titulo,
      contenido: post.contenido,
      imagenUrl: post.imagenUrl || '',
      estado: post.estado,
    });
    setShowForm(true);
  };

  // Eliminar post
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este post?')) return;

    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error eliminando');

      setPosts(posts.filter((p) => p.id !== id));
    } catch (e) {
      console.error('Error:', e);
      alert('Error eliminando post');
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ titulo: '', contenido: '', imagenUrl: '', estado: 'publicado' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CO');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Blog</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          {showForm ? 'Cancelar' : '+ Nuevo artículo'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold">
            {editingId ? 'Editar artículo' : 'Crear artículo'}
          </h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título del artículo"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contenido
            </label>
            <textarea
              value={formData.contenido}
              onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-48"
              placeholder="Contenido del artículo (separa párrafos con líneas vacías)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL de imagen (opcional)
            </label>
            <input
              type="text"
              value={formData.imagenUrl}
              onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="borrador">Borrador</option>
              <option value="publicado">Publicado</option>
              <option value="archivado">Archivado</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Tabla de posts */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-6 w-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay artículos</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                    {post.titulo}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        post.estado === 'publicado'
                          ? 'bg-green-100 text-green-700'
                          : post.estado === 'borrador'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {post.estado}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Ver
                    </a>
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {page > 1 && (
            <button
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            >
              ← Anterior
            </button>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${
                p === page
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}

          {page < totalPages && (
            <button
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            >
              Siguiente →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
