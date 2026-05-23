-- ============================================
-- SEED DE DADOS PARA TESTES
-- Execute no Supabase SQL Editor para ter
-- dados de exemplo no desenvolvimento
-- NÃO execute em produção
-- ============================================

-- Usuário de teste (senha: teste123)
INSERT INTO usuarios (id, telefone, nome, email, plano, status_assinatura)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '62999999999',
  'Luiz Teste',
  'teste@dadosfazenda.com.br',
  'full',
  'ativa'
) ON CONFLICT DO NOTHING;

-- Propriedades de exemplo
INSERT INTO propriedades (usuario_id, nome, car_codigo, latitude, longitude, area_ha, municipio, estado, ativa, monitorada)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Fazenda Santa Maria', 'GO-5219803-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', -17.8500, -50.9200, 1240, 'Rio Verde', 'GO', true, true),
  ('00000000-0000-0000-0000-000000000001', 'Sítio Boa Vista', 'GO-5213103-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', -17.5678, -52.1234, 340, 'Mineiros', 'GO', true, false),
  ('00000000-0000-0000-0000-000000000001', 'Fazenda Progresso', 'GO-5204300-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', -18.4100, -52.6500, 2800, 'Chapadão do Céu', 'GO', true, false)
ON CONFLICT DO NOTHING;

-- Consulta de exemplo
INSERT INTO consultas (usuario_id, latitude, longitude, car_codigo, resultado)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  -17.8500,
  -50.9200,
  'GO-5219803-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  '{"car": {"codigo": "GO-5219803-XXXX", "status": "Ativo", "area_ha": 1240, "municipio": "Rio Verde", "estado": "GO"}, "embargos": [], "consultado_em": "2026-05-22T10:00:00Z"}'::jsonb
) ON CONFLICT DO NOTHING;

-- Alerta de exemplo
INSERT INTO alertas (propriedade_id, usuario_id, tipo, descricao, enviado)
SELECT p.id, p.usuario_id, 'embargo_ibama', '1 novo embargo IBAMA detectado próximo à propriedade', true
FROM propriedades p
WHERE p.nome = 'Sítio Boa Vista'
ON CONFLICT DO NOTHING;
