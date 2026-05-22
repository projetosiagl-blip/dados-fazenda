-- ============================================
-- SUPABASE STORAGE — Execute no SQL Editor
-- Cria o bucket de relatórios PDF (Farm Scan)
-- ============================================

-- Cria o bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'relatorios',
  'relatorios',
  true,
  10485760,  -- 10MB
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Política: serviço pode fazer upload
CREATE POLICY "service_upload_relatorios"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'relatorios');

-- Política: leitura pública dos PDFs
CREATE POLICY "public_read_relatorios"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'relatorios');

-- Política: serviço pode atualizar
CREATE POLICY "service_update_relatorios"
ON storage.objects FOR UPDATE
TO service_role
USING (bucket_id = 'relatorios');
