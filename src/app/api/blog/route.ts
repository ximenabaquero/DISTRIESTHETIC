import { NextRequest, NextResponse } from 'next/server';
import { createBlogPost, getAllBlogPosts, getAllBlogPostsAdmin } from '@/lib/blogStore';

/**
 * POST /api/blog
 * Crear un nuevo post de blog
 * 
 * Requiere header: x-n8n-secret (debe coincidir con N8N_SECRET del servidor)
 * 
 * Body:
 *   {
 *     titulo: string (requerido)
 *     contenido: string (requerido)
 *     slug?: string (opcional, se genera automáticamente)
 *     imagenUrl?: string
 *     estado?: 'borrador' | 'publicado' | 'archivado' (default: 'publicado')
 *   }
 */
export async function POST(request: NextRequest) {
  // Validar token secreto de n8n
  const token = request.headers.get('x-n8n-secret');
  const expectedToken = process.env.N8N_SECRET;

  if (!expectedToken || token !== expectedToken) {
    return NextResponse.json(
      { error: 'Token inválido o faltante' },
      { status: 401 }
    );
  }

  let body: { titulo?: string; contenido?: string; slug?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Body inválido' },
      { status: 400 }
    );
  }

  const { titulo, contenido, slug } = body;

  // Validar campos requeridos
  if (!titulo || typeof titulo !== 'string' || titulo.trim().length === 0) {
    return NextResponse.json(
      { error: 'Título requerido y no puede estar vacío' },
      { status: 400 }
    );
  }

  if (!contenido || typeof contenido !== 'string' || contenido.trim().length === 0) {
    return NextResponse.json(
      { error: 'Contenido requerido y no puede estar vacío' },
      { status: 400 }
    );
  }

  try {
    const post = await createBlogPost({
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      slug,
      estado: 'publicado',
    });

    return NextResponse.json(post, { status: 201 });
  } catch (e) {
    console.error('[POST /api/blog] Error:', e);
    return NextResponse.json(
      { error: 'Error creando post de blog' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/blog
 * Obtener listado de posts publicados (público)
 * 
 * Query params:
 *   ?page=1 (default: 1)
 *   ?perPage=10 (default: 10)
 *   ?admin=true (si es admin, trae también borradores)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('perPage') ?? '10', 10)));
  const isAdmin = searchParams.get('admin') === 'true';

  try {
    let result;

    if (isAdmin) {
      // Admin puede ver todos los posts (incluyendo borradores)
      // TODO: Validar que sea admin autenticado
      result = await getAllBlogPostsAdmin(page, perPage);
    } else {
      // Público solo ve posts publicados
      result = await getAllBlogPosts(page, perPage);
    }

    return NextResponse.json({
      posts: result.posts,
      total: result.total,
      page,
      perPage,
      totalPages: Math.ceil(result.total / perPage),
    });
  } catch (e) {
    console.error('[GET /api/blog] Error:', e);
    return NextResponse.json(
      { error: 'Error obteniendo posts' },
      { status: 500 }
    );
  }
}
