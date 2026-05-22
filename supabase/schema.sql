-- ============================================
-- DADOS FAZENDA — Schema completo do banco
-- Execute no Supabase SQL Editor
-- ============================================

-- Habilita extensão geográfica
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- TABELAS DE NEGÓCIO
-- ============================================

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telefone TEXT UNIQUE NOT NULL,
  nome TEXT,
  email TEXT,
  plano TEXT CHECK (plano IN ('basico', 'full', 'empresarial')),
  status_assinatura TEXT CHECK (status_assinatura IN ('ativa', 'cancelada', 'inadimplente', 'trial')),
  asaas_customer_id TEXT,
  asaas_subscription_id TEXT,
  empresa_id UUID,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  admin_id UUID REFERENCES usuarios(id),
  plano TEXT DEFAULT 'empresarial',
  max_usuarios INT DEFAULT 2,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE usuarios ADD CONSTRAINT fk_empresa
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS propriedades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  car_codigo TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  area_ha DOUBLE PRECISION,
  municipio TEXT,
  estado TEXT,
  ativa BOOLEAN DEFAULT TRUE,
  monitorada BOOLEAN DEFAULT FALSE,
  ultimo_snapshot JSONB,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consultas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE NOT NULL,
  propriedade_id UUID REFERENCES propriedades(id) ON DELETE SET NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  car_codigo TEXT,
  resultado JSONB,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  propriedade_id UUID REFERENCES propriedades(id) ON DELETE CASCADE NOT NULL,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  dados JSONB,
  enviado BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABELAS GEOGRÁFICAS (PostGIS)
-- ============================================

CREATE TABLE IF NOT EXISTS embargos_ibama (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seq_tad TEXT UNIQUE NOT NULL,
  nome_embargado TEXT,
  municipio TEXT,
  estado TEXT,
  data_embargo TEXT,
  status TEXT DEFAULT 'Ativo',
  geom GEOMETRY(GEOMETRY, 4326),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS terras_indigenas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  etnia TEXT,
  municipio TEXT,
  estado TEXT,
  situacao TEXT,
  geom GEOMETRY(MULTIPOLYGON, 4326),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assentamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  municipio TEXT,
  estado TEXT,
  capacidade INT,
  geom GEOMETRY(MULTIPOLYGON, 4326),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS unidades_conservacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  categoria TEXT,
  grupo TEXT,
  esfera TEXT,
  municipio TEXT,
  estado TEXT,
  geom GEOMETRY(MULTIPOLYGON, 4326),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS queimadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  municipio TEXT,
  estado TEXT,
  data_hora TIMESTAMPTZ,
  satelite TEXT,
  geom GEOMETRY(POINT, 4326),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mineracao_anm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  processo TEXT,
  substancia TEXT,
  municipio TEXT,
  estado TEXT,
  fase TEXT,
  geom GEOMETRY(GEOMETRY, 4326),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pivosCentral (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cultura TEXT,
  municipio TEXT,
  estado TEXT,
  geom GEOMETRY(POLYGON, 4326),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS florestas_publicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT,
  classe TEXT,
  municipio TEXT,
  estado TEXT,
  geom GEOMETRY(MULTIPOLYGON, 4326),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES ESPACIAIS (performance)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_embargos_geom ON embargos_ibama USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_ti_geom ON terras_indigenas USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_assentamentos_geom ON assentamentos USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_uc_geom ON unidades_conservacao USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_queimadas_geom ON queimadas USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_mineracao_geom ON mineracao_anm USING GIST (geom);

-- ============================================
-- FUNÇÕES POSTGIS (consultas geográficas)
-- ============================================

-- Busca embargos próximos a uma coordenada
CREATE OR REPLACE FUNCTION buscar_embargos_proximo(lat FLOAT, lon FLOAT, raio_km FLOAT DEFAULT 10)
RETURNS TABLE (
  seq_tad TEXT, nome_embargado TEXT, data_embargo TEXT, status TEXT, municipio TEXT
) AS $$
  SELECT seq_tad, nome_embargado, data_embargo, status, municipio
  FROM embargos_ibama
  WHERE ST_DWithin(
    geom::geography,
    ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography,
    raio_km * 1000
  )
  ORDER BY data_embargo DESC
  LIMIT 10;
$$ LANGUAGE sql;

-- Verifica em quais camadas um ponto está contido
CREATE OR REPLACE FUNCTION verificar_camadas_ponto(lat FLOAT, lon FLOAT)
RETURNS JSONB AS $$
DECLARE
  ponto GEOMETRY := ST_SetSRID(ST_MakePoint(lon, lat), 4326);
  resultado JSONB := '{}'::JSONB;
  terras TEXT[];
  assentos TEXT[];
  ucs TEXT[];
BEGIN
  SELECT ARRAY_AGG(nome) INTO terras FROM terras_indigenas
    WHERE ST_Contains(geom, ponto);
  SELECT ARRAY_AGG(nome) INTO assentos FROM assentamentos
    WHERE ST_Contains(geom, ponto);
  SELECT ARRAY_AGG(nome) INTO ucs FROM unidades_conservacao
    WHERE ST_Contains(geom, ponto);

  resultado := jsonb_build_object(
    'terras_indigenas', COALESCE(terras, ARRAY[]::TEXT[]),
    'assentamentos', COALESCE(assentos, ARRAY[]::TEXT[]),
    'unidades_conservacao', COALESCE(ucs, ARRAY[]::TEXT[])
  );

  RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE propriedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;

-- Usuário só vê seus próprios dados
CREATE POLICY "usuarios_proprios" ON usuarios
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "propriedades_proprias" ON propriedades
  FOR ALL USING (usuario_id = auth.uid());

CREATE POLICY "consultas_proprias" ON consultas
  FOR ALL USING (usuario_id = auth.uid());

CREATE POLICY "alertas_proprios" ON alertas
  FOR ALL USING (usuario_id = auth.uid());
