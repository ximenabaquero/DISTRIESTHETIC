/**
 * Data Factories para pruebas de producción
 * Genera datos imaginarios realistas para clientes, pedidos, contactos, etc.
 */

import type { Pedido, PedidoItem, PedidoEstado, PedidoMetodo, CreatePedidoData } from './pedidosStore';

// Re-exportar tipos para que sean accesibles desde este módulo
export type { Pedido, PedidoItem, PedidoEstado, PedidoMetodo, CreatePedidoData };

// ── Datos base para generar valores realistas ────────────────────────────────
const NOMBRES = [
  'Juan García', 'María López', 'Carlos Rodríguez', 'Ana Martínez', 'Pedro Sánchez',
  'Laura Fernández', 'Antonio Díaz', 'Isabel Moreno', 'Miguel Jiménez', 'Rosa Pérez',
  'Francisco Ruiz', 'Carmen Álvarez', 'Manuel Ramírez', 'Dolores Herrera', 'Diego Navarro',
  'Pilar Domínguez', 'Rafael Castro', 'Beatriz Romero', 'Sergio Molina', 'Verónica Cabrera',
];

const CIUDADES = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
  'Cúcuta', 'Bucaramanga', 'Santa Marta', 'Pereira', 'Manizales',
  'Armenia', 'Ibagué', 'Quibdó', 'Valledupar', 'Villavicencio',
];

const PRODUCTOS_COMUNES = [
  { nombre: 'Suero Fisiológico 500ml', precio: 8500 },
  { nombre: 'Gasas Estériles 10x10cm', precio: 12000 },
  { nombre: 'Algodón Quirúrgico 1kg', precio: 45000 },
  { nombre: 'Apósitos Adhesivos Surtidos', precio: 28000 },
  { nombre: 'Jeringas 10ml (caja de 100)', precio: 65000 },
  { nombre: 'Agujas Hipodérmicas 25G', precio: 35000 },
  { nombre: 'Guantes Quirúrgicos Talla M', precio: 42000 },
  { nombre: 'Mascarillas Quirúrgicas (50un)', precio: 25000 },
  { nombre: 'Esparadrapo Hipoalergénico', precio: 18000 },
  { nombre: 'Alcohol al 96% 500ml', precio: 15000 },
  { nombre: 'Betadine 120ml', precio: 22000 },
  { nombre: 'Vitamina C 1000mg (100 cápsulas)', precio: 38000 },
];

// ── Utilidades ────────────────────────────────────────────────────────────────
function random<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPhone(): string {
  // Formato colombiano: +57 3XX XXXXXXX
  return `+57 3${randomInt(0, 9)}${randomInt(100000000, 999999999)}`;
}

function randomAddress(): string {
  const calle = randomInt(1, 200);
  const numero = randomInt(1, 150);
  const apartado = randomInt(101, 999);
  return `Calle ${calle} #${numero}-${apartado}`;
}

function randomRef(type: 'mp' | 'wompi' | 'manual'): string {
  if (type === 'mp') return `MP-${Date.now()}-${randomInt(1000, 9999)}`;
  if (type === 'wompi') return `WP-${Date.now()}-${randomInt(1000, 9999)}`;
  return `MAN-${Date.now()}-${randomInt(1000, 9999)}`;
}

// ── Factories ──────────────────────────────────────────────────────────────────

/**
 * Genera un PedidoItem imaginario
 */
export function createPedidoItem(overrides?: Partial<PedidoItem>): PedidoItem {
  const producto = random(PRODUCTOS_COMUNES);
  return {
    id: randomInt(1, 9999),
    nombre: producto.nombre,
    precio: producto.precio,
    cantidad: randomInt(1, 5),
    ...overrides,
  };
}

/**
 * Genera múltiples PedidoItems
 */
export function createPedidoItems(count: number = randomInt(1, 4)): PedidoItem[] {
  return Array.from({ length: count }, () => createPedidoItem());
}

/**
 * Calcula el total de un array de items
 */
export function calculateTotal(items: PedidoItem[]): number {
  return items.reduce((sum, item) => sum + (item.precio || 0) * item.cantidad, 0);
}

/**
 * Genera datos para crear un Pedido
 */
export function createPedidoData(overrides?: Partial<CreatePedidoData>): CreatePedidoData {
  const items = createPedidoItems();
  const metodoPago: PedidoMetodo = overrides?.metodoPago || random(['whatsapp', 'mercadopago', 'wompi'] as const);
  
  return {
    items,
    total: calculateTotal(items),
    metodoPago,
    nombre: overrides?.nombre || random(NOMBRES),
    telefono: overrides?.telefono || randomPhone(),
    ciudad: overrides?.ciudad || random(CIUDADES),
    direccion: overrides?.direccion || randomAddress(),
    referencia: overrides?.referencia || randomRef(metodoPago === 'mercadopago' ? 'mp' : metodoPago === 'wompi' ? 'wompi' : 'manual'),
    notas: overrides?.notas || (Math.random() > 0.7 ? `Entregar después de las 6pm` : undefined),
    ...overrides,
  };
}

/**
 * Genera un Pedido completo (simulado, sin guardar en BD)
 */
export function createPedido(overrides?: Partial<Pedido>): Pedido {
  const data = createPedidoData();
  const ahora = new Date();
  const daysAgo = randomInt(0, 30);
  ahora.setDate(ahora.getDate() - daysAgo);
  
  const estados: PedidoEstado[] = ['sin_entregar', 'entregado', 'cancelado'];
  
  return {
    id: randomInt(1000, 9999999),
    createdAt: ahora.toISOString(),
    items: data.items,
    total: data.total,
    metodoPago: data.metodoPago,
    estado: overrides?.estado || random(estados),
    referencia: data.referencia ?? null,
    nombre: data.nombre ?? null,
    telefono: data.telefono ?? null,
    ciudad: data.ciudad ?? null,
    direccion: data.direccion ?? null,
    notas: data.notas ?? null,
    ...overrides,
  };
}

/**
 * Genera múltiples Pedidos
 */
export function createPedidos(count: number = 10, overrides?: Partial<Pedido>): Pedido[] {
  return Array.from({ length: count }, () => createPedido(overrides));
}

/**
 * Genera un contacto imaginario
 */
export interface ContactoData {
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  empresa?: string;
  mensaje: string;
  createdAt: string;
}

export function createContacto(overrides?: Partial<ContactoData>): ContactoData {
  const ahora = new Date();
  const daysAgo = randomInt(0, 15);
  ahora.setDate(ahora.getDate() - daysAgo);
  
  return {
    nombre: overrides?.nombre || random(NOMBRES),
    email: overrides?.email || `cliente${randomInt(1000, 9999)}@example.com`,
    telefono: overrides?.telefono || randomPhone(),
    ciudad: overrides?.ciudad || random(CIUDADES),
    empresa: overrides?.empresa || (Math.random() > 0.5 ? `Clínica ${random(CIUDADES)}` : undefined),
    mensaje: overrides?.mensaje || `Interesado en más información sobre productos médicos. ${Math.random() > 0.7 ? 'Necesito presupuesto.' : ''}`,
    createdAt: ahora.toISOString(),
    ...overrides,
  };
}

/**
 * Genera múltiples contactos
 */
export function createContactos(count: number = 10, overrides?: Partial<ContactoData>): ContactoData[] {
  return Array.from({ length: count }, () => createContacto(overrides));
}

/**
 * Genera un mensaje de contacto
 */
export interface MensajeData {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  ciudad?: string;
  createdAt: string;
  leido: boolean;
}

export function createMensaje(overrides?: Partial<MensajeData>): MensajeData {
  const ahora = new Date();
  const daysAgo = randomInt(0, 30);
  ahora.setDate(ahora.getDate() - daysAgo);
  
  return {
    id: randomInt(1000, 999999),
    nombre: overrides?.nombre || random(NOMBRES),
    email: overrides?.email || `usuario${randomInt(1000, 9999)}@example.com`,
    telefono: overrides?.telefono || randomPhone(),
    ciudad: overrides?.ciudad || random(CIUDADES),
    mensaje: overrides?.mensaje || `¿Cuál es el precio para pedidos al por mayor?`,
    createdAt: ahora.toISOString(),
    leido: overrides?.leido ?? Math.random() > 0.5,
    ...overrides,
  };
}

/**
 * Genera múltiples mensajes
 */
export function createMensajes(count: number = 10, overrides?: Partial<MensajeData>): MensajeData[] {
  return Array.from({ length: count }, () => createMensaje(overrides));
}

/**
 * Genera datos completos para pruebas (pedidos + contactos + mensajes)
 */
export interface TestDataBundle {
  pedidos: Pedido[];
  contactos: ContactoData[];
  mensajes: MensajeData[];
}

export function createTestDataBundle(counts?: { pedidos?: number; contactos?: number; mensajes?: number }): TestDataBundle {
  return {
    pedidos: createPedidos(counts?.pedidos || 15),
    contactos: createContactos(counts?.contactos || 12),
    mensajes: createMensajes(counts?.mensajes || 20),
  };
}

/**
 * Exporta datos como JSON (útil para copiar/pegar en BD)
 */
export function exportAsJson(data: unknown, prettify: boolean = true): string {
  return prettify ? JSON.stringify(data, null, 2) : JSON.stringify(data);
}
