## Proyecto DISTRIESTHETIC

Aplicación construida con Next.js 15 + Turbopack para gestionar el catálogo de productos de DISTRIESTHETIC.

## Desarrollo local

```powershell
npm install
npm run dev
```

La app queda disponible en `http://localhost:3000`.

## Panel administrativo

- Acceso desde `/admin` usando el correo configurado en `NEXT_PUBLIC_ADMIN_EMAIL` (o `ADMIN_EMAIL`) y la contraseña `NEXT_PUBLIC_ADMIN_PASSWORD`.
- Permite editar precio y stock masivamente y **subir/eliminar imágenes** por producto.
- Las imágenes se guardan en `public/uploads`. Puedes subir archivos `.jpg`, `.png`, `.webp`, etc. (el nombre se genera automáticamente).

## API relevante

- `GET /api/productos` → catálogo fusionado (base + overrides).
- `POST /api/productos` → actualizar precio/stock en lote.
- `POST /api/productos/:id/imagen` → subir imagen de producto.
- `DELETE /api/productos/:id/imagen` → eliminar imagen actual.

Todas las operaciones usan archivos JSON locales por defecto y pueden integrarse con Supabase si se configuran las variables `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.
Si usas Supabase, añade la columna `imagen_url TEXT` a la tabla `productos_overrides`; si no existe, la app usará solo el almacenamiento local para las imágenes.
