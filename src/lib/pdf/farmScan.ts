import puppeteer from 'puppeteer'

interface DadosFarmScan {
  propriedade: string
  municipio: string
  estado: string
  area_ha: number
  car: string
  mes: string
  embargos: number
  queimadas: number
  alertas: string[]
  status_car: string
}

export async function gerarFarmScanPDF(dados: DadosFarmScan): Promise<Buffer> {
  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, sans-serif; color: #1a1a1a; background: white; padding: 40px; }
    .header { background: #1e4d2b; color: white; padding: 28px 32px; border-radius: 8px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-start; }
    .logo { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
    .subtitulo { font-size: 12px; color: #a8d5b5; }
    .mes { font-size: 13px; color: #a8d5b5; text-align: right; }
    .nome-prop { font-size: 22px; font-weight: 700; text-align: right; }
    .secao { margin-bottom: 24px; }
    .secao-titulo { font-size: 11px; font-weight: 700; color: #4a5568; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e2e8d5; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .card { background: #f8faf6; border: 1px solid #d4ddc8; border-radius: 6px; padding: 14px 16px; }
    .card-label { font-size: 11px; color: #4a5568; margin-bottom: 4px; }
    .card-valor { font-size: 18px; font-weight: 700; color: #1e4d2b; }
    .card-sub { font-size: 11px; color: #4a5568; margin-top: 2px; }
    .badge-ok { display: inline-block; background: #f0f9f4; color: #2d6a4f; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 12px; border: 1px solid #b8dfc8; }
    .badge-alerta { display: inline-block; background: #fef9ec; color: #b7882c; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 12px; border: 1px solid #f0c040; }
    .badge-erro { display: inline-block; background: #fdf2f2; color: #c0392b; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 12px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f4ec; font-size: 13px; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #4a5568; }
    .info-valor { font-weight: 600; color: #1a1a1a; }
    .alerta-item { background: #fef9ec; border: 1px solid #f0c040; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px; font-size: 12px; color: #1a1a1a; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #d4ddc8; display: flex; justify-content: space-between; font-size: 11px; color: #4a5568; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">🌾 Dados Fazenda</div>
      <div class="subtitulo">Farm Scan — Relatório Mensal</div>
    </div>
    <div style="text-align:right">
      <div class="mes">${dados.mes}</div>
      <div class="nome-prop">${dados.propriedade}</div>
      <div style="font-size:13px;color:#a8d5b5;margin-top:4px">${dados.municipio} - ${dados.estado}</div>
    </div>
  </div>

  <div class="secao">
    <div class="secao-titulo">Indicadores do mês</div>
    <div class="grid-4">
      <div class="card">
        <div class="card-label">Área total</div>
        <div class="card-valor">${dados.area_ha.toLocaleString('pt-BR')}</div>
        <div class="card-sub">hectares</div>
      </div>
      <div class="card">
        <div class="card-label">Embargos IBAMA</div>
        <div class="card-valor" style="color:${dados.embargos > 0 ? '#c0392b' : '#1e4d2b'}">${dados.embargos}</div>
        <div class="card-sub">${dados.embargos === 0 ? 'Nenhum ativo' : 'Ativo(s)'}</div>
      </div>
      <div class="card">
        <div class="card-label">Queimadas próximas</div>
        <div class="card-valor" style="color:${dados.queimadas > 0 ? '#e67e22' : '#1e4d2b'}">${dados.queimadas}</div>
        <div class="card-sub">últimos 30 dias</div>
      </div>
      <div class="card">
        <div class="card-label">Status CAR</div>
        <div style="margin-top:6px">
          <span class="${dados.status_car === 'Ativo' ? 'badge-ok' : 'badge-alerta'}">${dados.status_car}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="secao">
    <div class="secao-titulo">Dados do imóvel</div>
    <div style="background:#f8faf6;border:1px solid #d4ddc8;border-radius:6px;padding:4px 16px">
      <div class="info-row"><span class="info-label">Código CAR</span><span class="info-valor" style="font-family:monospace;font-size:12px">${dados.car}</span></div>
      <div class="info-row"><span class="info-label">Município</span><span class="info-valor">${dados.municipio} - ${dados.estado}</span></div>
      <div class="info-row"><span class="info-label">Área cadastrada</span><span class="info-valor">${dados.area_ha.toLocaleString('pt-BR')} ha</span></div>
      <div class="info-row"><span class="info-label">Período do relatório</span><span class="info-valor">${dados.mes}</span></div>
    </div>
  </div>

  ${dados.alertas.length > 0 ? `
  <div class="secao">
    <div class="secao-titulo">Alertas do período</div>
    ${dados.alertas.map(a => `<div class="alerta-item">⚠️ ${a}</div>`).join('')}
  </div>` : `
  <div class="secao">
    <div class="secao-titulo">Alertas do período</div>
    <div style="background:#f0f9f4;border:1px solid #b8dfc8;border-radius:6px;padding:14px 16px;font-size:13px;color:#2d6a4f">
      ✅ Nenhum alerta registrado neste período. Propriedade sem ocorrências.
    </div>
  </div>`}

  <div class="footer">
    <span>Dados Fazenda — Sistema de Monitoramento Rural</span>
    <span>Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
  </div>
</body>
</html>`

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'domcontentloaded' })
  const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } })
  await browser.close()

  return Buffer.from(pdf)
}
