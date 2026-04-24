/**
 * Script para generar e insertar datos de prueba en Supabase
 * Uso: npx ts-node scripts/generateTestData.ts [cantidad de pedidos]
 * 
 * Ejemplo:
 *   npx ts-node scripts/generateTestData.ts
 *   npx ts-node scripts/generateTestData.ts 20
 */

import { createClient } from '@supabase/supabase-js';
import {
  createPedidos,
  createMensajes,
  exportAsJson,
  type Pedido,
  type MensajeData,
} from '../src/lib/factories';

async function main() {
  // Obtener cantidad del argumento de línea de comandos
  const countArg = process.argv[2];
  const pedidosCount = countArg ? parseInt(countArg, 10) : 15;

  if (isNaN(pedidosCount) || pedidosCount <= 0) {
    console.error('❌ Proporciona un número válido: npx ts-node scripts/generateTestData.ts 20');
    process.exit(1);
  }

  console.log(`📊 Generando ${pedidosCount} pedidos de prueba...`);

  // Inicializar cliente Supabase
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configurados');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  try {
    // ── Generar datos ────
    const pedidos = createPedidos(pedidosCount);
    const mensajes = createMensajes(Math.floor(pedidosCount * 0.8));

    console.log(`✅ Generados ${pedidos.length} pedidos`);
    console.log(`✅ Generados ${mensajes.length} mensajes`);

    // ── Insertar pedidos ────
    console.log('\n📤 Insertando pedidos en Supabase...');
    for (const pedido of pedidos) {
      const { error } = await supabase.from('pedidos').insert({
        created_at: pedido.createdAt,
        items: pedido.items,
        total: pedido.total,
        metodo_pago: pedido.metodoPago,
        estado: pedido.estado,
        referencia: pedido.referencia,
        nombre: pedido.nombre,
        telefono: pedido.telefono,
        ciudad: pedido.ciudad,
        direccion: pedido.direccion,
        notas: pedido.notas,
      });

      if (error) {
        console.error(`❌ Error insertando pedido: ${error.message}`);
      }
    }
    console.log(`✅ ${pedidos.length} pedidos insertados correctamente`);

    // ── Insertar mensajes ────
    console.log('\n📤 Insertando mensajes en Supabase...');
    for (const mensaje of mensajes) {
      const { error } = await supabase.from('mensajes').insert({
        nombre: mensaje.nombre,
        email: mensaje.email,
        telefono: mensaje.telefono,
        ciudad: mensaje.ciudad,
        mensaje: mensaje.mensaje,
        created_at: mensaje.createdAt,
        leido: mensaje.leido,
      });

      if (error) {
        console.error(`❌ Error insertando mensaje: ${error.message}`);
      }
    }
    console.log(`✅ ${mensajes.length} mensajes insertados correctamente`);

    // ── Mostrar resumen ────
    console.log('\n' + '='.repeat(60));
    console.log('📋 RESUMEN DE DATOS GENERADOS');
    console.log('='.repeat(60));
    console.log(`✓ Pedidos: ${pedidos.length}`);
    console.log(`✓ Mensajes: ${mensajes.length}`);
    console.log(`✓ Total items procesados: ${pedidos.length + mensajes.length}`);

    // ── Mostrar preview ────
    console.log('\n' + '='.repeat(60));
    console.log('🔍 PREVIEW DE DATOS (primer pedido y mensaje)');
    console.log('='.repeat(60));
    console.log('\n📦 Primer Pedido:');
    console.log(exportAsJson(pedidos[0]));
    console.log('\n💬 Primer Mensaje:');
    console.log(exportAsJson(mensajes[0]));

    console.log('\n' + '='.repeat(60));
    console.log('✨ ¡Datos de prueba generados exitosamente!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

main();
