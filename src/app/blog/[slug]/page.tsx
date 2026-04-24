'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import { Footer } from '@/components/Footer';
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

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/blog/${slug}`);

        if (!res.ok) {
          if (res.status === 404) {
            setError('Artículo no encontrado');
          } else {
            setError('Error cargando el artículo');
          }
          return;
        }

        const data = await res.json();
        setPost(data);
      } catch (e) {
        console.error('Error:', e);
        setError('Error cargando el artículo');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SiteNav />

      <div className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                ← Volver al blog
              </Link>
            </div>
          )}

          {/* Post */}
          {!loading && post && (
            <>
              {/* Back link */}
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold"
              >
                ← Volver al blog
              </Link>

              {/* Imagen de portada */}
              {post.imagenUrl && (
                <div className="mb-8 rounded-xl overflow-hidden">
                  <img
                    src={post.imagenUrl}
                    alt={post.titulo}
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              {/* Título */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.titulo}</h1>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
                <time>{formatDate(post.createdAt)}</time>
              </div>

              <EkgDivider />

              {/* Contenido */}
              <article className="prose prose-sm max-w-none my-8">
                {post.contenido.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                    {paragraph}
                  </p>
                ))}
              </article>

              <EkgDivider />

              {/* CTA */}
              <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <p className="text-gray-700 mb-4">
                  ¿Interesado en nuestros productos? Consulta nuestro catálogo.
                </p>
                <Link
                  href="/productos"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                  Ver productos
                </Link>
              </div>

              {/* Back link bottom */}
              <div className="mt-12 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  ← Más artículos
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
