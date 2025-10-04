import { promises as fs } from 'fs';
import path from 'path';
import { productosBase, type Producto } from '@/data/productos';

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
  const file = await readFile();
  return merge(productosBase, file.productos);
}

export async function updateProducto(id: number, data: Partial<Pick<Producto, 'precio' | 'stock'>>): Promise<Producto | null> {
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