import { promises as fs } from 'fs';
import path from 'path';
import { productosBase, type Producto } from '@/data/productos';

// Supabase (modo híbrido). Usamos import dinámico para no romper build si no está instalado todavía.
import type { SupabaseClient } from '@supabase/supabase-js';

interface ProductoOverrideRow { id: number; precio: number | null; stock: number | null }

let supabase: SupabaseClient | null = null;
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
  productos: Producto[];
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

// Merge base + overrides
function merge(base: Producto[], overrides: Producto[]): Producto[] {
  return base.map(b => {
    const o = overrides.find(p => p.id === b.id);
    return o ? { ...b, precio: o.precio, stock: o.stock } : b;
  });
}

export async function getAllProductos(): Promise<Producto[]> {
  const sb = await getSupabase();
  if (sb) {
    const { data, error } = await sb.from('productos_overrides').select('id, precio, stock');
    if (error) {
      console.error('Supabase getAllProductos error:', error.message);
    }
    if (data) {
      const overrides: Producto[] = data.map((r: ProductoOverrideRow) => ({
        id: r.id,
        nombre: '', // se rellenará desde base en merge
        descripcion: '',
        categoria: '',
        disponible: true,
        etiqueta: '',
        precio: r.precio === null ? null : Number(r.precio),
        stock: r.stock ?? 0,
      }));
      // Merge manual: buscamos en productosBase por id
      const merged = productosBase.map(b => {
        const o = overrides.find(x => x.id === b.id);
        return o ? { ...b, precio: o.precio, stock: o.stock } : b;
      });
      return merged;
    }
  }
  // fallback archivo
  const file = await readFile();
  return merge(productosBase, file.productos);
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
    const base = productosBase.find(p => p.id === id);
    if (!base) return null;
    file.productos.push({ ...base, precio: data.precio ?? null, stock: data.stock ?? 0 });
  }
  await fs.writeFile(dataFile, JSON.stringify(file, null, 2), 'utf8');
  const merged = merge(productosBase, file.productos);
  return merged.find(p => p.id === id) || null;
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
      const base = productosBase.find(p => p.id === item.id);
      if (base) {
        file.productos.push({ ...base, precio: item.precio, stock: item.stock });
      }
    }
  }
  await fs.writeFile(dataFile, JSON.stringify(file, null, 2), 'utf8');
  return merge(productosBase, file.productos);
}