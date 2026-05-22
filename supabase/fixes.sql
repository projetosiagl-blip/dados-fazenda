-- ============================================
-- FIXES — Execute no Supabase SQL Editor
-- Correções adicionais ao schema inicial
-- ============================================

-- Adiciona unique constraint na tabela queimadas (necessário para upsert do cron)
ALTER TABLE queimadas
  DROP CONSTRAINT IF EXISTS queimadas_lat_lon_hora_unique;

ALTER TABLE queimadas
  ADD CONSTRAINT queimadas_lat_lon_hora_unique
  UNIQUE (latitude, longitude, data_hora);

-- Cria bucket de relatórios PDF se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('relatorios', 'relatorios', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;
