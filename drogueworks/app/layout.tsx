import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  // ── Core ──────────────────────────────────────────────────
  title: {
    default: 'DrogueWorks — Custom Altimeter Sleds for High-Power Rocketry',
    template: '%s | DrogueWorks',
  },
  description:
    'Precision 3D-printed altimeter sleds for high-power rocketry. Custom-fit for Eggtimer Quantum, Featherweight Raven, Stratologger CF, and more. Heat-set inserts, tight tolerances. STL files and flight-ready printed sleds. Shipping June 2026.',

  // ── Keywords (still read by Bing, Yandex, and niche crawlers) ──
  keywords: [
    'altimeter sled',
    'high power rocketry',
    'HPR hardware',
    'Eggtimer Quantum sled',
    'Featherweight Raven sled',
    'Stratologger CF sled',
    '98mm altimeter sled',
    '4 inch rocket sled',
    '75mm altimeter sled',
    'dual deploy sled',
    '3D printed rocketry hardware',
    'avionics bay',
    'AV bay sled',
    'rocket electronics sled',
    'custom rocket hardware',
    'ASA rocket parts',
    'CF nylon rocket sled',
    'heat set insert rocket',
    'LOC Precision altimeter',
    'Wildman rocketry sled',
    'Madcow rocketry',
    'parametric rocket hardware',
    'Level 1 rocketry hardware',
    'Level 2 rocketry hardware',
  ],

  // ── Authorship ────────────────────────────────────────────
  authors: [{ name: 'DrogueWorks', url: 'https://drogueworks.onrender.com' }],
  creator: 'DrogueWorks',
  publisher: 'DrogueWorks',

  // ── Indexing ──────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ── Canonical ─────────────────────────────────────────────
  alternates: {
    canonical: 'https://drogueworks.onrender.com',
  },

  // ── Open Graph ────────────────────────────────────────────
  openGraph: {
    type: 'website',
    url: 'https://drogueworks.onrender.com',
    siteName: 'DrogueWorks',
    title: 'DrogueWorks — Custom Altimeter Sleds for High-Power Rocketry',
    description:
      'Precision-fit altimeter sleds for Eggtimer Quantum, Featherweight Raven, Stratologger CF. Heat-set inserts, tight tolerances. STL files + printed sleds. Shipping June 2026.',
    images: [
      {
        url: 'https://drogueworks.onrender.com/DrogueWorks_Logo.png',
        width: 1024,
        height: 512,
        alt: 'DrogueWorks — Precision Avionics Hardware for High-Power Rocketry',
      },
    ],
    locale: 'en_US',
  },

  // ── Twitter / X ───────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'DrogueWorks — Custom Altimeter Sleds for High-Power Rocketry',
    description:
      'Precision-fit altimeter sleds for Eggtimer Quantum, Featherweight Raven, Stratologger CF. Shipping June 2026.',
    images: ['https://drogueworks.onrender.com/DrogueWorks_Logo.png'],
  },

  // ── Verification (add your codes when you set these up) ───
  // verification: {
  //   google: 'YOUR_GOOGLE_SEARCH_CONSOLE_CODE',
  //   yandex: 'YOUR_YANDEX_CODE',
  // },

  // ── App metadata ──────────────────────────────────────────
  applicationName: 'DrogueWorks',
  category: 'Hardware / Rocketry',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        {/* Structured data — Organization + Product */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://drogueworks.onrender.com/#org',
                  name: 'DrogueWorks',
                  url: 'https://drogueworks.onrender.com',
                  logo: 'https://drogueworks.onrender.com/DrogueWorks_Logo.png',
                  description:
                    'Parametric altimeter sleds and avionics hardware for high-power rocketry.',
                  foundingDate: '2026',
                  sameAs: ['https://github.com/trumanheaston-lab/DrogueWorks'],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://drogueworks.onrender.com/#website',
                  url: 'https://drogueworks.onrender.com',
                  name: 'DrogueWorks',
                  publisher: { '@id': 'https://drogueworks.onrender.com/#org' },
                },
                {
                  '@type': 'Product',
                  name: '4" Eggtimer Quantum Altimeter Sled',
                  description:
                    'Precision-fit 3D printed altimeter sled for the Eggtimer Quantum. Designed for 98mm (4") airframes. M3 heat-set inserts, correct PCB boss pattern, dual battery bay.',
                  brand: { '@id': 'https://drogueworks.onrender.com/#org' },
                  category: 'High-Power Rocketry Hardware',
                  offers: {
                    '@type': 'Offer',
                    price: '45',
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/PreOrder',
                    priceValidUntil: '2026-12-31',
                    url: 'https://drogueworks.onrender.com',
                  },
                },
                {
                  '@type': 'Product',
                  name: '4" Featherweight Raven Altimeter Sled',
                  description:
                    'Precision-fit 3D printed altimeter sled for the Featherweight Raven 3 and Raven 4. Designed for 98mm (4") airframes. M3 heat-set inserts, correct PCB footprint.',
                  brand: { '@id': 'https://drogueworks.onrender.com/#org' },
                  category: 'High-Power Rocketry Hardware',
                  offers: {
                    '@type': 'Offer',
                    price: '45',
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/PreOrder',
                    priceValidUntil: '2026-12-31',
                    url: 'https://drogueworks.onrender.com',
                  },
                },
                {
                  '@type': 'Product',
                  name: 'DrogueWorks Altimeter Sled STL/STEP File',
                  description:
                    'Parametric STL and STEP files for self-printing DrogueWorks altimeter sleds. Optimized for ASA and CF-Nylon. Includes print settings documentation.',
                  brand: { '@id': 'https://drogueworks.onrender.com/#org' },
                  category: 'Digital Download / Rocketry Hardware',
                  offers: {
                    '@type': 'Offer',
                    price: '12',
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/PreOrder',
                    url: 'https://drogueworks.onrender.com',
                  },
                },
                {
                  '@type': 'FAQPage',
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'What altimeters does DrogueWorks make sleds for?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'DrogueWorks makes custom-fit altimeter sleds for the Eggtimer Quantum, Featherweight Raven 3, Featherweight Raven 4, PerfectFlite Stratologger CF, and Missile Works RRC3. Each sled is engineered to the exact PCB footprint of the altimeter.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'What airframe sizes are supported?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'DrogueWorks currently offers sleds for 54mm (2.1"), 75mm (3"), and 98mm (4") airframes. The 98mm / 4" Eggtimer Quantum sled is the first product shipping in June 2026.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'Can I print the sled myself?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Yes. DrogueWorks offers STL and STEP files for $12 so you can print the sled yourself. Files are optimized for ASA and CF-Nylon and include a print settings PDF.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'What material are the sleds printed in?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Printed sleds are produced in ASA (heat deflection 94°C, UV stable) or CF-Nylon (chopped carbon fiber reinforced). Both materials are appropriate for high-power rocketry flight environments.',
                      },
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
