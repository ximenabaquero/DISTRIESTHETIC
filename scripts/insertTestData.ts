/**
 * Inserta 100 pedidos de prueba en Supabase
 * Lee credenciales de .env.local
 *
 * Uso: npx ts-node --project tsconfig.scripts.json scripts/insertTestData.ts
 * Para borrar los datos insertados: npx ts-node --project tsconfig.scripts.json scripts/insertTestData.ts --clean
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

// Cargar .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

import { createClient } from '@supabase/supabase-js';
import {
  createPedidoItems,
  calculateTotal,
  randomDateInRange,
  weightedRandom,
} from '../src/lib/factories';

// ── Datos base ────────────────────────────────────────────────────────────────
const NOMBRES = [
  'Valentina Torres', 'Sebastián Vargas', 'Juliana Ríos', 'Andrés Morales', 'Camila Ospina',
  'Santiago Gómez', 'Daniela Restrepo', 'Felipe Cardona', 'Natalia Zapata', 'Alejandro Cano',
  'Luisa Palacios', 'Nicolás Arbeláez', 'Paola Salazar', 'Cristian Muñoz', 'Adriana Castaño',
  'Jhon Quintero', 'Melissa Agudelo', 'David Londoño', 'Marcela Giraldo', 'Esteban Velásquez',
  'Carolina Montes', 'Mauricio Peñaloza', 'Angélica Bernal', 'Iván Rincón', 'Tatiana Suárez',
  'Juan García', 'María López', 'Carlos Rodríguez', 'Ana Martínez', 'Pedro Sánchez',
  'Laura Fernández', 'Antonio Díaz', 'Isabel Moreno', 'Miguel Jiménez', 'Rosa Pérez',
];

const CIUDADES = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
  'Cúcuta', 'Bucaramanga', 'Santa Marta', 'Pereira', 'Manizales',
  'Armenia', 'Ibagué', 'Valledupar', 'Villavicencio', 'Pasto',
];

const FECHA_INICIO = new Date('2025-11-01T00:00:00Z');
const FECHA_FIN = new Date('2026-05-02T23:59:59Z');
const TOTAL_PEDIDOS = 100;
const TEST_TAG = 'TEST_DATA_2026'; // Marca en notas para identificar y poder borrar

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

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no encontrados en .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  // Modo limpieza: borra los datos de prueba
  if (process.argv.includes('--clean')) {
    console.log('🧹 Borrando pedidos de prueba...');
    const { error, count } = await supabase
      .from('pedidos')
      .delete({ count: 'exact' })
      .like('notas', `%${TEST_TAG}%`);

    if (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
    console.log(`✓ ${count} pedidos de prueba eliminados`);
    return;
  }

  console.log(`Insertando ${TOTAL_PEDIDOS} pedidos de prueba en Supabase...\n`);

  let insertados = 0;
  let errores = 0;

  for (let i = 0; i < TOTAL_PEDIDOS; i++) {
    const fecha = randomDateInRange(FECHA_INICIO, FECHA_FIN);
    const estado = weightedRandom(
      ['sin_entregar', 'entregado', 'cancelado'],
      [25, 55, 20]
    );
    const metodoPago = weightedRandom(
      ['whatsapp', 'mercadopago'],
      [65, 35]
    );
    const items = createPedidoItems(randomInt(1, 4));
    const total = calculateTotal(items);
    const nombre = random(NOMBRES);
    const prefijo = metodoPago === 'mercadopago' ? 'MP' : 'WA';
    const referencia = `${prefijo}-TEST-${Date.now()}-${randomInt(100, 999)}`;
    const notas = Math.random() > 0.6
      ? `Entregar en horario de oficina [${TEST_TAG}]`
      : `[${TEST_TAG}]`;

    const { error } = await supabase.from('pedidos').insert({
      created_at: fecha,
      items,
      total,
      metodo_pago: metodoPago,
      estado,
      referencia,
      nombre,
      telefono: randomPhone(),
      ciudad: random(CIUDADES),
      direccion: randomAddress(),
      notas,
    });

    if (error) {
      console.error(`  ❌ Pedido ${i + 1}: ${error.message}`);
      errores++;
    } else {
      insertados++;
      if (insertados % 10 === 0) {
        process.stdout.write(`  ${insertados}/${TOTAL_PEDIDOS} insertados...\r`);
      }
    }
  }

  console.log(`\n✓ ${insertados} pedidos insertados correctamente`);
  if (errores > 0) console.log(`⚠ ${errores} errores`);
  console.log('\nEl panel ahora mostrará los datos.');
  console.log(`Para limpiar después: npx ts-node --project tsconfig.scripts.json scripts/insertTestData.ts --clean\n`);
}

main().catch(err => {
  console.error('❌ Error inesperado:', err);
  process.exit(1);
});
