'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

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
    desc: 'Precision-fit for 98mm airframes. Heat-set inserts, dual battery bays, Quantum-specific PCB rails.',
    tags: ['98mm', 'Quantum', 'Dual-deploy'],
    eta: 'June 2026',
  },
  {
    id: 'DW-DS3',
    name: '75mm Dual-Deploy Sled',
    desc: 'Fits 3" airframes. Dual altimeter capable. Wire routing channel. M3 boss pattern.',
    tags: ['75mm', 'Dual altimeter', 'ASA'],
    eta: 'July 2026',
  },
  {
    id: 'DW-FJ4',
    name: '4-Fin Alignment Jig',
    desc: 'Repeatable 90° fin placement. Machined reference edges. Works with most 54–98mm tubes.',
    tags: ['Alignment', 'Universal', 'Ground support'],
    eta: 'Q3 2026',
  },
  {
    id: 'DW-AVB',
    name: 'Full AV Bay Kit',
    desc: 'Sled + bulkheads + hardware. Pre-drilled for M3 all-thread. Ships ready to stuff.',
    tags: ['Complete kit', 'Hardware included'],
    eta: 'TBD',
  },
]

interface FormState {
  email: string
  sled_size: string
  altimeters: string[]
  price_range: string
  other_hardware: string[]
}

const EMPTY: FormState = { email: '', sled_size: '', altimeters: [], price_range: '', other_hardware: [] }

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#050505;color:#fff;font-family:'Barlow',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#050505}::-webkit-scrollbar-thumb{background:#222}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 0 rgba(74,222,128,0)}50%{box-shadow:0 0 20px rgba(74,222,128,.12)}}
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
        .hero{padding:96px 1.25rem 48px;max-width:1080px;margin:0 auto;opacity:0;transition:opacity .7s ease}
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

        /* LOGO DIVIDER */
        .logo-div{display:flex;justify-content:center;align-items:center;padding:40px 1.25rem 48px;gap:24px}
        .logo-div-line{flex:1;height:1px;background:rgba(255,255,255,.05);max-width:200px}

        /* FORM */
        .fsec{max-width:740px;margin:0 auto 72px;padding:0 1.25rem}
        .fcard{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.02)}
        .fcard-hdr{padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.07);background:rgba(0,0,0,.3);display:flex;align-items:flex-start;gap:10px;flex-wrap:wrap}
        .fnum{font-family:'JetBrains Mono',monospace;font-size:10px;color:#444;border:1px solid rgba(255,255,255,.07);padding:2px 7px;flex-shrink:0;margin-top:1px}
        .ftitle{font-size:14px;font-weight:600;letter-spacing:.07em;text-transform:uppercase}
        .fsub{font-family:'JetBrains Mono',monospace;font-size:10px;color:#555;margin-top:2px}
        .fbody{padding:20px;display:flex;flex-direction:column;gap:18px}
        .ffooter{padding:0 20px 20px}

        /* FIELDS */
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

        /* PRICE PILLS */
        .pg{display:grid;gap:5px;grid-template-columns:repeat(5,1fr)}
        .pp{font-family:'JetBrains Mono',monospace;font-size:10px;padding:10px 3px;border:none;cursor:pointer;border-radius:0;transition:all .15s;text-align:center}
        .pp.on{background:#fff;color:#050505}
        .pp.off{background:rgba(255,255,255,.04);color:#666}
        .pp.off:hover{background:rgba(255,255,255,.08);color:#aaa}

        /* CHIPS */
        .chips{display:flex;flex-wrap:wrap;gap:5px}
        .chip{font-family:'JetBrains Mono',monospace;font-size:10px;padding:7px 10px;border:none;border-radius:0;cursor:pointer;transition:all .15s}
        .chip.on{background:#fff;color:#050505}
        .chip.off{background:rgba(255,255,255,.04);color:#666}
        .chip.off:hover{background:rgba(255,255,255,.09);color:#bbb}

        /* SUBMIT */
        .sbtn{width:100%;padding:15px 20px;background:#fff;color:#050505;border:none;border-radius:0;cursor:pointer;font-family:'Barlow',sans-serif;font-size:13px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;transition:background .15s,transform .1s;display:flex;align-items:center;justify-content:center;gap:9px;animation:glow 3s ease infinite}
        .sbtn:hover{background:#ddd}
        .sbtn:active{transform:scale(.99)}
        .sbtn:disabled{background:#1a1a1a;color:#444;cursor:not-allowed;animation:none}
        .snote{font-family:'JetBrains Mono',monospace;font-size:10px;color:#333;text-align:center;margin-top:10px;line-height:1.7}
        .cur{display:inline-block;width:7px;height:12px;background:#4ade80;animation:blink 1s step-end infinite;vertical-align:middle;margin-left:1px}

        /* SUCCESS */
        .sw{padding:3rem 1.5rem;display:flex;flex-direction:column;align-items:center;gap:1.4rem;text-align:center}
        .scheck{width:46px;height:46px;border:1px solid #4ade80;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .stitle{font-size:18px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:7px}
        .sbody{font-family:'JetBrains Mono',monospace;font-size:11px;color:#777;line-height:1.9;max-width:380px}
        .stag{font-family:'JetBrains Mono',monospace;font-size:10px;color:#4ade80;border:1px solid rgba(74,222,128,.2);padding:7px 14px;letter-spacing:.1em}

        /* PRODUCTS */
        .psec{max-width:1080px;margin:0 auto 80px;padding:0 1.25rem}
        .phdr{display:flex;align-items:center;gap:12px;margin-bottom:24px}
        .plbl{font-family:'JetBrains Mono',monospace;font-size:10px;color:#333;letter-spacing:.18em;text-transform:uppercase;white-space:nowrap}
        .prule{flex:1;height:1px;background:rgba(255,255,255,.05)}
        .pcnt{font-family:'JetBrains Mono',monospace;font-size:10px;color:#2a2a2a}
        .pgrid{display:grid;gap:1px;background:rgba(255,255,255,.05);grid-template-columns:repeat(4,1fr)}
        .pcard{background:#050505;padding:18px;position:relative;transition:background .2s}
        .pcard:hover{background:#0b0b0b}
        .pbadge{position:absolute;top:14px;right:12px;font-family:'JetBrains Mono',monospace;font-size:8px;color:#fbbf24;border:1px solid rgba(251,191,36,.2);padding:2px 6px;letter-spacing:.1em;text-transform:uppercase}
        .pid{font-family:'JetBrains Mono',monospace;font-size:9px;color:#333;letter-spacing:.14em;margin-bottom:9px}
        .pname{font-size:13px;font-weight:600;letter-spacing:.02em;margin-bottom:7px;line-height:1.35;padding-right:68px}
        .pdesc{font-family:'JetBrains Mono',monospace;font-size:10px;color:#444;line-height:1.8;margin-bottom:12px}
        .ptags{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px}
        .ptag{font-family:'JetBrains Mono',monospace;font-size:9px;color:#333;border:1px solid rgba(255,255,255,.06);padding:2px 6px}
        .peta{font-family:'JetBrains Mono',monospace;font-size:10px;color:#4ade80}

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
          .cd-num{font-size:22px}
          .ftr-r{align-items:flex-start}
        }
        @media(max-width:860px){.pgrid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:480px){
          .pgrid{grid-template-columns:1fr}
          .pg{grid-template-columns:repeat(3,1fr)}
          .hero-h1{font-size:1.9rem}
        }
        @media(max-width:400px){
          .pg{grid-template-columns:repeat(2,1fr)}
          .hdr-status span:last-child{display:none}
        }
      `}</style>

      {/* HEADER */}
      <header className="hdr">
        <a href="#" className="hdr-logo">
          <Image src="/DrogueWorks_Logo.png" alt="DrogueWorks" width={30} height={30} style={{ objectFit: 'contain' }} />
          <div className="hdr-wm">
            <span className="hdr-b">DROGUE</span>
            <span className="hdr-l">WORKS</span>
          </div>
        </a>
        <div className="hdr-status">
          <span className="sdot" />
          <span>SYSTEMS NOMINAL</span>
        </div>
      </header>

      {/* HERO */}
      <section className={`hero${visible ? ' vis' : ''}`}>
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
            </p>
            <div className="stream-blk">
              {streamLines.map((line, i) => (
                <div key={i} className="stream-ln" style={{ opacity: i === streamLines.length - 1 ? 1 : 0.25 }}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Countdown */}
          <div className="cd-box">
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

      {/* LOGO DIVIDER */}
      <div className="logo-div">
        <div className="logo-div-line" />
        <Image
          src="/DrogueWorks_Logo.png"
          alt="DrogueWorks"
          width={130}
          height={130}
          style={{ objectFit: 'contain', width: 'clamp(100px,22vw,130px)', height: 'auto', opacity: 0.9 }}
        />
        <div className="logo-div-line" />
      </div>

      {/* WAITLIST FORM */}
      <section className="fsec">
        <div className="fcard">
          <div className="fcard-hdr">
            <span className="fnum">01</span>
            <div>
              <div className="ftitle">Join the Waitlist</div>
              <div className="fsub">Early access + launch discount for pilot cohort</div>
            </div>
          </div>

          {submitted ? (
            <div className="sw">
              <div className="scheck">
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
            <form onSubmit={handleSubmit} noValidate>
              <div className="fbody">

                <div className="field">
                  <label className="flbl">Email Address <span className="freq">✱</span></label>
                  <input type="email" value={form.email} placeholder="pilot@example.com"
                    className={`fi${errors.email ? ' e' : ''}`}
                    onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: undefined })) }}
                  />
                  {errors.email && <span className="ferr">✕ {errors.email}</span>}
                </div>

                <div className="field">
                  <label className="flbl">Sled size you&apos;re most interested in <span className="freq">✱</span></label>
                  <select value={form.sled_size} className={`fs${errors.sled_size ? ' e' : ''}`}
                    onChange={e => { setForm(p => ({ ...p, sled_size: e.target.value })); setErrors(p => ({ ...p, sled_size: undefined })) }}
                  >
                    <option value="">— SELECT AIRFRAME SIZE —</option>
                    <option value="54mm">54mm (2.1") — 38mm motor compatible</option>
                    <option value="75mm">75mm (3") — Mid-power to L1</option>
                    <option value="98mm">98mm (4") — L1 / L2 certified</option>
                    <option value="other">Other / Not sure yet</option>
                  </select>
                  {errors.sled_size && <span className="ferr">✕ {errors.sled_size}</span>}
                </div>

                <div className="field">
                  <label className="flbl">Altimeter(s) you need sleds for <span className="fhint">— select all that apply</span></label>
                  <div className="chips">
                    {['Eggtimer Quantum', 'Stratologger CF', 'Altus Metrum Raven', 'Missile Works RRC3', 'Featherweight GPS', 'Other'].map(opt => (
                      <button key={opt} type="button" onClick={() => toggleMulti('altimeters', opt)}
                        className={`chip ${form.altimeters.includes(opt) ? 'on' : 'off'}`}>{opt}</button>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <label className="flbl">What would you pay for a premium custom sled? <span className="freq">✱</span></label>
                  <div className="pg">
                    {['Under $35', '$35–$45', '$46–$55', '$56–$70', '$70+'].map(opt => (
                      <button key={opt} type="button"
                        onClick={() => { setForm(p => ({ ...p, price_range: opt })); setErrors(p => ({ ...p, price_range: undefined })) }}
                        className={`pp ${form.price_range === opt ? 'on' : 'off'}`}>{opt}</button>
                    ))}
                  </div>
                  {errors.price_range && <span className="ferr">✕ {errors.price_range}</span>}
                </div>

                <div className="field">
                  <label className="flbl">Other hardware you&apos;re interested in <span className="fhint">— select all that apply</span></label>
                  <div className="chips">
                    {['Fin alignment jigs', 'Full AV bay kits', 'Switch mounts', 'Battery trays', 'Nose cone bulkheads'].map(opt => (
                      <button key={opt} type="button" onClick={() => toggleMulti('other_hardware', opt)}
                        className={`chip ${form.other_hardware.includes(opt) ? 'on' : 'off'}`}>{opt}</button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="ffooter">
                {errors._form && <div className="ferr" style={{ marginBottom: 12 }}>✕ {errors._form}</div>}
                <button type="submit" className="sbtn" disabled={submitting}>
                  {submitting
                    ? <><span className="mono" style={{ fontSize: 11, letterSpacing: '.1em' }}>TRANSMITTING</span><span className="cur" /></>
                    : 'Join the Waitlist — Get Early Access & Launch Discount →'
                  }
                </button>
                <p className="snote">No spam. One email when sleds drop. Unsubscribe anytime.</p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* PRODUCT CARDS */}
      <section className="psec">
        <div className="phdr">
          <span className="plbl">Hardware Manifest</span>
          <div className="prule" />
          <span className="pcnt">4 items</span>
        </div>
        <div className="pgrid">
          {PRODUCTS.map(p => (
            <div key={p.id} className="pcard">
              <span className="pbadge">COMING SOON</span>
              <div className="pid">{p.id}</div>
              <div className="pname">{p.name}</div>
              <p className="pdesc">{p.desc}</p>
              <div className="ptags">{p.tags.map(t => <span key={t} className="ptag">{t}</span>)}</div>
              <div className="peta">ETA: {p.eta}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ftr">
        <div className="ftl">
          <div className="flr">
            <Image src="/DrogueWorks_Logo.png" alt="" width={20} height={20} style={{ objectFit: 'contain', opacity: 0.6 }} />
            <span className="fbrand">DrogueWorks</span>
          </div>
          <div className="ftagline">Parametric hardware for high-power rocketry</div>
        </div>
        <div className="ftr-r">
          <div className="fstat"><span className="sdot" />Hardware Status: Operational</div>
          <a href="https://github.com/trumanheaston-lab/DrogueWorks" target="_blank" rel="noopener noreferrer" className="flink">
            github.com/trumanheaston-lab/DrogueWorks →
          </a>
        </div>
      </footer>
    </>
  )
}
