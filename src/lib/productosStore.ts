import { productosBase, type Producto } from '@/data/productos';
import { getPool } from '@/lib/dbClient';

export type ProductoInfoUpdate = {
  nombre?: string | null;
  descripcion?: string | null;
  categoria?: Producto['categoria'] | null;
  etiqueta?: string | null;
  disponible?: boolean | null;
};

// Flag para saber si ya sembramos los productos base.
// Evita verificar la base de datos en cada request.
let seeded = false;

// ── mapRow: traduce una fila de la BD al tipo Producto del código ───────────
// La base de datos usa snake_case (imagen_url, is_base) pero el código usa
// camelCase (imagenUrl). Esta función hace la traducción.
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
async function ensureSeeded(): Promise<void> {
  if (seeded) return;

  const pool = getPool();
  const { rows } = await pool.query<{ count: string }>('SELECT COUNT(*)::int AS count FROM productos');
  const count = Number(rows[0]?.count ?? 0);

  if (count > 0) {
    seeded = true;
    return;
  }

  // La tabla está vacía → insertar todos los productos base
  const values = productosBase.map((p) => [
    p.id,
    p.nombre,
    p.descripcion,
    p.categoria,
    p.disponible,
    p.etiqueta,
    p.precio,
    p.stock,
    p.imagenUrl ?? null,
    true, // is_base
  ]);

  // Construir INSERT con múltiples filas usando ON CONFLICT DO NOTHING (idempotente)
  const placeholders = values
    .map(
      (_, i) =>
        `($${i * 10 + 1}, $${i * 10 + 2}, $${i * 10 + 3}, $${i * 10 + 4}, $${i * 10 + 5}, $${i * 10 + 6}, $${i * 10 + 7}, $${i * 10 + 8}, $${i * 10 + 9}, $${i * 10 + 10})`,
    )
    .join(', ');

  const flat = values.flat();

  try {
    await pool.query(
      `INSERT INTO productos (id, nombre, descripcion, categoria, disponible, etiqueta, precio, stock, imagen_url, is_base)
       VALUES ${placeholders}
       ON CONFLICT (id) DO NOTHING`,
      flat,
    );
  } catch (e) {
    console.error('[productosStore] Error sembrando productos base:', e);
  }

  seeded = true;
}

// ── API pública ─────────────────────────────────────────────────────────────

export async function getAllProductos(): Promise<Producto[]> {
  const pool = getPool();

  try {
    await ensureSeeded();
    const { rows } = await pool.query('SELECT * FROM productos ORDER BY id ASC');
    return rows.map((row) => mapRow(row as Record<string, unknown>));
  } catch (e) {
    console.error('[productosStore] Error obteniendo productos:', e);
    return [...productosBase];
  }
}

export async function bulkUpdate(
  list: Array<{ id: number; precio: number | null; stock: number }>,
): Promise<Producto[]> {
  const pool = getPool();

  await Promise.all(
    list.map((item) =>
      pool.query('UPDATE productos SET precio=$1, stock=$2 WHERE id=$3', [
        item.precio,
        item.stock,
        item.id,
      ]),
    ),
  );

  return getAllProductos();
}

export async function createProducto(data: Omit<Producto, 'id'>): Promise<Producto> {
  const pool = getPool();

  const { rows } = await pool.query(
    `INSERT INTO productos (nombre, descripcion, categoria, disponible, etiqueta, precio, stock, imagen_url, is_base)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)
     RETURNING *`,
    [
      data.nombre,
      data.descripcion,
      data.categoria,
      data.disponible,
      data.etiqueta,
      data.precio,
      data.stock,
      data.imagenUrl ?? null,
    ],
  );

  if (!rows[0]) throw new Error('Error creando producto.');
  return mapRow(rows[0] as Record<string, unknown>);
}

export async function updateProductoInfo(
  id: number,
  data: ProductoInfoUpdate,
): Promise<Producto | null> {
  const pool = getPool();

  // Construir SET dinámico solo con los campos que se quieren cambiar
  const sets: string[] = [];
  const params: unknown[] = [];

  if (data.nombre !== undefined && data.nombre !== null) {
    params.push(data.nombre);
    sets.push(`nombre=$${params.length}`);
  }
  if (data.descripcion !== undefined && data.descripcion !== null) {
    params.push(data.descripcion);
    sets.push(`descripcion=$${params.length}`);
  }
  if (data.categoria !== undefined && data.categoria !== null) {
    params.push(data.categoria);
    sets.push(`categoria=$${params.length}`);
  }
  if (data.etiqueta !== undefined && data.etiqueta !== null) {
    params.push(data.etiqueta);
    sets.push(`etiqueta=$${params.length}`);
  }
  if (data.disponible !== undefined && data.disponible !== null) {
    params.push(data.disponible);
    sets.push(`disponible=$${params.length}`);
  }

  if (sets.length === 0) return null;

  params.push(id);
  const { rows } = await pool.query(
    `UPDATE productos SET ${sets.join(', ')} WHERE id=$${params.length} RETURNING *`,
    params,
  );

  if (!rows[0]) return null;
  return mapRow(rows[0] as Record<string, unknown>);
}

export async function setProductoImagen(
  id: number,
  imagenUrl: string | null,
): Promise<Producto | null> {
  const pool = getPool();

  const { rows } = await pool.query(
    'UPDATE productos SET imagen_url=$1 WHERE id=$2 RETURNING *',
    [imagenUrl, id],
  );

  if (!rows[0]) {
    console.error('[productosStore] Error actualizando imagen para id:', id);
    return null;
  }
  return mapRow(rows[0] as Record<string, unknown>);
}

export async function deleteProducto(id: number): Promise<Producto | null> {
  const pool = getPool();

  // Verificar que existe y no es producto base
  const { rows: found } = await pool.query(
    'SELECT * FROM productos WHERE id=$1',
    [id],
  );

  if (!found[0]) return null;
  if ((found[0] as Record<string, unknown>).is_base) return null;

  await pool.query('DELETE FROM productos WHERE id=$1', [id]);
  return mapRow(found[0] as Record<string, unknown>);
}

export async function decrementarStock(
  items: Array<{ id: number; cantidad: number }>,
): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const ids = items.map((i) => i.id);
    const { rows } = await client.query<{ id: number; stock: number }>(
      'SELECT id, stock FROM productos WHERE id = ANY($1) FOR UPDATE',
      [ids],
    );

    const stockMap = new Map(rows.map((r) => [Number(r.id), Number(r.stock)]));

    await Promise.all(
      items.map((item) => {
        const current = stockMap.get(item.id) ?? 0;
        const newStock = Math.max(0, current - item.cantidad);
        return client.query('UPDATE productos SET stock=$1 WHERE id=$2', [newStock, item.id]);
      }),
    );

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('[productosStore] Error decrementando stock:', e);
  } finally {
    client.release();
  }
}

export async function updateProducto(
  id: number,
  data: Partial<Pick<Producto, 'precio' | 'stock'>>,
): Promise<Producto | null> {
  const pool = getPool();

  const sets: string[] = [];
  const params: unknown[] = [];

  if (data.precio !== undefined) {
    params.push(data.precio);
    sets.push(`precio=$${params.length}`);
  }
  if (data.stock !== undefined) {
    params.push(data.stock);
    sets.push(`stock=$${params.length}`);
  }

  if (sets.length === 0) return null;

  params.push(id);
  const { rows } = await pool.query(
    `UPDATE productos SET ${sets.join(', ')} WHERE id=$${params.length} RETURNING *`,
    params,
  );

  if (!rows[0]) return null;
  return mapRow(rows[0] as Record<string, unknown>);
}
