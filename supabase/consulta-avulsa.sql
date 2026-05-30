-- Tabela para consultas avulsas (pagamento único, sem assinatura)
CREATE TABLE IF NOT EXISTS consultas_avulsas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL CHECK (tipo IN ('consulta', 'relatorio')),
  nome text,
  telefone text NOT NULL,
  email text,
  car_codigo text,
  latitude numeric,
  longitude numeric,
  municipio text,
  estado text,
  status_pagamento text NOT NULL DEFAULT 'pendente'
    CHECK (status_pagamento IN ('pendente', 'pago', 'processando', 'entregue', 'falhou')),
  asaas_payment_id text UNIQUE,
  resultado jsonb,
  pdf_url text,
  expira_em timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  criado_em timestamptz NOT NULL DEFAULT now()
);

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_consultas_avulsas_asaas ON consultas_avulsas (asaas_payment_id);
CREATE INDEX IF NOT EXISTS idx_consultas_avulsas_telefone ON consultas_avulsas (telefone);
CREATE INDEX IF NOT EXISTS idx_consultas_avulsas_criado ON consultas_avulsas (criado_em DESC);

-- RLS: leitura pública por id (para página /relatorio/[id])
ALTER TABLE consultas_avulsas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública por id"
  ON consultas_avulsas FOR SELECT
  USING (true);

CREATE POLICY "Inserção via service role"
  ON consultas_avulsas FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Atualização via service role"
  ON consultas_avulsas FOR UPDATE
  USING (true);
