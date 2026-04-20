import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostBySlug } from '@/lib/blogStore';

/**
 * GET /api/blog/[slug]
 * Obtener un post de blog por su slug
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  if (!slug || typeof slug !== 'string') {
    return NextResponse.json(
      { error: 'Slug inválido' },
      { status: 400 }
    );
  }

  try {
    const post = await getBlogPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (e) {
    console.error(`[GET /api/blog/${slug}] Error:`, e);
    return NextResponse.json(
      { error: 'Error obteniendo post' },
      { status: 500 }
    );
  }
}
