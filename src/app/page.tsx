import Link from 'next/link'
import { MapPin, Bell, FileText, Check, X, MessageCircle, Map, Shield, Layers, Leaf, Scale, Building2, TrendingUp } from 'lucide-react'
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1 }

export const metadata: Metadata = {
  title: 'Check Fazenda — Consulta de Imóveis Rurais em Segundos',
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
  { p: 'Preciso de um celular específico?', r: 'Não. Use seu WhatsApp normalmente. Salve o número do Check Fazenda na agenda e envie sua localização ou o código CAR.' },
  { p: 'Os dados substituem documentos oficiais?', r: 'Não. Os dados são para fins informativos e de monitoramento. Para fins jurídicos, consulte sempre os documentos originais nos sistemas governamentais.' },
  { p: 'Posso monitorar propriedades de terceiros?', r: 'Sim. Cadastre qualquer imóvel rural do Brasil, independente de ser proprietário. Advogados e corretores usam para acompanhar imóveis de clientes.' },
  { p: 'O que acontece se eu cancelar?', r: 'Você pode cancelar a qualquer momento. O acesso permanece ativo até o fim do período pago. Sem multa ou fidelidade mínima.' },
  { p: 'Quantas consultas posso fazer?', r: 'Consultas ilimitadas em todos os planos. Não cobramos por consulta — só a mensalidade do seu plano.' },
]

function IconCheck() {
  return <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#2D4F38', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={12} color="white" strokeWidth={3} /></div>
}

function IconX() {
  return <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#EDE8E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><X size={11} color="#A09080" strokeWidth={3} /></div>
}

export default function Home() {
  return (
    <div style={{ backgroundColor: '#FBF9F5', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* HEADER */}
      <header style={{ backgroundColor: '#1D3325', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, backgroundColor: '#B07D4F', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={18} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ color: '#F4ECE1', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.3px' }}>Check Fazenda</span>
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            <a href="#como-funciona" style={{ color: '#A4C0B0', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Como funciona</a>
            <a href="#planos" style={{ color: '#A4C0B0', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Planos</a>
            <a href="#faq" style={{ color: '#A4C0B0', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>FAQ</a>
            <Link href="/auth/login" style={{ color: '#A4C0B0', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>Entrar</Link>
            <Link href="/auth/cadastro" style={{ backgroundColor: '#B07D4F', color: 'white', padding: '0.5rem 1.25rem', borderRadius: 6, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}>
              Consultar agora
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #1D3325 0%, #2A4233 60%, #B07D4F 100%)', padding: '5rem 1.5rem 6rem' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(176,125,79,0.2)', border: '1px solid rgba(176,125,79,0.4)', borderRadius: 20, padding: '0.35rem 0.875rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 6, height: 6, backgroundColor: '#B07D4F', borderRadius: '50%' }} />
              <span style={{ color: '#D4A574', fontSize: '0.78rem', fontWeight: 600 }}>25+ camadas de dados rurais</span>
            </div>
            <h1 style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#F4ECE1', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.25rem', letterSpacing: '-0.5px' }}>
              Consulte qualquer fazenda do Brasil em segundos
            </h1>
            <p style={{ color: '#A4C0B0', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 480 }}>
              Acesse dados de CAR, INCRA, embargos IBAMA, terras indígenas e muito mais — direto pelo WhatsApp ou pelo painel web.
            </p>
            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
              <Link href="/auth/cadastro" style={{ backgroundColor: '#B07D4F', color: 'white', padding: '0.875rem 2rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', display: 'inline-block' }}>
                Começar agora
              </Link>
              <a href="#como-funciona" style={{ backgroundColor: 'transparent', color: '#F4ECE1', padding: '0.875rem 1.75rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', border: '1px solid rgba(244,236,225,0.25)', display: 'inline-block' }}>
                Ver como funciona
              </a>
            </div>
            <p style={{ color: 'rgba(164,192,176,0.6)', fontSize: '0.78rem', marginTop: '1rem' }}>Sem contrato · Cancele quando quiser</p>
          </div>
          {/* SMARTPHONE MOCKUP */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
              width: 272,
              height: 556,
              border: '12px solid #111',
              borderRadius: 40,
              backgroundColor: '#0b141a',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 30px 60px -12px rgba(0,0,0,0.7), inset 0 0 12px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
            }}>

              {/* NOTCH / DYNAMIC ISLAND */}
              <div style={{
                width: 100, height: 18,
                backgroundColor: '#111',
                borderRadius: 12,
                position: 'absolute',
                top: 10, left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 30,
              }} />

              {/* STATUS BAR */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '30px 18px 6px',
                fontSize: 11, color: 'rgba(255,255,255,0.85)',
                fontWeight: 600, flexShrink: 0,
              }}>
                <span>09:41</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {/* Signal */}
                  <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
                    <rect x="0" y="8" width="3" height="3" rx="0.5" opacity="0.35"/>
                    <rect x="4" y="5.5" width="3" height="5.5" rx="0.5" opacity="0.6"/>
                    <rect x="8" y="3" width="3" height="8" rx="0.5" opacity="0.85"/>
                    <rect x="12" y="0" width="3" height="11" rx="0.5"/>
                  </svg>
                  {/* WiFi */}
                  <svg width="14" height="11" viewBox="0 0 20 14" fill="white">
                    <circle cx="10" cy="13" r="1.5"/>
                    <path d="M6.5 9.5C7.5 8.5 8.7 8 10 8s2.5.5 3.5 1.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8"/>
                    <path d="M3.5 6.5C5.2 4.8 7.5 3.8 10 3.8s4.8 1 6.5 2.7" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
                    <path d="M0.5 3.5C2.8 1.2 6.3 0 10 0s7.2 1.2 9.5 3.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.25"/>
                  </svg>
                  {/* Battery */}
                  <svg width="22" height="11" viewBox="0 0 24 12" fill="none">
                    <rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
                    <rect x="2" y="2" width="15" height="8" rx="1.5" fill="white"/>
                    <path d="M21.5 4v4c1-.3 2-1 2-2s-1-1.7-2-2z" fill="rgba(255,255,255,0.45)"/>
                  </svg>
                </div>
              </div>

              {/* WHATSAPP HEADER */}
              <div style={{
                backgroundColor: '#1f2c34',
                padding: '8px 14px 10px',
                display: 'flex', alignItems: 'center', gap: 10,
                borderBottom: '1px solid #2a3942',
                flexShrink: 0,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  backgroundColor: '#2D4F38',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, border: '1.5px solid #4CAF78',
                }}>
                  <MapPin size={17} color="#4CAF78" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#e9eaeb', fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.2 }}>Check Fazenda</p>
                  <p style={{ color: '#4CAF78', fontSize: 11, margin: 0, marginTop: 1 }}>Online agora</p>
                </div>
              </div>

              {/* CHAT AREA */}
              <div style={{
                flex: 1,
                padding: '10px 10px 0',
                display: 'flex', flexDirection: 'column', gap: 5,
                overflowY: 'hidden',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='%230b141a'/%3E%3Cpath d='M20 10 L25 15 L20 20 L15 15z' fill='rgba(255,255,255,0.015)'/%3E%3C/svg%3E")`,
              }}>

                {/* Msg 1: User location */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    backgroundColor: '#005c4b',
                    borderRadius: '10px 10px 2px 10px',
                    padding: '7px 10px',
                    maxWidth: '80%',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <MapPin size={16} color="#4CAF78" />
                      </div>
                      <div>
                        <p style={{ color: '#e9eaeb', fontSize: 11, margin: 0, fontWeight: 600 }}>Localização</p>
                        <p style={{ color: 'rgba(233,234,235,0.6)', fontSize: 10, margin: 0 }}>Rio Verde, GO</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 3, marginTop: 3 }}>
                      <span style={{ color: 'rgba(233,234,235,0.45)', fontSize: 9 }}>09:41</span>
                      <svg width="16" height="9" viewBox="0 0 18 10" fill="none">
                        <path d="M1 5L4 8L8 4" stroke="#53BDEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 5L9 8L17 1" stroke="#53BDEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Msg 2: Bot processing */}
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    backgroundColor: '#202c33',
                    borderRadius: '10px 10px 10px 2px',
                    padding: '7px 10px',
                    maxWidth: '75%',
                  }}>
                    <p style={{ color: 'rgba(233,234,235,0.75)', fontSize: 11, margin: 0 }}>⏳ Consultando dados...</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                      <span style={{ color: 'rgba(233,234,235,0.35)', fontSize: 9 }}>09:41</span>
                    </div>
                  </div>
                </div>

                {/* Msg 3: Bot result */}
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    backgroundColor: '#202c33',
                    borderRadius: '10px 10px 10px 2px',
                    padding: '8px 10px',
                    maxWidth: '90%',
                  }}>
                    <p style={{ color: '#e9eaeb', fontSize: 10.5, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line', fontFamily: 'monospace' }}>
                      {'🌾 *DADOS DA PROPRIEDADE*\n━━━━━━━━━━━━\n📋 CAR: GO-5219803-XXXX\n• Status: Ativo ✅\n• Área: 1.240 ha\n• Rio Verde — GO\n\n🏛️ INCRA/SIGEF\n• CCIR: 12345678\n• Titular: João Silva\n\n🚨 IBAMA: ✅ Sem embargos'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                      <span style={{ color: 'rgba(233,234,235,0.35)', fontSize: 9 }}>09:42</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* INPUT BAR */}
              <div style={{
                backgroundColor: '#1f2c34',
                padding: '8px 10px',
                display: 'flex', alignItems: 'center', gap: 7,
                borderTop: '1px solid #2a3942',
                flexShrink: 0,
              }}>
                <div style={{
                  flex: 1, backgroundColor: '#2a3942',
                  borderRadius: 20, padding: '7px 14px',
                  display: 'flex', alignItems: 'center',
                }}>
                  <span style={{ color: 'rgba(233,234,235,0.3)', fontSize: 12 }}>Mensagem</span>
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  backgroundColor: '#00a884',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* DADOS DISPONÍVEIS */}
      <section style={{ backgroundColor: '#1D3325', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: '#8EAB9A', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dados inclusos:</span>
          {['CAR/SICAR', 'INCRA/SIGEF', 'CCIR', 'Embargos IBAMA', 'Terras Indígenas', 'PRODES', 'Queimadas', 'Mineração ANM'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Check size={12} color="#B07D4F" strokeWidth={3} />
              <span style={{ color: '#A4C0B0', fontSize: '0.82rem', fontWeight: 500 }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: '5rem 1.5rem', backgroundColor: '#FBF9F5' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: '#B07D4F', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Simples assim</span>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#1D3325', marginTop: '0.5rem' }}>Como funciona</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { n: '01', icon: <MessageCircle size={24} color="#B07D4F" />, titulo: 'Envie a localização', texto: 'Compartilhe sua localização pelo WhatsApp, cole um link do Google Maps ou informe o código CAR da propriedade.' },
              { n: '02', icon: <Map size={24} color="#B07D4F" />, titulo: 'Receba os dados', texto: 'Em segundos você recebe o relatório completo: CAR, INCRA, embargos, terras indígenas e todas as camadas do seu plano.' },
              { n: '03', icon: <Bell size={24} color="#B07D4F" />, titulo: 'Monitore e receba alertas', texto: 'Cadastre suas fazendas e receba alertas automáticos no WhatsApp quando qualquer dado mudar — embargos, queimadas e mais.' },
            ].map(item => (
              <div key={item.n} style={{ backgroundColor: 'white', border: '1px solid #E5DDD0', borderRadius: 10, padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 48, height: 48, backgroundColor: '#F5EFE6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </div>
                  <span style={{ color: '#B07D4F', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em' }}>PASSO {item.n}</span>
                </div>
                <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700, fontSize: '1.05rem', color: '#1D3325', marginBottom: '0.625rem' }}>{item.titulo}</h3>
                <p style={{ color: '#5A6555', fontSize: '0.875rem', lineHeight: 1.7 }}>{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O QUE VOCÊ RECEBE */}
      <section style={{ padding: '5rem 1.5rem', backgroundColor: 'white', borderTop: '1px solid #E5DDD0', borderBottom: '1px solid #E5DDD0' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: '#B07D4F', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dados completos</span>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#1D3325', marginTop: '0.5rem' }}>O que você recebe em cada consulta</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { icon: <FileText size={20} color="#B07D4F" />, titulo: 'CAR / SICAR', desc: 'Código, status, área, município, proprietário e polígono geográfico da propriedade.' },
              { icon: <Shield size={20} color="#B07D4F" />, titulo: 'INCRA / SIGEF', desc: 'Georreferenciamento oficial, CCIR, NIRF, titulares e situação cadastral.' },
              { icon: <MapPin size={20} color="#B07D4F" />, titulo: 'Embargos IBAMA', desc: 'Verificação de embargos ambientais ativos no entorno da propriedade.' },
              { icon: <Layers size={20} color="#B07D4F" />, titulo: 'Terras Indígenas', desc: 'Sobreposição com áreas indígenas demarcadas pela FUNAI.' },
              { icon: <Map size={20} color="#B07D4F" />, titulo: 'Unidades de Conservação', desc: 'ICMBio, UCs estaduais e municipais que interceptam o imóvel.' },
              { icon: <Bell size={20} color="#B07D4F" />, titulo: 'PRODES', desc: 'Dados de desmatamento do INPE na região da propriedade.' },
            ].map(item => (
              <div key={item.titulo} style={{ backgroundColor: '#FBF9F5', border: '1px solid #E5DDD0', borderRadius: 10, padding: '1.5rem' }}>
                <div style={{ width: 40, height: 40, backgroundColor: '#F5EFE6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.875rem' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1D3325', marginBottom: '0.4rem' }}>{item.titulo}</h3>
                <p style={{ color: '#5A6555', fontSize: '0.82rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONSULTA AVULSA */}
      <section id="consulta-avulsa" style={{ padding: '5rem 1.5rem', backgroundColor: '#FBF9F5', borderTop: '1px solid #E5DDD0' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: '#B07D4F', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sem assinatura</span>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#1D3325', marginTop: '0.5rem' }}>
              Consulta única · Pague e receba agora
            </h2>
            <p style={{ color: '#5A6555', marginTop: '0.75rem', fontSize: '0.95rem' }}>
              Ideal para quem precisa de uma consulta pontual sem compromisso mensal
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', maxWidth: 720, margin: '0 auto' }}>
            {/* Consulta */}
            <div style={{ backgroundColor: 'white', border: '1px solid #E5DDD0', borderRadius: 10, padding: '2rem' }}>
              <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700, fontSize: '1.05rem', color: '#1D3325', marginBottom: '0.25rem' }}>Consulta</h3>
              <p style={{ color: '#5A6555', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Resultado no WhatsApp em segundos</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#1D3325', letterSpacing: '-1px' }}>R$ 19,90</span>
                <span style={{ color: '#5A6555', fontSize: '0.875rem' }}>por consulta</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['CAR + INCRA + SIGEF', 'Embargos IBAMA', 'Terras Indígenas e UCs', 'Entrega no WhatsApp'].map(r => (
                  <li key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#3a4a3a' }}>
                    <Check size={13} color="#2D4F38" strokeWidth={3} />{r}
                  </li>
                ))}
              </ul>
              <Link href="/consulta?tipo=consulta" style={{ display: 'block', textAlign: 'center', backgroundColor: '#F5EFE6', color: '#1D3325', padding: '0.8rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', border: '1px solid #B07D4F' }}>
                Consultar agora
              </Link>
            </div>

            {/* Relatório */}
            <div style={{ backgroundColor: 'white', border: '2px solid #B07D4F', borderRadius: 10, padding: '2rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#B07D4F', color: 'white', padding: '0.15rem 0.875rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                MAIS COMPLETO
              </div>
              <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700, fontSize: '1.05rem', color: '#1D3325', marginBottom: '0.25rem' }}>Relatório Completo</h3>
              <p style={{ color: '#5A6555', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Farm Scan PDF + WhatsApp</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#1D3325', letterSpacing: '-1px' }}>R$ 49,90</span>
                <span style={{ color: '#5A6555', fontSize: '0.875rem' }}>por relatório</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['Tudo da Consulta', 'Farm Scan PDF completo', 'Queimadas e desmatamento', 'Download disponível por 7 dias'].map(r => (
                  <li key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#3a4a3a' }}>
                    <Check size={13} color="#2D4F38" strokeWidth={3} />{r}
                  </li>
                ))}
              </ul>
              <Link href="/consulta?tipo=relatorio" style={{ display: 'block', textAlign: 'center', backgroundColor: '#B07D4F', color: 'white', padding: '0.8rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                Gerar relatório
              </Link>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: '#5A6555' }}>
            Precisa de consultas frequentes?{' '}
            <a href="#planos" style={{ color: '#B07D4F', fontWeight: 600, textDecoration: 'none' }}>
              Veja os planos de assinatura →
            </a>
          </p>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" style={{ padding: '5rem 1.5rem', backgroundColor: 'white', borderTop: '1px solid #E5DDD0' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: '#B07D4F', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Preços e planos</span>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#1D3325', marginTop: '0.5rem' }}>O plano certo para você</h2>
            <p style={{ color: '#5A6555', marginTop: '0.75rem', fontSize: '0.95rem' }}>Consultas ilimitadas em todos os planos · Sem cobrança por consulta</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>

            {/* BÁSICO */}
            <div style={{ backgroundColor: '#FBF9F5', border: '1px solid #E5DDD0', borderRadius: 10, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700, fontSize: '1.1rem', color: '#1D3325', marginBottom: '0.25rem' }}>Básico</h3>
                <p style={{ color: '#5A6555', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Para consultas pontuais de imóveis rurais</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1D3325', letterSpacing: '-1px' }}>R$ 59,90</span>
                  <span style={{ color: '#5A6555', fontSize: '0.875rem' }}>/mês</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B07D4F', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>10 camadas inclusas</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  {CAMADAS_BASICO.map(c => (
                    <li key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#3a4a3a' }}>
                      <IconCheck />{c}
                    </li>
                  ))}
                </ul>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B07D4F', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Funcionalidades</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  {['Consultas ilimitadas', 'Consulta via WhatsApp', 'Painel web completo', 'Histórico de consultas'].map(c => (
                    <li key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#3a4a3a' }}>
                      <IconCheck />{c}
                    </li>
                  ))}
                  {['Monitoramento contínuo', 'Alertas WhatsApp', 'Farm Scan PDF'].map(c => (
                    <li key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#9a8a7a' }}>
                      <IconX />{c}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/auth/cadastro?plano=basico" style={{ display: 'block', textAlign: 'center', backgroundColor: '#F5EFE6', color: '#1D3325', padding: '0.8rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', border: '1px solid #B07D4F' }}>
                Assinar Básico
              </Link>
            </div>

            {/* FULL */}
            <div style={{ backgroundColor: '#1D3325', border: '2px solid #2D4F38', borderRadius: 10, padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#B07D4F', color: 'white', padding: '0.2rem 1rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                MELHOR CUSTO-BENEFÍCIO
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700, fontSize: '1.1rem', color: '#F4ECE1', marginBottom: '0.25rem' }}>Full</h3>
                <p style={{ color: '#A4C0B0', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Monitoramento completo com alertas automáticos</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#F4ECE1', letterSpacing: '-1px' }}>R$ 99,90</span>
                  <span style={{ color: '#A4C0B0', fontSize: '0.875rem' }}>/mês</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B07D4F', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Tudo do Básico +</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                  {['Monitoramento contínuo', 'Alertas automáticos WhatsApp', 'Farm Scan — PDF mensal'].map(c => (
                    <li key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#D4ECE0' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#B07D4F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={12} color="white" strokeWidth={3} /></div>
                      {c}
                    </li>
                  ))}
                </ul>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#B07D4F', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>+12 camadas exclusivas</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {CAMADAS_FULL.map(c => (
                    <li key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: '#A4C0B0' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: 'rgba(176,125,79,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={11} color="#B07D4F" strokeWidth={3} /></div>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/auth/cadastro?plano=full" style={{ display: 'block', textAlign: 'center', backgroundColor: '#B07D4F', color: 'white', padding: '0.8rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                Assinar Full
              </Link>
            </div>

            {/* EMPRESARIAL */}
            <div style={{ backgroundColor: '#FBF9F5', border: '1px solid #E5DDD0', borderRadius: 10, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700, fontSize: '1.1rem', color: '#1D3325', marginBottom: '0.25rem' }}>Empresarial</h3>
                <p style={{ color: '#5A6555', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Para escritórios e times com múltiplas propriedades</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1D3325', letterSpacing: '-1px' }}>R$ 397</span>
                  <span style={{ color: '#5A6555', fontSize: '0.875rem' }}>/mês</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B07D4F', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Tudo do Full +</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  {['2 acessos Full inclusos', 'Gestão de equipe e time', 'Usuários extras: R$ 149/mês', 'Dashboard centralizado', 'Suporte prioritário'].map(c => (
                    <li key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#3a4a3a' }}>
                      <IconCheck />{c}
                    </li>
                  ))}
                </ul>
                <div style={{ backgroundColor: '#F5EFE6', border: '1px solid #E5DDD0', borderRadius: 8, padding: '0.875rem', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.8rem', color: '#5A6555', lineHeight: 1.5 }}>
                    Ideal para <strong style={{ color: '#1D3325' }}>advogados do agro</strong>, <strong style={{ color: '#1D3325' }}>imobiliárias rurais</strong> e <strong style={{ color: '#1D3325' }}>escritórios de consultoria</strong>.
                  </p>
                </div>
              </div>
              <Link href="/auth/cadastro?plano=empresarial" style={{ display: 'block', textAlign: 'center', backgroundColor: '#F5EFE6', color: '#1D3325', padding: '0.8rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', border: '1px solid #B07D4F' }}>
                Assinar Empresarial
              </Link>
            </div>
          </div>

          {/* TABELA COMPARATIVA */}
          <div style={{ backgroundColor: 'white', border: '1px solid #E5DDD0', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #E5DDD0' }}>
              <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700, fontSize: '1rem', color: '#1D3325' }}>Comparativo completo de recursos</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F5EFE6' }}>
                    <th style={{ padding: '0.875rem 2rem', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: '#5A6555', textTransform: 'uppercase', letterSpacing: '0.05em', width: '50%' }}>Recurso</th>
                    {['Básico', 'Full', 'Empresarial'].map(p => (
                      <th key={p} style={{ padding: '0.875rem 1.5rem', textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#5A6555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARATIVO.map((item, i) => (
                    <tr key={item.recurso} style={{ borderTop: '1px solid #E5DDD0', backgroundColor: i % 2 === 0 ? 'white' : '#FBF9F5' }}>
                      <td style={{ padding: '0.75rem 2rem', fontSize: '0.875rem', color: '#3a4a3a', fontWeight: 500 }}>{item.recurso}</td>
                      {[item.basico, item.full, item.empresarial].map((val, j) => (
                        <td key={j} style={{ padding: '0.75rem 1.5rem', textAlign: 'center' }}>
                          {val
                            ? <Check size={18} color="#2D4F38" strokeWidth={2.5} style={{ margin: '0 auto', display: 'block' }} />
                            : <X size={16} color="#C8BFB5" strokeWidth={2} style={{ margin: '0 auto', display: 'block' }} />}
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
      <section style={{ padding: '5rem 1.5rem', backgroundColor: '#FBF9F5', borderTop: '1px solid #E5DDD0' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#1D3325' }}>Para quem é o Check Fazenda</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: <Leaf size={22} color="#B07D4F" />, titulo: 'Produtores Rurais', desc: 'Consulte e monitore suas propriedades com facilidade pelo celular, sem precisar aprender sistemas complexos.' },
              { icon: <Scale size={22} color="#B07D4F" />, titulo: 'Advogados do Agro', desc: 'Acesse dados fundiários e ambientais com precisão e velocidade para suas análises e due diligence.' },
              { icon: <Building2 size={22} color="#B07D4F" />, titulo: 'Corretores Rurais', desc: 'Consulte qualquer fazenda antes de fechar negócio. Em segundos você tem tudo que precisa.' },
              { icon: <TrendingUp size={22} color="#B07D4F" />, titulo: 'Investidores', desc: 'Due diligence completa de propriedades rurais em todo o Brasil antes de qualquer decisão de compra.' },
            ].map(item => (
              <div key={item.titulo} style={{ backgroundColor: 'white', border: '1px solid #E5DDD0', borderRadius: 10, padding: '1.75rem' }}>
                <div style={{ width: 44, height: 44, backgroundColor: '#F5EFE6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 700, fontSize: '0.95rem', color: '#1D3325', marginBottom: '0.5rem' }}>{item.titulo}</h3>
                <p style={{ color: '#5A6555', fontSize: '0.85rem', lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '5rem 1.5rem', backgroundColor: 'white', borderTop: '1px solid #E5DDD0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: '#B07D4F', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dúvidas</span>
            <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#1D3325', marginTop: '0.5rem' }}>Perguntas frequentes</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} style={{ backgroundColor: '#FBF9F5', border: '1px solid #E5DDD0', borderRadius: 8, padding: '1.25rem 1.5rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.925rem', color: '#1D3325', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  {item.p}
                </h3>
                <p style={{ color: '#5A6555', fontSize: '0.875rem', lineHeight: 1.65 }}>{item.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: 'linear-gradient(135deg, #1D3325 0%, #2A4233 60%, #B07D4F 100%)', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#F4ECE1', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, marginBottom: '1rem' }}>
            Pronto para consultar sua fazenda?
          </h2>
          <p style={{ color: '#A4C0B0', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.6 }}>
            Comece agora e tenha acesso imediato aos dados rurais que você precisa.
          </p>
          <Link href="/auth/cadastro" style={{ backgroundColor: '#B07D4F', color: 'white', padding: '0.925rem 2.5rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '1rem', display: 'inline-block' }}>
            Criar conta gratuita
          </Link>
          <p style={{ color: 'rgba(164,192,176,0.5)', fontSize: '0.78rem', marginTop: '1rem' }}>Sem cartão de crédito para começar</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0F1C14', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.875rem' }}>
                <div style={{ width: 28, height: 28, backgroundColor: '#B07D4F', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={15} color="white" />
                </div>
                <span style={{ color: '#F4ECE1', fontWeight: 700 }}>Check Fazenda</span>
              </div>
              <p style={{ color: '#7D9284', fontSize: '0.78rem', lineHeight: 1.7 }}>
                LGE SOLUCOES LTDA.<br />
                CNPJ 50.571.717/0001-61<br />
                Av. Contorno, Qd. 67, Lt. 19A — Centro<br />
                Ivolândia — GO
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: '#7D9284', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Links</span>
              <Link href="/termos" style={{ color: '#7D9284', fontSize: '0.82rem', textDecoration: 'none' }}>Termos de uso</Link>
              <Link href="/privacidade" style={{ color: '#7D9284', fontSize: '0.82rem', textDecoration: 'none' }}>Privacidade</Link>
              <Link href="/planos" style={{ color: '#7D9284', fontSize: '0.82rem', textDecoration: 'none' }}>Planos</Link>
              <Link href="/contato" style={{ color: '#7D9284', fontSize: '0.82rem', textDecoration: 'none' }}>Contato</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: '#7D9284', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Contato</span>
              <a href="mailto:projetosiagl@gmail.com" style={{ color: '#7D9284', fontSize: '0.82rem', textDecoration: 'none' }}>projetosiagl@gmail.com</a>
              <a href="https://wa.me/5562942631425" target="_blank" rel="noreferrer" style={{ color: '#7D9284', fontSize: '0.82rem', textDecoration: 'none' }}>+55 62 94263-1425</a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1A2E1F', paddingTop: '1.5rem' }}>
            <p style={{ color: '#4A5E50', fontSize: '0.75rem', textAlign: 'center' }}>© 2026 Check Fazenda · LGE SOLUCOES LTDA. · CNPJ 50.571.717/0001-61 · Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
