import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function Privacidade() {
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

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ backgroundColor: 'white', border: '1px solid #d4ddc8', borderRadius: 8, padding: '2.5rem' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem' }}>Política de Privacidade</h1>
          <p style={{ color: '#4a5568', fontSize: '0.875rem', marginBottom: '2rem' }}>Última atualização: maio de 2026 · Em conformidade com a LGPD (Lei 13.709/2018)</p>

          {[
            {
              titulo: '1. Quem somos',
              texto: 'Check Fazenda é operado pela LGE SOLUCOES LTDA. (CNPJ 50.571.717/0001-61). Esta política descreve como coletamos, usamos e protegemos seus dados pessoais.'
            },
            {
              titulo: '2. Dados que coletamos',
              texto: 'Coletamos: (a) Dados de cadastro: nome, e-mail e número de WhatsApp fornecidos no momento do cadastro; (b) Dados de uso: consultas realizadas, propriedades cadastradas, histórico de alertas; (c) Dados de pagamento: processados pelo Asaas — não armazenamos dados de cartão; (d) Dados de localização: coordenadas geográficas enviadas para consulta de propriedades.'
            },
            {
              titulo: '3. Como usamos seus dados',
              texto: 'Seus dados são usados para: prestação do serviço de consulta e monitoramento; envio de alertas automáticos pelo WhatsApp; geração de relatórios mensais (Farm Scan); comunicação sobre sua assinatura; melhoria do serviço. Não vendemos seus dados a terceiros.'
            },
            {
              titulo: '4. Base legal (LGPD)',
              texto: 'O tratamento de dados é fundamentado em: (a) execução de contrato — necessário para prestar o serviço contratado; (b) legítimo interesse — para comunicações sobre sua assinatura e alertas; (c) consentimento — para comunicações de marketing, quando aplicável.'
            },
            {
              titulo: '5. Compartilhamento de dados',
              texto: 'Compartilhamos dados apenas com prestadores de serviço essenciais: Supabase (armazenamento de dados), Asaas (processamento de pagamentos). Todos os parceiros seguem políticas de privacidade compatíveis com a LGPD.'
            },
            {
              titulo: '6. Retenção de dados',
              texto: 'Mantemos seus dados pelo período de vigência da assinatura e por até 5 anos após o encerramento, conforme obrigações legais e fiscais. Dados de localização de consultas são retidos por 2 anos.'
            },
            {
              titulo: '7. Seus direitos (LGPD Art. 18)',
              texto: 'Você tem direito a: confirmar a existência de tratamento; acessar seus dados; corrigir dados incompletos ou inexatos; solicitar a exclusão de dados desnecessários; revogar consentimento; portabilidade de dados. Para exercer seus direitos, contate: projetosiagl@gmail.com'
            },
            {
              titulo: '8. Segurança',
              texto: 'Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo: criptografia em trânsito (HTTPS/TLS), criptografia em repouso, controle de acesso por função (RLS no banco de dados), autenticação segura.'
            },
            {
              titulo: '9. Cookies',
              texto: 'Utilizamos apenas cookies estritamente necessários para manter sua sessão autenticada. Não utilizamos cookies de rastreamento ou publicidade.'
            },
            {
              titulo: '10. Contato',
              texto: 'Encarregado de dados (DPO): projetosiagl@gmail.com · Prazo de resposta: até 15 dias úteis.'
            },
          ].map(item => (
            <div key={item.titulo} style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem' }}>{item.titulo}</h2>
              <p style={{ color: '#4a5568', fontSize: '0.875rem', lineHeight: 1.7 }}>{item.texto}</p>
            </div>
          ))}

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #d4ddc8' }}>
            <p style={{ color: '#4a5568', fontSize: '0.8rem' }}>
              Dúvidas sobre privacidade? <a href="mailto:projetosiagl@gmail.com" style={{ color: '#2d6a4f', textDecoration: 'none', fontWeight: 600 }}>projetosiagl@gmail.com</a>
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
