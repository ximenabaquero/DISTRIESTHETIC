/**
 * Script para ver datos de prueba sin insertarlos
 * Uso: npx ts-node scripts/previewTestData.ts [cantidad de pedidos]
 * 
 * Ejemplo:
 *   npx ts-node scripts/previewTestData.ts
 *   npx ts-node scripts/previewTestData.ts 5
 */

import {
  createTestDataBundle,
  exportAsJson,
} from '../src/lib/factories';

async function main() {
  const countArg = process.argv[2];
  const count = countArg ? parseInt(countArg, 10) : 3;

  if (isNaN(count) || count <= 0) {
    console.error('❌ Proporciona un número válido: npx ts-node scripts/previewTestData.ts 5');
    process.exit(1);
  }

  console.log(`📊 Generando preview de datos de prueba (${count} de cada)...`);
  console.log('');

  try {
    const bundle = createTestDataBundle({
      pedidos: count,
      contactos: count,
      mensajes: count,
    });

    // ── Mostrar resumen ────
    console.log('='.repeat(70));
    console.log('📋 RESUMEN DE DATOS GENERADOS');
    console.log('='.repeat(70));
    console.log(`✓ Pedidos: ${bundle.pedidos.length}`);
    console.log(`✓ Contactos: ${bundle.contactos.length}`);
    console.log(`✓ Mensajes: ${bundle.mensajes.length}`);
    console.log(`✓ Total items: ${bundle.pedidos.length + bundle.contactos.length + bundle.mensajes.length}`);

    // ── Mostrar datos completos ────
    console.log('\n' + '='.repeat(70));
    console.log('📦 PEDIDOS');
    console.log('='.repeat(70));
    console.log(exportAsJson(bundle.pedidos));

    console.log('\n' + '='.repeat(70));
    console.log('👥 CONTACTOS');
    console.log('='.repeat(70));
    console.log(exportAsJson(bundle.contactos));

    console.log('\n' + '='.repeat(70));
    console.log('💬 MENSAJES');
    console.log('='.repeat(70));
    console.log(exportAsJson(bundle.mensajes));

    console.log('\n' + '='.repeat(70));
    console.log('✨ Preview completado');
    console.log('='.repeat(70));
    console.log('\n💡 Para insertar estos datos en Supabase:');
    console.log('   npx ts-node scripts/generateTestData.ts ' + count);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
