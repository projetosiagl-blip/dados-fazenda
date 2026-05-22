# Dados Fazenda

Sistema SaaS de consulta e monitoramento de imóveis rurais brasileiros. Acesse dados de CAR, INCRA, SIGEF, embargos IBAMA, terras indígenas e +25 camadas geográficas via WhatsApp ou painel web.

## Stack

- **Frontend/Backend:** Next.js 16 (App Router, TypeScript)
- **Banco de dados:** Supabase (PostgreSQL + PostGIS)
- **WhatsApp:** Evolution API
- **Pagamento:** Asaas (PIX + cartão + recorrência)
- **Hospedagem:** Netlify
- **PDF:** Puppeteer

## Configuração

### 1. Clonar e instalar

```bash
git clone https://github.com/projetosiagl-blip/dados-fazenda.git
cd dados-fazenda
npm install
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha `.env.local`:

| Variável | Onde encontrar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → Chave publicável |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → Chaves secretas |
| `EVOLUTION_API_URL` | URL da sua instância Evolution API |
| `EVOLUTION_API_KEY` | Chave configurada na Evolution API |
| `EVOLUTION_INSTANCE` | Nome da instância (ex: `dados-fazenda`) |
| `INFOSIMPLES_TOKEN` | infosimples.com → Conta → API Token |
| `NETRIN_API_KEY` | netrin.com.br → Área do cliente |
| `ASAAS_API_KEY` | Asaas → Configurações → API |
| `ASAAS_ENV` | `sandbox` para testes, `production` para produção |
| `ASAAS_WEBHOOK_TOKEN` | String aleatória para validar webhooks |
| `CRON_SECRET` | String aleatória para proteger os cron jobs |
| `NEXT_PUBLIC_APP_URL` | URL do app em produção |

### 3. Banco de dados

No **Supabase SQL Editor**, execute em ordem:

```
1. supabase/schema.sql   → Cria todas as tabelas e funções PostGIS
2. supabase/fixes.sql    → Correções e constraints adicionais
3. supabase/storage.sql  → Cria bucket de relatórios PDF
```

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

## Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── planos/                     # Página de planos
│   ├── auth/
│   │   ├── login/                  # Login
│   │   ├── cadastro/               # Cadastro
│   │   └── logout/                 # Logout (route handler)
│   ├── dashboard/
│   │   ├── layout.tsx              # Sidebar + layout do painel
│   │   ├── page.tsx                # Painel principal
│   │   ├── propriedades/           # Lista e detalhe de propriedades
│   │   ├── historico/              # Histórico de consultas
│   │   ├── alertas/                # Central de alertas
│   │   ├── configuracoes/          # Conta e assinatura
│   │   └── plano/                  # Upgrade de plano
│   └── api/
│       ├── webhook/whatsapp/       # Recebe mensagens WhatsApp
│       ├── webhook/pagamento/      # Webhooks do Asaas
│       ├── planos/assinar/         # Cria assinatura no Asaas
│       ├── propriedades/[id]/      # CRUD de propriedades
│       └── cron/
│           ├── sincronizar-ibama/  # Sync embargos IBAMA (diário)
│           ├── sincronizar-queimadas/ # Sync INPE (diário)
│           ├── monitorar-propriedades/ # Detecta mudanças (diário)
│           └── farm-scan/          # Gera PDF mensal (mensal)
├── lib/
│   ├── supabase/                   # Client e server do Supabase
│   ├── whatsapp/                   # Evolution API + parser de mensagens
│   ├── apis/                       # Infosimples, Netrin, IBAMA
│   ├── pagamento/                  # Asaas
│   ├── pdf/                        # Geração do Farm Scan PDF
│   ├── consulta.ts                 # Orquestra a consulta completa
│   └── env.ts                      # Validação de variáveis de ambiente
├── components/ui/
│   └── SidebarMobile.tsx           # Menu hambúrguer mobile
└── types/
    └── index.ts                    # TypeScript types
```

## Cron Jobs

Configure no painel do Netlify (Build & Deploy → Scheduled Functions) ou use um serviço externo (cron-job.org, EasyCron):

| Endpoint | Frequência | O que faz |
|---|---|---|
| `/api/cron/sincronizar-ibama` | Diário 06:00 | Sincroniza embargos IBAMA |
| `/api/cron/sincronizar-queimadas` | Diário 07:00 | Importa focos do INPE |
| `/api/cron/monitorar-propriedades` | Diário 08:00 | Detecta mudanças e envia alertas |
| `/api/cron/farm-scan` | Mensal dia 1 | Gera e envia PDF a clientes Full+ |

Todos os crons requerem o header: `x-cron-secret: [CRON_SECRET]`

## Importação de dados geográficos

Para popular as camadas geográficas (terras indígenas, assentamentos, UCs):

```bash
pip install geopandas psycopg2-binary shapely
SUPABASE_DB_URL="postgresql://..." python scripts/importar-shapefiles.py
```

## Webhooks necessários

Configure no painel do Asaas a URL:
```
https://seu-dominio.com/api/webhook/pagamento
```

Configure na Evolution API o webhook:
```
https://seu-dominio.com/api/webhook/whatsapp
```

## Deploy

O deploy é automático via Netlify ao fazer push na branch `main`.

Para deploy manual:
```bash
npm run build
```
