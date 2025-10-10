import { promises as fs } from 'fs';
import path from 'path';
import { productosBase, type Producto } from '@/data/productos';
import { deleteLocalProductImage } from './productImageStorage';

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
  nombre?: string;
  descripcion?: string;
  categoria?: Producto['categoria'];
  etiqueta?: string;
  disponible?: boolean;
}

type ProductoExtra = Producto;

export type ProductoInfoUpdate = {
  nombre?: string | null;
  descripcion?: string | null;
  categoria?: Producto['categoria'] | null;
  etiqueta?: string | null;
  disponible?: boolean | null;
};

interface ProductosFileV3 {
  version: 3;
  overrides: ProductoOverride[];
  extras: ProductoExtra[];
  lastId: number;
}

type ProductosFile = ProductosFileV3;

const baseMaxId = productosBase.reduce((max, p) => Math.max(max, p.id), 0);

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

function createEmptyFile(): ProductosFile {
  return {
    version: 3,
    overrides: [],
    extras: [],
    lastId: baseMaxId,
  };
}

async function ensureFile(): Promise<void> {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(createEmptyFile(), null, 2), 'utf8');
  }
}

function migrateFile(data: unknown): ProductosFile {
  if (!data || typeof data !== 'object') return createEmptyFile();
  const record = data as Record<string, unknown>;
  const version = Number(record.version ?? 1);

  if (version >= 3) {
    const overrides = Array.isArray(record.overrides) ? (record.overrides as ProductoOverride[]) : [];
    const extras = Array.isArray(record.extras) ? (record.extras as ProductoExtra[]) : [];
    const lastIdRaw = typeof record.lastId === 'number' ? record.lastId : baseMaxId;
    const lastExtraId = extras.reduce((max, p) => Math.max(max, p.id), baseMaxId);
    return {
      version: 3,
      overrides,
      extras,
      lastId: Math.max(lastIdRaw, lastExtraId, baseMaxId),
    };
  }

  if (version === 2) {
    const overrides = Array.isArray(record.overrides) ? (record.overrides as ProductoOverride[]) : [];
    const extras = Array.isArray(record.extras) ? (record.extras as ProductoExtra[]) : [];
    const lastIdRaw = typeof record.lastId === 'number' ? record.lastId : baseMaxId;
    const lastExtraId = extras.reduce((max, p) => Math.max(max, p.id), baseMaxId);
    return {
      version: 3,
      overrides,
      extras,
      lastId: Math.max(lastIdRaw, lastExtraId, baseMaxId),
    };
  }

  const legacyOverrides = Array.isArray((record as { productos?: ProductoOverride[] }).productos)
    ? ((record as { productos?: ProductoOverride[] }).productos ?? [])
    : [];

  return {
    version: 3,
    overrides: legacyOverrides,
    extras: [],
    lastId: baseMaxId,
  };
}

async function readFile(): Promise<ProductosFile> {
  await ensureFile();
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    const parsed = JSON.parse(raw);
    const migrated = migrateFile(parsed);
    if (migrated.version !== (parsed?.version ?? 1)) {
      await writeFile(migrated);
    }
    return migrated;
  } catch (error) {
    console.warn('[productosStore] Archivo inválido, recreando productos.json', error);
    const empty = createEmptyFile();
    await writeFile(empty);
    return empty;
  }
}

async function writeFile(data: ProductosFile): Promise<void> {
  await fs.writeFile(dataFile, JSON.stringify({ ...data, version: 3 }, null, 2), 'utf8');
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
      nombre: hasOwn(o, 'nombre') ? (o.nombre ?? b.nombre) : b.nombre,
      descripcion: hasOwn(o, 'descripcion') ? (o.descripcion ?? b.descripcion) : b.descripcion,
      categoria: hasOwn(o, 'categoria') ? (o.categoria ?? b.categoria) : b.categoria,
      etiqueta: hasOwn(o, 'etiqueta') ? (o.etiqueta ?? b.etiqueta) : b.etiqueta,
      disponible: hasOwn(o, 'disponible') ? (o.disponible ?? b.disponible) : b.disponible,
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
  if (file.overrides.length) {
    merged = merge(merged, file.overrides);
  }

  if (file.extras.length) {
    merged = [...merged, ...file.extras.map(extra => ({ ...extra }))];
  }

  return merged.sort((a, b) => a.id - b.id);
}

export async function updateProducto(id: number, data: Partial<Pick<Producto, 'precio' | 'stock'>>): Promise<Producto | null> {
  const sb = await getSupabase();
  const isBaseProduct = productosBase.some(p => p.id === id);
  if (sb && isBaseProduct) {
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
  if (isBaseProduct) {
    const existing = file.overrides.find(p => p.id === id);
    if (existing) {
      if (data.precio !== undefined) existing.precio = data.precio;
      if (data.stock !== undefined) existing.stock = data.stock;
    } else {
      const newOverride: ProductoOverride = { id };
      if (data.precio !== undefined) newOverride.precio = data.precio;
      if (data.stock !== undefined) newOverride.stock = data.stock;
      file.overrides.push(newOverride);
    }
  } else {
    const extra = file.extras.find(p => p.id === id);
    if (extra) {
      if (data.precio !== undefined) extra.precio = data.precio ?? null;
      if (data.stock !== undefined) extra.stock = data.stock ?? 0;
    }
  }
  await writeFile(file);
  const allProductos = await getAllProductos();
  return allProductos.find(p => p.id === id) || null;
}

export async function bulkUpdate(list: Array<{ id: number; precio: number | null; stock: number }>): Promise<Producto[]> {
  const sb = await getSupabase();
  const baseIds = new Set(productosBase.map(p => p.id));
  const payloadForSupabase = list.filter(item => baseIds.has(item.id));
  if (sb && payloadForSupabase.length) {
    const payload = payloadForSupabase.map(i => ({ id: i.id, precio: i.precio, stock: i.stock }));
    const { error } = await sb.from('productos_overrides').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error('Supabase bulkUpdate error:', error.message);
    }
  }

  const file = await readFile();
  for (const item of list) {
    if (baseIds.has(item.id)) {
      const ex = file.overrides.find(p => p.id === item.id);
      if (ex) {
        ex.precio = item.precio;
        ex.stock = item.stock;
      } else {
        file.overrides.push({ id: item.id, precio: item.precio, stock: item.stock });
      }
      continue;
    }
    const extra = file.extras.find(p => p.id === item.id);
    if (extra) {
      extra.precio = item.precio;
      extra.stock = item.stock;
    }
  }
  await writeFile(file);
  return getAllProductos();
}


export async function setProductoImagen(id: number, imagenUrl: string | null): Promise<Producto | null> {
  const sb = await getSupabase();
  const isBaseProduct = productosBase.some(p => p.id === id);
  if (sb && supabaseSupportsImages !== false && isBaseProduct) {
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
  if (isBaseProduct) {
    const existing = file.overrides.find(p => p.id === id);
    if (existing) {
      existing.imagenUrl = imagenUrl ?? null;
    } else {
      file.overrides.push({ id, imagenUrl: imagenUrl ?? null });
    }
  } else {
    const extra = file.extras.find(p => p.id === id);
    if (extra) {
      extra.imagenUrl = imagenUrl ?? null;
    }
  }
  await writeFile(file);
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

export async function createProducto(data: Omit<Producto, 'id'>): Promise<Producto> {
  const file = await readFile();
  const nextId = Math.max(
    file.lastId ?? baseMaxId,
    ...file.extras.map(p => p.id),
    baseMaxId,
  ) + 1;

  const nuevoProducto: Producto = {
    ...data,
    id: nextId,
  };

  file.extras.push(nuevoProducto);
  file.lastId = nextId;
  await writeFile(file);

  return nuevoProducto;
}

export async function updateProductoInfo(id: number, data: ProductoInfoUpdate): Promise<Producto | null> {
  const file = await readFile();
  const isBaseProduct = productosBase.some(p => p.id === id);

  if (isBaseProduct) {
    let existing = file.overrides.find(p => p.id === id);
    if (!existing) {
      existing = { id };
      file.overrides.push(existing);
    }

    if (data.nombre !== undefined) {
      if (data.nombre === null) {
        delete existing.nombre;
      } else {
        existing.nombre = data.nombre;
      }
    }
    if (data.descripcion !== undefined) {
      if (data.descripcion === null) {
        delete existing.descripcion;
      } else {
        existing.descripcion = data.descripcion;
      }
    }
    if (data.categoria !== undefined) {
      if (data.categoria === null) {
        delete existing.categoria;
      } else {
        existing.categoria = data.categoria;
      }
    }
    if (data.etiqueta !== undefined) {
      if (data.etiqueta === null) {
        delete existing.etiqueta;
      } else {
        existing.etiqueta = data.etiqueta;
      }
    }
    if (data.disponible !== undefined) {
      if (data.disponible === null) {
        delete existing.disponible;
      } else {
        existing.disponible = data.disponible;
      }
    }
  } else {
    const extra = file.extras.find(p => p.id === id);
    if (!extra) return null;
    if (data.nombre !== undefined && data.nombre !== null) {
      extra.nombre = data.nombre;
    }
    if (data.descripcion !== undefined && data.descripcion !== null) {
      extra.descripcion = data.descripcion;
    }
    if (data.categoria !== undefined && data.categoria !== null) {
      extra.categoria = data.categoria;
    }
    if (data.etiqueta !== undefined && data.etiqueta !== null) {
      extra.etiqueta = data.etiqueta;
    }
    if (data.disponible !== undefined && data.disponible !== null) {
      extra.disponible = data.disponible;
    }
  }

  await writeFile(file);
  const allProductos = await getAllProductos();
  return allProductos.find(p => p.id === id) || null;
}

export async function deleteProducto(id: number): Promise<Producto | null> {
  const file = await readFile();
  const index = file.extras.findIndex(p => p.id === id);
  if (index === -1) {
    return null;
  }
  const [removed] = file.extras.splice(index, 1);
  await writeFile(file);
  if (removed?.imagenUrl) {
    await deleteLocalProductImage(removed.imagenUrl);
  }
  return removed;
}