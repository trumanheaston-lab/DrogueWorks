'use client'

import { useState, useEffect, useRef } from 'react'
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
  'AV bay assembly takes forever',
  'Sleds never fit my airframe right',
  'Wiring is a mess / hard to manage',
  'Finding the right hardware (screws, inserts)',
  'Fin alignment is inconsistent',
  'Recovery harness rigging',
  'Nose cone weight / ballast fitting',
  'Altimeter programming / setup',
]

const USEFUL_PARTS = [
  'Custom altimeter sleds (tight-fit, labeled)',
  'Fin alignment jigs',
  'Full AV bay kits (sled + bulkheads + hardware)',
  'Switch mounts / arming blocks',
  'Battery trays / holders',
  'Nose cone bulkheads',
  'Recovery harness anchor points',
  'Motor retention adapters',
  'Centering rings',
  'Documentation / build guides',
]

const SIZES = ['29mm', '38mm', '54mm', '75mm (3")', '98mm (4")', '4" +', 'Mixed / varies']

const EXPERIENCE = [
  'Just getting started (< 5 flights)',
  'Getting comfortable (5–20 flights)',
  'Intermediate (L1 certified)',
  'Experienced (L2 certified)',
  'Veteran (L3 / 20+ years)',
]

const STREAM_MSGS = [
  '[LISTENING_MODE_ACTIVE]',
  '[COMMUNITY_FEEDBACK_OPEN]',
  '[PROTOTYPE_V1_PRINTING]',
  '[SURVEY_DATA_PROCESSING]',
  '[BUILDING_IN_PUBLIC]',
  '[ITERATION_01_OF_MANY]',
  '[HPR_COMMUNITY_INPUT_NEEDED]',
]

export default function CommunityPage() {
  const [survey, setSurvey] = useState<SurveyState>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof SurveyState | '_form', string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [streamLines, setStreamLines] = useState([STREAM_MSGS[0], STREAM_MSGS[1]])
  const [visible, setVisible] = useState(false)
  const streamIdx = useRef(2)

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const msg = STREAM_MSGS[streamIdx.current % STREAM_MSGS.length]
      streamIdx.current++
      setStreamLines(p => { const n = [...p, msg]; return n.length > 4 ? n.slice(-4) : n })
    }, 2800)
    return () => clearInterval(id)
  }, [])

  const toggle = (key: 'altimeters' | 'frustrations' | 'useful_parts' | 'airframe_sizes', val: string) =>
    setSurvey(p => ({ ...p, [key]: p[key].includes(val) ? p[key].filter(v => v !== val) : [...p[key], val] }))

  const validate = () => {
    const e: typeof errors = {}
    if (!survey.email || !/\S+@\S+\.\S+/.test(survey.email)) e.email = 'Email required so we can follow up'
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
          body: JSON.stringify({ ...survey, _subject: 'DrogueWorks Community Survey Response' }),
        })
        if (!res.ok) throw new Error()
      } else {
        console.log('Survey response:', JSON.stringify(survey, null, 2))
        await new Promise(r => setTimeout(r, 900))
      }
      setSubmitted(true)
    } catch {
      setErrors({ _form: 'Submission failed — please try again or email trumanheaston@gmail.com' })
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
        body{background:#060708;color:#e8e8e8;font-family:'Barlow',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:#060708}
        ::-webkit-scrollbar-thumb{background:#252525}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes breathe{0%,100%{filter:drop-shadow(0 0 18px rgba(74,222,128,.12))}50%{filter:drop-shadow(0 0 36px rgba(74,222,128,.28))}}
        .mono{font-family:'JetBrains Mono',monospace}
        .sdot{width:5px;height:5px;border-radius:50%;background:#4ade80;animation:pulse 2s infinite;display:inline-block;flex-shrink:0}

        /* ── HEADER ── */
        .hdr{position:fixed;top:0;left:0;right:0;z-index:100;height:54px;display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;background:rgba(6,7,8,.94);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,255,255,.06)}
        .hdr-logo{display:flex;align-items:center;gap:9px;text-decoration:none}
        .hdr-b{font-weight:700;font-size:14px;letter-spacing:.12em;text-transform:uppercase;color:#fff}
        .hdr-l{font-weight:300;font-size:14px;letter-spacing:.12em;text-transform:uppercase;color:#4a4a4a}
        .hdr-status{font-family:'JetBrains Mono',monospace;font-size:10px;color:#4ade80;display:flex;align-items:center;gap:7px;letter-spacing:.08em}

        /* ── HERO ── */
        .hero{max-width:1000px;margin:0 auto;padding:108px 1.5rem 0;opacity:0;transition:opacity .8s ease}
        .hero.vis{opacity:1}

        /* ── LOGO BLOCK ── */
        .logo-block{display:flex;flex-direction:column;align-items:center;padding:56px 1.5rem 48px;text-align:center}
        .logo-img{animation:breathe 5s ease-in-out infinite}
        .logo-eyebrow{font-family:'JetBrains Mono',monospace;font-size:10px;color:#4ade80;letter-spacing:.2em;text-transform:uppercase;margin-top:20px;opacity:.7}

        /* ── INTRO CARD ── */
        .intro-wrap{max-width:700px;margin:0 auto 72px;padding:0 1.5rem}
        .intro-card{border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);padding:32px;position:relative}
        .intro-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(74,222,128,.5),transparent)}
        .intro-from{font-family:'JetBrains Mono',monospace;font-size:9px;color:#4ade80;letter-spacing:.15em;text-transform:uppercase;margin-bottom:18px;display:flex;align-items:center;gap:8px}
        .intro-from::before{content:'';display:inline-block;width:14px;height:1px;background:#4ade80}
        .intro-h1{font-size:clamp(1.6rem,4vw,2.6rem);font-weight:700;line-height:1.15;letter-spacing:-.01em;color:#fff;margin-bottom:20px}
        .intro-h1 em{font-style:normal;color:#4ade80}
        .intro-body{font-size:15px;color:#999;line-height:1.85;display:flex;flex-direction:column;gap:14px}
        .intro-body p strong{color:#ddd;font-weight:600}
        .stream-blk{margin-top:22px;border-top:1px solid rgba(255,255,255,.06);padding-top:14px}
        .stream-ln{font-family:'JetBrains Mono',monospace;font-size:10px;color:#4ade80;line-height:2;transition:opacity .4s}

        /* ── CONTEXT STRIP ── */
        .context-strip{max-width:1000px;margin:0 auto 64px;padding:0 1.5rem;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,.05)}
        .ctx-cell{background:#060708;padding:20px;display:flex;flex-direction:column;gap:6px}
        .ctx-num{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;color:#fff;letter-spacing:-.02em;line-height:1}
        .ctx-num span{font-size:.5em;color:#4ade80;font-weight:400;letter-spacing:0}
        .ctx-label{font-family:'JetBrains Mono',monospace;font-size:10px;color:#555;letter-spacing:.12em;text-transform:uppercase;line-height:1.5}

        /* ── COMMUNITY NOTE ── */
        .note-wrap{max-width:700px;margin:0 auto 56px;padding:0 1.5rem}
        .note-card{border-left:2px solid rgba(74,222,128,.4);padding:20px 24px;background:rgba(74,222,128,.03)}
        .note-label{font-family:'JetBrains Mono',monospace;font-size:9px;color:#4ade80;letter-spacing:.15em;text-transform:uppercase;margin-bottom:8px}
        .note-text{font-size:14px;color:#888;line-height:1.8}
        .note-text strong{color:#bbb;font-weight:600}

        /* ── SECTION HEADERS ── */
        .sec-wrap{max-width:700px;margin:0 auto;padding:0 1.5rem}
        .sec-hdr{display:flex;align-items:center;gap:12px;margin-bottom:8px}
        .sec-num{font-family:'JetBrains Mono',monospace;font-size:9px;color:#4ade80;letter-spacing:.15em;border:1px solid rgba(74,222,128,.25);padding:2px 7px}
        .sec-title{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#ccc}
        .sec-desc{font-family:'JetBrains Mono',monospace;font-size:10px;color:#555;margin-bottom:20px;padding-left:2px}

        /* ── SURVEY FORM ── */
        .survey-wrap{max-width:700px;margin:0 auto 80px;padding:0 1.5rem}
        .survey-card{border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.018)}
        .survey-hdr{padding:20px 24px;border-bottom:1px solid rgba(255,255,255,.06);background:rgba(0,0,0,.25);display:flex;align-items:flex-start;gap:12px}
        .snum{font-family:'JetBrains Mono',monospace;font-size:9px;color:#4ade80;border:1px solid rgba(74,222,128,.25);padding:2px 7px;flex-shrink:0;margin-top:1px}
        .stitle{font-size:14px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#fff}
        .ssub{font-family:'JetBrains Mono',monospace;font-size:10px;color:#555;margin-top:3px}
        .sbody{padding:24px;display:flex;flex-direction:column;gap:24px}
        .sfooter{padding:0 24px 24px}

        /* ── FIELDS ── */
        .field{display:flex;flex-direction:column;gap:8px}
        .q{font-size:14px;font-weight:600;color:#ccc;line-height:1.4}
        .q-hint{font-family:'JetBrains Mono',monospace;font-size:10px;color:#444;margin-top:2px}
        .ferr{font-family:'JetBrains Mono',monospace;font-size:10px;color:#f87171}

        /* inputs */
        .fi,.fta{background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.1);color:#e8e8e8;font-family:'JetBrains Mono',monospace;font-size:12px;padding:11px 13px;outline:none;border-radius:0;width:100%;transition:border-color .2s;-webkit-appearance:none}
        .fi:focus,.fta:focus{border-color:rgba(255,255,255,.3)}
        .fi::placeholder,.fta::placeholder{color:#2d2d2d}
        .fi.e{border-color:rgba(248,113,113,.5)}
        .fta{resize:vertical;min-height:90px;line-height:1.7}

        /* chip buttons */
        .chips{display:flex;flex-wrap:wrap;gap:6px}
        .chip{font-family:'JetBrains Mono',monospace;font-size:10px;padding:7px 12px;border:1px solid;cursor:pointer;border-radius:0;transition:all .15s;text-align:left;line-height:1.4}
        .chip.on{background:rgba(74,222,128,.12);border-color:rgba(74,222,128,.5);color:#4ade80}
        .chip.off{background:transparent;border-color:rgba(255,255,255,.08);color:#555}
        .chip.off:hover{border-color:rgba(255,255,255,.2);color:#999}

        /* radio-style single select */
        .options{display:flex;flex-direction:column;gap:6px}
        .opt{font-family:'JetBrains Mono',monospace;font-size:11px;padding:10px 14px;border:1px solid;cursor:pointer;border-radius:0;transition:all .15s;text-align:left;display:flex;align-items:center;gap:10px}
        .opt.on{background:rgba(74,222,128,.08);border-color:rgba(74,222,128,.4);color:#ccc}
        .opt.off{background:transparent;border-color:rgba(255,255,255,.07);color:#555}
        .opt.off:hover{border-color:rgba(255,255,255,.18);color:#888}
        .opt-dot{width:7px;height:7px;border-radius:50%;border:1px solid;flex-shrink:0}
        .opt.on .opt-dot{background:#4ade80;border-color:#4ade80}
        .opt.off .opt-dot{background:transparent;border-color:#333}

        /* pill-style pay range */
        .pay-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
        .pay-pill{font-family:'JetBrains Mono',monospace;font-size:10px;padding:10px 6px;border:none;cursor:pointer;border-radius:0;transition:all .15s;text-align:center;line-height:1.4;border:1px solid}
        .pay-pill.on{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.3);color:#fff}
        .pay-pill.off{background:transparent;border-color:rgba(255,255,255,.07);color:#555}
        .pay-pill.off:hover{border-color:rgba(255,255,255,.18);color:#888}

        /* divider */
        .q-divider{height:1px;background:rgba(255,255,255,.05);margin:4px 0}

        /* submit */
        .sub-btn{width:100%;padding:15px 20px;background:#fff;color:#060708;border:none;cursor:pointer;font-family:'Barlow',sans-serif;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;transition:background .15s,transform .1s;display:flex;align-items:center;justify-content:center;gap:9px;border-radius:0}
        .sub-btn:hover{background:#d4d4d4}
        .sub-btn:active{transform:scale(.99)}
        .sub-btn:disabled{background:#1c1c1c;color:#3a3a3a;cursor:not-allowed}
        .sub-note{font-family:'JetBrains Mono',monospace;font-size:10px;color:#333;text-align:center;margin-top:10px;line-height:1.7}
        .cur{display:inline-block;width:7px;height:12px;background:#4ade80;animation:blink 1s step-end infinite;vertical-align:middle}

        /* success */
        .success{padding:3rem 2rem;display:flex;flex-direction:column;align-items:center;gap:1.5rem;text-align:center}
        .s-check{width:52px;height:52px;border:1px solid #4ade80;display:flex;align-items:center;justify-content:center}
        .s-title{font-size:18px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#fff;margin-bottom:6px}
        .s-body{font-family:'JetBrains Mono',monospace;font-size:11px;color:#666;line-height:2;max-width:400px}
        .s-tag{font-family:'JetBrains Mono',monospace;font-size:10px;color:#4ade80;border:1px solid rgba(74,222,128,.2);padding:8px 16px;letter-spacing:.1em}

        /* ── WHAT WE'RE BUILDING ── */
        .wip-wrap{max-width:700px;margin:0 auto 80px;padding:0 1.5rem}
        .wip-list{display:flex;flex-direction:column;gap:1px;background:rgba(255,255,255,.05)}
        .wip-item{background:#060708;padding:18px 20px;display:flex;align-items:flex-start;gap:14px;transition:background .2s}
        .wip-item:hover{background:#0c0d0e}
        .wip-status{flex-shrink:0;margin-top:2px}
        .badge{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.1em;padding:3px 7px;text-transform:uppercase;border:1px solid}
        .badge-proto{color:#fbbf24;border-color:rgba(251,191,36,.3)}
        .badge-planned{color:#555;border-color:rgba(255,255,255,.08)}
        .badge-research{color:#60a5fa;border-color:rgba(96,165,250,.3)}
        .wip-name{font-size:13px;font-weight:600;color:#ccc;margin-bottom:4px}
        .wip-desc{font-family:'JetBrains Mono',monospace;font-size:10px;color:#555;line-height:1.7}

        /* ── FOOTER ── */
        .ftr{border-top:1px solid rgba(255,255,255,.05);max-width:1000px;margin:0 auto;padding:28px 1.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.25rem}
        .ftl{display:flex;flex-direction:column;gap:5px}
        .fbrand-row{display:flex;align-items:center;gap:8px}
        .fbrand{font-weight:700;font-size:13px;letter-spacing:.1em;text-transform:uppercase}
        .ftagline{font-family:'JetBrains Mono',monospace;font-size:10px;color:#333}
        .ftr-r{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
        .fstat{font-family:'JetBrains Mono',monospace;font-size:10px;color:#4ade80;display:flex;align-items:center;gap:6px}
        .flink{font-family:'JetBrains Mono',monospace;font-size:10px;color:#333;text-decoration:none;transition:color .2s}
        .flink:hover{color:#666}

        /* ── RESPONSIVE ── */
        @media(max-width:640px){
          .context-strip{grid-template-columns:1fr 1fr}
          .pay-grid{grid-template-columns:repeat(2,1fr)}
          .ftr-r{align-items:flex-start}
          .intro-card{padding:22px}
          .sbody{padding:18px}
        }
        @media(max-width:400px){
          .context-strip{grid-template-columns:1fr}
          .hdr-status span:last-child{display:none}
        }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────── */}
      <header className="hdr">
        <a href="#" className="hdr-logo" aria-label="DrogueWorks home">
          <Image src="/DrogueWorks_Logo.png" alt="DrogueWorks" width={28} height={28} style={{ objectFit: 'contain' }} priority />
          <span className="hdr-b">DROGUE</span><span className="hdr-l">WORKS</span>
        </a>
        <div className="hdr-status">
          <span className="sdot" />
          <span>Building in Public</span>
        </div>
      </header>

      {/* ── LOGO ────────────────────────────────────────── */}
      <div className="logo-block">
        <Image
          className="logo-img"
          src="/DrogueWorks_Logo.png"
          alt="DrogueWorks"
          width={200}
          height={200}
          style={{ objectFit: 'contain', width: 'clamp(130px,24vw,200px)', height: 'auto' }}
        />
        <div className="logo-eyebrow">Community Hardware Project · Est. 2026</div>
      </div>

      {/* ── HERO / INTRO ────────────────────────────────── */}
      <section className={`hero${visible ? ' vis' : ''}`}>
        <div className="intro-wrap" style={{ margin: '0 auto 56px' }}>
          <div className="intro-card">
            <div className="intro-from">From the maker</div>
            <h1 className="intro-h1">
              Building better tools for rocketry —<br />
              <em>one prototype at a time.</em>
            </h1>
            <div className="intro-body">
              <p>
                Hey. I&apos;m Truman. I got into high-power rocketry and immediately ran into the same
                problem everyone does: the off-the-shelf avionics hardware is either expensive,
                generic, or just doesn&apos;t quite fit. So I started designing my own.
              </p>
              <p>
                <strong>DrogueWorks is early.</strong> I&apos;m not here to sell you something I haven&apos;t proven.
                Right now I&apos;m building prototypes, flying them, breaking them, and iterating.
                The first sled is a 4&quot; Eggtimer Quantum build — but honestly, I&apos;m not sure
                that&apos;s what the community needs most.
              </p>
              <p>
                <strong>That&apos;s why this page exists.</strong> Before I spend months machining sleds nobody
                asked for — I want to hear from people who actually fly. What&apos;s your real frustration?
                What would save you time on the pad? Take 3 minutes and tell me.
              </p>
            </div>
            <div className="stream-blk" aria-hidden="true">
              {streamLines.map((line, i) => (
                <div key={i} className="stream-ln" style={{ opacity: i === streamLines.length - 1 ? 1 : 0.22 }}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTEXT STRIP ───────────────────────────────── */}
      <div className="context-strip">
        {[
          { num: '01', suffix: '', label: 'Prototype\ncurrently printing' },
          { num: '~3', suffix: 'min', label: 'Time to fill\nthis survey' },
          { num: '100%', suffix: '', label: 'Responses read\nby me personally' },
        ].map(({ num, suffix, label }) => (
          <div key={num} className="ctx-cell">
            <div className="ctx-num">{num}{suffix && <span> {suffix}</span>}</div>
            <div className="ctx-label">{label}</div>
          </div>
        ))}
      </div>

      {/* ── COMMUNITY NOTE ──────────────────────────────── */}
      <div className="note-wrap">
        <div className="note-card">
          <div className="note-label">A note on feedback</div>
          <div className="note-text">
            I&apos;ve already heard from one flier with 10+ 3D-printed sleds under his belt.
            His advice: <strong>use PETG, print in one piece, keep standoffs under 3mm, and make sure
            there&apos;s room for wiring.</strong> That&apos;s exactly the kind of input that changes what I build.
            If you&apos;ve got opinions — strong or mild — I want them.
          </div>
        </div>
      </div>

      {/* ── SURVEY FORM ─────────────────────────────────── */}
      <div className="survey-wrap">
        <div className="survey-card">
          <div className="survey-hdr">
            <span className="snum">SURVEY</span>
            <div>
              <div className="stitle">Community Feedback Form</div>
              <div className="ssub">~3 minutes · all responses go directly to me</div>
            </div>
          </div>

          {submitted ? (
            <div className="success">
              <div className="s-check">
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                  <polyline points="1,7 7,13 19,1" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </div>
              <div>
                <div className="s-title">Received. Thank you.</div>
                <div className="s-body">
                  I&apos;ll read every response personally. If you left your email I may follow up
                  with questions — that&apos;s it. No sales emails, ever.
                </div>
              </div>
              <div className="s-tag">[FEEDBACK_LOGGED] — ITERATION +1</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="sbody">

                {/* Q1 — altimeters */}
                <div className="field">
                  <div className="q">What altimeters do you fly most?
                    <div className="q-hint">Select all that apply</div>
                  </div>
                  <div className="chips">
                    {ALTIMETERS.map(opt => (
                      <button key={opt} type="button" onClick={() => toggle('altimeters', opt)}
                        aria-pressed={survey.altimeters.includes(opt)}
                        className={`chip ${survey.altimeters.includes(opt) ? 'on' : 'off'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  {errors.altimeters && <span className="ferr">↑ {errors.altimeters}</span>}
                </div>

                <div className="q-divider" />

                {/* Q2 — frustrations */}
                <div className="field">
                  <div className="q">What frustrates you most when building rockets?
                    <div className="q-hint">Select everything that resonates</div>
                  </div>
                  <div className="chips">
                    {FRUSTRATIONS.map(opt => (
                      <button key={opt} type="button" onClick={() => toggle('frustrations', opt)}
                        aria-pressed={survey.frustrations.includes(opt)}
                        className={`chip ${survey.frustrations.includes(opt) ? 'on' : 'off'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={survey.custom_frustration}
                    onChange={e => setSurvey(p => ({ ...p, custom_frustration: e.target.value }))}
                    placeholder="Anything not listed above? Tell me here..."
                    className="fta"
                    rows={2}
                  />
                </div>

                <div className="q-divider" />

                {/* Q3 — useful parts */}
                <div className="field">
                  <div className="q">What parts or tools would save you the most time?
                    <div className="q-hint">What would you actually use?</div>
                  </div>
                  <div className="chips">
                    {USEFUL_PARTS.map(opt => (
                      <button key={opt} type="button" onClick={() => toggle('useful_parts', opt)}
                        aria-pressed={survey.useful_parts.includes(opt)}
                        className={`chip ${survey.useful_parts.includes(opt) ? 'on' : 'off'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={survey.custom_useful}
                    onChange={e => setSurvey(p => ({ ...p, custom_useful: e.target.value }))}
                    placeholder="Something not listed? Describe it..."
                    className="fta"
                    rows={2}
                  />
                </div>

                <div className="q-divider" />

                {/* Q4 — would pay */}
                <div className="field">
                  <div className="q">Would you pay for well-made custom 3D-printed rocketry hardware?</div>
                  <div className="options">
                    {[
                      'Yes — if it fit well and saved me time',
                      'Maybe — depends on the price and quality',
                      'Probably not — I\'d rather print it myself',
                      'No — I make my own or buy off-the-shelf',
                    ].map(opt => (
                      <button key={opt} type="button"
                        onClick={() => { setSurvey(p => ({ ...p, would_pay: opt })); setErrors(p => ({ ...p, would_pay: undefined })) }}
                        aria-pressed={survey.would_pay === opt}
                        className={`opt ${survey.would_pay === opt ? 'on' : 'off'}`}>
                        <span className="opt-dot" />
                        {opt}
                      </button>
                    ))}
                  </div>
                  {errors.would_pay && <span className="ferr">↑ {errors.would_pay}</span>}
                </div>

                {/* Q4b — price range (conditional) */}
                {(survey.would_pay === 'Yes — if it fit well and saved me time' ||
                  survey.would_pay === 'Maybe — depends on the price and quality') && (
                  <div className="field" style={{ marginTop: -10 }}>
                    <div className="q" style={{ fontSize: 13, color: '#888' }}>
                      What price feels fair for a custom-fit printed altimeter sled?
                    </div>
                    <div className="pay-grid">
                      {['Under $15', '$15–$25', '$25–$40', '$40–$60', '$60–$80', 'Over $80'].map(opt => (
                        <button key={opt} type="button"
                          onClick={() => setSurvey(p => ({ ...p, pay_range: opt }))}
                          aria-pressed={survey.pay_range === opt}
                          className={`pay-pill ${survey.pay_range === opt ? 'on' : 'off'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="q-divider" />

                {/* Q5 — airframe sizes */}
                <div className="field">
                  <div className="q">What airframe sizes do you build most?
                    <div className="q-hint">Select all that apply</div>
                  </div>
                  <div className="chips">
                    {SIZES.map(opt => (
                      <button key={opt} type="button" onClick={() => toggle('airframe_sizes', opt)}
                        aria-pressed={survey.airframe_sizes.includes(opt)}
                        className={`chip ${survey.airframe_sizes.includes(opt) ? 'on' : 'off'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="q-divider" />

                {/* Q6 — experience */}
                <div className="field">
                  <div className="q">How would you describe your experience level?</div>
                  <div className="options">
                    {EXPERIENCE.map(opt => (
                      <button key={opt} type="button"
                        onClick={() => setSurvey(p => ({ ...p, experience_level: opt }))}
                        aria-pressed={survey.experience_level === opt}
                        className={`opt ${survey.experience_level === opt ? 'on' : 'off'}`}>
                        <span className="opt-dot" />
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="q-divider" />

                {/* Q7 — open feedback */}
                <div className="field">
                  <div className="q">Anything else you want to tell me?
                    <div className="q-hint">Strong opinions encouraged. Blunt is fine.</div>
                  </div>
                  <textarea
                    value={survey.open_feedback}
                    onChange={e => setSurvey(p => ({ ...p, open_feedback: e.target.value }))}
                    placeholder="What should I actually build? What am I getting wrong? What does the HPR community actually need?..."
                    className="fta"
                    rows={4}
                  />
                </div>

                <div className="q-divider" />

                {/* Email */}
                <div className="field">
                  <div className="q">Email address
                    <div className="q-hint">So I can follow up with questions. No marketing, ever.</div>
                  </div>
                  <input type="email" value={survey.email} placeholder="you@example.com" autoComplete="email"
                    className={`fi${errors.email ? ' e' : ''}`}
                    onChange={e => { setSurvey(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: undefined })) }}
                  />
                  {errors.email && <span className="ferr">↑ {errors.email}</span>}
                </div>

              </div>

              <div className="sfooter">
                {errors._form && <div className="ferr" style={{ marginBottom: 12 }}>{errors._form}</div>}
                <button type="submit" className="sub-btn" disabled={submitting}>
                  {submitting
                    ? <><span className="mono" style={{ fontSize: 11 }}>SENDING</span><span className="cur" /></>
                    : 'Submit Feedback →'
                  }
                </button>
                <p className="sub-note">
                  Responses go straight to my inbox. I read every one.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── WHAT WE'RE BUILDING ─────────────────────────── */}
      <div className="wip-wrap">
        <div className="sec-hdr" style={{ marginBottom: 16 }}>
          <span className="sec-num">LOG</span>
          <span className="sec-title">What I&apos;m working on</span>
        </div>
        <div className="wip-list">
          {[
            {
              status: 'proto', label: 'PROTOTYPE',
              name: '4" Eggtimer Quantum Sled (DW-QS4)',
              desc: 'First prototype printed. Testing fit in LOC coupler. Working on standoff height and terminal block clearance.',
            },
            {
              status: 'proto', label: 'PROTOTYPE',
              name: '4" Featherweight Raven Sled (DW-RV4)',
              desc: 'PCB footprint verified. Boss pattern drafted. Print queued. Community says Raven is more common than Quantum — pivoting priority.',
            },
            {
              status: 'research', label: 'RESEARCH',
              name: 'Fin Alignment Jig (universal 54–98mm)',
              desc: 'Multiple fliers mentioned fin cant as a real problem. Researching existing solutions before designing.',
            },
            {
              status: 'planned', label: 'PLANNED',
              name: '75mm Dual-Deploy Sled',
              desc: 'Planned for Q3 2026. Waiting on survey data to confirm diameter demand before committing.',
            },
            {
              status: 'planned', label: 'PLANNED',
              name: 'STL/STEP File Library',
              desc: 'Parametric files for self-printers. $10–15 range. Survey feedback will determine which altimeters to prioritize.',
            },
          ].map(item => (
            <div key={item.name} className="wip-item">
              <div className="wip-status">
                <span className={`badge badge-${item.status}`}>{item.label}</span>
              </div>
              <div>
                <div className="wip-name">{item.name}</div>
                <div className="wip-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="ftr">
        <div className="ftl">
          <div className="fbrand-row">
            <Image src="/DrogueWorks_Logo.png" alt="" width={18} height={18} style={{ objectFit: 'contain', opacity: 0.5 }} aria-hidden="true" />
            <span className="fbrand">DrogueWorks</span>
          </div>
          <div className="ftagline">A maker project. Building in public. Feedback welcome.</div>
          <div className="ftagline" style={{ marginTop: 3, fontSize: 9, color: '#1e1e1e' }}>© 2026 DrogueWorks</div>
        </div>
        <div className="ftr-r">
          <div className="fstat"><span className="sdot" />Actively Iterating</div>
          <a href="mailto:trumanheaston@gmail.com" className="flink">trumanheaston@gmail.com</a>
          <a href="https://github.com/trumanheaston-lab/DrogueWorks" target="_blank" rel="noopener noreferrer" className="flink">
            github.com/trumanheaston-lab →
          </a>
        </div>
      </footer>
    </>
  )
}
