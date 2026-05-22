import { MensagemWhatsApp, Plano, ResultadoConsulta } from '@/types'
import { consultarCAR, consultarCARPorCoordenada } from '@/lib/apis/infosimples'
import { consultarINCRA, consultarINCRAPorCoordenada } from '@/lib/apis/netrin'
import { buscarEmbargos } from '@/lib/apis/ibama'

interface ResultadoProcessado {
  texto: string
  dados: ResultadoConsulta
}

export async function processarConsulta(
  mensagem: MensagemWhatsApp,
  plano: Plano
): Promise<ResultadoProcessado> {
  const lat = mensagem.latitude
  const lon = mensagem.longitude
  const car = mensagem.car_codigo

  // Chama APIs em paralelo
  const [dadosCAR, dadosINCRA, embargos] = await Promise.all([
    car ? consultarCAR(car) : lat && lon ? consultarCARPorCoordenada(lat, lon) : null,
    car ? consultarINCRA(car) : lat && lon ? consultarINCRAPorCoordenada(lat, lon) : null,
    lat && lon ? buscarEmbargos(lat, lon) : [],
  ])

  const resultado: ResultadoConsulta = {
    car: dadosCAR ?? undefined,
    incra: dadosINCRA ?? undefined,
    embargos,
    consultado_em: new Date().toISOString(),
  }

  const texto = formatarResposta(resultado, plano)

  return { texto, dados: resultado }
}

function formatarResposta(resultado: ResultadoConsulta, plano: Plano): string {
  const linhas: string[] = []

  linhas.push(`🌾 *DADOS DA PROPRIEDADE RURAL*`)
  linhas.push(`━━━━━━━━━━━━━━━━━━━━━`)

  if (resultado.car) {
    const car = resultado.car
    linhas.push(`📋 *CAR*`)
    linhas.push(`• Código: \`${car.codigo}\``)
    linhas.push(`• Status: ${car.status}`)
    linhas.push(`• Área: ${car.area_ha.toLocaleString('pt-BR')} ha`)
    linhas.push(`• Município: ${car.municipio} - ${car.estado}`)
    if (car.proprietario) linhas.push(`• Proprietário: ${car.proprietario}`)
  } else {
    linhas.push(`📋 *CAR*`)
    linhas.push(`• Não encontrado para esta localização`)
  }

  linhas.push(``)

  if (resultado.incra) {
    const incra = resultado.incra
    linhas.push(`🏛️ *INCRA / SIGEF*`)
    if (incra.nome_imovel) linhas.push(`• Imóvel: ${incra.nome_imovel}`)
    if (incra.ccir) linhas.push(`• CCIR: ${incra.ccir}`)
    if (incra.nirf) linhas.push(`• NIRF: ${incra.nirf}`)
    if (incra.area_ha) linhas.push(`• Área: ${incra.area_ha.toLocaleString('pt-BR')} ha`)
    if (incra.situacao) linhas.push(`• Situação: ${incra.situacao}`)
    if (incra.titulares?.length) linhas.push(`• Titular: ${incra.titulares[0]}`)
  } else {
    linhas.push(`🏛️ *INCRA / SIGEF*`)
    linhas.push(`• Não encontrado`)
  }

  linhas.push(``)

  // Embargos IBAMA
  linhas.push(`🚨 *EMBARGOS IBAMA*`)
  if (resultado.embargos.length === 0) {
    linhas.push(`• ✅ Nenhum embargo encontrado`)
  } else {
    resultado.embargos.slice(0, 3).forEach(e => {
      linhas.push(`• ⛔ ${e.data_embargo} — ${e.municipio ?? 'Local'}`)
      if (e.nome_embargado) linhas.push(`  Embargado: ${e.nome_embargado}`)
    })
    if (resultado.embargos.length > 3) {
      linhas.push(`• +${resultado.embargos.length - 3} embargo(s) adicional(is)`)
    }
  }

  if (plano === 'basico') {
    linhas.push(``)
    linhas.push(`━━━━━━━━━━━━━━━━━━━━━`)
    linhas.push(`💡 *Faça upgrade para o Plano Full* e acesse:`)
    linhas.push(`• Monitoramento contínuo com alertas`)
    linhas.push(`• Queimadas, desmatamento, mineração e +15 camadas`)
    linhas.push(`• Relatório mensal PDF (Farm Scan)`)
    linhas.push(`👉 ${process.env.NEXT_PUBLIC_APP_URL}/planos`)
  }

  linhas.push(``)
  linhas.push(`━━━━━━━━━━━━━━━━━━━━━`)
  linhas.push(`🕒 ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`)

  return linhas.join('\n')
}
