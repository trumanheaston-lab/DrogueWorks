'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? ''

interface SurveyState {
  email: string
  altimeters: string[]
  frustrations: string[]
  custom_frustration: string
  useful_parts: string[]
  custom_useful: string
  would_pay: string
  pay_range: string
  airframe_sizes: string[]
  experience_level: string
  open_feedback: string
}

const EMPTY: SurveyState = {
  email: '',
  altimeters: [],
  frustrations: [],
  custom_frustration: '',
  useful_parts: [],
  custom_useful: '',
  would_pay: '',
  pay_range: '',
  airframe_sizes: [],
  experience_level: '',
  open_feedback: '',
}

const ALTIMETERS = [
  'Featherweight Raven 3',
  'Featherweight Raven 4',
  'Featherweight GPS Tracker',
  'PerfectFlite Stratologger CF',
  'Eggtimer Quantum',
  'Eggtimer Quark',
  'Missile Works RRC3',
  'Altus Metrum',
  'Other',
]

const FRUSTRATIONS = [
  'AV bay assembly takes too long',
  'Sleds that don\'t fit my airframe',
  'Wire management is a pain',
  'Sourcing the right screws and hardware',
  'Fin alignment',
  'Recovery harness setup',
  'Nose cone ballast',
  'Altimeter setup and programming',
]

const USEFUL_PARTS = [
  'Altimeter sleds that actually fit',
  'Fin alignment jigs',
  'Full AV bay kits',
  'Switch mounts',
  'Battery holders',
  'Nose cone bulkheads',
  'Recovery anchor points',
  'Motor retention parts',
  'Centering rings',
  'Build guides or documentation',
]

const SIZES = ['29mm', '38mm', '54mm', '75mm', '98mm', 'Larger', 'It varies']

const EXPERIENCE = [
  'Just starting out (under 5 flights)',
  'Getting comfortable (5 to 20 flights)',
  'L1 certified',
  'L2 certified',
  'L3 or 20+ years flying',
]

export default function Page() {
  const [survey, setSurvey] = useState<SurveyState>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof SurveyState | '_form', string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 60) }, [])

  const toggle = (key: 'altimeters' | 'frustrations' | 'useful_parts' | 'airframe_sizes', val: string) =>
    setSurvey(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(v => v !== val) : [...p[key], val] }))

  const validate = () => {
    const e: typeof errors = {}
    if (!survey.email || !/\S+@\S+\.\S+/.test(survey.email)) e.email = 'Need a valid email'
    if (survey.altimeters.length === 0) e.altimeters = 'Pick at least one'
    if (!survey.would_pay) e.would_pay = 'Required'
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
          body: JSON.stringify({ ...survey, _subject: 'DrogueWorks Survey' }),
        })
        if (!res.ok) throw new Error()
      } else {
        console.log('Survey:', JSON.stringify(survey, null, 2))
        await new Promise(r => setTimeout(r, 800))
      }
      setSubmitted(true)
    } catch {
      setErrors({ _form: 'Something went wrong. Email me directly at trumanheaston@gmail.com' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: #0a0a0a;
          color: #d4d4d4;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; }

        a { color: inherit; }
        .mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        /* ---- LAYOUT ---- */
        .page { max-width: 640px; margin: 0 auto; padding: 0 1.25rem; }

        /* ---- HEADER ---- */
        .header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #1a1a1a;
        }
        .header-inner {
          max-width: 640px; margin: 0 auto; padding: 0 1.25rem;
          height: 52px; display: flex; align-items: center; justify-content: space-between;
        }
        .logo-link { display: flex; align-items: center; gap: 8px; text-decoration: none; }
        .logo-text { font-weight: 700; font-size: 14px; letter-spacing: 0.08em; color: #fff; }
        .status-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: #4ade80;
          display: flex; align-items: center; gap: 5px;
        }
        .status-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ade80; animation: pulse 2s infinite; }

        /* ---- LOGO SECTION ---- */
        .logo-section {
          padding-top: 88px;
          display: flex; flex-direction: column; align-items: center;
          padding-bottom: 40px;
          opacity: 0;
          animation: fadeIn 0.6s ease 0.1s forwards;
        }

        /* ---- INTRO ---- */
        .intro {
          padding-bottom: 48px;
          opacity: 0;
          animation: fadeIn 0.6s ease 0.2s forwards;
        }
        .intro h1 {
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 24px;
          letter-spacing: -0.01em;
        }
        .intro p {
          color: #888;
          margin-bottom: 16px;
          font-size: 15px;
        }
        .intro p:last-child { margin-bottom: 0; }
        .intro strong { color: #bbb; font-weight: 500; }

        /* ---- QUOTE ---- */
        .quote-block {
          border-left: 2px solid #2a2a2a;
          padding: 12px 16px;
          margin: 24px 0;
          background: #111;
        }
        .quote-block p {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #666;
          line-height: 1.8;
          margin: 0;
        }
        .quote-block cite {
          display: block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #444;
          margin-top: 8px;
          font-style: normal;
        }

        /* ---- DIVIDER ---- */
        .divider { height: 1px; background: #1a1a1a; margin: 40px 0; }

        /* ---- FORM ---- */
        .survey-form {
          opacity: 0;
          animation: fadeIn 0.6s ease 0.3s forwards;
          padding-bottom: 80px;
        }
        .form-title {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .form-subtitle {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #444;
          margin-bottom: 32px;
        }

        .question { margin-bottom: 28px; }
        .q-label {
          font-size: 14px;
          font-weight: 500;
          color: #ccc;
          margin-bottom: 4px;
          display: block;
        }
        .q-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #444;
          margin-bottom: 12px;
          display: block;
        }

        /* chips */
        .chip-group { display: flex; flex-wrap: wrap; gap: 6px; }
        .chip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          padding: 6px 11px;
          border: 1px solid #222;
          background: transparent;
          color: #555;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.15s;
          line-height: 1;
        }
        .chip:hover { border-color: #444; color: #999; }
        .chip.selected { border-color: #4ade80; color: #4ade80; background: rgba(74, 222, 128, 0.05); }

        /* radio options */
        .option-group { display: flex; flex-direction: column; gap: 6px; }
        .option-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px;
          border: 1px solid #1e1e1e;
          background: transparent;
          color: #555;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.15s;
          font-size: 13px;
          text-align: left;
          width: 100%;
        }
        .option-btn:hover { border-color: #333; color: #888; }
        .option-btn.selected { border-color: #333; color: #ccc; background: #111; }
        .option-circle {
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 1px solid #333;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .option-btn.selected .option-circle { border-color: #4ade80; background: #4ade80; }
        .option-btn.selected .option-circle::after {
          content: ''; width: 5px; height: 5px;
          border-radius: 50%; background: #0a0a0a;
        }

        /* pay grid */
        .pay-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
        .pay-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          padding: 10px 6px;
          border: 1px solid #1e1e1e;
          background: transparent;
          color: #555;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.15s;
          text-align: center;
        }
        .pay-btn:hover { border-color: #333; color: #888; }
        .pay-btn.selected { border-color: #4ade80; color: #4ade80; background: rgba(74,222,128,0.05); }

        /* text inputs */
        .text-input, .textarea {
          width: 100%;
          background: #111;
          border: 1px solid #1e1e1e;
          color: #ccc;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          padding: 10px 12px;
          outline: none;
          border-radius: 2px;
          transition: border-color 0.2s;
          -webkit-appearance: none;
        }
        .text-input:focus, .textarea:focus { border-color: #333; }
        .text-input::placeholder, .textarea::placeholder { color: #2a2a2a; }
        .text-input.has-error { border-color: rgba(248, 113, 113, 0.4); }
        .textarea { resize: vertical; min-height: 80px; line-height: 1.6; }
        .small-textarea { min-height: 60px; font-size: 13px; margin-top: 8px; }

        .field-error {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #f87171;
          margin-top: 6px;
        }

        /* submit */
        .submit-btn {
          width: 100%;
          padding: 13px 20px;
          background: #fff;
          color: #0a0a0a;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: background 0.15s;
          border-radius: 2px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:hover { background: #e0e0e0; }
        .submit-btn:disabled { background: #1a1a1a; color: #3a3a3a; cursor: not-allowed; }
        .submit-note {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: #333;
          text-align: center; margin-top: 10px; line-height: 1.7;
        }
        .cursor { display: inline-block; width: 7px; height: 13px; background: #4ade80; animation: blink 1s step-end infinite; vertical-align: middle; }

        /* ---- SUCCESS ---- */
        .success-state {
          padding: 48px 0;
          display: flex; flex-direction: column; align-items: center;
          gap: 16px; text-align: center;
        }
        .success-icon {
          width: 44px; height: 44px;
          border: 1px solid #2a2a2a;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
        }
        .success-title { font-size: 18px; font-weight: 600; color: #fff; }
        .success-body { font-size: 14px; color: #666; max-width: 360px; line-height: 1.7; }

        /* ---- WORK IN PROGRESS ---- */
        .wip-section { padding-bottom: 72px; }
        .wip-title {
          font-size: 13px; font-weight: 600;
          color: #fff; text-transform: uppercase;
          letter-spacing: 0.06em; margin-bottom: 4px;
        }
        .wip-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: #444; margin-bottom: 20px;
        }
        .wip-item {
          padding: 14px 0;
          border-bottom: 1px solid #141414;
          display: flex; align-items: flex-start; gap: 12px;
        }
        .wip-item:last-child { border-bottom: none; }
        .wip-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px; padding: 3px 7px;
          border-radius: 2px; flex-shrink: 0; margin-top: 1px;
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .badge-proto { background: rgba(251,191,36,0.08); color: #ca8a04; border: 1px solid rgba(251,191,36,0.15); }
        .badge-next { background: rgba(96,165,250,0.06); color: #3b82f6; border: 1px solid rgba(96,165,250,0.15); }
        .badge-later { background: transparent; color: #333; border: 1px solid #1e1e1e; }
        .wip-name { font-size: 13px; font-weight: 500; color: #bbb; margin-bottom: 3px; }
        .wip-desc { font-size: 12px; color: #555; line-height: 1.6; }

        /* ---- FOOTER ---- */
        .footer {
          border-top: 1px solid #141414;
          padding: 28px 1.25rem;
          max-width: 640px; margin: 0 auto;
          display: flex; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; color: #333;
        }
        .footer-left { display: flex; flex-direction: column; gap: 4px; }
        .footer-brand { color: #555; font-weight: 500; }
        .footer-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .footer-link { text-decoration: none; color: #333; transition: color 0.2s; }
        .footer-link:hover { color: #666; }
        .footer-status { color: #4ade80; display: flex; align-items: center; gap: 5px; }

        @media (max-width: 480px) {
          .pay-grid { grid-template-columns: repeat(2, 1fr); }
          .footer-right { align-items: flex-start; }
        }
      `}</style>

      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <a href="#" className="logo-link">
            <Image src="/DrogueWorks_Logo.png" alt="DrogueWorks" width={26} height={26} style={{ objectFit: 'contain' }} priority />
            <span className="logo-text">DrogueWorks</span>
          </a>
          <div className="status-badge">
            <span className="status-dot" />
            <span>building in public</span>
          </div>
        </div>
      </header>

      {/* LOGO */}
      <div className="logo-section">
        <Image
          src="/DrogueWorks_Logo.png"
          alt="DrogueWorks"
          width={160}
          height={160}
          style={{ objectFit: 'contain', width: 'clamp(110px, 22vw, 160px)', height: 'auto', opacity: 0.92 }}
        />
      </div>

      <main className="page">

        {/* INTRO */}
        <div className="intro">
          <h1>I'm trying to build useful stuff for rocketry. Tell me what you actually need.</h1>

          <p>
            My name is Truman. I started DrogueWorks because I kept running into the same
            problem building rockets: avionics hardware that almost fits, generic sleds with no
            clearance for terminal blocks, and way too much time spent on stuff that should
            just work out of the box.
          </p>

          <p>
            Right now I have one prototype on the bench, a 4 inch Eggtimer Quantum sled.
            But before I commit to a product line, I want to know what people who actually fly
            think is worth solving.
          </p>

          <div className="quote-block">
            <p>
              "Use PETG and make it one piece. If you print vertical you will need some vertical
              walls to reinforce the sled. The battery box works well. You really don't need more
              than 3mm of the board for most altimeters. I just put them flat on the board and
              use washers or m3 standoffs."
            </p>
            <cite>feedback from a flier with 10+ printed sleds</cite>
          </div>

          <p>
            That kind of input changes what I build. If you have 3 minutes and opinions about
            rocketry hardware, I'd appreciate hearing them.
          </p>
        </div>

        <div className="divider" />

        {/* SURVEY */}
        <div className="survey-form">
          <div className="form-title">Community Survey</div>
          <div className="form-subtitle">~3 min. responses go straight to my inbox.</div>

          {submitted ? (
            <div className="success-state">
              <div className="success-icon">
                <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
                  <polyline points="1,6 6,11 17,1" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="success-title">Got it, thanks.</div>
              <div className="success-body">
                I read every response. If you left your email I might follow up with a question or two.
                That's it, no marketing.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>

              {/* Q1 */}
              <div className="question">
                <label className="q-label">What altimeters do you fly most?</label>
                <span className="q-sub">select all that apply</span>
                <div className="chip-group">
                  {ALTIMETERS.map(opt => (
                    <button key={opt} type="button"
                      onClick={() => toggle('altimeters', opt)}
                      className={`chip ${survey.altimeters.includes(opt) ? 'selected' : ''}`}>
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.altimeters && <div className="field-error">{errors.altimeters}</div>}
              </div>

              {/* Q2 */}
              <div className="question">
                <label className="q-label">What's most annoying when you're building?</label>
                <span className="q-sub">select all that apply</span>
                <div className="chip-group">
                  {FRUSTRATIONS.map(opt => (
                    <button key={opt} type="button"
                      onClick={() => toggle('frustrations', opt)}
                      className={`chip ${survey.frustrations.includes(opt) ? 'selected' : ''}`}>
                      {opt}
                    </button>
                  ))}
                </div>
                <textarea
                  value={survey.custom_frustration}
                  onChange={e => setSurvey(p => ({ ...p, custom_frustration: e.target.value }))}
                  placeholder="Anything else that drives you crazy..."
                  className="textarea small-textarea"
                />
              </div>

              {/* Q3 */}
              <div className="question">
                <label className="q-label">What parts or tools would actually save you time?</label>
                <span className="q-sub">be honest, not just polite</span>
                <div className="chip-group">
                  {USEFUL_PARTS.map(opt => (
                    <button key={opt} type="button"
                      onClick={() => toggle('useful_parts', opt)}
                      className={`chip ${survey.useful_parts.includes(opt) ? 'selected' : ''}`}>
                      {opt}
                    </button>
                  ))}
                </div>
                <textarea
                  value={survey.custom_useful}
                  onChange={e => setSurvey(p => ({ ...p, custom_useful: e.target.value }))}
                  placeholder="Something not on the list..."
                  className="textarea small-textarea"
                />
              </div>

              {/* Q4 */}
              <div className="question">
                <label className="q-label">Would you pay for well-made custom printed rocketry hardware?</label>
                <div className="option-group" style={{ marginTop: 8 }}>
                  {[
                    'Yes, if it fit well and saved me time',
                    'Maybe, depends on price and quality',
                    "Probably not, I'd rather print it myself",
                    'No, I make my own or buy off the shelf',
                  ].map(opt => (
                    <button key={opt} type="button"
                      onClick={() => { setSurvey(p => ({ ...p, would_pay: opt })); setErrors(p => ({ ...p, would_pay: undefined })) }}
                      className={`option-btn ${survey.would_pay === opt ? 'selected' : ''}`}>
                      <span className="option-circle" />
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.would_pay && <div className="field-error">{errors.would_pay}</div>}
              </div>

              {/* Q4b conditional */}
              {(survey.would_pay === 'Yes, if it fit well and saved me time' ||
                survey.would_pay === 'Maybe, depends on price and quality') && (
                <div className="question" style={{ marginTop: -12 }}>
                  <label className="q-label" style={{ fontSize: 13, color: '#888' }}>
                    What price seems fair for a custom fit altimeter sled?
                  </label>
                  <div className="pay-grid" style={{ marginTop: 10 }}>
                    {['Under $15', '$15 to $25', '$25 to $40', '$40 to $60', '$60 to $80', 'Over $80'].map(opt => (
                      <button key={opt} type="button"
                        onClick={() => setSurvey(p => ({ ...p, pay_range: opt }))}
                        className={`pay-btn ${survey.pay_range === opt ? 'selected' : ''}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q5 */}
              <div className="question">
                <label className="q-label">What airframe sizes do you build most?</label>
                <span className="q-sub">select all that apply</span>
                <div className="chip-group">
                  {SIZES.map(opt => (
                    <button key={opt} type="button"
                      onClick={() => toggle('airframe_sizes', opt)}
                      className={`chip ${survey.airframe_sizes.includes(opt) ? 'selected' : ''}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q6 */}
              <div className="question">
                <label className="q-label">How much have you flown?</label>
                <div className="option-group" style={{ marginTop: 8 }}>
                  {EXPERIENCE.map(opt => (
                    <button key={opt} type="button"
                      onClick={() => setSurvey(p => ({ ...p, experience_level: opt }))}
                      className={`option-btn ${survey.experience_level === opt ? 'selected' : ''}`}>
                      <span className="option-circle" />
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q7 */}
              <div className="question">
                <label className="q-label">Anything else?</label>
                <span className="q-sub">blunt feedback is more useful than polite feedback</span>
                <textarea
                  value={survey.open_feedback}
                  onChange={e => setSurvey(p => ({ ...p, open_feedback: e.target.value }))}
                  placeholder="What should I actually build? What am I getting wrong? What does the community actually need?"
                  className="textarea"
                  rows={4}
                />
              </div>

              {/* Email */}
              <div className="question">
                <label className="q-label">Email</label>
                <span className="q-sub">so I can follow up. no marketing, ever.</span>
                <input
                  type="email"
                  value={survey.email}
                  onChange={e => { setSurvey(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: undefined })) }}
                  placeholder="you@example.com"
                  className={`text-input ${errors.email ? 'has-error' : ''}`}
                  autoComplete="email"
                />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>

              {errors._form && (
                <div className="field-error" style={{ marginBottom: 16 }}>{errors._form}</div>
              )}

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting
                  ? <><span>Sending</span><span className="cursor" /></>
                  : 'Submit'
                }
              </button>
              <p className="submit-note">I read every response personally.</p>

            </form>
          )}
        </div>

        <div className="divider" />

        {/* WHAT I'M WORKING ON */}
        <div className="wip-section">
          <div className="wip-title">What I'm working on</div>
          <div className="wip-sub">rough status, updated as things change</div>

          {[
            {
              badge: 'proto', label: 'Prototype',
              name: '4 inch Eggtimer Quantum sled',
              desc: 'First print done. Working on standoff height and terminal block clearance. May switch to PETG based on community feedback.',
            },
            {
              badge: 'next', label: 'Up next',
              name: '4 inch Featherweight Raven sled',
              desc: 'Multiple people have mentioned Raven as more common than Quantum. Moving this up the list.',
            },
            {
              badge: 'next', label: 'Up next',
              name: 'STL and STEP files for self-printers',
              desc: 'Parametric files you can print yourself. Probably $10 to $15. Which altimeters to prioritize depends on survey results.',
            },
            {
              badge: 'later', label: 'Later',
              name: 'Fin alignment jig',
              desc: 'A few people have mentioned fin cant as a real problem. Researching what already exists before designing something.',
            },
            {
              badge: 'later', label: 'Later',
              name: '75mm sled options',
              desc: 'Waiting on survey data to see how much demand there is at this size.',
            },
          ].map(item => (
            <div key={item.name} className="wip-item">
              <span className={`wip-badge badge-${item.badge}`}>{item.label}</span>
              <div>
                <div className="wip-name">{item.name}</div>
                <div className="wip-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-left">
          <span className="footer-brand">DrogueWorks</span>
          <span>a small maker project, 2026</span>
        </div>
        <div className="footer-right">
          <span className="footer-status">
            <span className="status-dot" style={{ width: 4, height: 4 }} />
            actively iterating
          </span>
          <a href="mailto:trumanheaston@gmail.com" className="footer-link">trumanheaston@gmail.com</a>
          <a href="https://github.com/trumanheaston-lab/DrogueWorks" target="_blank" rel="noopener noreferrer" className="footer-link">
            github
          </a>
        </div>
      </footer>
    </>
  )
}
