import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DrogueWorks — Parametric Rocket Hardware',
  description:
    'Precision altimeter sled configurator for high-power rocketry. Submit your airframe specs and flight profile — we machine to your tolerances.',
  keywords: ['rocketry', 'altimeter sled', 'high-power rocketry', 'HPR', 'parametric hardware'],
  openGraph: {
    title: 'DrogueWorks — Parametric Rocket Hardware',
    description: 'Precision altimeter sleds, machined to your airframe tolerances.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
