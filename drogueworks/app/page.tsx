'use client'

import { useState, useEffect, useRef } from 'react'

// ── Formspree endpoint — replace with your ID ─────────────────
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? ''

// ── Terminal stream messages ──────────────────────────────────
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

type MultiKey = 'altimeters' | 'other_hardware'

interface FormState {
  email: string
  sled_size: string
  altimeters: string[]
  price_range: string
  other_hardware: string[]
}

const EMPTY_FORM: FormState = {
  email: '',
  sled_size: '',
  altimeters: [],
  price_range: '',
  other_hardware: [],
}

export default function ComingSoonPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [streamLines, setStreamLines] = useState<string[]>([STREAM[0], STREAM[1]])
  const [visible, setVisible] = useState(false)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const streamIdx = useRef(2)

  // Fade in
  useEffect(() => { setTimeout(() => setVisible(true), 60) }, [])

  // Terminal stream
  useEffect(() => {
    const id = setInterval(() => {
      const msg = STREAM[streamIdx.current % STREAM.length]
      streamIdx.current++
      setStreamLines(prev => {
        const next = [...prev, msg]
        return next.length > 6 ? next.slice(-6) : next
      })
    }, 2400)
    return () => clearInterval(id)
  }, [])

  // Countdown to June 1 2026
  useEffect(() => {
    const target = new Date('2026-06-01T00:00:00Z').getTime()
    const tick = () => {
      const diff = target - Date.now()
      if (diff <= 0) return
      setCountdown({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const toggleMulti = (key: MultiKey, val: string) => {
    setForm(prev => {
      const arr = prev[key]
      return { ...prev, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] }
    })
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.sled_size)  e.sled_size  = 'Please select a size'
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
      setErrors({ email: 'Submission failed — please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ background: '#050505', minHeight: '100vh', color: '#fff', fontFamily: "'Barlow', sans-serif" }}>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem',
        background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '0.15em', textTransform: 'uppercase' }}>DROGUE</span>
          <span style={{ fontWeight: 300, fontSize: 15, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>WORKS</span>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 6, letterSpacing: '0.1em' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite', display: 'inline-block' }} />
          SYSTEMS NOMINAL
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{
        maxWidth: 1100, margin: '0 auto', padding: '130px 2rem 80px',
        opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease',
      }}>
        {/* Label */}
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#888', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-block', width: 24, height: 1, background: '#888' }} />
          Mission Manifest / First Batch / June 2026
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '3rem', alignItems: 'start' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
              PRECISION<br />AVIONICS SLEDS<br />
              <span style={{ color: '#888', fontWeight: 300 }}>FOR HIGH POWER ROCKETS.</span>
            </h1>
            <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.8, maxWidth: 560, marginBottom: 28 }}>
              First batch of custom 4&quot; Eggtimer Quantum sleds shipping June 2026.
              Built with tight tolerances, installed heat-set inserts, and full
              Mission Manifest documentation.
            </p>

            {/* Terminal stream */}
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: '1.2rem' }}>
              {streamLines.map((line, i) => (
                <div key={i} style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  color: '#4ade80', lineHeight: 2.0,
                  opacity: i === streamLines.length - 1 ? 1 : 0.35,
                  transition: 'opacity 0.3s',
                }}>{line}</div>
              ))}
            </div>
          </div>

          {/* Countdown */}
          <div style={{
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.02)',
            padding: '1.5rem',
            minWidth: 220,
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>
              First Batch Ships In
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {[
                ['DAYS',    countdown.days],
                ['HOURS',   countdown.hours],
                ['MIN',     countdown.minutes],
                ['SEC',     countdown.seconds],
              ].map(([label, val]) => (
                <div key={label as string} style={{ padding: '12px 8px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', background: 'rgba(0,0,0,0.3)' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 500, color: '#fff', lineHeight: 1 }}>
                    {String(val).padStart(2, '0')}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#555', letterSpacing: '0.15em', marginTop: 4 }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#4ade80', textAlign: 'center', marginTop: 12, letterSpacing: '0.1em' }}>
              TARGET: 01 JUNE 2026
            </div>
          </div>
        </div>
      </section>

      {/* ── WAITLIST FORM ────────────────────────────────────── */}
      <section style={{ maxWidth: 780, margin: '0 auto 80px', padding: '0 2rem' }}>
        <div style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.02)' }}>

          {/* Form header */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#555', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 8px' }}>
              01
            </span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Join the Waitlist
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#888', marginTop: 2 }}>
                Early access + launch discount for pilot cohort
              </div>
            </div>
          </div>

          {submitted ? (
            /* ── SUCCESS ── */
            <div style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: 48, height: 48, border: '1px solid #4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                  <polyline points="1,7 7,13 19,1" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Systems Nominal.
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#888', lineHeight: 1.9, maxWidth: 420 }}>
                  You&apos;re on the list. We&apos;ll notify you when the first sleds drop — and you&apos;ll get first access plus a launch discount.
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)', padding: '8px 16px', letterSpacing: '0.12em' }}>
                [MANIFEST_ACCEPTED] — PILOT COHORT +1
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Email */}
                <Field label="Email Address" required error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: undefined })) }}
                    placeholder="pilot@example.com"
                    style={inputStyle(!!errors.email)}
                  />
                </Field>

                {/* Sled size */}
                <Field label="What size sled are you most interested in?" required error={errors.sled_size}>
                  <SelectInput
                    value={form.sled_size}
                    onChange={v => { setForm(p => ({ ...p, sled_size: v })); setErrors(p => ({ ...p, sled_size: undefined })) }}
                    error={!!errors.sled_size}
                    options={[
                      { value: '', label: '— SELECT AIRFRAME SIZE —' },
                      { value: '54mm', label: '54mm (2.1") — 38mm motor tube compatible' },
                      { value: '75mm', label: '75mm (3") — Mid-power to L1' },
                      { value: '98mm', label: '98mm (4") — L1 / L2 certified flights' },
                      { value: 'other', label: 'Other / Not sure yet' },
                    ]}
                  />
                </Field>

                {/* Altimeters multi-select */}
                <Field label="Which altimeter(s) do you need sleds for?" hint="Select all that apply">
                  <MultiSelect
                    selected={form.altimeters}
                    onToggle={v => toggleMulti('altimeters', v)}
                    options={[
                      'Eggtimer Quantum',
                      'Stratologger CF',
                      'Altus Metrum Raven',
                      'Missile Works RRC3',
                      'Featherweight GPS',
                      'Other',
                    ]}
                  />
                </Field>

                {/* Price range */}
                <Field label="What would you pay for a premium custom sled?" required error={errors.price_range}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                    {['Under $35', '$35–$45', '$46–$55', '$56–$70', '$70+'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { setForm(p => ({ ...p, price_range: opt })); setErrors(p => ({ ...p, price_range: undefined })) }}
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 11, padding: '10px 4px', border: 'none', cursor: 'pointer',
                          background: form.price_range === opt ? '#fff' : 'rgba(255,255,255,0.04)',
                          color: form.price_range === opt ? '#050505' : '#888',
                          borderRadius: 0,
                          outline: errors.price_range ? '1px solid rgba(239,68,68,0.5)' : 'none',
                          transition: 'all 0.15s',
                          letterSpacing: '0.03em',
                        }}
                      >{opt}</button>
                    ))}
                  </div>
                </Field>

                {/* Other hardware multi-select */}
                <Field label="Interested in other DrogueWorks hardware?" hint="Select all that apply">
                  <MultiSelect
                    selected={form.other_hardware}
                    onToggle={v => toggleMulti('other_hardware', v)}
                    options={[
                      'Fin alignment jigs',
                      'Full AV bay kits',
                      'Switch mounts',
                      'Battery trays',
                      'Nose cone bulkheads',
                    ]}
                  />
                </Field>

              </div>

              {/* Submit */}
              <div style={{ padding: '0 24px 24px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%', padding: '15px 24px',
                    background: submitting ? '#333' : '#fff',
                    color: submitting ? '#888' : '#050505',
                    border: 'none', borderRadius: 0, cursor: submitting ? 'not-allowed' : 'pointer',
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                    transition: 'background 0.15s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  }}
                >
                  {submitting ? (
                    <>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em' }}>TRANSMITTING</span>
                      <span style={{ display: 'inline-block', width: 8, height: 13, background: '#4ade80', animation: 'blink 1s step-end infinite' }} />
                    </>
                  ) : (
                    'Join the Waitlist — Get Early Access & Launch Discount →'
                  )}
                </button>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#555', textAlign: 'center', marginTop: 10, lineHeight: 1.7 }}>
                  No spam. One email when sleds drop. Unsubscribe anytime.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── PRODUCT CARDS ────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto 100px', padding: '0 2rem' }}>
        <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#555', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Hardware Manifest
          </div>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#555', letterSpacing: '0.1em' }}>
            4 items
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 1, background: 'rgba(255,255,255,0.06)' }}>
          {PRODUCTS.map(product => (
            <div key={product.id} style={{ background: '#050505', padding: '20px', position: 'relative', transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#0a0a0a')}
              onMouseLeave={e => (e.currentTarget.style.background = '#050505')}
            >
              {/* Coming soon badge */}
              <div style={{
                position: 'absolute', top: 16, right: 16,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)',
                padding: '2px 7px', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                COMING SOON
              </div>

              {/* ID */}
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#555', letterSpacing: '0.15em', marginBottom: 12 }}>
                {product.id}
              </div>

              {/* Name */}
              <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 8, lineHeight: 1.3, paddingRight: 80 }}>
                {product.name}
              </div>

              {/* Desc */}
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#666', lineHeight: 1.75, marginBottom: 16 }}>
                {product.desc}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {product.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                    color: '#555', border: '1px solid rgba(255,255,255,0.08)',
                    padding: '2px 7px', letterSpacing: '0.08em',
                  }}>{tag}</span>
                ))}
              </div>

              {/* ETA */}
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#4ade80' }}>
                ETA: {product.eta}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        maxWidth: 1100, margin: '0 auto', padding: '28px 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase' }}>DROGUEWORKS</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#555', marginTop: 4 }}>
            Parametric hardware for high-power rocketry
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite', display: 'inline-block' }} />
            Hardware Status: Operational
          </div>
          <a href="https://github.com/trumanheaston-lab/DrogueWorks" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#555', textDecoration: 'none' }}>
            github.com/trumanheaston-lab/DrogueWorks →
          </a>
        </div>
      </footer>

      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050505; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        input::placeholder { color: #444; }
        input:focus { outline: none; }
        select:focus { outline: none; }
        @media (max-width: 680px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .price-grid { grid-template-columns: repeat(3,1fr) !important; }
          .countdown-grid { grid-template-columns: repeat(4,1fr) !important; }
        }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────

function Field({ label, required, hint, error, children }: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#888', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
        {label}
        {required && <span style={{ color: '#ef4444', fontSize: 8 }}>✱</span>}
        {hint && <span style={{ color: '#555', fontSize: 9, textTransform: 'none', letterSpacing: 0 }}> — {hint}</span>}
      </label>
      {children}
      {error && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#ef4444' }}>✕ {error}</span>}
    </div>
  )
}

function inputStyle(error: boolean): React.CSSProperties {
  return {
    background: '#0a0a0a', border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)'}`,
    color: '#fff', fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
    padding: '10px 12px', outline: 'none', borderRadius: 0, width: '100%',
  }
}

function SelectInput({ value, onChange, options, error }: {
  value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]; error: boolean
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        ...inputStyle(error),
        cursor: 'pointer', appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6' fill='none' stroke='%23888' stroke-width='1.5'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
        paddingRight: 32,
      }}
    >
      {options.map(o => <option key={o.value} value={o.value} style={{ background: '#111' }}>{o.label}</option>)}
    </select>
  )
}

function MultiSelect({ selected, onToggle, options }: {
  selected: string[]; onToggle: (v: string) => void; options: string[]
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(opt => {
        const active = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              padding: '7px 12px', border: 'none', borderRadius: 0, cursor: 'pointer',
              background: active ? '#fff' : 'rgba(255,255,255,0.05)',
              color: active ? '#050505' : '#888',
              transition: 'all 0.15s',
              letterSpacing: '0.03em',
            }}
          >{opt}</button>
        )
      })}
    </div>
  )
}
