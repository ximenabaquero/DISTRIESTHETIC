import { getPool } from '@/lib/dbClient';

export type PedidoItem = {
  id: number;
  nombre: string;
  precio: number | null;
  cantidad: number;
};

export type PedidoEstado = 'sin_entregar' | 'entregado' | 'cancelado';
export type PedidoMetodo = 'whatsapp' | 'mercadopago' | 'wompi';

export interface Pedido {
  id: number;
  createdAt: string;
  items: PedidoItem[];
  total: number;
  metodoPago: PedidoMetodo;
  estado: PedidoEstado;
  referencia: string | null;
  nombre: string | null;
  telefono: string | null;
  ciudad: string | null;
  direccion: string | null;
  notas: string | null;
}

export interface CreatePedidoData {
  items: PedidoItem[];
  total: number;
  metodoPago: PedidoMetodo;
  referencia?: string;
  nombre?: string;
  telefono?: string;
  ciudad?: string;
  direccion?: string;
  notas?: string;
}

// ── mapRow: convierte una fila de la base de datos al formato del código ────
// La BD usa snake_case (created_at, metodo_pago); el código usa camelCase.
// Los campos JSONB (items) vienen ya parseados por el driver pg.
function mapRow(row: Record<string, unknown>): Pedido {
  return {
    id: Number(row.id),
    createdAt: String(row.created_at),
    items: (row.items as PedidoItem[]) ?? [],
    total: Number(row.total),
    metodoPago: String(row.metodo_pago) as PedidoMetodo,
    estado: String(row.estado) as PedidoEstado,
    referencia: typeof row.referencia === 'string' ? row.referencia : null,
    nombre: typeof row.nombre === 'string' ? row.nombre : null,
    telefono: typeof row.telefono === 'string' ? row.telefono : null,
    ciudad: typeof row.ciudad === 'string' ? row.ciudad : null,
    direccion: typeof row.direccion === 'string' ? row.direccion : null,
    notas: typeof row.notas === 'string' ? row.notas : null,
  };
}

export async function createPedido(data: CreatePedidoData): Promise<Pedido> {
  const pool = getPool();

  const { rows } = await pool.query(
    `INSERT INTO pedidos
       (items, total, metodo_pago, referencia, estado, nombre, telefono, ciudad, direccion, notas)
     VALUES ($1, $2, $3, $4, 'sin_entregar', $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      JSON.stringify(data.items),
      data.total,
      data.metodoPago,
      data.referencia ?? null,
      data.nombre ?? null,
      data.telefono ?? null,
      data.ciudad ?? null,
      data.direccion ?? null,
      data.notas ?? null,
    ],
  );

  if (!rows[0]) throw new Error('Error creando pedido.');
  return mapRow(rows[0] as Record<string, unknown>);
}

export async function getAllPedidos(): Promise<Pedido[]> {
  const pool = getPool();

  const { rows } = await pool.query(
    'SELECT * FROM pedidos ORDER BY created_at DESC',
  );

  return rows.map((row) => mapRow(row as Record<string, unknown>));
}

export async function getPedidoById(id: number): Promise<Pedido | null> {
  const pool = getPool();

  const { rows } = await pool.query(
    'SELECT * FROM pedidos WHERE id=$1',
    [id],
  );

  if (!rows[0]) return null;
  return mapRow(rows[0] as Record<string, unknown>);
}

export async function getPedidoByReferencia(referencia: string): Promise<Pedido | null> {
  const pool = getPool();

  const { rows } = await pool.query(
    'SELECT * FROM pedidos WHERE referencia=$1',
    [referencia],
  );

  if (!rows[0]) return null;
  return mapRow(rows[0] as Record<string, unknown>);
}

export async function updatePedidoEstado(id: number, estado: PedidoEstado): Promise<Pedido | null> {
  const pool = getPool();

  const { rows } = await pool.query(
    'UPDATE pedidos SET estado=$1 WHERE id=$2 RETURNING *',
    [estado, id],
  );

  if (!rows[0]) {
    console.error('[pedidosStore] Error actualizando estado para id:', id);
    return null;
  }

  return mapRow(rows[0] as Record<string, unknown>);
}

export async function updatePedidoEstadoByReferencia(
  referencia: string,
  estado: PedidoEstado,
): Promise<Pedido | null> {
  const pool = getPool();

  const { rows } = await pool.query(
    'UPDATE pedidos SET estado=$1 WHERE referencia=$2 RETURNING *',
    [estado, referencia],
  );

  if (!rows[0]) {
    console.error('[pedidosStore] Error actualizando estado por referencia:', referencia);
    return null;
  }

  return mapRow(rows[0] as Record<string, unknown>);
}
