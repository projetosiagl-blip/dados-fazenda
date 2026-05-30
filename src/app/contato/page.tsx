import Link from 'next/link'
import { MapPin, Mail, MessageCircle, Clock } from 'lucide-react'

export default function Contato() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7f2' }}>
      <header style={{ backgroundColor: '#1e4d2b', padding: '1rem 1.5rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', width: 'fit-content' }}>
          <div style={{ width: 32, height: 32, backgroundColor: '#52b788', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={18} color="white" />
          </div>
          <span style={{ color: 'white', fontWeight: 700 }}>Check Fazenda</span>
        </Link>
      </header>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.75rem' }}>Fale conosco</h1>
          <p style={{ color: '#4a5568', fontSize: '0.95rem' }}>Estamos aqui para ajudar. Escolha o canal mais conveniente.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <a href="https://wa.me/5562942631425" target="_blank" rel="noreferrer"
            style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '1.75rem', textDecoration: 'none', display: 'block', transition: 'border-color 0.15s' }}>
            <div style={{ width: 44, height: 44, backgroundColor: '#e8f8ee', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <MessageCircle size={22} color="#25D366" />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', marginBottom: '0.4rem' }}>WhatsApp</h3>
            <p style={{ color: '#4a5568', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Resposta rápida para dúvidas sobre planos, consultas e uso do sistema.
            </p>
            <p style={{ color: '#25D366', fontWeight: 700, fontSize: '0.875rem' }}>+55 62 94263-1425</p>
          </a>

          <a href="mailto:projetosiagl@gmail.com"
            style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '1.75rem', textDecoration: 'none', display: 'block' }}>
            <div style={{ width: 44, height: 44, backgroundColor: '#f0f5f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Mail size={22} color="#2d6a4f" />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', marginBottom: '0.4rem' }}>E-mail</h3>
            <p style={{ color: '#4a5568', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Para questões técnicas, suporte à conta ou assuntos comerciais.
            </p>
            <p style={{ color: '#2d6a4f', fontWeight: 700, fontSize: '0.875rem' }}>projetosiagl@gmail.com</p>
          </a>
        </div>

        <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
            <Clock size={16} color="#2d6a4f" />
            <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1a1a' }}>Horário de atendimento</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[
              { dia: 'Segunda a sexta', hora: '08h às 18h' },
              { dia: 'Sábado', hora: '08h às 12h' },
              { dia: 'Domingo e feriados', hora: 'Sem atendimento' },
            ].map(item => (
              <div key={item.dia} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#4a5568' }}>{item.dia}</span>
                <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{item.hora}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.78rem', color: '#4a5568', marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid #f0f4ec' }}>
            O bot do WhatsApp funciona 24h para consultas. O suporte humano segue o horário acima.
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ color: '#2d6a4f', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  )
}
