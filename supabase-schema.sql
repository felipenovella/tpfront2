-- =============================================
-- AeroCat — Schema SQL para Supabase
-- Ejecutar en el SQL Editor de Supabase
-- =============================================

-- Tabla de aeronaves
CREATE TABLE aircraft (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  model       TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  category    TEXT DEFAULT 'Comercial',
  airline     TEXT,
  first_flight INTEGER,
  description TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de favoritos
CREATE TABLE favorites (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  aircraft_id UUID REFERENCES aircraft(id) ON DELETE CASCADE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, aircraft_id)
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE aircraft ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Aircraft: cualquier usuario autenticado puede leer
CREATE POLICY "Cualquiera puede leer aeronaves"
  ON aircraft FOR SELECT
  USING (auth.role() = 'authenticated');

-- Aircraft: solo el dueño puede insertar, actualizar, eliminar
CREATE POLICY "Solo el dueño puede insertar"
  ON aircraft FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Solo el dueño puede actualizar"
  ON aircraft FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Solo el dueño puede eliminar"
  ON aircraft FOR DELETE
  USING (auth.uid() = user_id);

-- Favorites: cada usuario gestiona los suyos
CREATE POLICY "El usuario gestiona sus favoritos"
  ON favorites FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- Storage bucket para imágenes
-- =============================================

-- Ejecutar desde Dashboard > Storage > New Bucket:
-- Nombre: aircraft-images
-- Public: true

-- Política de storage (ejecutar en SQL Editor):
INSERT INTO storage.buckets (id, name, public) VALUES ('aircraft-images', 'aircraft-images', true);

CREATE POLICY "Usuarios autenticados pueden subir"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'aircraft-images' AND auth.role() = 'authenticated');

CREATE POLICY "Imágenes públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'aircraft-images');

CREATE POLICY "El dueño puede eliminar su imagen"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'aircraft-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================
-- Datos de ejemplo (opcional)
-- =============================================

-- Reemplazá 'USER_ID_AQUI' con un UUID real de auth.users
-- INSERT INTO aircraft (user_id, model, manufacturer, category, airline, first_flight, description) VALUES
-- ('USER_ID_AQUI', 'Boeing 737-800', 'Boeing', 'Comercial', 'Aerolíneas Argentinas', 1998, 'Avión de pasajeros de fuselaje estrecho, uno de los más vendidos de la historia.'),
-- ('USER_ID_AQUI', 'Airbus A320', 'Airbus', 'Comercial', 'LATAM', 1987, 'El primer avión de pasajeros con fly-by-wire en la aviación comercial.'),
-- ('USER_ID_AQUI', 'Cessna 172', 'Cessna', 'Privado', null, 1955, 'El avión más fabricado de la historia. Ideal para instrucción de vuelo.');
