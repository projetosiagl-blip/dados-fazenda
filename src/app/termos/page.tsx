import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function Termos() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7f2' }}>
      <header style={{ backgroundColor: '#1e4d2b', padding: '1rem 1.5rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', width: 'fit-content' }}>
          <div style={{ width: 32, height: 32, backgroundColor: '#52b788', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={18} color="white" />
          </div>
          <span style={{ color: 'white', fontWeight: 700 }}>Dados Fazenda</span>
        </Link>
      </header>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '2.5rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem' }}>Termos de Uso</h1>
          <p style={{ color: '#4a5568', fontSize: '0.875rem', marginBottom: '2rem' }}>Última atualização: maio de 2026</p>

          {[
            {
              titulo: '1. Aceitação dos termos',
              texto: 'Ao acessar ou usar a plataforma Dados Fazenda, você concorda com estes Termos de Uso. Se não concordar, não utilize o serviço. O uso continuado da plataforma após alterações constitui aceitação das mesmas.'
            },
            {
              titulo: '2. Descrição do serviço',
              texto: 'O Dados Fazenda é uma plataforma digital que fornece consultas e monitoramento de dados de imóveis rurais brasileiros, agregando informações de fontes públicas como CAR/SICAR, INCRA, SIGEF, IBAMA e INPE. Os dados são fornecidos para fins informativos e não substituem documentos oficiais.'
            },
            {
              titulo: '3. Cadastro e conta',
              texto: 'Para usar o serviço, você deve fornecer informações verdadeiras e precisas. Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas sob sua conta.'
            },
            {
              titulo: '4. Assinatura e pagamento',
              texto: 'O serviço é oferecido mediante assinatura mensal. O valor é cobrado automaticamente na data de renovação. O cancelamento pode ser realizado a qualquer momento pelo painel de configurações, com efeito ao final do período vigente. Não há reembolso de períodos parciais.'
            },
            {
              titulo: '5. Uso permitido',
              texto: 'O serviço destina-se a uso pessoal e profissional legítimo relacionado a imóveis rurais. É proibido: (a) revender ou redistribuir os dados sem autorização; (b) usar o serviço para fins ilegais; (c) tentar acessar sistemas além do escopo da plataforma; (d) compartilhar credenciais de acesso com terceiros não autorizados.'
            },
            {
              titulo: '6. Precisão dos dados',
              texto: 'Os dados fornecidos provêm de fontes governamentais públicas. O Dados Fazenda não garante a completude, exatidão ou atualidade absoluta das informações. Os dados devem ser verificados nas fontes oficiais antes de qualquer decisão jurídica ou financeira.'
            },
            {
              titulo: '7. Limitação de responsabilidade',
              texto: 'O Dados Fazenda não se responsabiliza por decisões tomadas com base nas informações fornecidas pela plataforma, por indisponibilidade temporária do serviço, ou por imprecisões nos dados provenientes de fontes governamentais. A responsabilidade total da plataforma limita-se ao valor pago nos últimos 3 meses.'
            },
            {
              titulo: '8. Propriedade intelectual',
              texto: 'A plataforma, seu código, design e organização são propriedade da Agrios Tecnologia LTDA. Os dados governamentais são de domínio público conforme legislação aplicável.'
            },
            {
              titulo: '9. Modificações',
              texto: 'Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas por e-mail ou WhatsApp com antecedência mínima de 30 dias.'
            },
            {
              titulo: '10. Lei aplicável',
              texto: 'Estes termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de Goiânia - GO para dirimir quaisquer controvérsias.'
            },
          ].map(item => (
            <div key={item.titulo} style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem' }}>{item.titulo}</h2>
              <p style={{ color: '#4a5568', fontSize: '0.875rem', lineHeight: 1.7 }}>{item.texto}</p>
            </div>
          ))}

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #d4ddc8' }}>
            <p style={{ color: '#4a5568', fontSize: '0.8rem' }}>
              Dúvidas? Entre em contato: <a href="mailto:contato@dadosfazenda.com.br" style={{ color: '#2d6a4f', textDecoration: 'none', fontWeight: 600 }}>contato@dadosfazenda.com.br</a>
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/" style={{ color: '#2d6a4f', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>← Voltar para o início</Link>
        </div>
      </div>
    </div>
  )
}
