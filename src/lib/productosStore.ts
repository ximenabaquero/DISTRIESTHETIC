import { productosBase, type Producto } from '@/data/productos';
import type { SupabaseClient } from '@supabase/supabase-js';

export type ProductoInfoUpdate = {
  nombre?: string | null;
  descripcion?: string | null;
  categoria?: Producto['categoria'] | null;
  etiqueta?: string | null;
  disponible?: boolean | null;
};

// ── Inicialización lazy (Singleton) ────────────────────────────────────────
// "Singleton" significa que solo se crea UNA instancia del cliente Supabase
// en toda la vida del servidor. Se guarda en esta variable de módulo.
// La primera vez que se llama getSupabase(), se crea. Las siguientes veces
// devuelve el mismo cliente ya creado, sin reconectarse.
let supabase: SupabaseClient | null = null;

// Flag para saber si ya sembramos los productos base.
// Evita verificar la base de datos en cada request.
let seeded = false;

async function getSupabase(): Promise<SupabaseClient | null> {
  if (supabase) return supabase; // ya existe → reusar
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null; // sin credenciales → sin base de datos
  const { createClient } = await import('@supabase/supabase-js');
  supabase = createClient(url, key, { auth: { persistSession: false } });
  return supabase;
}

// ── mapRow: traduce una fila de la BD al tipo Producto del código ───────────
// La base de datos usa snake_case (imagen_url, is_base) pero el código usa
// camelCase (imagenUrl). Esta función hace la traducción.
// También convierte strings a números, maneja nulls, etc.
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

// ── ensureSeeded: siembra los productos base si la tabla está vacía ─────────
// "Sembrar" (seed) = insertar datos iniciales en la base de datos.
// Esta función es IDEMPOTENTE: si los datos ya están, no hace nada.
// Gracias a `upsert` (insert + update si existe), se puede llamar
// múltiples veces sin crear duplicados.
// El flag `seeded` evita hacer la consulta COUNT en cada request.
async function ensureSeeded(sb: SupabaseClient): Promise<void> {
  if (seeded) return; // ya se verificó antes → saltarse

  // Contar cuántos productos hay en la tabla
  // `head: true` hace que solo devuelva el conteo sin traer los datos
  const { count, error } = await sb
    .from('productos')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('[productosStore] Error verificando semilla:', error.message);
    return;
  }

  if (count !== null && count > 0) {
    seeded = true; // ya hay datos → no sembrar
    return;
  }

  // La tabla está vacía → insertar todos los productos base del archivo productos.ts
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
    is_base: true, // marcar como producto base (no se puede eliminar desde el admin)
  }));

  // upsert = "insert o update si ya existe" (idempotente)
  // onConflict: 'id' → si ya existe un producto con ese id, actualizar
  const { error: insertError } = await sb
    .from('productos')
    .upsert(rows, { onConflict: 'id' });

  if (insertError) {
    console.error('[productosStore] Error sembrando productos base:', insertError.message);
  }

  seeded = true;
}

// ── API pública ─────────────────────────────────────────────────────────────

export async function getAllProductos(): Promise<Producto[]> {
  const sb = await getSupabase();
  // Sin Supabase (desarrollo sin .env) → devolver los productos base del código
  if (!sb) return [...productosBase];

  await ensureSeeded(sb); // asegurar que existan datos antes de leer

  // Supabase devuelve { data, error }
  // data = array de filas si todo salió bien
  // error = objeto con mensaje si algo falló
  const { data, error } = await sb
    .from('productos')
    .select('*')
    .order('id', { ascending: true });

  if (error || !data) {
    console.error('[productosStore] Error obteniendo productos:', error?.message);
    return [...productosBase]; // fallback a datos del código si falla la BD
  }

  return data.map((row) => mapRow(row as Record<string, unknown>));
}

export async function bulkUpdate(
  list: Array<{ id: number; precio: number | null; stock: number }>,
): Promise<Producto[]> {
  const sb = await getSupabase();
  if (!sb) throw new Error('Supabase no configurado.');

  // Promise.all ejecuta todos los updates EN PARALELO, no uno por uno.
  // Si hubiera 50 productos, sin Promise.all tardaría 50 × tiempo_de_BD.
  // Con Promise.all, todos corren al mismo tiempo → mucho más rápido.
  await Promise.all(
    list.map((item) =>
      sb
        .from('productos')
        .update({ precio: item.precio, stock: item.stock })
        .eq('id', item.id),
    ),
  );

  // Devolver la lista actualizada desde la base de datos
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
      is_base: false, // es un producto extra agregado manualmente → se puede eliminar
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

  // Construir el objeto de actualización dinámicamente:
  // solo incluir los campos que realmente se quieren cambiar (no son null/undefined).
  // Así no sobreescribimos accidentalmente campos que no se modificaron.
  const updates: Record<string, unknown> = {};
  if (data.nombre !== undefined && data.nombre !== null) updates.nombre = data.nombre;
  if (data.descripcion !== undefined && data.descripcion !== null) updates.descripcion = data.descripcion;
  if (data.categoria !== undefined && data.categoria !== null) updates.categoria = data.categoria;
  if (data.etiqueta !== undefined && data.etiqueta !== null) updates.etiqueta = data.etiqueta;
  if (data.disponible !== undefined && data.disponible !== null) updates.disponible = data.disponible;

  if (Object.keys(updates).length === 0) return null; // nada que actualizar

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
    .update({ imagen_url: imagenUrl }) // null = quitar la imagen
    .eq('id', id)
    .select()
    .single();

  if (error || !updated) {
    console.error('[productosStore] Error actualizando imagen:', error?.message, { id, imagenUrl });
    return null;
  }
  return mapRow(updated as Record<string, unknown>);
}

export async function deleteProducto(id: number): Promise<Producto | null> {
  const sb = await getSupabase();
  if (!sb) throw new Error('Supabase no configurado.');

  // Primero verificar que el producto existe y que no es un producto base
  const { data: current, error: fetchError } = await sb
    .from('productos')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !current) return null;

  // Los productos base (is_base = true) no se pueden eliminar
  // para que el catálogo siempre tenga los productos originales
  if ((current as Record<string, unknown>).is_base) return null;

  const { error } = await sb.from('productos').delete().eq('id', id);
  if (error) throw new Error(error.message);

  return mapRow(current as Record<string, unknown>);
}

export async function decrementarStock(
  items: Array<{ id: number; cantidad: number }>,
): Promise<void> {
  const sb = await getSupabase();
  if (!sb) throw new Error('Supabase no configurado.');

  // No se puede decrementar directamente con SQL desde el cliente de Supabase
  // sin funciones de base de datos. El proceso es:
  // 1. Leer los stocks actuales de todos los productos del pedido
  // 2. Calcular el nuevo stock (actual - cantidad pedida, mínimo 0)
  // 3. Actualizar todos en paralelo
  const ids = items.map(i => i.id);
  const { data, error } = await sb.from('productos').select('id, stock').in('id', ids);
  if (error || !data) {
    console.error('[productosStore] Error obteniendo stock para decrementar:', error?.message);
    return;
  }

  // Convertir a Map para buscar stock por id en O(1) en vez de O(n)
  const stockMap = new Map(data.map(r => [Number(r.id), Number(r.stock)]));

  // Actualizar todos los stocks en paralelo
  await Promise.all(
    items.map(item => {
      const current = stockMap.get(item.id) ?? 0;
      const newStock = Math.max(0, current - item.cantidad); // nunca menor que 0
      return sb.from('productos').update({ stock: newStock }).eq('id', item.id);
    }),
  );
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
