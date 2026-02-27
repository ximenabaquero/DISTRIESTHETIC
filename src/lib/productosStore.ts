import { productosBase, type Producto } from '@/data/productos';
import type { SupabaseClient } from '@supabase/supabase-js';

export type ProductoInfoUpdate = {
  nombre?: string | null;
  descripcion?: string | null;
  categoria?: Producto['categoria'] | null;
  etiqueta?: string | null;
  disponible?: boolean | null;
};

// ──────────────────────────────────────────────────────────────
// Supabase client (server-side, service role)
// ──────────────────────────────────────────────────────────────
let supabase: SupabaseClient | null = null;
let seeded = false;

async function getSupabase(): Promise<SupabaseClient | null> {
  if (supabase) return supabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const { createClient } = await import('@supabase/supabase-js');
  supabase = createClient(url, key, { auth: { persistSession: false } });
  return supabase;
}

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
function mapRow(row: Record<string, unknown>): Producto {
  return {
    id: Number(row.id),
    nombre: String(row.nombre),
    descripcion: String(row.descripcion ?? ''),
    categoria: String(row.categoria) as Producto['categoria'],
    disponible: Boolean(row.disponible),
    etiqueta: String(row.etiqueta ?? ''),
    precio: row.precio !== null && row.precio !== undefined ? Number(row.precio) : null,
    stock: Number(row.stock) || 0,
    imagenUrl: typeof row.imagen_url === 'string' ? row.imagen_url : null,
  };
}

/**
 * Siembra los 37 productos base si la tabla está vacía.
 * Usa upsert para que sea idempotente en caso de ejecución repetida.
 */
async function ensureSeeded(sb: SupabaseClient): Promise<void> {
  if (seeded) return;

  const { count, error } = await sb
    .from('productos')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('[productosStore] Error verificando semilla:', error.message);
    return;
  }

  if (count !== null && count > 0) {
    seeded = true;
    return;
  }

  const rows = productosBase.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion,
    categoria: p.categoria,
    disponible: p.disponible,
    etiqueta: p.etiqueta,
    precio: p.precio,
    stock: p.stock,
    imagen_url: p.imagenUrl,
    is_base: true,
  }));

  const { error: insertError } = await sb
    .from('productos')
    .upsert(rows, { onConflict: 'id' });

  if (insertError) {
    console.error('[productosStore] Error sembrando productos base:', insertError.message);
  }

  seeded = true;
}

// ──────────────────────────────────────────────────────────────
// API pública
// ──────────────────────────────────────────────────────────────

export async function getAllProductos(): Promise<Producto[]> {
  const sb = await getSupabase();
  if (!sb) return [...productosBase];

  await ensureSeeded(sb);

  const { data, error } = await sb
    .from('productos')
    .select('*')
    .order('id', { ascending: true });

  if (error || !data) {
    console.error('[productosStore] Error obteniendo productos:', error?.message);
    return [...productosBase];
  }

  return data.map((row) => mapRow(row as Record<string, unknown>));
}

export async function bulkUpdate(
  list: Array<{ id: number; precio: number | null; stock: number }>,
): Promise<Producto[]> {
  const sb = await getSupabase();
  if (!sb) throw new Error('Supabase no configurado.');

  await Promise.all(
    list.map((item) =>
      sb
        .from('productos')
        .update({ precio: item.precio, stock: item.stock })
        .eq('id', item.id),
    ),
  );

  return getAllProductos();
}

export async function createProducto(data: Omit<Producto, 'id'>): Promise<Producto> {
  const sb = await getSupabase();
  if (!sb) throw new Error('Supabase no configurado.');

  const { data: inserted, error } = await sb
    .from('productos')
    .insert({
      nombre: data.nombre,
      descripcion: data.descripcion,
      categoria: data.categoria,
      disponible: data.disponible,
      etiqueta: data.etiqueta,
      precio: data.precio,
      stock: data.stock,
      imagen_url: data.imagenUrl,
      is_base: false,
    })
    .select()
    .single();

  if (error || !inserted) {
    throw new Error(error?.message || 'Error creando producto.');
  }

  return mapRow(inserted as Record<string, unknown>);
}

export async function updateProductoInfo(
  id: number,
  data: ProductoInfoUpdate,
): Promise<Producto | null> {
  const sb = await getSupabase();
  if (!sb) throw new Error('Supabase no configurado.');

  const updates: Record<string, unknown> = {};
  if (data.nombre !== undefined && data.nombre !== null) updates.nombre = data.nombre;
  if (data.descripcion !== undefined && data.descripcion !== null) updates.descripcion = data.descripcion;
  if (data.categoria !== undefined && data.categoria !== null) updates.categoria = data.categoria;
  if (data.etiqueta !== undefined && data.etiqueta !== null) updates.etiqueta = data.etiqueta;
  if (data.disponible !== undefined && data.disponible !== null) updates.disponible = data.disponible;

  if (Object.keys(updates).length === 0) return null;

  const { data: updated, error } = await sb
    .from('productos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !updated) return null;
  return mapRow(updated as Record<string, unknown>);
}

export async function setProductoImagen(
  id: number,
  imagenUrl: string | null,
): Promise<Producto | null> {
  const sb = await getSupabase();
  if (!sb) throw new Error('Supabase no configurado.');

  const { data: updated, error } = await sb
    .from('productos')
    .update({ imagen_url: imagenUrl })
    .eq('id', id)
    .select()
    .single();

  if (error || !updated) return null;
  return mapRow(updated as Record<string, unknown>);
}

export async function deleteProducto(id: number): Promise<Producto | null> {
  const sb = await getSupabase();
  if (!sb) throw new Error('Supabase no configurado.');

  const { data: current, error: fetchError } = await sb
    .from('productos')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !current) return null;

  // Solo se pueden eliminar productos extras (is_base = false)
  if ((current as Record<string, unknown>).is_base) return null;

  const { error } = await sb.from('productos').delete().eq('id', id);
  if (error) throw new Error(error.message);

  return mapRow(current as Record<string, unknown>);
}

// Alias conservado por compatibilidad con updateProducto individual
export async function updateProducto(
  id: number,
  data: Partial<Pick<Producto, 'precio' | 'stock'>>,
): Promise<Producto | null> {
  const sb = await getSupabase();
  if (!sb) throw new Error('Supabase no configurado.');

  const updates: Record<string, unknown> = {};
  if (data.precio !== undefined) updates.precio = data.precio;
  if (data.stock !== undefined) updates.stock = data.stock;

  const { data: updated, error } = await sb
    .from('productos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !updated) return null;
  return mapRow(updated as Record<string, unknown>);
}
