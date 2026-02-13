import type { Metadata, Viewport } from 'next'
import { Press_Start_2P } from 'next/font/google'

import './globals.css'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
})

export const metadata: Metadata = {
  title: 'hanipot',
  description: 'A Valentine\'s surprise',
  icons: {
    icon: 'photos/favicon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
