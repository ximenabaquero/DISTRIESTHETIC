import { promises as fs } from 'fs';
import path from 'path';
import { productosBase, type Producto } from '@/data/productos';

// Supabase (modo híbrido). Usamos import dinámico para no romper build si no está instalado todavía.
import type { SupabaseClient } from '@supabase/supabase-js';

interface ProductoOverrideRow {
  id: number;
  precio: number | null;
  stock: number | null;
  imagen_url?: string | null;
}

interface ProductoOverride {
  id: number;
  precio?: number | null;
  stock?: number;
  imagenUrl?: string | null;
}

let supabase: SupabaseClient | null = null;
let supabaseSupportsImages: boolean | null = null;
async function getSupabase(): Promise<SupabaseClient | null> {
  if (supabase) return supabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // service role para operaciones de escritura seguras en el servidor.
  if (!url || !key) return null;
  const { createClient } = await import('@supabase/supabase-js');
  supabase = createClient(url, key, { auth: { persistSession: false } });
  return supabase;
}

const dataFile = path.join(process.cwd(), 'data', 'productos.json');

interface ProductosFile {
  version: number;
  productos: ProductoOverride[];
}

async function ensureFile(): Promise<void> {
  try {
    await fs.access(dataFile);
  } catch {
    const initial: ProductosFile = { version: 1, productos: [] };
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(initial, null, 2), 'utf8');
  }
}

async function readFile(): Promise<ProductosFile> {
  await ensureFile();
  const raw = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(raw) as ProductosFile;
}

function hasOwn<T extends object>(obj: T, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

// Merge base + overrides
function merge(base: Producto[], overrides: ProductoOverride[]): Producto[] {
  return base.map(b => {
    const o = overrides.find(p => p.id === b.id);
    if (!o) return b;
    return {
      ...b,
      precio: hasOwn(o, 'precio') ? (o.precio ?? null) : b.precio,
      stock: hasOwn(o, 'stock') ? (o.stock ?? 0) : b.stock,
      imagenUrl: hasOwn(o, 'imagenUrl') ? (o.imagenUrl ?? null) : b.imagenUrl,
    };
  });
}

export async function getAllProductos(): Promise<Producto[]> {
  let merged: Producto[] = [...productosBase];
  const sb = await getSupabase();
  if (sb) {
    const mergedFromSupabase = await fetchSupabaseOverrides(sb);
    if (mergedFromSupabase?.length) {
      const overrides: ProductoOverride[] = mergedFromSupabase.map((r: ProductoOverrideRow) => ({
        id: r.id,
        precio: r.precio === null ? null : Number(r.precio),
        stock: r.stock ?? 0,
        imagenUrl: supabaseSupportsImages === false ? null : r.imagen_url ?? null,
      }));
      merged = merge(merged, overrides);
    }
  }

  const file = await readFile();
  if (file.productos.length) {
    merged = merge(merged, file.productos);
  }

  return merged;
}

export async function updateProducto(id: number, data: Partial<Pick<Producto, 'precio' | 'stock'>>): Promise<Producto | null> {
  const sb = await getSupabase();
  if (sb) {
    const updatePayload: { id: number; precio?: number | null; stock?: number } = { id };
    if (data.precio !== undefined) updatePayload.precio = data.precio;
    if (data.stock !== undefined) updatePayload.stock = data.stock;
    const { error } = await sb.from('productos_overrides').upsert(updatePayload, { onConflict: 'id' });
    if (error) {
      console.error('Supabase updateProducto error:', error.message);
    } else {
      const all = await getAllProductos();
      return all.find(p => p.id === id) || null;
    }
  }
  // fallback archivo
  const file = await readFile();
  const existing = file.productos.find(p => p.id === id);
  if (existing) {
    if (data.precio !== undefined) existing.precio = data.precio;
    if (data.stock !== undefined) existing.stock = data.stock;
  } else {
    const newOverride: ProductoOverride = { id };
    if (data.precio !== undefined) newOverride.precio = data.precio;
    if (data.stock !== undefined) newOverride.stock = data.stock;
    file.productos.push(newOverride);
  }
  await fs.writeFile(dataFile, JSON.stringify(file, null, 2), 'utf8');
  const allProductos = await getAllProductos();
  return allProductos.find(p => p.id === id) || null;
}

export async function bulkUpdate(list: Array<{ id: number; precio: number | null; stock: number }>): Promise<Producto[]> {
  const sb = await getSupabase();
  if (sb) {
    const payload = list.map(i => ({ id: i.id, precio: i.precio, stock: i.stock }));
    const { error } = await sb.from('productos_overrides').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error('Supabase bulkUpdate error:', error.message);
    } else {
      return getAllProductos();
    }
  }
  const file = await readFile();
  for (const item of list) {
    const ex = file.productos.find(p => p.id === item.id);
    if (ex) {
      ex.precio = item.precio;
      ex.stock = item.stock;
    } else {
      file.productos.push({ id: item.id, precio: item.precio, stock: item.stock });
    }
  }
  await fs.writeFile(dataFile, JSON.stringify(file, null, 2), 'utf8');
  return getAllProductos();
}

export async function setProductoImagen(id: number, imagenUrl: string | null): Promise<Producto | null> {
  const sb = await getSupabase();
  if (sb && supabaseSupportsImages !== false) {
    const { error } = await sb
      .from('productos_overrides')
      .upsert({ id, imagen_url: imagenUrl }, { onConflict: 'id' });
    if (error) {
      if (error.message?.includes('imagen_url')) {
        supabaseSupportsImages = false;
      } else {
        console.error('Supabase setProductoImagen error:', error.message);
      }
    } else {
      const allProductos = await getAllProductos();
      return allProductos.find(p => p.id === id) || null;
    }
  }

  const file = await readFile();
  const existing = file.productos.find(p => p.id === id);
  if (existing) {
    existing.imagenUrl = imagenUrl ?? null;
  } else {
    file.productos.push({ id, imagenUrl: imagenUrl ?? null });
  }
  await fs.writeFile(dataFile, JSON.stringify(file, null, 2), 'utf8');
  const allProductos = await getAllProductos();
  return allProductos.find(p => p.id === id) || null;
}

async function fetchSupabaseOverrides(sb: SupabaseClient): Promise<ProductoOverrideRow[] | null> {
  let { data, error } = await sb.from('productos_overrides').select('id, precio, stock, imagen_url');
  if (error) {
    if (error.message?.includes('imagen_url')) {
      supabaseSupportsImages = false;
      ({ data, error } = await sb.from('productos_overrides').select('id, precio, stock'));
    }
  }

  if (error) {
    console.error('Supabase getAllProductos error:', error.message);
    return null;
  }

  if (supabaseSupportsImages === null) {
    supabaseSupportsImages = data?.some(row => Object.prototype.hasOwnProperty.call(row, 'imagen_url')) ?? false;
  }

  return data ?? null;
}