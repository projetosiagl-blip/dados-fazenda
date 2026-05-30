import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Check Fazenda — Consulta de Imóveis Rurais',
    template: '%s | Check Fazenda',
  },
  description: 'Consulte dados de CAR, INCRA, embargos IBAMA e mais de 25 camadas de informação rural. Monitoramento contínuo via WhatsApp.',
  keywords: ['consulta rural', 'CAR', 'INCRA', 'SIGEF', 'imóvel rural', 'fazenda', 'embargos IBAMA', 'dados rurais', 'monitoramento rural'],
  authors: [{ name: 'Check Fazenda' }],
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
