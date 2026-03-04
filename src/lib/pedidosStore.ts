import type { SupabaseClient } from '@supabase/supabase-js';

export type PedidoItem = {
  id: number;
  nombre: string;
  precio: number | null;
  cantidad: number;
};

export type PedidoEstado = 'pendiente' | 'pagado' | 'cancelado';
export type PedidoMetodo = 'whatsapp' | 'wompi';

export interface Pedido {
  id: number;
  createdAt: string;
  items: PedidoItem[];
  total: number;
  metodoPago: PedidoMetodo;
  estado: PedidoEstado;
  referencia: string | null;
}

export interface CreatePedidoData {
  items: PedidoItem[];
  total: number;
  metodoPago: PedidoMetodo;
  referencia?: string;
}

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

function mapRow(row: Record<string, unknown>): Pedido {
  return {
    id: Number(row.id),
    createdAt: String(row.created_at),
    items: (row.items as PedidoItem[]) ?? [],
    total: Number(row.total),
    metodoPago: String(row.metodo_pago) as PedidoMetodo,
    estado: String(row.estado) as PedidoEstado,
    referencia: typeof row.referencia === 'string' ? row.referencia : null,
  };
}

export async function createPedido(data: CreatePedidoData): Promise<Pedido> {
  const sb = await getSupabase();

  const { data: inserted, error } = await sb
    .from('pedidos')
    .insert({
      items: data.items,
      total: data.total,
      metodo_pago: data.metodoPago,
      referencia: data.referencia ?? null,
      estado: 'pendiente',
    })
    .select()
    .single();

  if (error || !inserted) {
    throw new Error(error?.message || 'Error creando pedido.');
  }

  return mapRow(inserted as Record<string, unknown>);
}

export async function getAllPedidos(): Promise<Pedido[]> {
  const sb = await getSupabase();

  const { data, error } = await sb
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('[pedidosStore] Error obteniendo pedidos:', error?.message);
    return [];
  }

  return data.map((row) => mapRow(row as Record<string, unknown>));
}

export async function getPedidoById(id: number): Promise<Pedido | null> {
  const sb = await getSupabase();

  const { data, error } = await sb
    .from('pedidos')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return mapRow(data as Record<string, unknown>);
}

export async function updatePedidoEstado(id: number, estado: PedidoEstado): Promise<Pedido | null> {
  const sb = await getSupabase();

  const { data: updated, error } = await sb
    .from('pedidos')
    .update({ estado })
    .eq('id', id)
    .select()
    .single();

  if (error || !updated) {
    console.error('[pedidosStore] Error actualizando estado:', error?.message);
    return null;
  }

  return mapRow(updated as Record<string, unknown>);
}
