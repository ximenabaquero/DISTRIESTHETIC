/**
 * Ejemplos de uso del Factory de Datos de Prueba
 * Este archivo muestra diferentes formas de usar las funciones factory
 */

import {
  createPedido,
  createPedidos,
  createMensaje,
  createMensajes,
  createContacto,
  createContactos,
  createPedidoData,
  createPedidoItem,
  createTestDataBundle,
  calculateTotal,
  exportAsJson,
  type Pedido,
  type CreatePedidoData,
  type MensajeData,
} from '@/lib/factories';

// ── EJEMPLO 1: Crear un solo pedido ────────────────────────────────────────
export function ejemplo1_unPedido() {
  console.log('=== EJEMPLO 1: Crear un solo pedido ===\n');
  
  const pedido = createPedido();
  console.log('Pedido generado:', pedido);
  console.log('Total: $' + pedido.total.toLocaleString('es-CO'));
}

// ── EJEMPLO 2: Crear múltiples pedidos ────────────────────────────────────
export function ejemplo2_multiplespedidos() {
  console.log('\n=== EJEMPLO 2: Crear múltiples pedidos ===\n');
  
  const pedidos = createPedidos(5);
  const totalVentas = pedidos.reduce((sum, p) => sum + p.total, 0);
  
  console.log(`Generados ${pedidos.length} pedidos`);
  console.log(`Total de ventas: $${totalVentas.toLocaleString('es-CO')}`);
  console.log('Detalles:');
  pedidos.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.nombre} - $${p.total.toLocaleString('es-CO')} (${p.estado})`);
  });
}

// ── EJEMPLO 3: Personalizar pedidos ──────────────────────────────────────
export function ejemplo3_personalizarPedidos() {
  console.log('\n=== EJEMPLO 3: Personalizar pedidos ===\n');
  
  // Crear pedido para un cliente específico
  const pedidoCliente = createPedido({
    nombre: 'Clínica La Esperanza',
    ciudad: 'Bogotá',
    telefono: '+57 3001234567',
    direccion: 'Calle 50 #10-20',
  });
  
  console.log('Pedido personalizado:');
  console.log(`  Cliente: ${pedidoCliente.nombre}`);
  console.log(`  Ciudad: ${pedidoCliente.ciudad}`);
  console.log(`  Dirección: ${pedidoCliente.direccion}`);
  console.log(`  Total: $${pedidoCliente.total.toLocaleString('es-CO')}`);
}

// ── EJEMPLO 4: Filtrar y analizar pedidos ──────────────────────────────
export function ejemplo4_analizarPedidos() {
  console.log('\n=== EJEMPLO 4: Filtrar y analizar pedidos ===\n');
  
  const pedidos = createPedidos(20);
  
  // Análisis por estado
  const entregados = pedidos.filter(p => p.estado === 'entregado');
  const sinEntregar = pedidos.filter(p => p.estado === 'sin_entregar');
  const cancelados = pedidos.filter(p => p.estado === 'cancelado');
  
  console.log('Análisis por estado:');
  console.log(`  ✓ Entregados: ${entregados.length}`);
  console.log(`  ⏳ Sin entregar: ${sinEntregar.length}`);
  console.log(`  ✗ Cancelados: ${cancelados.length}`);
  
  // Análisis por método de pago
  const whatsapp = pedidos.filter(p => p.metodoPago === 'whatsapp');
  const mercadopago = pedidos.filter(p => p.metodoPago === 'mercadopago');
  const wompi = pedidos.filter(p => p.metodoPago === 'wompi');
  
  console.log('\nAnálisis por método de pago:');
  console.log(`  WhatsApp: ${whatsapp.length}`);
  console.log(`  Mercado Pago: ${mercadopago.length}`);
  console.log(`  Wompi: ${wompi.length}`);
  
  // Top 5 pedidos por monto
  console.log('\nTop 5 pedidos por monto:');
  const top5 = [...pedidos].sort((a, b) => b.total - a.total).slice(0, 5);
  top5.forEach((p, i) => {
    console.log(`  ${i + 1}. $${p.total.toLocaleString('es-CO')} - ${p.nombre} (${p.ciudad})`);
  });
}

// ── EJEMPLO 5: Crear mensajes y contactos ────────────────────────────────
export function ejemplo5_mensajesYContactos() {
  console.log('\n=== EJEMPLO 5: Crear mensajes y contactos ===\n');
  
  const mensajes = createMensajes(5);
  const noLeidos = mensajes.filter(m => !m.leido);
  
  console.log(`Mensajes generados: ${mensajes.length}`);
  console.log(`No leídos: ${noLeidos.length}`);
  console.log('\nDetalle:');
  mensajes.forEach((m, i) => {
    const estado = m.leido ? '✓ Leído' : '◯ No leído';
    console.log(`  ${i + 1}. ${estado} - ${m.nombre} (${m.ciudad})`);
  });
  
  // Contactos
  const contactos = createContactos(5);
  console.log(`\nContactos generados: ${contactos.length}`);
  contactos.forEach((c, i) => {
    const empresa = c.empresa ? ` - ${c.empresa}` : '';
    console.log(`  ${i + 1}. ${c.nombre}${empresa}`);
  });
}

// ── EJEMPLO 6: Exportar datos como JSON ──────────────────────────────────
export function ejemplo6_exportarJSON() {
  console.log('\n=== EJEMPLO 6: Exportar datos como JSON ===\n');
  
  const pedidos = createPedidos(2);
  const json = exportAsJson(pedidos);
  
  console.log('JSON generado:');
  console.log(json);
}

// ── EJEMPLO 7: Procesar datos (como si fueran de la BD) ────────────────
export function ejemplo7_procesarDatos() {
  console.log('\n=== EJEMPLO 7: Procesar datos ===\n');
  
  const pedidos = createPedidos(10);
  
  // Agregar impuestos y descuentos
  const pedidosProcesados = pedidos.map(p => {
    const subtotal = p.total;
    const iva = Math.round(subtotal * 0.19);
    const total = subtotal + iva;
    
    return {
      ...p,
      subtotal,
      iva,
      total,
      totalFormatted: `$${total.toLocaleString('es-CO')}`,
    };
  });
  
  console.log('Primeros 3 pedidos procesados:');
  pedidosProcesados.slice(0, 3).forEach((p, i) => {
    console.log(`\nPedido ${i + 1}:`);
    console.log(`  Subtotal: $${p.subtotal.toLocaleString('es-CO')}`);
    console.log(`  IVA (19%): $${p.iva.toLocaleString('es-CO')}`);
    console.log(`  Total: ${p.totalFormatted}`);
  });
}

// ── EJEMPLO 8: Generar bundle completo ──────────────────────────────────
export function ejemplo8_bundleCompleto() {
  console.log('\n=== EJEMPLO 8: Bundle completo de datos ===\n');
  
  const datos = createTestDataBundle({
    pedidos: 5,
    contactos: 5,
    mensajes: 5,
  });
  
  console.log('Bundle generado:');
  console.log(`  Pedidos: ${datos.pedidos.length}`);
  console.log(`  Contactos: ${datos.contactos.length}`);
  console.log(`  Mensajes: ${datos.mensajes.length}`);
  
  console.log('\nPrimer pedido:');
  const p = datos.pedidos[0];
  console.log(`  ${p.nombre} - ${p.ciudad}`);
  console.log(`  Items: ${p.items.length}`);
  console.log(`  Total: $${p.total.toLocaleString('es-CO')}`);
  
  console.log('\nPrimer contacto:');
  const c = datos.contactos[0];
  console.log(`  ${c.nombre} - ${c.email}`);
  console.log(`  Empresa: ${c.empresa || 'N/A'}`);
  
  console.log('\nPrimer mensaje:');
  const m = datos.mensajes[0];
  console.log(`  ${m.nombre}: "${m.mensaje}"`);
}

// ── EJEMPLO 9: Items individuales ────────────────────────────────────────
export function ejemplo9_items() {
  console.log('\n=== EJEMPLO 9: Items individuales ===\n');
  
  // Crear un item
  const item = createPedidoItem();
  console.log('Item generado:');
  console.log(`  ${item.nombre}`);
  console.log(`  Precio: $${item.precio?.toLocaleString('es-CO')}`);
  console.log(`  Cantidad: ${item.cantidad}`);
  console.log(`  Subtotal: $${(item.precio! * item.cantidad).toLocaleString('es-CO')}`);
  
  // Personalizar item
  const itemPersonalizado = createPedidoItem({
    nombre: 'Suero Fisiológico 1L',
    precio: 15000,
    cantidad: 100,
  });
  console.log('\nItem personalizado:');
  console.log(`  ${itemPersonalizado.nombre}`);
  console.log(`  Subtotal: $${(itemPersonalizado.precio! * itemPersonalizado.cantidad).toLocaleString('es-CO')}`);
}

// ── EJEMPLO 10: Estadísticas ────────────────────────────────────────────
export function ejemplo10_estadisticas() {
  console.log('\n=== EJEMPLO 10: Estadísticas ===\n');
  
  const pedidos = createPedidos(100);
  
  // Calcular estadísticas
  const totalVentas = pedidos.reduce((sum, p) => sum + p.total, 0);
  const promedio = totalVentas / pedidos.length;
  const maximo = Math.max(...pedidos.map(p => p.total));
  const minimo = Math.min(...pedidos.map(p => p.total));
  
  console.log('Estadísticas de 100 pedidos generados:');
  console.log(`  Total ventas: $${totalVentas.toLocaleString('es-CO')}`);
  console.log(`  Promedio por pedido: $${promedio.toLocaleString('es-CO')}`);
  console.log(`  Pedido máximo: $${maximo.toLocaleString('es-CO')}`);
  console.log(`  Pedido mínimo: $${minimo.toLocaleString('es-CO')}`);
  
  // Distribución por ciudad
  const porCiudad: Record<string, number> = {};
  pedidos.forEach(p => {
    if (p.ciudad) porCiudad[p.ciudad] = (porCiudad[p.ciudad] || 0) + 1;
  });
  
  console.log('\nDistribución por ciudad:');
  Object.entries(porCiudad).forEach(([ciudad, count]) => {
    console.log(`  ${ciudad}: ${count} pedidos`);
  });
}

// ── EJECUTAR TODOS LOS EJEMPLOS ────────────────────────────────────────
export async function runAllExamples() {
  try {
    ejemplo1_unPedido();
    ejemplo2_multiplespedidos();
    ejemplo3_personalizarPedidos();
    ejemplo4_analizarPedidos();
    ejemplo5_mensajesYContactos();
    ejemplo6_exportarJSON();
    ejemplo7_procesarDatos();
    ejemplo8_bundleCompleto();
    ejemplo9_items();
    ejemplo10_estadisticas();
    
    console.log('\n' + '='.repeat(60));
    console.log('✨ ¡Todos los ejemplos completados!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('Error ejecutando ejemplos:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runAllExamples();
}
