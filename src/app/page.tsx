import Link from 'next/link'
import { MapPin, Bell, FileText, Check, X, MessageCircle, Map, Shield, Layers, Leaf, Scale, Building2, TrendingUp } from 'lucide-react'
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1 }

export const metadata: Metadata = {
  title: 'Dados Fazenda — Consulta de Imóveis Rurais em Segundos',
  description: 'Acesse dados de CAR, INCRA, embargos IBAMA, terras indígenas e mais de 25 camadas de informação rural. Consulte qualquer fazenda do Brasil pelo WhatsApp ou painel web.',
  keywords: 'consulta rural, CAR, INCRA, SIGEF, imóvel rural, fazenda, embargos IBAMA, dados rurais, monitoramento rural',
}

const CAMADAS_BASICO = [
  'Dados CAR / SICAR',
  'INCRA / SIGEF',
  'Matrícula e CCIR',
  'Área e limites',
  'Embargos IBAMA',
  'Terras Indígenas',
  'Assentamentos INCRA',
  'ICMBio',
  'UCs Estaduais e Municipais',
  'Camada PRODES (desmatamento)',
]

const CAMADAS_FULL = [
  'Área de Queimadas',
  'Composição do solo',
  'Histórico de precipitação',
  'Aptidão Agrícola',
  'Outorgas Superficial e Subterrânea',
  'Pivôs de Irrigação',
  'Aeródromos',
  'CONAB Safras',
  'Armazéns CONAB',
  'Mineração (ANM)',
  'Florestas Públicas',
  'Sítios Arqueológicos',
]

const COMPARATIVO = [
  { recurso: 'Consultas ilimitadas', basico: true, full: true, empresarial: true },
  { recurso: 'Dados CAR / SICAR', basico: true, full: true, empresarial: true },
  { recurso: 'INCRA / SIGEF / CCIR', basico: true, full: true, empresarial: true },
  { recurso: 'Embargos IBAMA', basico: true, full: true, empresarial: true },
  { recurso: 'Terras Indígenas', basico: true, full: true, empresarial: true },
  { recurso: 'PRODES (desmatamento)', basico: true, full: true, empresarial: true },
  { recurso: 'UCs e ICMBio', basico: true, full: true, empresarial: true },
  { recurso: 'Assentamentos INCRA', basico: true, full: true, empresarial: true },
  { recurso: 'Consulta via WhatsApp', basico: true, full: true, empresarial: true },
  { recurso: 'Painel web', basico: true, full: true, empresarial: true },
  { recurso: 'Monitoramento contínuo', basico: false, full: true, empresarial: true },
  { recurso: 'Alertas automáticos WhatsApp', basico: false, full: true, empresarial: true },
  { recurso: 'Farm Scan — relatório PDF mensal', basico: false, full: true, empresarial: true },
  { recurso: 'Queimadas e precipitação', basico: false, full: true, empresarial: true },
  { recurso: 'Aptidão agrícola e solo', basico: false, full: true, empresarial: true },
  { recurso: 'Pivôs de irrigação', basico: false, full: true, empresarial: true },
  { recurso: 'Outorgas hídricas', basico: false, full: true, empresarial: true },
  { recurso: 'Mineração e florestas públicas', basico: false, full: true, empresarial: true },
  { recurso: 'CONAB safras e armazéns', basico: false, full: true, empresarial: true },
  { recurso: '2 acessos inclusos', basico: false, full: false, empresarial: true },
  { recurso: 'Gestão de equipe', basico: false, full: false, empresarial: true },
  { recurso: 'Usuários extras (R$ 149/mês)', basico: false, full: false, empresarial: true },
]

const FAQ_ITEMS = [
  { p: 'Os dados são atualizados com que frequência?', r: 'CAR e INCRA são consultados em tempo real. Embargos IBAMA e queimadas sincronizam diariamente. Camadas estáticas (terras indígenas, UCs) atualizam mensalmente.' },
  { p: 'Preciso de um celular específico?', r: 'Não. Use seu WhatsApp normalmente. Salve o número do Dados Fazenda na agenda e envie sua localização ou o código CAR.' },
  { p: 'Os dados substituem documentos oficiais?', r: 'Não. Os dados são para fins informativos e de monitoramento. Para fins jurídicos, consulte sempre os documentos originais nos sistemas governamentais.' },
  { p: 'Posso monitorar propriedades de terceiros?', r: 'Sim. Cadastre qualquer imóvel rural do Brasil, independente de ser proprietário. Advogados e corretores usam para acompanhar imóveis de clientes.' },
  { p: 'O que acontece se eu cancelar?', r: 'Você pode cancelar a qualquer momento. O acesso permanece ativo até o fim do período pago. Sem multa ou fidelidade mínima.' },
  { p: 'Quantas consultas posso fazer?', r: 'Consultas ilimitadas em todos os planos. Não cobramos por consulta — só a mensalidade do seu plano.' },
]

function IconCheck() {
  return <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#2d6a4f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={12} color="white" strokeWidth={3} /></div>
}

function IconX() {
  return <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#e8eee4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><X size={11} color="#9aab8e" strokeWidth={3} /></div>
}

export default function Home() {
  return (
    <div style={{ backgroundColor: '#f5f7f2', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* HEADER */}
      <header style={{ backgroundColor: '#1e4d2b', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, backgroundColor: '#52b788', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={18} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.3px' }}>Dados Fazenda</span>
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            <a href="#como-funciona" style={{ color: '#a8d5b5', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Como funciona</a>
            <a href="#planos" style={{ color: '#a8d5b5', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Planos</a>
            <a href="#faq" style={{ color: '#a8d5b5', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>FAQ</a>
            <Link href="/auth/login" style={{ color: '#a8d5b5', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Entrar</Link>
            <Link href="/auth/cadastro" style={{ backgroundColor: '#52b788', color: 'white', padding: '0.5rem 1.25rem', borderRadius: 6, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}>
              Consultar agora
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ backgroundColor: '#1a3d22', background: 'linear-gradient(135deg, #1a3d22 0%, #2d6a4f 100%)', padding: '5rem 1.5rem 6rem' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(82,183,136,0.15)', border: '1px solid rgba(82,183,136,0.3)', borderRadius: 20, padding: '0.35rem 0.875rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 6, height: 6, backgroundColor: '#52b788', borderRadius: '50%' }} />
              <span style={{ color: '#52b788', fontSize: '0.78rem', fontWeight: 600 }}>25+ camadas de dados rurais</span>
            </div>
            <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem', letterSpacing: '-1.5px' }}>
              Consulte qualquer fazenda do Brasil em segundos
            </h1>
            <p style={{ color: '#a8d5b5', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 480 }}>
              Acesse dados de CAR, INCRA, embargos IBAMA, terras indígenas e muito mais — direto pelo WhatsApp ou pelo painel web.
            </p>
            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
              <Link href="/auth/cadastro" style={{ backgroundColor: '#52b788', color: 'white', padding: '0.875rem 2rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', display: 'inline-block' }}>
                Começar agora
              </Link>
              <a href="#como-funciona" style={{ backgroundColor: 'transparent', color: 'white', padding: '0.875rem 1.75rem', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.25)', display: 'inline-block' }}>
                Ver como funciona
              </a>
            </div>
            <p style={{ color: 'rgba(168,213,181,0.6)', fontSize: '0.78rem', marginTop: '1rem' }}>Sem contrato · Cancele quando quiser</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '2rem', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#28c840' }} />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginLeft: 8 }}>WhatsApp · Dados Fazenda</span>
            </div>
            {[
              { de: 'Você', msg: '📍 [Localização compartilhada]', lado: 'right' },
              { de: 'Bot', msg: '⏳ Consultando dados da propriedade...', lado: 'left' },
              { de: 'Bot', msg: '🌾 DADOS DA PROPRIEDADE\n━━━━━━━━━━━\n📋 CAR: GO-5219803-XXXX\n• Status: Ativo ✅\n• Área: 1.240 ha\n• Rio Verde - GO\n\n🏛️ INCRA/SIGEF\n• CCIR: 12345678\n• Titular: João Silva\n\n🚨 IBAMA: ✅ Sem embargos', lado: 'left' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: item.lado === 'right' ? 'flex-end' : 'flex-start', marginBottom: '0.625rem' }}>
                <div style={{ backgroundColor: item.lado === 'right' ? '#2d6a4f' : 'rgba(255,255,255,0.1)', borderRadius: item.lado === 'right' ? '12px 12px 2px 12px' : '12px 12px 12px 2px', padding: '0.5rem 0.75rem', maxWidth: '85%' }}>
                  <p style={{ color: 'white', fontSize: '0.75rem', lineHeight: 1.5, whiteSpace: 'pre-line', margin: 0 }}>{item.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DADOS DISPONÍVEIS */}
      <section style={{ backgroundColor: '#2d6a4f', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: '#6b9e7e', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dados inclusos:</span>
          {['CAR/SICAR', 'INCRA/SIGEF', 'CCIR', 'Embargos IBAMA', 'Terras Indígenas', 'PRODES', 'Queimadas', 'Mineração ANM'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Check size={12} color="#52b788" strokeWidth={3} />
              <span style={{ color: '#c8e6d4', fontSize: '0.82rem', fontWeight: 500 }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: '#2d6a4f', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Simples assim</span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#1a1a1a', marginTop: '0.5rem', letterSpacing: '-0.5px' }}>Como funciona</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { n: '01', icon: <MessageCircle size={24} color="#2d6a4f" />, titulo: 'Envie a localização', texto: 'Compartilhe sua localização pelo WhatsApp, cole um link do Google Maps ou informe o código CAR da propriedade.' },
              { n: '02', icon: <Map size={24} color="#2d6a4f" />, titulo: 'Receba os dados', texto: 'Em segundos você recebe o relatório completo: CAR, INCRA, embargos, terras indígenas e todas as camadas do seu plano.' },
              { n: '03', icon: <Bell size={24} color="#2d6a4f" />, titulo: 'Monitore e receba alertas', texto: 'Cadastre suas fazendas e receba alertas automáticos no WhatsApp quando qualquer dado mudar — embargos, queimadas e mais.' },
            ].map(item => (
              <div key={item.n} style={{ backgroundColor: 'white', border: '1px solid #e2e8d5', borderRadius: 12, padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 48, height: 48, backgroundColor: '#f0f7f2', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </div>
                  <span style={{ color: '#b7882c', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.05em' }}>PASSO {item.n}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a', marginBottom: '0.625rem' }}>{item.titulo}</h3>
                <p style={{ color: '#5a6a5a', fontSize: '0.875rem', lineHeight: 1.7 }}>{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O QUE VOCÊ RECEBE */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: 'white', borderTop: '1px solid #e2e8d5', borderBottom: '1px solid #e2e8d5' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: '#2d6a4f', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dados completos</span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#1a1a1a', marginTop: '0.5rem', letterSpacing: '-0.5px' }}>O que você recebe em cada consulta</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { icon: <FileText size={20} color="#2d6a4f" />, titulo: 'CAR / SICAR', desc: 'Código, status, área, município, proprietário e polígono geográfico da propriedade.' },
              { icon: <Shield size={20} color="#2d6a4f" />, titulo: 'INCRA / SIGEF', desc: 'Georreferenciamento oficial, CCIR, NIRF, titulares e situação cadastral.' },
              { icon: <MapPin size={20} color="#2d6a4f" />, titulo: 'Embargos IBAMA', desc: 'Verificação de embargos ambientais ativos no entorno da propriedade.' },
              { icon: <Layers size={20} color="#2d6a4f" />, titulo: 'Terras Indígenas', desc: 'Sobreposição com áreas indígenas demarcadas pela FUNAI.' },
              { icon: <Map size={20} color="#2d6a4f" />, titulo: 'Unidades de Conservação', desc: 'ICMBio, UCs estaduais e municipais que interceptam o imóvel.' },
              { icon: <Bell size={20} color="#2d6a4f" />, titulo: 'PRODES', desc: 'Dados de desmatamento do INPE na região da propriedade.' },
            ].map(item => (
              <div key={item.titulo} style={{ backgroundColor: '#f8faf6', border: '1px solid #e2e8d5', borderRadius: 10, padding: '1.5rem' }}>
                <div style={{ width: 40, height: 40, backgroundColor: '#e8f4ee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.875rem' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a', marginBottom: '0.4rem' }}>{item.titulo}</h3>
                <p style={{ color: '#5a6a5a', fontSize: '0.82rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONSULTA AVULSA */}
      <section id="consulta-avulsa" style={{ padding: '5rem 1.5rem', backgroundColor: '#f5f7f2', borderTop: '1px solid #e2e8d5' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: '#b7882c', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sem assinatura</span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#1a1a1a', marginTop: '0.5rem', letterSpacing: '-0.5px' }}>
              Consulta única · Pague e receba agora
            </h2>
            <p style={{ color: '#5a6a5a', marginTop: '0.75rem', fontSize: '0.95rem' }}>
              Ideal para quem precisa de uma consulta pontual sem compromisso mensal
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', maxWidth: 720, margin: '0 auto' }}>
            {/* Consulta */}
            <div style={{ backgroundColor: 'white', border: '1px solid #e2e8d5', borderRadius: 12, padding: '2rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a', marginBottom: '0.25rem' }}>Consulta</h3>
              <p style={{ color: '#5a6a5a', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Resultado no WhatsApp em segundos</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#1e4d2b', letterSpacing: '-1px' }}>R$ 19,90</span>
                <span style={{ color: '#5a6a5a', fontSize: '0.875rem' }}>por consulta</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['CAR + INCRA + SIGEF', 'Embargos IBAMA', 'Terras Indígenas e UCs', 'Entrega no WhatsApp'].map(r => (
                  <li key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#3a4a3a' }}>
                    <Check size={13} color="#2d6a4f" strokeWidth={3} />{r}
                  </li>
                ))}
              </ul>
              <Link href="/consulta?tipo=consulta" style={{ display: 'block', textAlign: 'center', backgroundColor: '#f0f7f2', color: '#2d6a4f', padding: '0.8rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', border: '1px solid #c8dfc8' }}>
                Consultar agora
              </Link>
            </div>

            {/* Relatório */}
            <div style={{ backgroundColor: 'white', border: '2px solid #2d6a4f', borderRadius: 12, padding: '2rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#b7882c', color: 'white', padding: '0.15rem 0.875rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                MAIS COMPLETO
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a', marginBottom: '0.25rem' }}>Relatório Completo</h3>
              <p style={{ color: '#5a6a5a', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Farm Scan PDF + WhatsApp</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#1e4d2b', letterSpacing: '-1px' }}>R$ 49,90</span>
                <span style={{ color: '#5a6a5a', fontSize: '0.875rem' }}>por relatório</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['Tudo da Consulta', 'Farm Scan PDF completo', 'Queimadas e desmatamento', 'Download disponível por 7 dias'].map(r => (
                  <li key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#3a4a3a' }}>
                    <Check size={13} color="#2d6a4f" strokeWidth={3} />{r}
                  </li>
                ))}
              </ul>
              <Link href="/consulta?tipo=relatorio" style={{ display: 'block', textAlign: 'center', backgroundColor: '#2d6a4f', color: 'white', padding: '0.8rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                Gerar relatório
              </Link>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: '#6a7a6a' }}>
            Precisa de consultas frequentes?{' '}
            <a href="#planos" style={{ color: '#2d6a4f', fontWeight: 600, textDecoration: 'none' }}>
              Veja os planos de assinatura →
            </a>
          </p>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: '#2d6a4f', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Preços e planos</span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#1a1a1a', marginTop: '0.5rem', letterSpacing: '-0.5px' }}>O plano certo para você</h2>
            <p style={{ color: '#5a6a5a', marginTop: '0.75rem', fontSize: '0.95rem' }}>Consultas ilimitadas em todos os planos · Sem cobrança por consulta</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>

            {/* BÁSICO */}
            <div style={{ backgroundColor: 'white', border: '1px solid #e2e8d5', borderRadius: 12, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a1a1a', marginBottom: '0.25rem' }}>Básico</h3>
                <p style={{ color: '#5a6a5a', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Para consultas pontuais de imóveis rurais</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1e4d2b', letterSpacing: '-1px' }}>R$ 59,90</span>
                  <span style={{ color: '#5a6a5a', fontSize: '0.875rem' }}>/mês</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2d6a4f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>10 camadas inclusas</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  {CAMADAS_BASICO.map(c => (
                    <li key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#3a4a3a' }}>
                      <IconCheck />{c}
                    </li>
                  ))}
                </ul>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2d6a4f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Funcionalidades</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  {['Consultas ilimitadas', 'Consulta via WhatsApp', 'Painel web completo', 'Histórico de consultas'].map(c => (
                    <li key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#3a4a3a' }}>
                      <IconCheck />{c}
                    </li>
                  ))}
                  {['Monitoramento contínuo', 'Alertas WhatsApp', 'Farm Scan PDF'].map(c => (
                    <li key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#9aab8e' }}>
                      <IconX />{c}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/auth/cadastro?plano=basico" style={{ display: 'block', textAlign: 'center', backgroundColor: '#f0f7f2', color: '#2d6a4f', padding: '0.8rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', border: '1px solid #c8dfc8' }}>
                Assinar Básico
              </Link>
            </div>

            {/* FULL */}
            <div style={{ backgroundColor: '#1e4d2b', border: '2px solid #2d6a4f', borderRadius: 12, padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#b7882c', color: 'white', padding: '0.2rem 1rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                MELHOR CUSTO-BENEFÍCIO
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'white', marginBottom: '0.25rem' }}>Full</h3>
                <p style={{ color: '#a8d5b5', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Monitoramento completo com alertas automáticos</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'white', letterSpacing: '-1px' }}>R$ 99,90</span>
                  <span style={{ color: '#a8d5b5', fontSize: '0.875rem' }}>/mês</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#52b788', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Tudo do Básico +</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                  {['Monitoramento contínuo', 'Alertas automáticos WhatsApp', 'Farm Scan — PDF mensal'].map(c => (
                    <li key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#c8e6d4' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#52b788', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={12} color="white" strokeWidth={3} /></div>
                      {c}
                    </li>
                  ))}
                </ul>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#52b788', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>+12 camadas exclusivas</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {CAMADAS_FULL.map(c => (
                    <li key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: '#a8d5b5' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'rgba(82,183,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={11} color="#52b788" strokeWidth={3} /></div>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/auth/cadastro?plano=full" style={{ display: 'block', textAlign: 'center', backgroundColor: '#52b788', color: 'white', padding: '0.8rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                Assinar Full
              </Link>
            </div>

            {/* EMPRESARIAL */}
            <div style={{ backgroundColor: 'white', border: '1px solid #e2e8d5', borderRadius: 12, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a1a1a', marginBottom: '0.25rem' }}>Empresarial</h3>
                <p style={{ color: '#5a6a5a', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Para escritórios e times com múltiplas propriedades</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1e4d2b', letterSpacing: '-1px' }}>R$ 397</span>
                  <span style={{ color: '#5a6a5a', fontSize: '0.875rem' }}>/mês</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2d6a4f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Tudo do Full +</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  {['2 acessos Full inclusos', 'Gestão de equipe e time', 'Usuários extras: R$ 149/mês', 'Dashboard centralizado', 'Suporte prioritário'].map(c => (
                    <li key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#3a4a3a' }}>
                      <IconCheck />{c}
                    </li>
                  ))}
                </ul>
                <div style={{ backgroundColor: '#f8faf6', borderRadius: 8, padding: '0.875rem', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.8rem', color: '#5a6a5a', lineHeight: 1.5 }}>
                    Ideal para <strong style={{ color: '#1a1a1a' }}>advogados do agro</strong>, <strong style={{ color: '#1a1a1a' }}>imobiliárias rurais</strong> e <strong style={{ color: '#1a1a1a' }}>escritórios de consultoria</strong>.
                  </p>
                </div>
              </div>
              <Link href="/auth/cadastro?plano=empresarial" style={{ display: 'block', textAlign: 'center', backgroundColor: '#f0f7f2', color: '#2d6a4f', padding: '0.8rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', border: '1px solid #c8dfc8' }}>
                Assinar Empresarial
              </Link>
            </div>
          </div>

          {/* TABELA COMPARATIVA */}
          <div style={{ backgroundColor: 'white', border: '1px solid #e2e8d5', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8d5' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>Comparativo completo de recursos</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8faf6' }}>
                    <th style={{ padding: '0.875rem 2rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: '#5a6a5a', textTransform: 'uppercase', letterSpacing: '0.05em', width: '50%' }}>Recurso</th>
                    {['Básico', 'Full', 'Empresarial'].map(p => (
                      <th key={p} style={{ padding: '0.875rem 1.5rem', textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#5a6a5a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARATIVO.map((item, i) => (
                    <tr key={item.recurso} style={{ borderTop: '1px solid #f0f4ec', backgroundColor: i % 2 === 0 ? 'white' : '#fafcfa' }}>
                      <td style={{ padding: '0.75rem 2rem', fontSize: '0.875rem', color: '#3a4a3a', fontWeight: 500 }}>{item.recurso}</td>
                      {[item.basico, item.full, item.empresarial].map((val, j) => (
                        <td key={j} style={{ padding: '0.75rem 1.5rem', textAlign: 'center' }}>
                          {val
                            ? <Check size={18} color="#2d6a4f" strokeWidth={2.5} style={{ margin: '0 auto', display: 'block' }} />
                            : <X size={16} color="#d4ddc8" strokeWidth={2} style={{ margin: '0 auto', display: 'block' }} />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* PARA QUEM */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: 'white', borderTop: '1px solid #e2e8d5' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.5px' }}>Para quem é o Dados Fazenda</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: <Leaf size={22} color="#2d6a4f" />, titulo: 'Produtores Rurais', desc: 'Consulte e monitore suas propriedades com facilidade pelo celular, sem precisar aprender sistemas complexos.' },
              { icon: <Scale size={22} color="#2d6a4f" />, titulo: 'Advogados do Agro', desc: 'Acesse dados fundiários e ambientais com precisão e velocidade para suas análises e due diligence.' },
              { icon: <Building2 size={22} color="#2d6a4f" />, titulo: 'Corretores Rurais', desc: 'Consulte qualquer fazenda antes de fechar negócio. Em segundos você tem tudo que precisa.' },
              { icon: <TrendingUp size={22} color="#2d6a4f" />, titulo: 'Investidores', desc: 'Due diligence completa de propriedades rurais em todo o Brasil antes de qualquer decisão de compra.' },
            ].map(item => (
              <div key={item.titulo} style={{ backgroundColor: '#f8faf6', border: '1px solid #e2e8d5', borderRadius: 12, padding: '1.75rem' }}>
                <div style={{ width: 44, height: 44, backgroundColor: '#e8f4ee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>{item.titulo}</h3>
                <p style={{ color: '#5a6a5a', fontSize: '0.85rem', lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '5rem 1.5rem', borderTop: '1px solid #e2e8d5' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: '#2d6a4f', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dúvidas</span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#1a1a1a', marginTop: '0.5rem', letterSpacing: '-0.5px' }}>Perguntas frequentes</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} style={{ backgroundColor: 'white', border: '1px solid #e2e8d5', borderRadius: 10, padding: '1.25rem 1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.925rem', color: '#1a1a1a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  {item.p}
                </h3>
                <p style={{ color: '#5a6a5a', fontSize: '0.875rem', lineHeight: 1.65 }}>{item.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ backgroundColor: '#1e4d2b', background: 'linear-gradient(135deg, #1a3d22 0%, #2d6a4f 100%)', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.5px' }}>
            Pronto para consultar sua fazenda?
          </h2>
          <p style={{ color: '#a8d5b5', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.6 }}>
            Comece agora e tenha acesso imediato aos dados rurais que você precisa.
          </p>
          <Link href="/auth/cadastro" style={{ backgroundColor: '#52b788', color: 'white', padding: '0.925rem 2.5rem', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '1rem', display: 'inline-block' }}>
            Criar conta gratuita
          </Link>
          <p style={{ color: 'rgba(168,213,181,0.5)', fontSize: '0.78rem', marginTop: '1rem' }}>Sem cartão de crédito para começar</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#152d1a', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.875rem' }}>
                <div style={{ width: 28, height: 28, backgroundColor: '#52b788', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={15} color="white" />
                </div>
                <span style={{ color: '#a8d5b5', fontWeight: 700 }}>Dados Fazenda</span>
              </div>
              <p style={{ color: '#4a6a52', fontSize: '0.78rem', lineHeight: 1.7 }}>
                LGE SOLUCOES LTDA.<br />
                CNPJ 50.571.717/0001-61<br />
                Av. Contorno, Qd. 67, Lt. 19A — Centro<br />
                Ivolândia — GO
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: '#6b9e7e', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Links</span>
              <Link href="/termos" style={{ color: '#6b9e7e', fontSize: '0.82rem', textDecoration: 'none' }}>Termos de uso</Link>
              <Link href="/privacidade" style={{ color: '#6b9e7e', fontSize: '0.82rem', textDecoration: 'none' }}>Privacidade</Link>
              <Link href="/planos" style={{ color: '#6b9e7e', fontSize: '0.82rem', textDecoration: 'none' }}>Planos</Link>
              <Link href="/contato" style={{ color: '#6b9e7e', fontSize: '0.82rem', textDecoration: 'none' }}>Contato</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: '#6b9e7e', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Contato</span>
              <a href="mailto:projetosiagl@gmail.com" style={{ color: '#6b9e7e', fontSize: '0.82rem', textDecoration: 'none' }}>projetosiagl@gmail.com</a>
              <a href="https://wa.me/5562942631425" target="_blank" rel="noreferrer" style={{ color: '#6b9e7e', fontSize: '0.82rem', textDecoration: 'none' }}>+55 62 94263-1425</a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1e3d24', paddingTop: '1.5rem' }}>
            <p style={{ color: '#3d6b45', fontSize: '0.75rem', textAlign: 'center' }}>© 2026 Dados Fazenda · LGE SOLUCOES LTDA. · CNPJ 50.571.717/0001-61 · Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
