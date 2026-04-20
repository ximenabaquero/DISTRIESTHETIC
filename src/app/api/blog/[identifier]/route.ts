import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostBySlug, updateBlogPost, deleteBlogPost } from '@/lib/blogStore';
import { requireAdmin } from '@/lib/adminAuth';

/**
 * GET /api/blog/[identifier]
 * Obtener un post por slug (público) o por ID (admin)
 * 
 * - Si identifier es un número: obtiene por ID (admin view)
 * - Si es texto: obtiene por slug (público, solo publicados)
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ identifier: string }> }
) {
  const { identifier } = await context.params;

  if (!identifier || typeof identifier !== 'string') {
    return NextResponse.json(
      { error: 'Identificador inválido' },
      { status: 400 }
    );
  }

  try {
    // Si es un número, es un ID (admin)
    if (/^\d+$/.test(identifier)) {
      // TODO: Aquí podrías implementar obtener por ID si lo necesitas
      return NextResponse.json(
        { error: 'Obtener por ID no implementado' },
        { status: 404 }
      );
    }

    // Si no, es un slug (público)
    const post = await getBlogPostBySlug(identifier);

    if (!post) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (e) {
    console.error(`[GET /api/blog/${identifier}] Error:`, e);
    return NextResponse.json(
      { error: 'Error obteniendo post' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/blog/[identifier]
 * Actualizar un post por ID (requiere admin)
 * 
 * identifier DEBE ser un número (ID del post)
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ identifier: string }> }
) {
  // Validar autenticación admin
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  const { identifier } = await context.params;
  
  // El identifier DEBE ser un número para PATCH
  if (!identifier || !(/^\d+$/.test(identifier))) {
    return NextResponse.json(
      { error: 'ID inválido. Use un número entero.' },
      { status: 400 }
    );
  }

  const postId = parseInt(identifier, 10);

  let body: { titulo?: string; contenido?: string; imagenUrl?: string | null; estado?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Body inválido' },
      { status: 400 }
    );
  }

  try {
    const post = await updateBlogPost(postId, {
      titulo: body.titulo,
      contenido: body.contenido,
      imagenUrl: body.imagenUrl,
      estado: (body.estado as any),
    });

    return NextResponse.json(post);
  } catch (e) {
    console.error(`[PATCH /api/blog/${identifier}] Error:`, e);
    return NextResponse.json(
      { error: 'Error actualizando post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blog/[identifier]
 * Eliminar un post por ID (requiere admin)
 * 
 * identifier DEBE ser un número (ID del post)
 */
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ identifier: string }> }
) {
  // Validar autenticación admin
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  const { identifier } = await context.params;
  
  // El identifier DEBE ser un número para DELETE
  if (!identifier || !(/^\d+$/.test(identifier))) {
    return NextResponse.json(
      { error: 'ID inválido. Use un número entero.' },
      { status: 400 }
    );
  }

  const postId = parseInt(identifier, 10);

  try {
    await deleteBlogPost(postId);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(`[DELETE /api/blog/${identifier}] Error:`, e);
    return NextResponse.json(
      { error: 'Error eliminando post' },
      { status: 500 }
    );
  }
}
