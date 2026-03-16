# Documentación — DistriEsthetic

Este archivo explica cómo funciona el proyecto, los conceptos de programación usados,
y dónde está cada cosa. Escrito para que puedas releerlo cuando sientas que se te olvida algo.

---

## Estructura del proyecto

```
src/
├── app/                  → Páginas y rutas (Next.js App Router)
│   ├── page.tsx          → Página principal (catálogo de productos)
│   ├── carrito/          → Página del carrito de compras
│   ├── admin/            → Panel de administración
│   │   ├── page.tsx      → Página principal del admin
│   │   └── components/   → Componentes del admin (tabla, modales, etc.)
│   └── api/              → Rutas del servidor (endpoints)
│       ├── productos/    → CRUD de productos
│       ├── pedidos/      → CRUD de pedidos
│       └── admin/        → Login, logout, mensajes
├── components/           → Componentes reutilizables (SiteNav, carrito, etc.)
├── context/              → Estado global (CartContext)
├── data/
│   └── productos.ts      → Lista base de productos (hardcodeada en el código)
└── lib/
    ├── productosStore.ts    → Lógica para leer/escribir productos en Supabase
    ├── pedidosStore.ts      → Lógica para leer/escribir pedidos en Supabase
    ├── adminAuth.ts         → Verificación de sesión admin
    └── productImageStorage.ts → Subir/borrar imágenes en Supabase Storage
```

---

## Conceptos fundamentales de React

### `const`

`const` declara una variable que **no se puede reasignar**.

```typescript
const nombre = "Lidocaína 50 ml";   // ✅ se puede leer
nombre = "Otra cosa";               // ❌ error — no se puede cambiar
```

En React se usa para todo: componentes, funciones, variables temporales.
La razón es que en React los datos cambian a través del estado (`useState`),
no reasignando variables directamente.

```typescript
// Un componente es una función guardada en una const
const ProductCard = ({ producto }) => {
  return <div>{producto.nombre}</div>;
};
```

---

### `useState` — El estado de un componente

El estado es **información que puede cambiar** y que cuando cambia, hace que
el componente se vuelva a dibujar en pantalla.

**Sintaxis:**
```typescript
const [valor, setValor] = useState(valorInicial);
//     ↑              ↑
//  lo que lees   función para cambiarlo
```

**Ejemplo real del proyecto** (en `useAdmin.ts`):
```typescript
const [saving, setSaving] = useState(false);
//     ↑                              ↑
//  ¿está guardando?            empieza en false (no está guardando)

// Cuando el usuario da clic en "Guardar":
setSaving(true);   // → React vuelve a dibujar, saving = true, botón muestra "Guardando..."
// ... cuando termina:
setSaving(false);  // → React vuelve a dibujar, saving = false, botón vuelve a normal
```

**Más ejemplos del proyecto:**
```typescript
const [productos, setProductos] = useState<Producto[]>([]);
// productos empieza como array vacío []
// cuando llegan del servidor: setProductos(listaDeProductos)

const [uploadingImageId, setUploadingImageId] = useState<number | null>(null);
// null = no se está subiendo ninguna imagen
// cuando se sube la del producto 5: setUploadingImageId(5)
// cuando termina: setUploadingImageId(null)
```

**Regla de oro:** Nunca modificar el estado directamente.
```typescript
productos.push(nuevoProducto);     // ❌ MAL — React no sabe que cambió
setProductos([...productos, nuevoProducto]); // ✅ BIEN
```

---

### `useEffect` — Ejecutar código en momentos específicos

`useEffect` sirve para ejecutar código como **reacción a algo**:
cuando el componente aparece en pantalla, o cuando un valor cambia.

**Sintaxis:**
```typescript
useEffect(() => {
  // código a ejecutar
}, [dependencias]);
//  ↑
// array que controla CUÁNDO se ejecuta
```

**Los 3 casos del array de dependencias:**

```typescript
// 1. Array vacío [] → se ejecuta UNA SOLA VEZ cuando el componente aparece
useEffect(() => {
  console.log("El componente apareció en pantalla");
}, []);

// 2. Con valores → se ejecuta cuando esos valores cambian
useEffect(() => {
  console.log("isAdmin cambió a:", isAdmin);
}, [isAdmin]);

// 3. Sin array → se ejecuta en CADA render (casi nunca se usa así)
useEffect(() => {
  console.log("Me ejecuto siempre");
});
```

**Ejemplo real del proyecto** (en `useAdmin.ts`):

```typescript
// useEffect 1: restaurar sesión al abrir la página
useEffect(() => {
  const restore = async () => {
    const stored = sessionStorage.getItem('admin_email');
    if (!stored) return;
    const res = await fetch('/api/admin/verify');
    const json = await res.json();
    if (json.ok) setSessionEmail(stored); // si la cookie sigue válida, loguear
  };
  restore();
}, []); // [] → solo al montar el componente por primera vez

// useEffect 2: cargar productos, pedidos y mensajes cuando el admin se loguea
useEffect(() => {
  if (!isAdmin) return; // si no está logueado, no hacer nada
  fetchAll();     // cargar productos
  fetchPedidos(); // cargar pedidos
  fetchMensajes();// cargar mensajes
}, [isAdmin]); // se ejecuta cada vez que isAdmin cambia (de false a true al loguearse)
```

---

### `useMemo` — Calcular un valor sin repetir trabajo innecesario

Sirve para **recordar el resultado de un cálculo** y no repetirlo si los datos no cambiaron.

```typescript
// Sin useMemo: se recalcula en CADA render aunque productos no haya cambiado
const categorias = productos.map(p => p.categoria);

// Con useMemo: solo se recalcula cuando `productos` cambia
const categorias = useMemo(
  () => Array.from(new Set(productos.map(p => p.categoria))).sort(),
  [productos] // ← solo recalcular si productos cambia
);
```

**Ejemplo real del proyecto:**
```typescript
// Filtrar productos visibles según búsqueda y categoría
const visibleProductos = useMemo(() => {
  return productos.filter(p => {
    if (categoryFilter && p.categoria !== categoryFilter) return false;
    if (!filter) return true;
    return p.nombre.toLowerCase().includes(filter.toLowerCase());
  });
}, [productos, filter, categoryFilter]); // recalcular si alguno de estos cambia
```

---

### `useCallback` — Recordar una función sin recrearla

Similar a `useMemo` pero para funciones. Evita que React cree la misma función
una y otra vez en cada render.

```typescript
// Esta función se memoriza — solo se recrea si baseProductsSet cambia
const handleCreateProducto = useCallback(async (payload) => {
  setCreatingProduct(true);
  // ... lógica para crear producto
  setCreatingProduct(false);
}, [baseProductsSet]);
```

---

## Cómo fluyen los datos en el admin

```
useAdmin.ts (el "cerebro")
    │
    ├── useState → guarda toda la información (productos, pedidos, etc.)
    ├── useEffect → carga datos del servidor al entrar
    ├── useCallback → funciones para guardar, editar, eliminar
    │
    └── devuelve todo → lo usa admin/page.tsx
            │
            ├── DashboardView  → recibe productos y pedidos, solo los muestra
            ├── MassEditTable  → recibe productos, llama a funciones del hook
            ├── PedidosView    → recibe pedidos, llama a onUpdateEstado
            └── MensajesView   → recibe mensajes, llama a onMarcarLeido, onEliminar
```

El patrón es: **un solo lugar tiene el estado** (`useAdmin`),
y los componentes hijos solo muestran datos y llaman funciones.

---

## Cómo funciona la autenticación del admin

1. El admin entra a `/admin` → aparece `LoginPanel`
2. Escribe correo + contraseña → llama `handleLogin`
3. `handleLogin` hace POST a `/api/admin/login`
4. El servidor verifica contra `ADMIN_EMAILS` y `ADMIN_PASSWORD` (variables de entorno)
5. Si es correcto → el servidor guarda una **cookie HTTP-only** (segura, invisible al JS)
6. El correo se guarda en `sessionStorage` para recordarlo entre recargas
7. Al recargar → `useEffect` verifica la cookie con `/api/admin/verify`

---

## Cómo funciona la subida de imágenes

```
Usuario selecciona foto (input file)
    ↓
uploadProductoImagen(id, file)    ← en useAdmin.ts
    ↓
POST /api/productos/{id}/imagen   ← API route
    ↓
saveProductImage(file, id)        ← en productImageStorage.ts
    ↓
Sube a Supabase Storage           ← bucket "product-images"
    ↓
Devuelve URL pública
    ↓
Guarda URL en tabla productos (imagen_url)
    ↓
Componente muestra la imagen nueva
```

---

## Cómo fluye un pedido de WhatsApp

```
Cliente agrega productos al carrito (CartContext)
    ↓
Va a /carrito → llena nombre, teléfono, dirección
    ↓
Hace clic en "Pedir por WhatsApp"
    ↓
1. POST /api/pedidos → guarda el pedido en Supabase
2. Se construye mensaje de texto (sin emojis para que WhatsApp lo lea bien)
3. window.open("https://wa.me/57XXXXXXXXX?text=...") → abre WhatsApp
    ↓
Admin ve el pedido en /admin → sección Pedidos
    ↓
Puede marcarlo como "Entregado" o "Cancelado"
```

---

## Variables de entorno (.env.local)

Son valores secretos que el servidor necesita pero que NO van en el código.

| Variable | Para qué sirve |
|---|---|
| `SUPABASE_URL` | Dirección de la base de datos |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave secreta para acceder a Supabase |
| `ADMIN_EMAILS` | Correos autorizados para el panel admin |
| `ADMIN_PASSWORD` | Contraseña del panel admin |
| `ADMIN_SESSION_SECRET` | Clave para firmar las cookies de sesión |

En **desarrollo** van en `.env.local` (no se sube a Git).
En **producción** van en Vercel → Settings → Environment Variables.

---

## Supabase — La base de datos

Supabase es una base de datos PostgreSQL en la nube. El proyecto usa dos cosas:

**Tablas:**
- `productos` → todos los productos con precio, stock, imagen
- `pedidos` → todos los pedidos con items, total, estado, datos del cliente
- `mensajes` → mensajes del formulario de contacto

**Storage:**
- Bucket `product-images` → donde se guardan las fotos de los productos

**Regla importante:** Los datos de Supabase son permanentes.
Un redeploy en Vercel NUNCA borra los datos — solo borra la memoria RAM del servidor
(variables `seeded`, caché, etc.).

---

## Glosario rápido

| Término | Qué es |
|---|---|
| `useState` | Guardar datos que pueden cambiar en un componente |
| `useEffect` | Ejecutar código cuando algo pasa (montar, cambio de valor) |
| `useMemo` | Recordar resultado de cálculo para no repetirlo |
| `useCallback` | Recordar una función para no recrearla |
| `const` | Variable que no se reasigna |
| `async/await` | Esperar respuestas del servidor sin bloquear la UI |
| `fetch` | Hacer llamadas HTTP al servidor desde el cliente |
| Hook | Función de React que empieza con `use` |
| Props | Datos que un componente padre le pasa al hijo |
| API Route | Función del servidor accesible por HTTP (`/api/...`) |
| Supabase | Base de datos en la nube que usa el proyecto |
| Vercel | Plataforma donde está desplegado el sitio |
