'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Head from 'next/head'

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? ''

const STREAM = [
  '[GEOMETRY_ENGINE_STANDBY]',
  '[AWAITING_PILOT_INPUT]',
  '[FIRST_BATCH_TOOLPATHING]',
  '[HEAT_INSERT_SCHEDULE_LOADED]',
  '[TOLERANCE_STACK_NOMINAL]',
  '[MANIFEST_QUEUE_OPEN]',
  '[JUNE_2026_TARGET_LOCKED]',
  '[EGGTIMER_QUANTUM_PROFILE_OK]',
  '[CADQUERY_KERNEL_INIT]',
  '[MATERIALS_ASA_CF_READY]',
]

const PRODUCTS = [
  {
    id: 'DW-QS4',
    name: '4" Eggtimer Quantum Sled',
    desc: 'Precision-fit for 98mm airframes. Heat-set inserts, dual battery bays, Quantum-specific PCB rails. M3 boss pattern throughout.',
    tags: ['98mm', 'Quantum', 'Dual-deploy'],
    eta: 'June 2026',
  },
  {
    id: 'DW-RV4',
    name: '4" Featherweight Raven Sled',
    desc: 'Engineered for the Raven 3 & 4. Correct PCB footprint, screw boss pattern, and terminal block clearances. Fits standard 98mm couplers.',
    tags: ['98mm', 'Raven 3/4', 'Dual-deploy'],
    eta: 'July 2026',
  },
  {
    id: 'DW-DS3',
    name: '75mm Dual-Deploy Sled',
    desc: 'Fits 3" airframes. Dual altimeter capable. Wire routing channel. M3 boss pattern. Compatible with most L1 airframes.',
    tags: ['75mm', 'Dual altimeter', 'ASA'],
    eta: 'August 2026',
  },
  {
    id: 'DW-FJ4',
    name: '4-Fin Alignment Jig',
    desc: 'Repeatable 90° fin placement. Machined reference edges. Works with most 54–98mm tubes. Eliminates fin cant.',
    tags: ['Alignment', 'Universal', 'Ground support'],
    eta: 'Q3 2026',
  },
  {
    id: 'DW-AVB',
    name: 'Full AV Bay Kit',
    desc: 'Sled + bulkheads + hardware. Pre-drilled for M3 all-thread. Ships ready to stuff. Includes Mission Manifest documentation.',
    tags: ['Complete kit', 'Hardware included'],
    eta: 'TBD',
  },
]

// Pricing tiers
const PRICING = [
  {
    id: 'stl',
    label: 'Digital File',
    price: '$12',
    sub: 'STL + STEP',
    desc: 'Print it yourself. Parametric files optimized for ASA/CF-Nylon. Includes print settings sheet.',
    features: ['STL print-ready file', 'STEP file for edits', 'Print settings PDF', 'Email support'],
    cta: 'Get the Files',
    highlight: false,
  },
  {
    id: 'printed',
    label: 'Printed Sled',
    price: '$45–$65',
    sub: 'ASA or CF-Nylon',
    desc: 'Flight-ready printed sled. Heat-set inserts installed. Test-fitted to your airframe diameter.',
    features: ['Printed in ASA or CF-Nylon', 'M3 heat-set inserts installed', 'Slide-fit verified', 'Mission Manifest card'],
    cta: 'Join Waitlist',
    highlight: true,
  },
  {
    id: 'kit',
    label: 'Full AV Bay Kit',
    price: '$110+',
    sub: 'Sled + bulkheads + hardware',
    desc: 'Complete avionics bay. Sled, bulkheads, all-thread, hardware. Ships ready to stuff.',
    features: ['Everything in Printed Sled', 'Matched bulkheads', 'M3 all-thread + nuts', 'Wiring diagram included'],
    cta: 'Join Waitlist',
    highlight: false,
  },
]

interface FormState {
  email: string
  sled_size: string
  altimeters: string[]
  price_range: string
  other_hardware: string[]
  interest_tier: string
}

const EMPTY: FormState = {
  email: '',
  sled_size: '',
  altimeters: [],
  price_range: '',
  other_hardware: [],
  interest_tier: '',
}

// Structured data for Google
const SCHEMA_ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DrogueWorks',
  description: 'Parametric altimeter sleds and avionics hardware for high-power rocketry. Custom-fit 3D printed sleds for Eggtimer Quantum, Featherweight Raven, Stratologger CF, and more.',
  url: 'https://drogueworks.onrender.com',
  foundingDate: '2026',
  keywords: 'altimeter sled, high power rocketry, HPR, avionics sled, Eggtimer Quantum sled, Featherweight Raven sled, 3D printed rocket parts, 98mm altimeter sled, dual deploy sled',
  sameAs: ['https://github.com/trumanheaston-lab/DrogueWorks'],
  offers: PRICING.map(p => ({
    '@type': 'Offer',
    name: `${p.label} — DrogueWorks Altimeter Sled`,
    price: p.price.replace(/[^0-9–+]/g, '').split('–')[0],
    priceCurrency: 'USD',
    availability: 'https://schema.org/PreOrder',
    description: p.desc,
  })),
}

export default function ComingSoonPage() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | '_form', string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [streamLines, setStreamLines] = useState([STREAM[0], STREAM[1]])
  const [visible, setVisible] = useState(false)
  const [cd, setCd] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const streamIdx = useRef(2)

  useEffect(() => { setTimeout(() => setVisible(true), 60) }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const msg = STREAM[streamIdx.current % STREAM.length]
      streamIdx.current++
      setStreamLines(p => { const n = [...p, msg]; return n.length > 5 ? n.slice(-5) : n })
    }, 2400)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const target = new Date('2026-06-01T00:00:00Z').getTime()
    const tick = () => {
      const diff = target - Date.now()
      if (diff <= 0) return
      setCd({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const toggleMulti = (key: 'altimeters' | 'other_hardware', val: string) =>
    setForm(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(v => v !== val) : [...p[key], val] }))

  const validate = () => {
    const e: typeof errors = {}
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.sled_size) e.sled_size = 'Please select a size'
    if (!form.price_range) e.price_range = 'Please select a range'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      if (FORMSPREE_ID) {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...form, _subject: 'DrogueWorks Waitlist Signup' }),
        })
        if (!res.ok) throw new Error()
      } else {
        console.log('DrogueWorks Waitlist:', JSON.stringify(form, null, 2))
        await new Promise(r => setTimeout(r, 800))
      }
      setSubmitted(true)
    } catch {
      setErrors({ _form: 'Submission failed — please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* ── SEO HEAD ─────────────────────────────────────────
          Note: for Next.js App Router, move these to layout.tsx metadata export.
          This <Head> works for Pages Router fallback.
      ─────────────────────────────────────────────────────── */}
      <Head>
        <title>DrogueWorks — Custom Altimeter Sleds for High-Power Rocketry</title>
        <meta name="description" content="Precision 3D-printed altimeter sleds for high-power rocketry. Custom-fit for Eggtimer Quantum, Featherweight Raven, Stratologger CF. Heat-set inserts, tight tolerances. Shipping June 2026." />
        <meta name="keywords" content="altimeter sled, high power rocketry, HPR hardware, Eggtimer Quantum sled, Featherweight Raven sled, Stratologger sled, 98mm altimeter sled, 4 inch rocket sled, dual deploy sled, 3D printed rocketry, avionics bay, AV bay, rocket electronics sled, custom rocket hardware, ASA rocket parts, CF nylon rocket" />
        <meta name="author" content="DrogueWorks" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://drogueworks.onrender.com" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://drogueworks.onrender.com" />
        <meta property="og:title" content="DrogueWorks — Custom Altimeter Sleds for High-Power Rocketry" />
        <meta property="og:description" content="Precision-fit altimeter sleds for Eggtimer Quantum, Featherweight Raven, Stratologger CF. Heat-set inserts, tight tolerances. First batch shipping June 2026." />
        <meta property="og:image" content="https://drogueworks.onrender.com/DrogueWorks_Logo.png" />
        <meta property="og:site_name" content="DrogueWorks" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DrogueWorks — Custom Altimeter Sleds for High-Power Rocketry" />
        <meta name="twitter:description" content="Precision-fit altimeter sleds for Eggtimer Quantum, Featherweight Raven, Stratologger CF. First batch shipping June 2026." />
        <meta name="twitter:image" content="https://drogueworks.onrender.com/DrogueWorks_Logo.png" />

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_ORG) }}
        />
      </Head>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#050505;color:#fff;font-family:'Barlow',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#050505}::-webkit-scrollbar-thumb{background:#222}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes glow{0%,100%{box-shadow:0 0 0 rgba(74,222,128,0)}50%{box-shadow:0 0 22px rgba(74,222,128,.13)}}
        @keyframes logoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .mono{font-family:'JetBrains Mono',monospace}

        /* HEADER */
        .hdr{position:fixed;top:0;left:0;right:0;z-index:100;height:54px;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;background:rgba(5,5,5,.93);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,.07)}
        .hdr-logo{display:flex;align-items:center;gap:9px;text-decoration:none}
        .hdr-wm{display:flex;align-items:baseline}
        .hdr-b{font-weight:700;font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:#fff}
        .hdr-l{font-weight:300;font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:#555}
        .hdr-status{font-family:'JetBrains Mono',monospace;font-size:10px;color:#4ade80;display:flex;align-items:center;gap:6px;letter-spacing:.1em}
        .sdot{width:5px;height:5px;border-radius:50%;background:#4ade80;animation:pulse 2s infinite;flex-shrink:0}

        /* HERO */
        .hero{padding:96px 1.25rem 56px;max-width:1080px;margin:0 auto;opacity:0;transition:opacity .7s ease}
        .hero.vis{opacity:1}
        .hero-lbl{font-family:'JetBrains Mono',monospace;font-size:10px;color:#555;letter-spacing:.2em;text-transform:uppercase;margin-bottom:22px;display:flex;align-items:center;gap:10px}
        .hero-lbl::before{content:'';display:inline-block;width:20px;height:1px;background:#333}
        .hero-grid{display:grid;grid-template-columns:1fr auto;gap:2.5rem;align-items:start}
        .hero-h1{font-size:clamp(1.9rem,5.5vw,3.6rem);font-weight:800;line-height:1.0;letter-spacing:-.02em;margin-bottom:1.1rem}
        .hero-h1 .dim{color:#444;font-weight:300}
        .hero-p{font-size:14px;color:#888;line-height:1.85;max-width:480px;margin-bottom:1.4rem}
        .stream-blk{border-left:1px solid rgba(255,255,255,.09);padding-left:1rem}
        .stream-ln{font-family:'JetBrains Mono',monospace;font-size:10px;color:#4ade80;line-height:2.1;transition:opacity .3s}

        /* COUNTDOWN */
        .cd-box{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.02);padding:1.1rem;min-width:186px;flex-shrink:0}
        .cd-lbl{font-family:'JetBrains Mono',monospace;font-size:9px;color:#555;letter-spacing:.15em;text-align:center;margin-bottom:10px;text-transform:uppercase}
        .cd-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px}
        .cd-cell{background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.05);padding:9px 4px;text-align:center}
        .cd-num{font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:500;line-height:1;color:#fff}
        .cd-unit{font-family:'JetBrains Mono',monospace;font-size:8px;color:#3a3a3a;letter-spacing:.12em;margin-top:3px;text-transform:uppercase}
        .cd-eta{font-family:'JetBrains Mono',monospace;font-size:9px;color:#4ade80;text-align:center;margin-top:8px;letter-spacing:.1em}

        /* ── BIG LOGO HERO ── */
        .logo-hero{display:flex;flex-direction:column;align-items:center;padding:32px 1.25rem 52px;gap:0;text-align:center}
        .logo-hero-img{animation:logoFloat 5s ease-in-out infinite;filter:drop-shadow(0 0 40px rgba(74,222,128,.18))}
        .logo-hero-rule{width:clamp(200px,40vw,380px);height:1px;background:linear-gradient(90deg,transparent,rgba(74,222,128,.4),transparent);margin:18px auto 0}
        .logo-hero-tagline{font-family:'JetBrains Mono',monospace;font-size:11px;color:#4ade80;letter-spacing:.18em;text-transform:uppercase;margin-top:14px;opacity:.7}

        /* PRICING SECTION */
        .price-sec{max-width:1080px;margin:0 auto 80px;padding:0 1.25rem}
        .sec-hdr{display:flex;align-items:center;gap:12px;margin-bottom:28px}
        .sec-lbl{font-family:'JetBrains Mono',monospace;font-size:10px;color:#333;letter-spacing:.18em;text-transform:uppercase;white-space:nowrap}
        .sec-rule{flex:1;height:1px;background:rgba(255,255,255,.05)}
        .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.06)}
        .price-card{background:#050505;padding:24px 20px;display:flex;flex-direction:column;gap:0;position:relative;transition:background .2s}
        .price-card:hover{background:#0a0a0a}
        .price-card.highlight{background:#0c0c0c;border-top:2px solid #4ade80}
        .price-card.highlight:hover{background:#0f0f0f}
        .popular-badge{position:absolute;top:-1px;left:50%;transform:translateX(-50%);font-family:'JetBrains Mono',monospace;font-size:9px;background:#4ade80;color:#050505;padding:2px 10px;letter-spacing:.1em;font-weight:600;text-transform:uppercase}
        .price-tier-label{font-family:'JetBrains Mono',monospace;font-size:9px;color:#555;letter-spacing:.15em;text-transform:uppercase;margin-bottom:10px}
        .price-amount{font-size:clamp(1.6rem,3vw,2.2rem);font-weight:800;letter-spacing:-.02em;line-height:1;margin-bottom:3px}
        .price-sub{font-family:'JetBrains Mono',monospace;font-size:10px;color:#555;margin-bottom:14px}
        .price-desc{font-size:13px;color:#777;line-height:1.7;margin-bottom:16px}
        .price-features{list-style:none;display:flex;flex-direction:column;gap:7px;margin-bottom:20px;flex:1}
        .price-features li{font-family:'JetBrains Mono',monospace;font-size:10px;color:#666;display:flex;align-items:flex-start;gap:8px;line-height:1.5}
        .price-features li::before{content:'→';color:#4ade80;flex-shrink:0}
        .price-btn{font-family:'Barlow',sans-serif;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:11px 16px;border:none;cursor:pointer;border-radius:0;transition:all .15s;text-align:center;width:100%}
        .price-btn.primary{background:#fff;color:#050505}
        .price-btn.primary:hover{background:#ddd}
        .price-btn.secondary{background:rgba(255,255,255,.06);color:#aaa;border:1px solid rgba(255,255,255,.1)}
        .price-btn.secondary:hover{background:rgba(255,255,255,.1);color:#fff}

        /* FORM */
        .fsec{max-width:740px;margin:0 auto 72px;padding:0 1.25rem}
        .fcard{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.02)}
        .fcard-hdr{padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.07);background:rgba(0,0,0,.3);display:flex;align-items:flex-start;gap:10px;flex-wrap:wrap}
        .fnum{font-family:'JetBrains Mono',monospace;font-size:10px;color:#444;border:1px solid rgba(255,255,255,.07);padding:2px 7px;flex-shrink:0;margin-top:1px}
        .ftitle{font-size:14px;font-weight:600;letter-spacing:.07em;text-transform:uppercase}
        .fsub{font-family:'JetBrains Mono',monospace;font-size:10px;color:#555;margin-top:2px}
        .fbody{padding:20px;display:flex;flex-direction:column;gap:18px}
        .ffooter{padding:0 20px 20px}
        .field{display:flex;flex-direction:column;gap:6px}
        .flbl{font-family:'JetBrains Mono',monospace;font-size:10px;color:#777;letter-spacing:.12em;text-transform:uppercase;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
        .freq{color:#ef4444;font-size:8px}
        .fhint{color:#444;font-size:9px;text-transform:none;letter-spacing:0}
        .ferr{font-family:'JetBrains Mono',monospace;font-size:10px;color:#ef4444}
        .fi,.fs,.fta{background:#0a0a0a;border:1px solid rgba(255,255,255,.11);color:#fff;font-family:'JetBrains Mono',monospace;font-size:12px;padding:11px 12px;outline:none;border-radius:0;width:100%;transition:border-color .2s,background .2s;-webkit-appearance:none;appearance:none}
        .fi:focus,.fs:focus,.fta:focus{border-color:rgba(255,255,255,.32);background:#0e0e0e}
        .fi::placeholder,.fta::placeholder{color:#2a2a2a}
        .fi.e,.fs.e{border-color:rgba(239,68,68,.45)}
        .fs{cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6' fill='none' stroke='%23666' stroke-width='1.5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:32px}
        .fs option{background:#111;color:#fff}
        .pg{display:grid;gap:5px;grid-template-columns:repeat(3,1fr)}
        .pp{font-family:'JetBrains Mono',monospace;font-size:10px;padding:10px 3px;border:none;cursor:pointer;border-radius:0;transition:all .15s;text-align:center;line-height:1.4}
        .pp.on{background:#fff;color:#050505}
        .pp.off{background:rgba(255,255,255,.04);color:#666}
        .pp.off:hover{background:rgba(255,255,255,.08);color:#aaa}
        .chips{display:flex;flex-wrap:wrap;gap:5px}
        .chip{font-family:'JetBrains Mono',monospace;font-size:10px;padding:7px 10px;border:none;border-radius:0;cursor:pointer;transition:all .15s}
        .chip.on{background:#fff;color:#050505}
        .chip.off{background:rgba(255,255,255,.04);color:#666}
        .chip.off:hover{background:rgba(255,255,255,.09);color:#bbb}
        .sbtn{width:100%;padding:15px 20px;background:#fff;color:#050505;border:none;border-radius:0;cursor:pointer;font-family:'Barlow',sans-serif;font-size:13px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;transition:background .15s,transform .1s;display:flex;align-items:center;justify-content:center;gap:9px;animation:glow 3s ease infinite}
        .sbtn:hover{background:#ddd}
        .sbtn:active{transform:scale(.99)}
        .sbtn:disabled{background:#1a1a1a;color:#444;cursor:not-allowed;animation:none}
        .snote{font-family:'JetBrains Mono',monospace;font-size:10px;color:#333;text-align:center;margin-top:10px;line-height:1.7}
        .cur{display:inline-block;width:7px;height:12px;background:#4ade80;animation:blink 1s step-end infinite;vertical-align:middle;margin-left:1px}
        .sw{padding:3rem 1.5rem;display:flex;flex-direction:column;align-items:center;gap:1.4rem;text-align:center}
        .scheck{width:46px;height:46px;border:1px solid #4ade80;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .stitle{font-size:18px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:7px}
        .sbody{font-family:'JetBrains Mono',monospace;font-size:11px;color:#777;line-height:1.9;max-width:380px}
        .stag{font-family:'JetBrains Mono',monospace;font-size:10px;color:#4ade80;border:1px solid rgba(74,222,128,.2);padding:7px 14px;letter-spacing:.1em}

        /* PRODUCTS */
        .psec{max-width:1080px;margin:0 auto 80px;padding:0 1.25rem}
        .pgrid{display:grid;gap:1px;background:rgba(255,255,255,.05);grid-template-columns:repeat(5,1fr)}
        .pcard{background:#050505;padding:18px;position:relative;transition:background .2s}
        .pcard:hover{background:#0b0b0b}
        .pbadge{position:absolute;top:14px;right:12px;font-family:'JetBrains Mono',monospace;font-size:8px;color:#fbbf24;border:1px solid rgba(251,191,36,.2);padding:2px 6px;letter-spacing:.1em;text-transform:uppercase}
        .pid{font-family:'JetBrains Mono',monospace;font-size:9px;color:#333;letter-spacing:.14em;margin-bottom:9px}
        .pname{font-size:12px;font-weight:600;letter-spacing:.02em;margin-bottom:7px;line-height:1.35;padding-right:64px}
        .pdesc{font-family:'JetBrains Mono',monospace;font-size:9px;color:#444;line-height:1.8;margin-bottom:12px}
        .ptags{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px}
        .ptag{font-family:'JetBrains Mono',monospace;font-size:8px;color:#333;border:1px solid rgba(255,255,255,.06);padding:2px 5px}
        .peta{font-family:'JetBrains Mono',monospace;font-size:9px;color:#4ade80}

        /* SEO CONTENT BLOCK */
        .seo-sec{max-width:1080px;margin:0 auto 80px;padding:0 1.25rem}
        .seo-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px}
        .seo-block h2{font-size:15px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px;color:#fff}
        .seo-block p{font-size:13px;color:#666;line-height:1.85}
        .seo-block ul{list-style:none;display:flex;flex-direction:column;gap:5px;margin-top:8px}
        .seo-block ul li{font-family:'JetBrains Mono',monospace;font-size:10px;color:#555;display:flex;align-items:flex-start;gap:8px}
        .seo-block ul li::before{content:'→';color:#4ade80;flex-shrink:0}

        /* FOOTER */
        .ftr{border-top:1px solid rgba(255,255,255,.05);padding:26px 1.25rem;max-width:1080px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.25rem}
        .ftl{display:flex;flex-direction:column;gap:4px}
        .flr{display:flex;align-items:center;gap:7px}
        .fbrand{font-weight:700;font-size:13px;letter-spacing:.1em;text-transform:uppercase}
        .ftagline{font-family:'JetBrains Mono',monospace;font-size:10px;color:#333}
        .ftr-r{display:flex;flex-direction:column;align-items:flex-end;gap:5px}
        .fstat{font-family:'JetBrains Mono',monospace;font-size:11px;color:#4ade80;display:flex;align-items:center;gap:6px}
        .flink{font-family:'JetBrains Mono',monospace;font-size:10px;color:#333;text-decoration:none;transition:color .2s}
        .flink:hover{color:#777}

        /* RESPONSIVE */
        @media(max-width:680px){
          .hero-grid{grid-template-columns:1fr;gap:1.75rem}
          .cd-box{min-width:unset;width:100%}
          .pricing-grid{grid-template-columns:1fr;gap:1px}
          .seo-grid{grid-template-columns:1fr}
          .ftr-r{align-items:flex-start}
        }
        @media(max-width:900px){
          .pgrid{grid-template-columns:repeat(3,1fr)}
          .pricing-grid{grid-template-columns:1fr 1fr}
        }
        @media(max-width:600px){
          .pgrid{grid-template-columns:repeat(2,1fr)}
          .pricing-grid{grid-template-columns:1fr}
          .pg{grid-template-columns:repeat(2,1fr)}
        }
        @media(max-width:400px){
          .hdr-status span:last-child{display:none}
          .pgrid{grid-template-columns:1fr}
        }
      `}</style>

      {/* HEADER */}
      <header className="hdr">
        <a href="#" className="hdr-logo" aria-label="DrogueWorks Home">
          <Image src="/DrogueWorks_Logo.png" alt="DrogueWorks logo" width={30} height={30} style={{ objectFit: 'contain' }} priority />
          <div className="hdr-wm">
            <span className="hdr-b">DROGUE</span>
            <span className="hdr-l">WORKS</span>
          </div>
        </a>
        <div className="hdr-status" aria-label="System status">
          <span className="sdot" aria-hidden="true" />
          <span>SYSTEMS NOMINAL</span>
        </div>
      </header>

      {/* HERO */}
      <section className={`hero${visible ? ' vis' : ''}`} aria-label="Hero">
        <div className="hero-lbl">Mission Manifest / First Batch / June 2026</div>
        <div className="hero-grid">
          <div>
            <h1 className="hero-h1">
              PRECISION<br />
              AVIONICS SLEDS<br />
              <span className="dim">FOR HIGH POWER ROCKETS.</span>
            </h1>
            <p className="hero-p">
              First batch of custom 4&quot; Eggtimer Quantum sleds shipping June 2026.
              Built with tight tolerances, installed heat-set inserts, and full Mission Manifest documentation.
              Also available as STL/STEP files for self-printing.
            </p>
            <div className="stream-blk" aria-hidden="true">
              {streamLines.map((line, i) => (
                <div key={i} className="stream-ln" style={{ opacity: i === streamLines.length - 1 ? 1 : 0.25 }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="cd-box" aria-label="Countdown to June 2026">
            <div className="cd-lbl">First Batch Ships In</div>
            <div className="cd-grid">
              {([['DAYS', cd.days], ['HRS', cd.hours], ['MIN', cd.minutes], ['SEC', cd.seconds]] as [string, number][]).map(([l, v]) => (
                <div key={l} className="cd-cell">
                  <div className="cd-num">{String(v).padStart(2, '0')}</div>
                  <div className="cd-unit">{l}</div>
                </div>
              ))}
            </div>
            <div className="cd-eta">TARGET: 01 JUNE 2026</div>
          </div>
        </div>
      </section>

      {/* ── BIG LOGO HERO ─────────────────────────────────── */}
      <div className="logo-hero" aria-hidden="true">
        <Image
          className="logo-hero-img"
          src="/DrogueWorks_Logo.png"
          alt="DrogueWorks — Precision Avionics Hardware"
          width={340}
          height={340}
          style={{ objectFit: 'contain', width: 'clamp(180px, 34vw, 340px)', height: 'auto' }}
        />
        <div className="logo-hero-rule" />
        <div className="logo-hero-tagline">Precision Hardware · Flight Validated · Mission Ready</div>
      </div>

      {/* ── PRICING ───────────────────────────────────────── */}
      <section className="price-sec" aria-labelledby="pricing-heading">
        <div className="sec-hdr">
          <span className="sec-lbl" id="pricing-heading">Pricing</span>
          <div className="sec-rule" />
        </div>
        <div className="pricing-grid">
          {PRICING.map(tier => (
            <div key={tier.id} className={`price-card${tier.highlight ? ' highlight' : ''}`}>
              {tier.highlight && <div className="popular-badge">Most Popular</div>}
              <div className="price-tier-label">{tier.label}</div>
              <div className="price-amount">{tier.price}</div>
              <div className="price-sub">{tier.sub}</div>
              <p className="price-desc">{tier.desc}</p>
              <ul className="price-features">
                {tier.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <button
                className={`price-btn ${tier.highlight ? 'primary' : 'secondary'}`}
                onClick={() => {
                  document.querySelector('.fsec')?.scrollIntoView({ behavior: 'smooth' })
                  if (tier.id === 'stl') setForm(p => ({ ...p, interest_tier: 'Digital File (STL/STEP)', price_range: 'Digital file only ($12)' }))
                }}
              >
                {tier.cta} →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── WAITLIST FORM ─────────────────────────────────── */}
      <section className="fsec" aria-labelledby="waitlist-heading">
        <div className="fcard">
          <div className="fcard-hdr">
            <span className="fnum">01</span>
            <div>
              <div className="ftitle" id="waitlist-heading">Join the Waitlist</div>
              <div className="fsub">Early access + launch discount for pilot cohort</div>
            </div>
          </div>

          {submitted ? (
            <div className="sw">
              <div className="scheck" role="img" aria-label="Success">
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                  <polyline points="1,7 7,13 19,1" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </div>
              <div>
                <div className="stitle">Systems Nominal.</div>
                <div className="sbody">
                  You&apos;re on the list. We&apos;ll notify you when the first sleds drop —
                  first access plus a launch discount.
                </div>
              </div>
              <div className="stag">[MANIFEST_ACCEPTED] — PILOT COHORT +1</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate aria-label="Waitlist signup form">
              <div className="fbody">

                <div className="field">
                  <label className="flbl" htmlFor="email-input">Email Address <span className="freq" aria-label="required">✱</span></label>
                  <input id="email-input" type="email" value={form.email} placeholder="pilot@example.com"
                    className={`fi${errors.email ? ' e' : ''}`} autoComplete="email"
                    onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: undefined })) }}
                    aria-describedby={errors.email ? 'email-err' : undefined}
                  />
                  {errors.email && <span id="email-err" className="ferr" role="alert">✕ {errors.email}</span>}
                </div>

                <div className="field">
                  <label className="flbl" htmlFor="sled-size">Sled size you&apos;re most interested in <span className="freq" aria-label="required">✱</span></label>
                  <select id="sled-size" value={form.sled_size} className={`fs${errors.sled_size ? ' e' : ''}`}
                    onChange={e => { setForm(p => ({ ...p, sled_size: e.target.value })); setErrors(p => ({ ...p, sled_size: undefined })) }}
                    aria-describedby={errors.sled_size ? 'size-err' : undefined}
                  >
                    <option value="">— SELECT AIRFRAME SIZE —</option>
                    <option value="54mm">54mm (2.1") — 38mm motor compatible</option>
                    <option value="75mm">75mm (3") — Mid-power to L1</option>
                    <option value="98mm">98mm (4") — L1 / L2 certified</option>
                    <option value="other">Other / Not sure yet</option>
                  </select>
                  {errors.sled_size && <span id="size-err" className="ferr" role="alert">✕ {errors.sled_size}</span>}
                </div>

                <div className="field">
                  <div className="flbl" id="alts-label">Altimeter(s) you need sleds for <span className="fhint">— select all that apply</span></div>
                  <div className="chips" role="group" aria-labelledby="alts-label">
                    {['Eggtimer Quantum', 'Featherweight Raven', 'Stratologger CF', 'Altus Metrum', 'Missile Works RRC3', 'Other'].map(opt => (
                      <button key={opt} type="button" onClick={() => toggleMulti('altimeters', opt)}
                        aria-pressed={form.altimeters.includes(opt)}
                        className={`chip ${form.altimeters.includes(opt) ? 'on' : 'off'}`}>{opt}</button>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <div className="flbl" id="price-label">
                    What are you most interested in? <span className="freq" aria-label="required">✱</span>
                  </div>
                  <div className="pg" role="group" aria-labelledby="price-label">
                    {['Digital file only ($12)', 'Printed sled ($45–$65)', 'Full AV bay kit ($110+)', 'Not sure yet'].map(opt => (
                      <button key={opt} type="button"
                        aria-pressed={form.price_range === opt}
                        onClick={() => { setForm(p => ({ ...p, price_range: opt })); setErrors(p => ({ ...p, price_range: undefined })) }}
                        className={`pp ${form.price_range === opt ? 'on' : 'off'}`}>{opt}</button>
                    ))}
                  </div>
                  {errors.price_range && <span className="ferr" role="alert">✕ {errors.price_range}</span>}
                </div>

                <div className="field">
                  <div className="flbl" id="hw-label">Other hardware you&apos;re interested in <span className="fhint">— select all that apply</span></div>
                  <div className="chips" role="group" aria-labelledby="hw-label">
                    {['Fin alignment jigs', 'Full AV bay kits', 'Switch mounts', 'Battery trays', 'Nose cone bulkheads'].map(opt => (
                      <button key={opt} type="button" onClick={() => toggleMulti('other_hardware', opt)}
                        aria-pressed={form.other_hardware.includes(opt)}
                        className={`chip ${form.other_hardware.includes(opt) ? 'on' : 'off'}`}>{opt}</button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="ffooter">
                {errors._form && <div className="ferr" style={{ marginBottom: 12 }} role="alert">✕ {errors._form}</div>}
                <button type="submit" className="sbtn" disabled={submitting}>
                  {submitting
                    ? <><span className="mono" style={{ fontSize: 11, letterSpacing: '.1em' }}>TRANSMITTING</span><span className="cur" aria-hidden="true" /></>
                    : 'Join the Waitlist — Get Early Access & Launch Discount →'
                  }
                </button>
                <p className="snote">No spam. One email when sleds drop. Unsubscribe anytime.</p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── PRODUCT CARDS ─────────────────────────────────── */}
      <section className="psec" aria-labelledby="products-heading">
        <div className="sec-hdr">
          <span className="sec-lbl" id="products-heading">Hardware Manifest</span>
          <div className="sec-rule" />
          <span className="sec-lbl">{PRODUCTS.length} items</span>
        </div>
        <div className="pgrid">
          {PRODUCTS.map(p => (
            <article key={p.id} className="pcard">
              <span className="pbadge">COMING SOON</span>
              <div className="pid">{p.id}</div>
              <h3 className="pname">{p.name}</h3>
              <p className="pdesc">{p.desc}</p>
              <div className="ptags" aria-label="Tags">
                {p.tags.map(t => <span key={t} className="ptag">{t}</span>)}
              </div>
              <div className="peta">ETA: {p.eta}</div>
            </article>
          ))}
        </div>
      </section>

      {/* ── SEO CONTENT ───────────────────────────────────── */}
      <section className="seo-sec" aria-label="About DrogueWorks">
        <div className="sec-hdr">
          <span className="sec-lbl">About the Hardware</span>
          <div className="sec-rule" />
        </div>
        <div className="seo-grid">
          <div className="seo-block">
            <h2>Custom Altimeter Sleds for HPR</h2>
            <p>
              DrogueWorks designs parametric altimeter sleds for high-power rocketry. Every sled is
              engineered to fit a specific altimeter — correct PCB footprint, correct boss pattern,
              correct terminal block clearances. Not a generic tray with foam padding.
            </p>
            <ul>
              <li>Eggtimer Quantum — 4" (98mm) sled</li>
              <li>Featherweight Raven 3 &amp; 4 — 4" (98mm) sled</li>
              <li>Stratologger CF — 75mm and 98mm</li>
              <li>Missile Works RRC3 — coming Q3 2026</li>
            </ul>
          </div>
          <div className="seo-block">
            <h2>Why DrogueWorks?</h2>
            <p>
              Printed in ASA or CF-Nylon. M3 heat-set inserts installed before shipping.
              Slide-fit tested to your actual airframe diameter. Each order ships with a
              Mission Manifest card: mass, material, fit spec, and a re-order QR code.
            </p>
            <ul>
              <li>STL + STEP files available for self-printing ($12)</li>
              <li>Flight-ready printed sleds with inserts ($45–$65)</li>
              <li>Full AV bay kits with bulkheads + hardware ($110+)</li>
              <li>Compatible with LOC, Wildman, Madcow, and custom airframes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ftr">
        <div className="ftl">
          <div className="flr">
            <Image src="/DrogueWorks_Logo.png" alt="" width={20} height={20} style={{ objectFit: 'contain', opacity: 0.6 }} aria-hidden="true" />
            <span className="fbrand">DrogueWorks</span>
          </div>
          <div className="ftagline">Parametric hardware for high-power rocketry</div>
          <div className="ftagline" style={{ marginTop: 4, fontSize: 9, color: '#2a2a2a' }}>
            © 2026 DrogueWorks · drogueworks.onrender.com
          </div>
        </div>
        <div className="ftr-r">
          <div className="fstat"><span className="sdot" aria-hidden="true" />Hardware Status: Operational</div>
          <a href="https://github.com/trumanheaston-lab/DrogueWorks" target="_blank" rel="noopener noreferrer" className="flink">
            github.com/trumanheaston-lab →
          </a>
        </div>
      </footer>
    </>
  )
}
