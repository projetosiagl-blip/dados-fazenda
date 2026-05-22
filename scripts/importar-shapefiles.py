#!/usr/bin/env python3
"""
Script de importação de shapefiles do governo para o Supabase/PostGIS
Execute uma vez para popular o banco com dados geográficos.

Pré-requisitos:
  pip install geopandas psycopg2-binary shapely sqlalchemy

Uso:
  python scripts/importar-shapefiles.py
"""

import os
import sys
import geopandas as gpd
import psycopg2
from psycopg2.extras import execute_values
from shapely.geometry import mapping
import json

# ============================================================
# CONFIGURAÇÃO — preencha com seus dados do Supabase
# ============================================================
SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL", "postgresql://postgres:[SENHA]@db.[PROJETO].supabase.co:5432/postgres")

# ============================================================
# FONTES DE DADOS DO GOVERNO (URLs públicas)
# ============================================================
FONTES = {
    "terras_indigenas": {
        "url": "https://geoserver.funai.gov.br/geoserver/Funai/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=Funai:tis_poligonais&outputFormat=SHAPE-ZIP",
        "tabela": "terras_indigenas",
        "campos": {"terrai_nom": "nome", "etnia_nome": "etnia", "municipio_": "municipio", "uf_sigla": "estado", "fase_ti": "situacao"}
    },
    "assentamentos": {
        "url": "https://certificacao.incra.gov.br/csv_shp/exp_shp.py?SR=SIRGAS2000&SIG_TIPO=PA&MUN=&UF=&OS=&NUMBER=&BASE=&HIST=&GER=&INTERV=&OBSERVACAO=&TIPO_PROJ=&DT_CRIACAO_INICIAL=&DT_CRIACAO_FINAL=&DT_PESQ_INICIAL=&DT_PESQ_FINAL=",
        "tabela": "assentamentos",
        "campos": {"nome_proje": "nome", "municipio": "municipio", "uf": "estado", "capacidade": "capacidade"}
    },
    "unidades_conservacao": {
        "url": "https://www.mma.gov.br/estruturas/sbf2008_cnuc2/_arquivos/cnuc_2023.zip",
        "tabela": "unidades_conservacao",
        "campos": {"nome_uc1": "nome", "categori3": "categoria", "grupo3": "grupo", "esfera3": "esfera", "municipio": "municipio", "sigla_uf": "estado"}
    },
}

def conectar():
    return psycopg2.connect(SUPABASE_DB_URL)

def geom_para_wkt(geom):
    """Converte geometria shapely para WKT com SRID."""
    if geom is None:
        return None
    return f"SRID=4326;{geom.wkt}"

def importar_shapefile(nome, config, conn):
    print(f"\n📥 Importando {nome}...")
    try:
        gdf = gpd.read_file(config["url"])

        if gdf.crs and gdf.crs.to_epsg() != 4326:
            print(f"  Reprojetando de {gdf.crs.to_epsg()} para 4326...")
            gdf = gdf.to_crs(epsg=4326)

        tabela = config["tabela"]
        campos = config["campos"]

        cur = conn.cursor()
        registros = []

        for _, row in gdf.iterrows():
            registro = {}
            for col_origem, col_destino in campos.items():
                if col_origem in row.index:
                    valor = row[col_origem]
                    registro[col_destino] = str(valor) if valor and str(valor) != 'nan' else None

            if row.geometry is not None:
                registro['geom'] = geom_para_wkt(row.geometry)

            registros.append(registro)

        if not registros:
            print(f"  Nenhum registro encontrado.")
            return 0

        colunas = list(registros[0].keys())
        valores = [[r.get(c) for c in colunas] for r in registros]

        sql = f"""
            INSERT INTO {tabela} ({', '.join(colunas)})
            VALUES %s
            ON CONFLICT DO NOTHING
        """
        execute_values(cur, sql, valores)
        conn.commit()
        cur.close()

        print(f"  ✅ {len(registros)} registros importados.")
        return len(registros)

    except Exception as e:
        print(f"  ❌ Erro: {e}")
        conn.rollback()
        return 0

def main():
    print("=" * 60)
    print("IMPORTAÇÃO DE SHAPEFILES — Dados Fazenda")
    print("=" * 60)

    try:
        conn = conectar()
        print("\n✅ Conectado ao banco de dados.")
    except Exception as e:
        print(f"\n❌ Erro ao conectar: {e}")
        sys.exit(1)

    total = 0
    for nome, config in FONTES.items():
        total += importar_shapefile(nome, config, conn)

    conn.close()
    print(f"\n{'=' * 60}")
    print(f"✅ Importação concluída — {total} registros no total.")
    print(f"{'=' * 60}")

if __name__ == "__main__":
    main()
