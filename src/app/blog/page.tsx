'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SiteNav from '@/components/SiteNav';
import Footer from '@/components/Footer';
import EkgDivider from '@/components/EkgDivider';

interface BlogPost {
  id: number;
  titulo: string;
  slug: string;
  contenido: string;
  imagenUrl: string | null;
  estado: string;
  createdAt: string;
}

export default function BlogPage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') ?? '1', 10);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/blog?page=${page}&perPage=10`);
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

  // Filtrar por búsqueda
  useEffect(() => {
    if (!search.trim()) {
      setFilteredPosts(posts);
    } else {
      const term = search.toLowerCase();
      setFilteredPosts(
        posts.filter((post) => post.titulo.toLowerCase().includes(term))
      );
    }
  }, [search, posts]);

  const getPreview = (contenido: string, maxChars: number = 150) => {
    return contenido.length > maxChars
      ? contenido.slice(0, maxChars) + '...'
      : contenido;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteNav />

      <div className="flex-1">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Blog</h1>
            <p className="text-gray-600">
              Artículos sobre estética, medicina estética e insumos médicos
            </p>
          </div>

          <EkgDivider />

          {/* Búsqueda */}
          <div className="mb-8 mt-8">
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          {/* Posts Grid */}
          {!loading && filteredPosts.length > 0 && (
            <div className="space-y-6 mb-12">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex gap-4">
                      {/* Imagen */}
                      {post.imagenUrl && (
                        <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={post.imagenUrl}
                            alt={post.titulo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                          {post.titulo}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {formatDate(post.createdAt)}
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {getPreview(post.contenido)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Sin resultados */}
          {!loading && filteredPosts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="w-16 h-16 text-gray-300 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500">
                {search.trim()
                  ? 'No se encontraron artículos'
                  : 'No hay artículos disponibles'}
              </p>
            </div>
          )}

          {/* Paginación */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {page > 1 && (
                <Link
                  href={`/blog?page=${page - 1}`}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  ← Anterior
                </Link>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/blog?page=${p}`}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    p === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </Link>
              ))}

              {page < totalPages && (
                <Link
                  href={`/blog?page=${page + 1}`}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Siguiente →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
