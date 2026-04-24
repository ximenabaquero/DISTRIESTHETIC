# Factory de Datos de Prueba

Este módulo proporciona funciones para generar datos imaginarios realistas para pruebas de producción.

## Archivos

- **`src/lib/factories.ts`** - Funciones factory para generar datos
- **`scripts/generateTestData.ts`** - Script para generar e insertar datos en Supabase
- **`scripts/previewTestData.ts`** - Script para ver datos sin insertarlos

## Uso

### 1. Preview de datos (sin insertar)

Ver cómo se verán los datos sin modificar la base de datos:

```bash
# Ver preview de 3 de cada (por defecto)
npx ts-node scripts/previewTestData.ts

# Ver preview de 10 pedidos, 10 contactos, 10 mensajes
npx ts-node scripts/previewTestData.ts 10
```

### 2. Generar e insertar datos en Supabase

Genera datos y los inserta automáticamente en tu base de datos:

```bash
# Generar 15 pedidos y ~12 mensajes (por defecto)
npx ts-node scripts/generateTestData.ts

# Generar 50 pedidos y ~40 mensajes
npx ts-node scripts/generateTestData.ts 50
```

## Uso en código

### Importar y usar las funciones factory

```typescript
import {
  createPedido,
  createPedidos,
  createMensaje,
  createMensajes,
  createContacto,
  createContactos,
  createTestDataBundle,
} from '@/lib/factories';

// Crear un pedido individual
const pedido = createPedido();
// Personalizarlo
const pedidoPersonalizado = createPedido({
  nombre: 'Mi Cliente',
  ciudad: 'Medellín',
  estado: 'entregado',
});

// Crear múltiples pedidos
const pedidos = createPedidos(10);

// Crear un mensaje
const mensaje = createMensaje();

// Crear múltiples mensajes
const mensajes = createMensajes(20);

// Crear un contacto
const contacto = createContacto();

// Crear múltiples contactos
const contactos = createContactos(15);

// Crear todo de una vez
const datos = createTestDataBundle({
  pedidos: 20,
  contactos: 15,
  mensajes: 30,
});
```

## Datos generados

### Estructura de un Pedido

```typescript
interface Pedido {
  id: number;
  createdAt: string;
  items: PedidoItem[]; // Array de productos
  total: number;
  metodoPago: 'whatsapp' | 'mercadopago' | 'wompi';
  estado: 'sin_entregar' | 'entregado' | 'cancelado';
  referencia: string | null;
  nombre: string | null;
  telefono: string | null;
  ciudad: string | null;
  direccion: string | null;
  notas: string | null;
}
```

### Estructura de un Mensaje

```typescript
interface MensajeData {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  ciudad?: string;
  createdAt: string;
  leido: boolean;
}
```

### Estructura de un Contacto

```typescript
interface ContactoData {
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  empresa?: string;
  mensaje: string;
  createdAt: string;
}
```

## Datos realistas incluidos

- **Nombres:** 20 nombres colombianos comunes
- **Ciudades:** 15 principales ciudades de Colombia
- **Productos:** 12 insumos médicos típicos
- **Teléfonos:** Formato +57 3XX XXXXXXX (realista)
- **Direcciones:** Formato típico colombiano (Calle X #Y-Z)
- **Fechas:** Distribuidas en los últimos 30 días
- **Referencias:** Formatos por método de pago (MP-, WP-, MAN-)

## Personalización

Puedes sobreescribir cualquier campo al crear datos:

```typescript
// Crear un pedido para una ciudad específica
const pedidoMedellin = createPedido({
  ciudad: 'Medellín',
  estado: 'entregado',
  nombre: 'Clínica del Centro',
});

// Crear múltiples pedidos con ciudad fija
const pedidosBogota = createPedidos(10, {
  ciudad: 'Bogotá',
});

// Crear un mensaje con contenido personalizado
const mensajePersonalizado = createMensaje({
  nombre: 'Dr. García',
  mensaje: 'Necesito un presupuesto para 1000 unidades',
});
```

## Ejemplo práctico

```typescript
// En una ruta de prueba o componente
import { createPedidos } from '@/lib/factories';

export async function GET(request: Request) {
  // Generar 10 pedidos de prueba
  const pedidos = createPedidos(10);
  
  // Procesarlos como si fueran reales
  const procesados = pedidos.map(p => ({
    ...p,
    total: Math.round(p.total * 1.19), // Agregar IVA
  }));
  
  return Response.json({ pedidos: procesados });
}
```

## Notas importantes

- ✅ Los datos son **completamente imaginarios** y seguros para pruebas
- ✅ Las ciudades y nombres son **reales de Colombia**
- ✅ Los teléfonos siguen el **formato colombiano válido**
- ✅ Los precios son **realistas** para insumos médicos
- ⚠️ No usar en producción sin validación adicional
- 💾 El script `generateTestData.ts` **requiere** SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY

## Tips

1. **Antes de insertar:** Siempre usa `previewTestData.ts` para ver los datos
2. **Limpiar datos:** Usa el panel de Supabase para eliminar datos de prueba
3. **Validar:** Verifica que los datos generados sean realistas en tu aplicación
4. **Iterar:** Ejecuta varias veces para generar variedad de datos

¡Happy testing! 🚀
