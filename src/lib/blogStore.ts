import type { SupabaseClient } from '@supabase/supabase-js';

export type BlogEstado = 'borrador' | 'publicado' | 'archivado';

export interface BlogPost {
  id: number;
  titulo: string;
  slug: string;
  contenido: string;
  imagenUrl: string | null;
  estado: BlogEstado;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogData {
  titulo: string;
  contenido: string;
  slug?: string; // si no se proporciona, se genera automáticamente
  imagenUrl?: string;
  estado?: BlogEstado;
}

export interface UpdateBlogData {
  titulo?: string;
  contenido?: string;
  imagenUrl?: string | null;
  estado?: BlogEstado;
}

// ── Inicialización lazy del cliente Supabase ────────────────────────────────
let supabase: SupabaseClient | null = null;

async function getSupabase(): Promise<SupabaseClient> {
  if (supabase) return supabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase no configurado.');
  const { createClient } = await import('@supabase/supabase-js');
  supabase = createClient(url, key, { auth: { persistSession: false } });
  return supabase;
}

// ── mapRow: convierte una fila de la base de datos al formato del código ────
// Supabase devuelve columnas en snake_case (created_at, imagen_url)
// pero el código usa camelCase (createdAt, imagenUrl).
function mapRow(row: Record<string, unknown>): BlogPost {
  return {
    id: Number(row.id),
    titulo: String(row.titulo),
    slug: String(row.slug),
    contenido: String(row.contenido),
    imagenUrl: typeof row.imagen_url === 'string' ? row.imagen_url : null,
    estado: String(row.estado) as BlogEstado,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

// ── Generar slug automáticamente desde el título ────────────────────────────
export function generateSlug(titulo: string): string {
  const slug = titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars
    .trim()
    .replace(/\s+/g, '-'); // spaces to hyphens
  return `${slug}-${Date.now()}`;
}

// ── createBlogPost: crear un nuevo artículo de blog ────────────────────────
export async function createBlogPost(data: CreateBlogData): Promise<BlogPost> {
  const sb = await getSupabase();

  const slug = data.slug || generateSlug(data.titulo);

  const { data: inserted, error } = await sb
    .from('blog')
    .insert({
      titulo: data.titulo,
      slug,
      contenido: data.contenido,
      imagen_url: data.imagenUrl ?? null,
      estado: data.estado ?? 'publicado',
    })
    .select()
    .single();

  if (error || !inserted) {
    throw new Error(error?.message || 'Error creando post de blog.');
  }

  return mapRow(inserted as Record<string, unknown>);
}

// ── getBlogPostBySlug: obtener un post por slug ─────────────────────────────
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const sb = await getSupabase();

  const { data, error } = await sb
    .from('blog')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    // Si no encuentra el post (PGRST116), devolver null
    if (error.code === 'PGRST116') return null;
    console.error('[blogStore] Error obteniendo post por slug:', error.message);
    return null;
  }

  if (!data) return null;

  return mapRow(data as Record<string, unknown>);
}

// ── getAllBlogPosts: obtener todos los posts publicados (para público) ──────
export async function getAllBlogPosts(
  page: number = 1,
  perPage: number = 10
): Promise<{ posts: BlogPost[]; total: number }> {
  const sb = await getSupabase();

  // Contar total
  const { count } = await sb
    .from('blog')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'publicado');

  // Obtener posts con paginación
  const { data, error } = await sb
    .from('blog')
    .select('*')
    .eq('estado', 'publicado')
    .order('created_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (error) {
    console.error('[blogStore] Error obteniendo posts:', error.message);
    return { posts: [], total: 0 };
  }

  const posts = (data ?? []).map((row) => mapRow(row as Record<string, unknown>));

  return {
    posts,
    total: count ?? 0,
  };
}

// ── getAllBlogPostsAdmin: obtener todos los posts (para admin, incluyendo borradores) ──
export async function getAllBlogPostsAdmin(
  page: number = 1,
  perPage: number = 10
): Promise<{ posts: BlogPost[]; total: number }> {
  const sb = await getSupabase();

  // Contar total
  const { count } = await sb
    .from('blog')
    .select('*', { count: 'exact', head: true });

  // Obtener posts con paginación
  const { data, error } = await sb
    .from('blog')
    .select('*')
    .order('created_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (error) {
    console.error('[blogStore] Error obteniendo posts (admin):', error.message);
    return { posts: [], total: 0 };
  }

  const posts = (data ?? []).map((row) => mapRow(row as Record<string, unknown>));

  return {
    posts,
    total: count ?? 0,
  };
}

// ── updateBlogPost: actualizar un post ────────────────────────────────────
export async function updateBlogPost(
  id: number,
  data: UpdateBlogData
): Promise<BlogPost> {
  const sb = await getSupabase();

  const { data: updated, error } = await sb
    .from('blog')
    .update({
      titulo: data.titulo,
      contenido: data.contenido,
      imagen_url: data.imagenUrl ?? undefined,
      estado: data.estado,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error || !updated) {
    throw new Error(error?.message || 'Error actualizando post de blog.');
  }

  return mapRow(updated as Record<string, unknown>);
}

// ── deleteBlogPost: eliminar un post ───────────────────────────────────────
export async function deleteBlogPost(id: number): Promise<void> {
  const sb = await getSupabase();

  const { error } = await sb.from('blog').delete().eq('id', id);

  if (error) {
    throw new Error(error.message || 'Error eliminando post de blog.');
  }
}
