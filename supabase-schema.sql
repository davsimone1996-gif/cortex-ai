-- ============================================================
-- HERO COLLECTIVE — Schema Supabase
-- Esegui questo nel SQL Editor del tuo progetto Supabase
-- ============================================================

-- Tabella progetti (portfolio)
CREATE TABLE IF NOT EXISTS projects (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  client      TEXT,
  category    TEXT,
  year        TEXT,
  description TEXT,
  slug        TEXT UNIQUE NOT NULL,
  thumbnail_url TEXT,
  video_url   TEXT,
  featured    BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Tabella articoli (news/blog)
CREATE TABLE IF NOT EXISTS articles (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  excerpt     TEXT,
  content     TEXT,
  category    TEXT,
  date        DATE,
  slug        TEXT UNIQUE NOT NULL,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Tabella impostazioni globali (reel URL, ecc.)
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);

-- ─── Row Level Security ───────────────────────────────────────
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Lettura pubblica per tutti
CREATE POLICY "Public read projects"  ON projects  FOR SELECT USING (true);
CREATE POLICY "Public read articles"  ON articles  FOR SELECT USING (true);
CREATE POLICY "Public read settings"  ON settings  FOR SELECT USING (true);

-- Scrittura autenticata (per l'admin panel)
CREATE POLICY "Auth insert projects"  ON projects  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth insert articles"  ON articles  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth upsert settings"  ON settings  FOR ALL    USING (auth.role() = 'authenticated');

-- ─── Storage Buckets ──────────────────────────────────────────
-- Crea manualmente questi bucket nel pannello Storage di Supabase:
--   • videos  (pubblico)
--   • images  (pubblico)
--
-- Oppure esegui tramite API/dashboard:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Policy storage: lettura pubblica
CREATE POLICY "Public read videos" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Policy storage: upload autenticato
CREATE POLICY "Auth upload videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
