‘use client’

import { useState, useEffect, useRef } from ‘react’
import Image from ‘next/image’

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? ‘’

// — SURVEY FORM STATE ––––––––––––––––––––––
interface SurveyState {
altimeters: string[]
pain_points: string[]
q3_time_savers: string
sizes: string[]
q5_willingness: string
q6_cert_level: string
q7_open: string
email: string
}

const EMPTY_SURVEY: SurveyState = {
altimeters: [],
pain_points: [],
q3_time_savers: ‘’,
sizes: [],
q5_willingness: ‘’,
q6_cert_level: ‘’,
q7_open: ‘’,
email: ‘’,
}

// — DATA ———————————————————
const PRODUCTS = [
{
id: ‘DW-QS4’,
status: ‘Prototype’,
statusColor: ‘#e85d26’,
name: ‘4” Eggtimer Quantum Sled’,
desc: ‘Precision-fit for 98mm airframes. Heat-set inserts, dual battery bays, Quantum-specific PCB rails. First batch targeting June 2026.’,
tags: [‘98mm’, ‘Quantum’, ‘Dual-deploy’],
},
{
id: ‘DW-RV4’,
status: ‘Prototype’,
statusColor: ‘#e85d26’,
name: ‘4” Featherweight Raven Sled’,
desc: ‘Built for the Raven 3 & 4. Correct PCB footprint and screw boss pattern. Terminal block clearances verified. Fits standard 98mm couplers.’,
tags: [‘98mm’, ‘Raven 3/4’, ‘Dual-deploy’],
},
{
id: ‘DW-DS3’,
status: ‘In Design’,
statusColor: ‘#3d9be9’,
name: ‘75mm Dual-Deploy Sled’,
desc: ‘3” airframe sled, dual altimeter capable. Wire routing channel built in. Targeting most common L1 airframes.’,
tags: [‘75mm’, ‘Dual altimeter’, ‘L1’],
},
{
id: ‘DW-FJ4’,
status: ‘In Design’,
statusColor: ‘#3d9be9’,
name: ‘Fin Alignment Jig’,
desc: ‘Repeatable 90deg fin placement for 54–98mm tubes. Designed to eliminate fin cant without a full-size build jig.’,
tags: [‘Alignment’, ‘Universal’, ‘Ground support’],
},
{
id: ‘DW-AVB’,
status: ‘Idea – Need Input’,
statusColor: ‘#5a7080’,
name: ‘Full AV Bay Kit’,
desc: ‘Sled + matched bulkheads + all-thread + hardware. Ships ready to stuff. Is this something you’d actually buy?’,
tags: [‘Complete kit’, ‘TBD’],
},
{
id: ‘DW-???’,
status: ‘Idea – Need Input’,
statusColor: ‘#5a7080’,
name: ‘What Else?’,
desc: “Seriously – what’s the thing that drives you crazy when you’re building? Tell me in the survey below.”,
tags: [‘Community-defined’],
},
]

const TIMELINE = [
{
date: ‘2025 Q4’,
title: ‘First Prototypes Printed’,
desc: ‘Started with 4” Eggtimer Quantum sleds. First prints, first failures, first good fits. Learned a lot about coupler tolerances and print orientation.’,
badge: ‘Done’,
badgeColor: ‘#3ecf8e’,
badgeBg: ‘rgba(62,207,142,0.12)’,
},
{
date: ‘2026 Q1–Q2’,
title: ‘Community Research’,
desc: ‘This page. Asking real fliers what they actually need before building more. Survey results will be shared publicly once collected.’,
badge: ‘Active Now’,
badgeColor: ‘#e85d26’,
badgeBg: ‘rgba(232,93,38,0.12)’,
},
{
date: ‘2026 Q2’,
title: ‘First Batch Ships’,
desc: ‘4” Quantum and Raven sleds. Small batch to early supporters. Survey respondents get first access.’,
badge: ‘Planned . Jun 2026’,
badgeColor: ‘#5a7080’,
badgeBg: ‘rgba(90,112,128,0.15)’,
},
{
date: ‘2026 Q3’,
title: ‘What the Community Told Me to Build’,
desc: “Whatever this survey points to. Genuinely. If 40 people say they need 75mm sleds for the Stratologger, that’s next.”,
badge: ‘Planned . TBD’,
badgeColor: ‘#5a7080’,
badgeBg: ‘rgba(90,112,128,0.15)’,
},
]

// — TOGGLE HELPER ————————————————
function toggleItem(arr: string[], val: string): string[] {
return arr.includes(val) ? arr.filter(v => v !== val) : […arr, val]
}

export default function HomePage() {
const [survey, setSurvey] = useState<SurveyState>(EMPTY_SURVEY)
const [submitting, setSubmitting] = useState(false)
const [submitted, setSubmitted] = useState(false)
const [formError, setFormError] = useState(’’)
const [visible, setVisible] = useState(false)
const revealRefs = useRef<(HTMLElement | null)[]>([])

useEffect(() => { setTimeout(() => setVisible(true), 60) }, [])

// Scroll reveal
useEffect(() => {
const observer = new IntersectionObserver(
entries => entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).style.opacity = ‘1’, (e.target as HTMLElement).style.transform = ‘none’ }),
{ threshold: 0.1 }
)
revealRefs.current.forEach(el => { if (el) observer.observe(el) })
return () => observer.disconnect()
}, [])

const addRevealRef = (el: HTMLElement | null, i: number) => { revealRefs.current[i] = el }

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault()
setFormError(’’)
setSubmitting(true)
try {
if (FORMSPREE_ID) {
const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
method: ‘POST’,
headers: { ‘Content-Type’: ‘application/json’, Accept: ‘application/json’ },
body: JSON.stringify({ …survey, _subject: ‘DrogueWorks Community Survey’ }),
})
if (!res.ok) throw new Error()
} else {
console.log(‘DrogueWorks Survey:’, JSON.stringify(survey, null, 2))
await new Promise(r => setTimeout(r, 700))
}
setSubmitted(true)
} catch {
setFormError(‘Submission failed – please try again.’)
} finally {
setSubmitting(false)
}
}

return (
<>
<style>{`
/* TOKENS */
:root {
–accent: #e85d26;
–accent2: #3d9be9;
–green: #3ecf8e;
–bg: #050505;
–bg1: #0a0a0a;
–bg2: #111111;
–border: rgba(255,255,255,0.07);
–border2: rgba(255,255,255,0.13);
–gray: #888888;
–muted: #444444;
}

```
/* NOISE OVERLAY */
body::before {
content:'';
position:fixed;inset:0;z-index:0;pointer-events:none;
background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
background-size:200px 200px;opacity:0.35;
}

/* ANIMATIONS */
@keyframes statusPulse { 0%,100%{opacity:1} 50%{opacity:.3} }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
@keyframes accentSlide { from{width:0} to{width:32px} }

/* SCAN LINES */
.scan-bg {
background-image:
repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.018) 39px,rgba(255,255,255,0.018) 40px);
}

/* HEADER */
.hdr {
position:fixed;top:0;left:0;right:0;z-index:100;height:54px;
display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;
background:rgba(5,5,5,.93);backdrop-filter:blur(16px);
border-bottom:1px solid var(--border);
}
.hdr-logo { display:flex;align-items:center;gap:10px;text-decoration:none }
.hdr-wordmark { display:flex;align-items:baseline }
.hdr-bold { font-weight:700;font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:#fff }
.hdr-light { font-weight:300;font-size:14px;letter-spacing:.14em;text-transform:uppercase;color:#444 }
.hdr-status {
font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--green);
display:flex;align-items:center;gap:7px;letter-spacing:.1em;
}
.sdot {
width:5px;height:5px;border-radius:50%;background:var(--green);flex-shrink:0;
animation:statusPulse 2.4s ease-in-out infinite;
}

/* HERO */
.hero {
padding:100px 1.5rem 72px;max-width:900px;margin:0 auto;
opacity:0;transition:opacity .7s ease;position:relative;z-index:1;
}
.hero.vis { opacity:1 }
.hero-tag {
font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;
text-transform:uppercase;color:var(--accent);margin-bottom:28px;
display:flex;align-items:center;gap:12px;
}
.hero-tag::before {
content:'';display:block;height:1px;background:var(--accent);
animation:accentSlide .6s .4s ease forwards;width:0;
}
.hero h1 {
font-size:clamp(2.4rem,6.5vw,4.4rem);font-weight:800;line-height:1.02;
letter-spacing:-.02em;margin-bottom:28px;
}
.hero h1 .accent { color:var(--accent) }
.hero h1 .dim { color:#444;font-weight:300 }
.hero-body {
max-width:560px;font-size:14px;font-weight:300;color:#888;
line-height:1.9;margin-bottom:36px;
}
.hero-body strong { color:#ccc;font-weight:500 }
.cta-row { display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:16px }
.btn-primary {
display:inline-flex;align-items:center;gap:9px;
padding:14px 28px;background:var(--accent);color:#fff;
font-family:'Barlow',sans-serif;font-size:12px;font-weight:700;
letter-spacing:.13em;text-transform:uppercase;border:none;cursor:pointer;
border-radius:0;transition:background .15s,transform .1s,box-shadow .15s;
text-decoration:none;
}
.btn-primary:hover { background:#ff6535;transform:translateY(-1px);box-shadow:0 8px 24px rgba(232,93,38,.3) }
.btn-ghost-lnk {
font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;
text-transform:uppercase;color:#555;border:1px solid rgba(255,255,255,.1);
padding:13px 18px;transition:color .2s,border-color .2s;text-decoration:none;
display:inline-block;
}
.btn-ghost-lnk:hover { color:var(--accent2);border-color:var(--accent2) }
.hero-note {
font-family:'JetBrains Mono',monospace;font-size:10px;color:#2a2a2a;letter-spacing:.08em;
}

/* SECTION HELPERS */
.wrap { max-width:900px;margin:0 auto;padding:0 1.5rem;position:relative;z-index:1 }
.sec-label {
font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;
text-transform:uppercase;color:var(--accent2);margin-bottom:14px;
display:block;
}
.sec-hdr-row {
display:flex;align-items:center;gap:14px;margin-bottom:32px;
}
.sec-hdr-label {
font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.18em;
text-transform:uppercase;color:#333;white-space:nowrap;
}
.sec-rule { flex:1;height:1px;background:var(--border) }
h2 {
font-size:clamp(1.7rem,4vw,2.6rem);font-weight:800;letter-spacing:-.01em;
line-height:1.1;margin-bottom:16px;
}
.section-border { border-top:1px solid var(--border) }
.reveal-block {
opacity:0;transform:translateY(20px);
transition:opacity .6s ease,transform .6s ease;
}

/* ABOUT */
.about { padding:72px 0;border-bottom:1px solid var(--border) }
.about-grid {
display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start;
}
.about p {
font-size:13px;font-weight:300;color:#777;line-height:1.9;margin-bottom:14px;
}
.about p strong { color:#ccc;font-weight:500 }
.about p em { color:#444;font-style:italic }
.about p:last-child { margin-bottom:0 }
.stats-col { display:flex;flex-direction:column }
.stat-row {
padding:18px 0;border-bottom:1px solid var(--border);
display:flex;flex-direction:column;gap:3px;
}
.stat-row:first-child { border-top:1px solid var(--border) }
.stat-val {
font-size:1.9rem;font-weight:800;letter-spacing:-.01em;color:#fff;
}
.stat-val .accent { color:var(--accent) }
.stat-desc {
font-family:'JetBrains Mono',monospace;font-size:9px;color:#333;letter-spacing:.08em;
}

/* MANIFESTO */
.manifesto {
background:var(--bg1);border-top:1px solid var(--border);
border-bottom:1px solid var(--border);padding:56px 1.5rem;
}
.manifesto-inner { max-width:660px;margin:0 auto;text-align:center }
.manifesto blockquote {
font-family:'JetBrains Mono',monospace;font-size:clamp(.8rem,1.8vw,.95rem);
line-height:2.1;color:#666;font-weight:300;
}
.manifesto blockquote strong { color:var(--accent);font-weight:500 }
.manifesto-sig {
margin-top:22px;font-family:'JetBrains Mono',monospace;
font-size:9px;color:#333;letter-spacing:.12em;
}

/* PRODUCT CARDS */
.building { padding:72px 0;border-bottom:1px solid var(--border) }
.building-intro {
max-width:520px;font-size:13px;font-weight:300;color:#666;
line-height:1.85;margin-bottom:40px;
}
.product-grid {
display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1px;
background:rgba(255,255,255,.05);
}
.product-card {
background:var(--bg);padding:22px 20px;transition:background .2s;
}
.product-card:hover { background:var(--bg1) }
.pc-status {
font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.15em;
text-transform:uppercase;display:flex;align-items:center;gap:7px;margin-bottom:14px;
}
.pc-dot { width:5px;height:5px;border-radius:50%;flex-shrink:0 }
.pc-name {
font-size:13px;font-weight:700;letter-spacing:.03em;color:#fff;margin-bottom:8px;
}
.pc-desc { font-family:'JetBrains Mono',monospace;font-size:9px;color:#444;line-height:1.85;margin-bottom:14px }
.pc-tags { display:flex;gap:5px;flex-wrap:wrap }
.pc-tag {
font-family:'JetBrains Mono',monospace;font-size:8px;color:#333;
border:1px solid rgba(255,255,255,.06);padding:2px 6px;
}

/* SURVEY */
.survey { padding:80px 0 96px;background:var(--bg1);border-bottom:1px solid var(--border) }
.survey-header { max-width:540px;margin:0 auto 52px;text-align:center;padding:0 1.5rem }
.survey-header p { font-size:13px;font-weight:300;color:#777;line-height:1.85;margin-top:14px }
.fcard {
border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.02);
}
.fcard-hdr {
padding:18px 24px;border-bottom:1px solid var(--border);
background:rgba(0,0,0,.3);display:flex;align-items:flex-start;gap:10px;
}
.fnum {
font-family:'JetBrains Mono',monospace;font-size:10px;color:#444;
border:1px solid rgba(255,255,255,.07);padding:2px 7px;flex-shrink:0;margin-top:1px;
}
.ftitle { font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase }
.fsub { font-family:'JetBrains Mono',monospace;font-size:10px;color:#444;margin-top:2px }
.fbody { padding:24px;display:flex;flex-direction:column;gap:28px }
.form-block { display:flex;flex-direction:column;gap:10px }
.form-divider { height:1px;background:var(--border);margin:4px 0 }
.flbl {
font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;
text-transform:uppercase;color:var(--accent2);display:block;margin-bottom:2px;
}
.flbl-q {
font-size:14px;font-weight:500;color:#ddd;display:block;margin-bottom:2px;
font-family:'Barlow',sans-serif;letter-spacing:0;text-transform:none;
}
.flbl-hint { font-size:12px;color:#444;margin-bottom:8px;display:block;font-family:'Barlow',sans-serif }

/* checkboxes / radios */
.check-grid {
display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:6px;
}
.radio-col { display:flex;flex-direction:column;gap:6px }
.check-item,.radio-item {
display:flex;align-items:center;gap:10px;padding:10px 12px;
border:1px solid var(--border2);cursor:pointer;transition:border-color .15s,background .15s;
}
.check-item:hover,.radio-item:hover { border-color:rgba(255,255,255,.22) }
.check-item input,.radio-item input { display:none }
.check-box {
width:14px;height:14px;flex-shrink:0;border:1px solid rgba(255,255,255,.18);
border-radius:1px;position:relative;transition:all .15s;
}
.check-box::after {
content:'';position:absolute;top:1px;left:4px;
width:4px;height:7px;border:1.5px solid #fff;
border-top:none;border-left:none;transform:rotate(45deg);opacity:0;
}
.check-item input:checked ~ .check-box { background:var(--accent);border-color:var(--accent) }
.check-item input:checked ~ .check-box::after { opacity:1 }
.check-item:has(input:checked) { border-color:var(--accent);background:rgba(232,93,38,.06) }
.radio-dot {
width:14px;height:14px;flex-shrink:0;border:1px solid rgba(255,255,255,.18);
border-radius:50%;position:relative;transition:all .15s;
}
.radio-dot::after {
content:'';position:absolute;top:50%;left:50%;
transform:translate(-50%,-50%);width:5px;height:5px;
border-radius:50%;background:var(--accent);opacity:0;transition:opacity .15s;
}
.radio-item input:checked ~ .radio-dot { border-color:var(--accent) }
.radio-item input:checked ~ .radio-dot::after { opacity:1 }
.radio-item:has(input:checked) { border-color:var(--accent);background:rgba(232,93,38,.06) }
.check-label { font-size:12px;color:#aaa;user-select:none;font-family:'JetBrains Mono',monospace }

/* textarea / email */
.fta,.fi-email {
width:100%;background:var(--bg);border:1px solid var(--border2);
color:#fff;font-family:'JetBrains Mono',monospace;font-size:12px;
padding:11px 14px;outline:none;border-radius:0;transition:border-color .2s,background .2s;
}
.fta:focus,.fi-email:focus { border-color:rgba(255,255,255,.3);background:var(--bg1) }
.fta::placeholder,.fi-email::placeholder { color:#2a2a2a }
.fta { resize:vertical;min-height:90px;line-height:1.8 }

/* submit */
.submit-row {
padding:24px;border-top:1px solid var(--border);
display:flex;align-items:center;gap:18px;flex-wrap:wrap;
}
.sbtn {
padding:14px 28px;background:#fff;color:#050505;border:none;cursor:pointer;
font-family:'Barlow',sans-serif;font-size:12px;font-weight:700;
letter-spacing:.13em;text-transform:uppercase;border-radius:0;
transition:background .15s,transform .1s;display:flex;align-items:center;gap:8px;
}
.sbtn:hover:not(:disabled) { background:#ddd;transform:translateY(-1px) }
.sbtn:disabled { background:#1a1a1a;color:#333;cursor:not-allowed }
.snote { font-family:'JetBrains Mono',monospace;font-size:9px;color:#2a2a2a;line-height:1.7 }
.ferr { font-family:'JetBrains Mono',monospace;font-size:10px;color:#ef4444 }

/* success */
.success-panel {
padding:3rem 2rem;display:flex;flex-direction:column;
align-items:center;gap:1.25rem;text-align:center;
}
.scheck {
width:44px;height:44px;border:1px solid var(--green);
display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.stitle { font-size:17px;font-weight:700;letter-spacing:.06em;text-transform:uppercase }
.sbody { font-family:'JetBrains Mono',monospace;font-size:11px;color:#555;line-height:1.9;max-width:360px }
.stag { font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--green);border:1px solid rgba(62,207,142,.2);padding:6px 14px;letter-spacing:.1em }

/* TIMELINE */
.roadmap { padding:72px 0;border-bottom:1px solid var(--border) }
.roadmap-intro { max-width:480px;font-size:13px;font-weight:300;color:#666;line-height:1.85;margin-bottom:36px }
.timeline { display:flex;flex-direction:column }
.tl-item {
display:grid;grid-template-columns:110px 1fr;gap:20px;
padding:24px 0;border-bottom:1px solid var(--border);
}
.tl-item:first-child { border-top:1px solid var(--border) }
.tl-date { font-family:'JetBrains Mono',monospace;font-size:9px;color:#333;letter-spacing:.1em;padding-top:3px }
.tl-title { font-size:13px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#fff;margin-bottom:5px }
.tl-desc { font-size:12px;font-weight:300;color:#666;line-height:1.8 }
.tl-badge {
display:inline-block;font-family:'JetBrains Mono',monospace;
font-size:9px;letter-spacing:.12em;text-transform:uppercase;
padding:3px 8px;margin-top:8px;
}

/* FOOTER */
.ftr {
border-top:1px solid var(--border);padding:32px 1.5rem;
max-width:900px;margin:0 auto;
display:flex;justify-content:space-between;align-items:flex-start;
flex-wrap:wrap;gap:24px;position:relative;z-index:1;
}
.ftr-brand { font-weight:700;font-size:13px;letter-spacing:.1em;text-transform:uppercase }
.ftr-brand span { color:var(--accent) }
.ftr-sub { font-family:'JetBrains Mono',monospace;font-size:9px;color:#2a2a2a;margin-top:5px;max-width:280px;line-height:1.7 }
.ftr-right { display:flex;flex-direction:column;align-items:flex-end;gap:6px }
.ftr-status {
font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--green);
display:flex;align-items:center;gap:6px;
}
.ftr-link {
font-family:'JetBrains Mono',monospace;font-size:9px;color:#2a2a2a;
text-decoration:none;transition:color .2s;letter-spacing:.06em;
}
.ftr-link:hover { color:#777 }
.ftr-copy { font-family:'JetBrains Mono',monospace;font-size:9px;color:#1a1a1a;margin-top:4px }

/* RESPONSIVE */
@media(max-width:680px) {
.about-grid { grid-template-columns:1fr;gap:40px }
.tl-item { grid-template-columns:1fr;gap:4px }
.ftr-right { align-items:flex-start }
}
@media(max-width:500px) {
.product-grid { grid-template-columns:1fr }
.check-grid { grid-template-columns:1fr }
}
`}</style>

{/* HEADER */}
<header className="hdr">
<a href="#" className="hdr-logo" aria-label="DrogueWorks Home">
<Image src="/DrogueWorks_Logo.png" alt="DrogueWorks logo" width={28} height={28} style={{ objectFit: 'contain' }} priority />
<div className="hdr-wordmark">
<span className="hdr-bold">DROGUE</span>
<span className="hdr-light">WORKS</span>
</div>
</a>
<div className="hdr-status" aria-label="Status">
<span className="sdot" aria-hidden="true" />
LISTENING MODE ACTIVE
</div>
</header>

{/* HERO */}
<section className={`hero scan-bg${visible ? ' vis' : ''}`} aria-label="Hero">
<div className="hero-tag">High-Power Rocketry / Community Hardware</div>
<h1>
BUILDING BETTER<br />
TOOLS FOR ROCKETRY<span className="accent">--</span><br />
<span className="dim">ONE PROTOTYPE AT A TIME.</span>
</h1>
<p className="hero-body">
I'm a maker who got tired of hunting for altimeter sleds that actually fit. So I started
building them. Now I want to know what <strong>you</strong> actually need -- before I build
the next thing. No hype. No storefront. Just a real person trying to make useful tools for
the HPR community.
</p>
<div className="cta-row">
<a href="#survey" className="btn-primary">
<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
Share Your Feedback
</a>
<a href="#building" className="btn-ghost-lnk">See What's in Progress </a>
</div>
<p className="hero-note">// No spam. No sales pitch. Just a survey.</p>
</section>

{/* ABOUT */}
<section className="about section-border">
<div className="wrap">
<div className="about-grid">
<div>
<span className="sec-label">// Who is this</span>
<h2>A Maker's<br />Honest Intro</h2>
<p>
I'm <strong>Truman</strong>. I fly high-power rockets and I build the hardware I wish
existed. DrogueWorks started because I spent too long messing with foam-padded generic
trays and decided there had to be a better way.
</p>
<p>
I'm not a company. I'm a person with a printer, some heat-set tooling, and a lot of
patience for tight tolerances. I design parametric sleds that actually fit specific
altimeters -- correct PCB footprint, correct boss pattern, correct terminal clearances.
</p>
<p>
<em>Right now I'm more interested in learning what you need than in selling you
something.</em> The survey below is the whole point of this page.
</p>
</div>

<div
className="stats-col reveal-block"
ref={el => addRevealRef(el, 0)}
style={{ transitionDelay: '.15s' }}
>
{[
{ val: ['4', '"'], desc: 'First sled diameter -- 98mm airframes' },
{ val: ['6', '+'], desc: 'Altimeters prototyped for so far' },
{ val: ['ASA', ' / CFN'], desc: 'Materials -- flight validated in test prints' },
{ val: ['0', '$'], desc: 'VC money. Self-funded, community-driven.' },
].map(({ val, desc }) => (
<div key={desc} className="stat-row">
<div className="stat-val">{val[0]}<span className="accent">{val[1]}</span></div>
<div className="stat-desc">{desc}</div>
</div>
))}
</div>
</div>
</div>
</section>

{/* MANIFESTO */}
<div className="manifesto">
<div className="manifesto-inner">
<blockquote>
&ldquo;The rocketry community already has enough vendors selling generic hardware.<br />
What it doesn&apos;t have enough of is people <strong>listening first.</strong><br />
I&apos;d rather build ten things the community actually wants<br />
than a hundred things I thought sounded good.&rdquo;
</blockquote>
<div className="manifesto-sig">-- Truman . DrogueWorks . Est. 2025</div>
</div>
</div>

{/* WHAT'S IN PROGRESS */}
<section className="building" id="building">
<div className="wrap">
<span className="sec-label">// Hardware Manifest</span>
<h2>What's in the Pipeline</h2>
<p className="building-intro">
Honest statuses -- not marketing ETAs. Some are prototypes I've already printed and tested.
Some are still designs. A few are just ideas waiting to see if the community actually wants them.
</p>
<div className="product-grid">
{PRODUCTS.map((p, i) => (
<div
key={p.id}
className="product-card reveal-block"
ref={el => addRevealRef(el, i + 1)}
style={{ transitionDelay: `${i * 0.08}s` }}
>
<div className="pc-status" style={{ color: p.statusColor }}>
<span className="pc-dot" style={{ background: p.statusColor }} />
{p.status}
</div>
<div className="pc-name">{p.name}</div>
<div className="pc-desc">{p.desc}</div>
<div className="pc-tags">
{p.tags.map(t => <span key={t} className="pc-tag">{t}</span>)}
</div>
</div>
))}
</div>
</div>
</section>

{/* SURVEY */}
<section className="survey" id="survey">
<div className="survey-header reveal-block" ref={el => addRevealRef(el, 10)}>
<span className="sec-label">// Community Feedback</span>
<h2>What Do You Actually Need?</h2>
<p>
I'm not guessing what to build next. I'm asking. Fill this out and you'll directly shape
what DrogueWorks builds in 2026. Takes about 3 minutes.
</p>
</div>

<div className="wrap">
<div className="fcard reveal-block" ref={el => addRevealRef(el, 11)}>
<div className="fcard-hdr">
<span className="fnum">DW-SURVEY-001</span>
<div>
<div className="ftitle">Community Hardware Survey</div>
<div className="fsub">All responses anonymous unless you share your email</div>
</div>
</div>

{submitted ? (
<div className="success-panel">
<div className="scheck" role="img" aria-label="Success">
<svg width="18" height="13" viewBox="0 0 18 13" fill="none">
<polyline points="1,6 6,11 17,1" stroke="#3ecf8e" strokeWidth="1.5" strokeLinecap="square"/>
</svg>
</div>
<div>
<div className="stitle">Received. Thank you.</div>
<div className="sbody">
This genuinely helps. I'll share what I learn with anyone who gave their
email -- one update, no spam.
</div>
</div>
<div className="stag">[SURVEY_LOGGED] -- COMMUNITY +1</div>
</div>
) : (
<form onSubmit={handleSubmit} noValidate aria-label="Community survey">
<div className="fbody">

{/* Q1 */}
<div className="form-block">
<span className="flbl">01 -- Altimeters</span>
<span className="flbl-q">What altimeters do you use most?</span>
<span className="flbl-hint">Select all that apply.</span>
<div className="check-grid">
{['Eggtimer Quantum','Eggtimer Proton','Featherweight Raven 3','Featherweight Raven 4','Stratologger CF','Altus Metrum','Missile Works RRC3','Other'].map(opt => (
<label key={opt} className="check-item">
<input type="checkbox" checked={survey.altimeters.includes(opt)}
onChange={() => setSurvey(p => ({ ...p, altimeters: toggleItem(p.altimeters, opt) }))} />
<span className="check-box" />
<span className="check-label">{opt}</span>
</label>
))}
</div>
</div>

<div className="form-divider" />

{/* Q2 */}
<div className="form-block">
<span className="flbl">02 -- Pain Points</span>
<span className="flbl-q">What frustrates you most when building rockets?</span>
<span className="flbl-hint">Pick everything that's annoyed you.</span>
<div className="check-grid">
{['Ill-fitting sleds / trays','Sourcing the right hardware','Getting fins aligned straight','Wire management in AV bays','Switch / arming loop mounting','Battery retention','Sled-to-coupler tolerances','No documentation / part specs'].map(opt => (
<label key={opt} className="check-item">
<input type="checkbox" checked={survey.pain_points.includes(opt)}
onChange={() => setSurvey(p => ({ ...p, pain_points: toggleItem(p.pain_points, opt) }))} />
<span className="check-box" />
<span className="check-label">{opt}</span>
</label>
))}
</div>
</div>

<div className="form-divider" />

{/* Q3 */}
<div className="form-block">
<span className="flbl">03 -- Most Valuable</span>
<span className="flbl-q">What parts or tools would save you the most time or headaches?</span>
<textarea
className="fta"
value={survey.q3_time_savers}
onChange={e => setSurvey(p => ({ ...p, q3_time_savers: e.target.value }))}
placeholder={'Be honest -- vague answers are less useful than specific ones.\ne.g. "I always have to file down the sled edges to fit my LOC 4\\" tube"'}
/>
</div>

<div className="form-divider" />

{/* Q4 */}
<div className="form-block">
<span className="flbl">04 -- Airframe Diameters</span>
<span className="flbl-q">What sizes do you build most?</span>
<span className="flbl-hint">Select all that apply.</span>
<div className="check-grid">
{['29mm','38mm','54mm (2.1")','75mm (3")','98mm (4")','150mm (6")','Other'].map(opt => (
<label key={opt} className="check-item">
<input type="checkbox" checked={survey.sizes.includes(opt)}
onChange={() => setSurvey(p => ({ ...p, sizes: toggleItem(p.sizes, opt) }))} />
<span className="check-box" />
<span className="check-label">{opt}</span>
</label>
))}
</div>
</div>

<div className="form-divider" />

{/* Q5 */}
<div className="form-block">
<span className="flbl">05 -- Willingness to Buy</span>
<span className="flbl-q">Would you pay for custom 3D printed parts, jigs, or AV bay solutions?</span>
<div className="radio-col">
{[
["yes_printed", "Yes -- I'd buy printed flight-ready parts"],
["yes_files", "Yes -- but I'd rather buy the files and print myself"],
["maybe", "Maybe -- depends on price and quality"],
["no", "No -- I design and print my own"],
].map(([val, label]) => (
<label key={val} className="radio-item">
<input type="radio" name="q5" value={val} checked={survey.q5_willingness === val}
onChange={() => setSurvey(p => ({ ...p, q5_willingness: val }))} />
<span className="radio-dot" />
<span className="check-label">{label}</span>
</label>
))}
</div>
</div>

<div className="form-divider" />

{/* Q6 */}
<div className="form-block">
<span className="flbl">06 -- Your Level</span>
<span className="flbl-q">What's your current certification level?</span>
<div className="radio-col">
{[
["uncertified", "Uncertified / just starting out"],
["L1", "L1 certified"],
["L2", "L2 certified"],
["L3", "L3 certified"],
].map(([val, label]) => (
<label key={val} className="radio-item">
<input type="radio" name="q6" value={val} checked={survey.q6_cert_level === val}
onChange={() => setSurvey(p => ({ ...p, q6_cert_level: val }))} />
<span className="radio-dot" />
<span className="check-label">{label}</span>
</label>
))}
</div>
</div>

<div className="form-divider" />

{/* Q7 */}
<div className="form-block">
<span className="flbl">07 -- Open Mic</span>
<span className="flbl-q">What's the thing nobody is building that you actually want?</span>
<textarea
className="fta"
style={{ minHeight: 110 }}
value={survey.q7_open}
onChange={e => setSurvey(p => ({ ...p, q7_open: e.target.value }))}
placeholder="No filter needed. Wild ideas welcome. This is the most useful question on the form."
/>
</div>

<div className="form-divider" />

{/* Email */}
<div className="form-block">
<span className="flbl">08 -- Stay in the Loop (Optional)</span>
<span className="flbl-q">Drop your email if you want to hear what I find out from this survey.</span>
<span className="flbl-hint">One update email. No spam, ever.</span>
<input
type="email"
className="fi-email"
value={survey.email}
onChange={e => setSurvey(p => ({ ...p, email: e.target.value }))}
placeholder="you@example.com"
autoComplete="email"
/>
</div>

</div>

<div className="submit-row">
{formError && <div className="ferr" role="alert"> {formError}</div>}
<button type="submit" className="sbtn" disabled={submitting}>
{submitting
? <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.1em' }}>TRANSMITTING</span>
: <>Send Feedback </>
}
</button>
<p className="snote">// Anonymous unless you include your email</p>
</div>
</form>
)}
</div>
</div>
</section>

{/* ROADMAP */}
<section className="roadmap section-border" id="roadmap">
<div className="wrap">
<span className="sec-label">// Mission Timeline</span>
<h2>Where Things Stand</h2>
<p className="roadmap-intro">
Honest progress, not marketing copy. Updated as things actually happen.
</p>
<div className="timeline">
{TIMELINE.map((item, i) => (
<div
key={item.date}
className="tl-item reveal-block"
ref={el => addRevealRef(el, 20 + i)}
style={{ transitionDelay: `${i * 0.1}s` }}
>
<div className="tl-date">{item.date}</div>
<div>
<div className="tl-title">{item.title}</div>
<div className="tl-desc">{item.desc}</div>
<span
className="tl-badge"
style={{ color: item.badgeColor, background: item.badgeBg }}
>
{item.badge}
</span>
</div>
</div>
))}
</div>
</div>
</section>

{/* FOOTER */}
<footer className="ftr">
<div>
<div className="ftr-brand">DROGUE<span>WORKS</span></div>
<div className="ftr-sub">
Parametric hardware for high-power rocketry. Built by a maker, for the community.
Honest about what's ready and what isn't.
</div>
<div className="ftr-copy">(c) 2026 DrogueWorks . drogueworks.onrender.com</div>
</div>
<div className="ftr-right">
<div className="ftr-status">
<span className="sdot" aria-hidden="true" />
Community listening mode active
</div>
<a
href="https://github.com/trumanheaston-lab/DrogueWorks"
target="_blank"
rel="noopener noreferrer"
className="ftr-link"
>
github.com/trumanheaston-lab
</a>
<a href="#survey" className="ftr-link">Take the Survey </a>
</div>
</footer>
</>
```
