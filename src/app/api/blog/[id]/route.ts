import { NextRequest, NextResponse } from 'next/server';
import { updateBlogPost, deleteBlogPost } from '@/lib/blogStore';
import { verifyAdminSession } from '@/lib/adminAuth';

/**
 * PATCH /api/blog/[id]
 * Actualizar un post de blog (requiere admin)
 * 
 * Body:
 *   {
 *     titulo?: string
 *     contenido?: string
 *     imagenUrl?: string | null
 *     estado?: 'borrador' | 'publicado' | 'archivado'
 *   }
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Validar autenticación admin
  const adminEmail = await verifyAdminSession(request);
  if (!adminEmail) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const postId = parseInt(id, 10);

  if (isNaN(postId)) {
    return NextResponse.json(
      { error: 'ID inválido' },
      { status: 400 }
    );
  }

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
    console.error(`[PATCH /api/blog/${id}] Error:`, e);
    return NextResponse.json(
      { error: 'Error actualizando post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blog/[id]
 * Eliminar un post de blog (requiere admin)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Validar autenticación admin
  const adminEmail = await verifyAdminSession(request);
  if (!adminEmail) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const postId = parseInt(id, 10);

  if (isNaN(postId)) {
    return NextResponse.json(
      { error: 'ID inválido' },
      { status: 400 }
    );
  }

  try {
    await deleteBlogPost(postId);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(`[DELETE /api/blog/${id}] Error:`, e);
    return NextResponse.json(
      { error: 'Error eliminando post' },
      { status: 500 }
    );
  }
}
