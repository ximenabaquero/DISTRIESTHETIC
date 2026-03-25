# DISTRIESTHETIC

Plataforma de e-commerce B2B/B2C para la distribución de productos médicos y estéticos. Desarrollada con Next.js 15, Supabase y Wompi como pasarela de pagos.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Lenguaje | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| Base de datos | Supabase (PostgreSQL) |
| Almacenamiento | Supabase Storage |
| Pagos | Wompi |
| Gráficas | Recharts |
| Exportación | XLSX |

---

## Funcionalidades

### Tienda (cliente)
- Catálogo con 59+ productos (medicamentos, insumos, químicos, ropa, protección)
- Búsqueda y filtrado por categoría
- Carrito de compras persistente (localStorage)
- Pago online vía Wompi
- Pedido por WhatsApp
- Formulario de contacto

### Panel de administración (`/admin`)
- Autenticación segura con cookies HTTP-only (sesión de 8 horas)
- Gestión de productos: crear, editar, eliminar, subir imágenes
- Edición masiva de precios y stock
- Gestión de pedidos con seguimiento de estado
- Gestión de mensajes de contacto
- Dashboard con estadísticas y gráficas
- Exportación de pedidos a Excel

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx              # Página principal (marketing)
│   ├── productos/            # Catálogo de productos
│   ├── carrito/              # Carrito y checkout
│   ├── pago/                 # Páginas de pago
│   ├── contacto/             # Formulario de contacto
│   ├── admin/                # Panel de administración
│   └── api/                  # Endpoints REST
├── components/               # Componentes reutilizables
├── context/
│   └── CartContext.tsx       # Estado global del carrito
├── lib/                      # Lógica de negocio y acceso a datos
├── data/
│   └── productos.ts          # Catálogo base (59 productos)
└── hooks/
    └── useAdmin.ts           # Lógica del panel admin
```

---

## Instalación y configuración

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd DISTRIESTHETIC
npm install
```

### 2. Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto basándote en `.env.example`:

```env
# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Admin
ADMIN_EMAILS=correo@ejemplo.com
ADMIN_PASSWORD=tu_contraseña
ADMIN_SESSION_SECRET=clave_secreta_larga

# Wompi (pagos)
WOMPI_PRIVATE_KEY=
WOMPI_INTEGRITY_SECRET=
WOMPI_EVENTS_SECRET=

# CORS
ALLOWED_ORIGINS=https://tudominio.com
```

### 3. Base de datos

Ejecuta el script SQL en tu proyecto de Supabase:

```
# En el SQL Editor de Supabase, ejecuta el contenido de:
supabase-setup.sql
```

Esto crea las tablas: `productos`, `pedidos`, `mensajes_contacto`, `contact_info`.

### 4. Correr en desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000`.
El panel de administración en `http://localhost:3000/admin`.

---

## Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo con Turbopack
npm run build    # Build de producción
npm start        # Servidor de producción
npm run lint     # Análisis estático con ESLint
```

---

## API

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/productos` | Catálogo completo de productos |
| `POST` | `/api/productos` | Actualizar precio/stock en lote |
| `POST` | `/api/productos/:id/imagen` | Subir imagen de producto |
| `DELETE` | `/api/productos/:id/imagen` | Eliminar imagen de producto |
| `GET` | `/api/pedidos` | Listar pedidos |
| `POST` | `/api/pedidos` | Crear nuevo pedido |
| `POST` | `/api/payments/wompi` | Webhook de confirmación de pago |
| `POST` | `/api/contacto` | Guardar mensaje de contacto |

---

## Base de datos

El proyecto usa Supabase con 4 tablas principales:

| Tabla | Descripción |
|---|---|
| `productos` | Catálogo con precio, stock e imagen |
| `pedidos` | Órdenes de clientes con estado de entrega |
| `mensajes_contacto` | Mensajes del formulario de contacto |
| `contact_info` | Datos de contacto de la empresa (WhatsApp, teléfono) |

> Si no hay `.env.local` configurado, el sistema usa datos locales como fallback para desarrollo.

---

## Seguridad

- Contraseñas comparadas con `timingSafeEqual` para prevenir ataques de temporización
- Sesión via cookies HTTP-only (no accesibles desde JavaScript)
- Lista blanca de correos de administrador (`ADMIN_EMAILS`)
- Clave de servicio de Supabase nunca expuesta al cliente
- CORS configurado por entorno

---

## Documentación adicional

Ver `DOCUMENTACION.md` para documentación técnica detallada, incluyendo explicación de patrones de React, flujo de datos y configuración de Supabase.
