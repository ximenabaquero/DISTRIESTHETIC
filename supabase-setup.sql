-- ============================================================
-- DISTRIESTHETIC – Supabase setup
-- Ejecutar en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. Tabla productos (fuente única de verdad)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS productos (
  id         SERIAL       PRIMARY KEY,
  nombre     TEXT         NOT NULL,
  descripcion TEXT        NOT NULL DEFAULT '',
  categoria  TEXT         NOT NULL DEFAULT 'insumos'
               CHECK (categoria IN ('medicamentos','soluciones','insumos','quimicos','ropa','proteccion')),
  disponible BOOLEAN      NOT NULL DEFAULT true,
  etiqueta   TEXT         NOT NULL DEFAULT '',
  precio     NUMERIC(12,2) NULL,
  stock      INTEGER      NOT NULL DEFAULT 0,
  imagen_url TEXT         NULL,
  is_base    BOOLEAN      NOT NULL DEFAULT false
);

-- IMPORTANTE: Ejecutar esta línea UNA VEZ después del primer arranque
-- de la app (la app inserta automáticamente los 37 productos base).
-- Esto evita que los nuevos productos extras colisionen con los IDs base:
-- SELECT setval(pg_get_serial_sequence('productos','id'), GREATEST(100, (SELECT MAX(id) FROM productos)));

-- ──────────────────────────────────────────────────────────────
-- 2. Tabla contact_info (fila única, id siempre = 1)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_info (
  id        INTEGER PRIMARY KEY DEFAULT 1,
  telefono  TEXT    NOT NULL DEFAULT '304 683 1493',
  whatsapp  TEXT    NOT NULL DEFAULT '573046831493',
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insertar fila inicial si no existe
INSERT INTO contact_info (id, telefono, whatsapp)
VALUES (1, '304 683 1493', '573046831493')
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- 3. Tabla mensajes_contacto (formulario de contacto)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mensajes_contacto (
  id         SERIAL      PRIMARY KEY,
  nombre     TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  telefono   TEXT        NULL,
  mensaje    TEXT        NOT NULL,
  leido      BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- 4. Row Level Security
-- ──────────────────────────────────────────────────────────────
-- Las escrituras siempre van por rutas server-side con service_role
-- (bypass RLS). La clave anon sólo necesita leer.

ALTER TABLE productos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info      ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes_contacto ENABLE ROW LEVEL SECURITY;

-- Lectura pública (catálogo y contacto visibles para todos)
CREATE POLICY "productos_select_public"
  ON productos FOR SELECT USING (true);

CREATE POLICY "contact_info_select_public"
  ON contact_info FOR SELECT USING (true);

-- Inserción pública (visitantes pueden enviar formulario de contacto)
-- Las lecturas/borrados de mensajes van por service_role (admin server-side)
CREATE POLICY "mensajes_insert_public"
  ON mensajes_contacto FOR INSERT WITH CHECK (true);

-- ──────────────────────────────────────────────────────────────
-- 5. Storage bucket product-images
-- ──────────────────────────────────────────────────────────────
-- Ejecutar desde el panel Storage de Supabase o con este SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política de lectura pública para imágenes
CREATE POLICY "product_images_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');
