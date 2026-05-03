/**
 * Genera datos falsos de clientes/pedidos para análisis en Power BI
 * Exporta 3 archivos CSV a data/export/
 *
 * Uso: npx ts-node scripts/generatePowerBIData.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  createPedidoItems,
  calculateTotal,
  randomDateInRange,
  weightedRandom,
  randomEmail,
} from '../src/lib/factories';
import type { Pedido, PedidoItem } from '../src/lib/factories';

// ── Configuración ─────────────────────────────────────────────────────────────
const TOTAL_PEDIDOS = 100;
const TOTAL_CONTACTOS = 60;
const FECHA_INICIO = new Date('2025-11-01T00:00:00Z');
const FECHA_FIN = new Date('2026-05-02T23:59:59Z');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'export');

// ── Datos base ────────────────────────────────────────────────────────────────
const NOMBRES = [
  'Valentina Torres', 'Sebastián Vargas', 'Juliana Ríos', 'Andrés Morales', 'Camila Ospina',
  'Santiago Gómez', 'Daniela Restrepo', 'Felipe Cardona', 'Natalia Zapata', 'Alejandro Cano',
  'Luisa Palacios', 'Nicolás Arbeláez', 'Paola Salazar', 'Cristian Muñoz', 'Adriana Castaño',
  'Jhon Quintero', 'Melissa Agudelo', 'David Londoño', 'Marcela Giraldo', 'Esteban Velásquez',
  'Carolina Montes', 'Mauricio Peñaloza', 'Angélica Bernal', 'Iván Rincón', 'Tatiana Suárez',
  'Juan García', 'María López', 'Carlos Rodríguez', 'Ana Martínez', 'Pedro Sánchez',
  'Laura Fernández', 'Antonio Díaz', 'Isabel Moreno', 'Miguel Jiménez', 'Rosa Pérez',
  'Francisco Ruiz', 'Carmen Álvarez', 'Manuel Ramírez', 'Dolores Herrera', 'Diego Navarro',
];

const CIUDADES = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
  'Cúcuta', 'Bucaramanga', 'Santa Marta', 'Pereira', 'Manizales',
  'Armenia', 'Ibagué', 'Valledupar', 'Villavicencio', 'Pasto',
];

const EMPRESAS = [
  'Clínica Estética Bella', 'Centro Médico Salud Total', 'SPA Revive', 'Estética Avanzada',
  'Clínica del Cuerpo', 'Medicina Estética Plus', 'Centro de Belleza Moderna', 'Derma & Spa',
  'Instituto Médico Estético', 'Bienestar y Salud', 'Clínica Juvenil', 'Centro Estético Premium',
];

// ── Helpers locales ────────────────────────────────────────────────────────────
function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPhone(): string {
  return `+57 3${randomInt(0, 9)}${randomInt(10, 99)} ${randomInt(100, 999)} ${randomInt(1000, 9999)}`;
}

function randomAddress(): string {
  return `Calle ${randomInt(1, 200)} #${randomInt(1, 150)}-${randomInt(10, 99)}`;
}

/** Escapa un campo para CSV (añade comillas si contiene coma, comilla o salto de línea) */
function csvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsvRow(fields: (string | number | null | undefined)[]): string {
  return fields.map(csvField).join(',');
}

// ── Interfaces ─────────────────────────────────────────────────────────────────
interface PedidoCSV {
  id: number;
  fecha: string;
  mes: string;
  cliente: string;
  ciudad: string;
  telefono: string;
  direccion: string;
  estado: string;
  metodo_pago: string;
  num_items: number;
  total: number;
  referencia: string;
  notas: string;
}

interface PedidoItemCSV {
  pedido_id: number;
  fecha_pedido: string;
  producto: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
}

interface ContactoCSV {
  id: number;
  fecha: string;
  mes: string;
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  empresa: string;
  tipo_consulta: string;
}

// ── Generadores ────────────────────────────────────────────────────────────────
function generatePedidos(): { pedidos: PedidoCSV[]; items: PedidoItemCSV[] } {
  const pedidosCSV: PedidoCSV[] = [];
  const itemsCSV: PedidoItemCSV[] = [];

  for (let i = 1; i <= TOTAL_PEDIDOS; i++) {
    const fecha = randomDateInRange(FECHA_INICIO, FECHA_FIN);
    const fechaDate = new Date(fecha);
    const mes = `${fechaDate.getFullYear()}-${String(fechaDate.getMonth() + 1).padStart(2, '0')}`;

    const estado = weightedRandom(
      ['entregado', 'sin_entregar', 'cancelado'],
      [55, 25, 20]
    );
    const metodoPago = weightedRandom(
      ['whatsapp', 'mercadopago'],
      [65, 35]
    );
    const nombre = random(NOMBRES);
    const ciudad = random(CIUDADES);

    const pedidoItems = createPedidoItems(randomInt(1, 4));
    const total = calculateTotal(pedidoItems);
    const prefijo = metodoPago === 'mercadopago' ? 'MP' : 'WA';
    const referencia = `${prefijo}-${fechaDate.getFullYear()}${String(fechaDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(4, '0')}`;

    pedidosCSV.push({
      id: i,
      fecha: fechaDate.toISOString().replace('T', ' ').substring(0, 19),
      mes,
      cliente: nombre,
      ciudad,
      telefono: randomPhone(),
      direccion: randomAddress(),
      estado,
      metodo_pago: metodoPago,
      num_items: pedidoItems.reduce((s, it) => s + it.cantidad, 0),
      total,
      referencia,
      notas: Math.random() > 0.75 ? 'Entregar en horario de oficina' : '',
    });

    for (const item of pedidoItems) {
      itemsCSV.push({
        pedido_id: i,
        fecha_pedido: fechaDate.toISOString().replace('T', ' ').substring(0, 19),
        producto: item.nombre,
        precio_unitario: item.precio ?? 0,
        cantidad: item.cantidad,
        subtotal: (item.precio ?? 0) * item.cantidad,
      });
    }
  }

  return { pedidos: pedidosCSV, items: itemsCSV };
}

function generateContactos(): ContactoCSV[] {
  const CONSULTAS = [
    'Consulta de precios', 'Pedido al por mayor', 'Información de productos',
    'Soporte técnico', 'Cotización empresarial', 'Disponibilidad de stock',
  ];

  return Array.from({ length: TOTAL_CONTACTOS }, (_, i) => {
    const nombre = random(NOMBRES);
    const fecha = randomDateInRange(FECHA_INICIO, FECHA_FIN);
    const fechaDate = new Date(fecha);
    const mes = `${fechaDate.getFullYear()}-${String(fechaDate.getMonth() + 1).padStart(2, '0')}`;

    return {
      id: i + 1,
      fecha: fechaDate.toISOString().replace('T', ' ').substring(0, 19),
      mes,
      nombre,
      email: randomEmail(nombre),
      telefono: randomPhone(),
      ciudad: random(CIUDADES),
      empresa: Math.random() > 0.4 ? random(EMPRESAS) : '',
      tipo_consulta: random(CONSULTAS),
    };
  });
}

// ── Serialización CSV ──────────────────────────────────────────────────────────
function pedidosToCSV(pedidos: PedidoCSV[]): string {
  const header = 'id,fecha,mes,cliente,ciudad,telefono,direccion,estado,metodo_pago,num_items,total,referencia,notas';
  const rows = pedidos.map(p =>
    toCsvRow([p.id, p.fecha, p.mes, p.cliente, p.ciudad, p.telefono, p.direccion, p.estado, p.metodo_pago, p.num_items, p.total, p.referencia, p.notas])
  );
  return [header, ...rows].join('\n');
}

function itemsToCSV(items: PedidoItemCSV[]): string {
  const header = 'pedido_id,fecha_pedido,producto,precio_unitario,cantidad,subtotal';
  const rows = items.map(it =>
    toCsvRow([it.pedido_id, it.fecha_pedido, it.producto, it.precio_unitario, it.cantidad, it.subtotal])
  );
  return [header, ...rows].join('\n');
}

function contactosToCSV(contactos: ContactoCSV[]): string {
  const header = 'id,fecha,mes,nombre,email,telefono,ciudad,empresa,tipo_consulta';
  const rows = contactos.map(c =>
    toCsvRow([c.id, c.fecha, c.mes, c.nombre, c.email, c.telefono, c.ciudad, c.empresa, c.tipo_consulta])
  );
  return [header, ...rows].join('\n');
}

// ── Resumen en consola ─────────────────────────────────────────────────────────
function printSummary(pedidos: PedidoCSV[], items: PedidoItemCSV[], contactos: ContactoCSV[]) {
  const totalVentas = pedidos
    .filter(p => p.estado === 'entregado')
    .reduce((s, p) => s + p.total, 0);

  const porEstado = pedidos.reduce<Record<string, number>>((acc, p) => {
    acc[p.estado] = (acc[p.estado] || 0) + 1;
    return acc;
  }, {});

  const porMetodo = pedidos.reduce<Record<string, number>>((acc, p) => {
    acc[p.metodo_pago] = (acc[p.metodo_pago] || 0) + 1;
    return acc;
  }, {});

  const porMes = pedidos.reduce<Record<string, number>>((acc, p) => {
    acc[p.mes] = (acc[p.mes] || 0) + 1;
    return acc;
  }, {});

  const ciudadTop = pedidos.reduce<Record<string, number>>((acc, p) => {
    acc[p.ciudad] = (acc[p.ciudad] || 0) + 1;
    return acc;
  }, {});
  const topCiudades = Object.entries(ciudadTop)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  console.log('\n══════════════════════════════════════════');
  console.log('  RESUMEN DE DATOS GENERADOS PARA POWER BI');
  console.log('══════════════════════════════════════════');
  console.log(`  Pedidos:      ${pedidos.length}`);
  console.log(`  Ítems:        ${items.length}`);
  console.log(`  Contactos:    ${contactos.length}`);
  console.log(`  Ventas (entregadas): $${totalVentas.toLocaleString('es-CO')} COP`);
  console.log('\n  Por estado:');
  Object.entries(porEstado).sort((a,b) => b[1]-a[1]).forEach(([k, v]) => console.log(`    ${k}: ${v}`));
  console.log('\n  Por método de pago:');
  Object.entries(porMetodo).sort((a,b) => b[1]-a[1]).forEach(([k, v]) => console.log(`    ${k}: ${v}`));
  console.log('\n  Por mes:');
  Object.entries(porMes).sort().forEach(([k, v]) => console.log(`    ${k}: ${v} pedidos`));
  console.log('\n  Top 5 ciudades:');
  topCiudades.forEach(([c, n]) => console.log(`    ${c}: ${n}`));
  console.log('══════════════════════════════════════════\n');
}

// ── Main ───────────────────────────────────────────────────────────────────────
function main() {
  console.log('Generando datos falsos para Power BI...\n');

  // Crear directorio de salida
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generar datos
  const { pedidos, items } = generatePedidos();
  const contactos = generateContactos();

  // Escribir CSVs con BOM UTF-8 para que Excel/Power BI detecte tildes correctamente
  const BOM = '\uFEFF';
  const pedidosPath = path.join(OUTPUT_DIR, 'pedidos.csv');
  const itemsPath = path.join(OUTPUT_DIR, 'pedido_items.csv');
  const contactosPath = path.join(OUTPUT_DIR, 'contactos.csv');

  fs.writeFileSync(pedidosPath, BOM + pedidosToCSV(pedidos), 'utf8');
  fs.writeFileSync(itemsPath, BOM + itemsToCSV(items), 'utf8');
  fs.writeFileSync(contactosPath, BOM + contactosToCSV(contactos), 'utf8');

  console.log(`✓ data/export/pedidos.csv      (${pedidos.length} filas)`);
  console.log(`✓ data/export/pedido_items.csv (${items.length} filas)`);
  console.log(`✓ data/export/contactos.csv    (${contactos.length} filas)`);

  printSummary(pedidos, items, contactos);

  console.log('Cómo importar en Power BI:');
  console.log('  1. Inicio > Obtener datos > Texto/CSV');
  console.log('  2. Importa los 3 archivos de data/export/');
  console.log('  3. En Modelo: relaciona pedidos[id] ↔ pedido_items[pedido_id]');
  console.log('  4. Usa la columna "mes" para slicers temporales\n');
}

main();
