import './globals.css'

export const metadata = {
  title: 'Painel Admin — Lar dos Sonhos Imóveis',
  description: 'Painel de gestão de imóveis — Gabriel Bin CRECI-SP 302244-F',
  robots: 'noindex, nofollow',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
