import Link from 'next/link'
import { MapPin, Shield, Bell, FileText, ChevronRight, Check } from 'lucide-react'

export default function Home() {
  return (
    <div style={{ backgroundColor: '#f5f7f2', minHeight: '100vh' }}>

      {/* HEADER */}
      <header style={{ backgroundColor: '#1e4d2b', borderBottom: '1px solid #16391f' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, backgroundColor: '#52b788', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={20} color="white" />
            </div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.3px' }}>Dados Fazenda</span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <a href="#como-funciona" style={{ color: '#a8d5b5', textDecoration: 'none', fontSize: '0.9rem' }}>Como funciona</a>
            <a href="#planos" style={{ color: '#a8d5b5', textDecoration: 'none', fontSize: '0.9rem' }}>Planos</a>
            <Link href="/auth/login" style={{ color: '#a8d5b5', textDecoration: 'none', fontSize: '0.9rem' }}>Entrar</Link>
            <Link href="/auth/cadastro" style={{ backgroundColor: '#52b788', color: 'white', padding: '0.5rem 1.25rem', borderRadius: 6, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
              Consultar agora
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ backgroundColor: '#1e4d2b', padding: '5rem 1.5rem 6rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#2d6a4f', border: '1px solid #52b788', borderRadius: 20, padding: '0.35rem 1rem', marginBottom: '1.5rem' }}>
            <span style={{ color: '#52b788', fontSize: '0.8rem', fontWeight: 600 }}>Dados rurais em segundos</span>
          </div>
          <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.25rem', letterSpacing: '-1px' }}>
            Consulte qualquer fazenda<br />do Brasil em segundos
          </h1>
          <p style={{ color: '#a8d5b5', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 560, margin: '0 auto 2.5rem' }}>
            Acesse dados de CAR, INCRA, embargos ambientais, terras indígenas e muito mais — direto no WhatsApp ou pelo painel web.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/cadastro" style={{ backgroundColor: '#52b788', color: 'white', padding: '0.875rem 2rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '1rem', display: 'inline-block' }}>
              Começar agora
            </Link>
            <a href="#como-funciona" style={{ backgroundColor: 'transparent', color: 'white', padding: '0.875rem 2rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '1rem', border: '1px solid #52b788', display: 'inline-block' }}>
              Ver como funciona
            </a>
          </div>
          <p style={{ color: '#6b9e7e', fontSize: '0.8rem', marginTop: '1rem' }}>Sem contrato. Cancele quando quiser.</p>
        </div>
      </section>

      {/* DADOS DISPONÍVEIS */}
      <section style={{ backgroundColor: '#2d6a4f', padding: '1.25rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['CAR / SICAR', 'INCRA / SIGEF', 'CCIR', 'Embargos IBAMA', 'Terras Indígenas', 'PRODES', 'Queimadas'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Check size={14} color="#52b788" />
              <span style={{ color: '#c8e6d4', fontSize: '0.85rem', fontWeight: 500 }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.75rem' }}>Como funciona</h2>
            <p style={{ color: '#4a5568', fontSize: '1rem' }}>Simples como mandar uma mensagem no WhatsApp</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { n: '01', icon: <MapPin size={24} color="#2d6a4f" />, titulo: 'Envie a localização', texto: 'Compartilhe sua localização pelo WhatsApp ou informe o código CAR da propriedade.' },
              { n: '02', icon: <Shield size={24} color="#2d6a4f" />, titulo: 'Receba o relatório', texto: 'Em segundos você recebe os dados completos: CAR, INCRA, embargos e camadas ambientais.' },
              { n: '03', icon: <Bell size={24} color="#2d6a4f" />, titulo: 'Monitore continuamente', texto: 'Cadastre suas fazendas e receba alertas automáticos quando qualquer dado mudar.' },
            ].map(item => (
              <div key={item.n} style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ backgroundColor: '#f0f5f0', borderRadius: 6, padding: '0.5rem' }}>{item.icon}</span>
                  <span style={{ color: '#b7882c', fontWeight: 700, fontSize: '0.8rem' }}>PASSO {item.n}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>{item.titulo}</h3>
                <p style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" style={{ padding: '5rem 1.5rem', backgroundColor: 'white', borderTop: '1px solid #d4ddc8', borderBottom: '1px solid #d4ddc8' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.75rem' }}>Planos e preços</h2>
            <p style={{ color: '#4a5568' }}>Escolha o plano ideal para o seu negócio</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: 960, margin: '0 auto' }}>

            {/* BÁSICO */}
            <div style={{ border: '1px solid #d4ddc8', borderRadius: 8, padding: '2rem', backgroundColor: '#fafcfa' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', marginBottom: '0.25rem' }}>Básico</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '1rem 0' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: '#1e4d2b' }}>R$ 59</span>
                <span style={{ color: '#4a5568', fontSize: '0.9rem' }}>,90/mês</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {['10 camadas de dados', 'CAR + INCRA + SIGEF', 'Embargos IBAMA', 'Terras Indígenas e UCs', 'Consulta via WhatsApp'].map(i => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: '#4a5568' }}>
                    <Check size={15} color="#2d6a4f" />{i}
                  </li>
                ))}
              </ul>
              <Link href="/auth/cadastro?plano=basico" style={{ display: 'block', textAlign: 'center', backgroundColor: '#2d6a4f', color: 'white', padding: '0.75rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                Assinar Básico
              </Link>
            </div>

            {/* FULL */}
            <div style={{ border: '2px solid #2d6a4f', borderRadius: 8, padding: '2rem', backgroundColor: 'white', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2d6a4f', color: 'white', padding: '0.2rem 1rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                MAIS POPULAR
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', marginBottom: '0.25rem' }}>Full</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '1rem 0' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: '#1e4d2b' }}>R$ 99</span>
                <span style={{ color: '#4a5568', fontSize: '0.9rem' }}>,90/mês</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {['Tudo do Básico', '+15 camadas extras', 'Monitoramento contínuo', 'Alertas automáticos WhatsApp', 'Queimadas e desmatamento', 'Farm Scan PDF mensal'].map(i => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: '#4a5568' }}>
                    <Check size={15} color="#2d6a4f" />{i}
                  </li>
                ))}
              </ul>
              <Link href="/auth/cadastro?plano=full" style={{ display: 'block', textAlign: 'center', backgroundColor: '#2d6a4f', color: 'white', padding: '0.75rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                Assinar Full
              </Link>
            </div>

            {/* EMPRESARIAL */}
            <div style={{ border: '1px solid #d4ddc8', borderRadius: 8, padding: '2rem', backgroundColor: '#fafcfa' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', marginBottom: '0.25rem' }}>Empresarial</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '1rem 0' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: '#1e4d2b' }}>R$ 397</span>
                <span style={{ color: '#4a5568', fontSize: '0.9rem' }}>/mês</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {['Tudo do Full', '2 acessos inclusos', 'Gestão de equipe', 'Usuário extra R$ 149/mês', 'Suporte prioritário'].map(i => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: '#4a5568' }}>
                    <Check size={15} color="#2d6a4f" />{i}
                  </li>
                ))}
              </ul>
              <Link href="/auth/cadastro?plano=empresarial" style={{ display: 'block', textAlign: 'center', backgroundColor: '#2d6a4f', color: 'white', padding: '0.75rem', borderRadius: 6, textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                Assinar Empresarial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PARA QUEM */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.9rem', fontWeight: 700, marginBottom: '3rem', color: '#1a1a1a' }}>Para quem é</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { titulo: 'Produtores Rurais', texto: 'Consulte e monitore suas propriedades com facilidade pelo celular.' },
              { titulo: 'Advogados do Agro', texto: 'Acesse dados fundiários e ambientais com precisão para suas análises.' },
              { titulo: 'Corretores Rurais', texto: 'Consulte qualquer fazenda antes de fechar negócio, em segundos.' },
              { titulo: 'Investidores', texto: 'Due diligence completa de propriedades rurais em todo o Brasil.' },
            ].map(item => (
              <div key={item.titulo} style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '1.5rem' }}>
                <div style={{ width: 8, height: 8, backgroundColor: '#2d6a4f', borderRadius: '50%', marginBottom: '0.75rem' }} />
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>{item.titulo}</h3>
                <p style={{ color: '#4a5568', fontSize: '0.88rem', lineHeight: 1.6 }}>{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ backgroundColor: '#1e4d2b', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ color: 'white', fontSize: '1.9rem', fontWeight: 700, marginBottom: '1rem' }}>
            Pronto para consultar sua fazenda?
          </h2>
          <p style={{ color: '#a8d5b5', marginBottom: '2rem', fontSize: '1rem' }}>
            Comece agora e tenha acesso imediato aos dados rurais que você precisa.
          </p>
          <Link href="/auth/cadastro" style={{ backgroundColor: '#52b788', color: 'white', padding: '0.875rem 2.5rem', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '1rem', display: 'inline-block' }}>
            Criar conta gratuita
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#16391f', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, backgroundColor: '#52b788', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={16} color="white" />
            </div>
            <span style={{ color: '#a8d5b5', fontWeight: 600, fontSize: '0.9rem' }}>Dados Fazenda</span>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: '#6b9e7e', fontSize: '0.8rem', textDecoration: 'none' }}>Termos de uso</a>
            <a href="#" style={{ color: '#6b9e7e', fontSize: '0.8rem', textDecoration: 'none' }}>Privacidade</a>
            <a href="mailto:contato@dadosfazenda.com.br" style={{ color: '#6b9e7e', fontSize: '0.8rem', textDecoration: 'none' }}>Contato</a>
          </div>
          <p style={{ color: '#4a7c5a', fontSize: '0.8rem' }}>© 2026 Dados Fazenda. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
