'use client'

import { useEffect, useRef, useState } from 'react'
import Header from '@/components/Header'
import PrecisionSidebar, { ConfigState } from '@/components/PrecisionSidebar'
import IntakeForm from '@/components/IntakeForm'
import DataReadout from '@/components/DataReadout'

// ── Hero terminal stream messages ─────────────────────────────────
const HERO_STREAM = [
  '[GEOMETRY_ENGINE_STANDBY]',
  '[AWAITING_PILOT_INPUT]',
  '[MATERIALS_DB_LOADED]',
  '[TOLERANCE_ENGINE_READY]',
  '[NLP_PARSER_ACTIVE]',
  '[CADQUERY_KERNEL_INIT]',
  '[SURFACE_FINISH_DEFAULT]',
  '[EXPORT_FORMAT_JSON]',
]

const DEFAULT_CONFIG: ConfigState = {
  od: 54.0,
  id: 52.4,
  sledLength: 152,
  mach: 0.80,
  gload: 15,
}

export default function Home() {
  const [config, setConfig] = useState<ConfigState>(DEFAULT_CONFIG)
  const [submitted, setSubmitted] = useState(false)
  const [streamLines, setStreamLines] = useState<string[]>([HERO_STREAM[0]])
  const [heroVisible, setHeroVisible] = useState(false)
  const streamIdx = useRef(1)

  // Fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  // Terminal stream
  useEffect(() => {
    const id = setInterval(() => {
      const msg = HERO_STREAM[streamIdx.current % HERO_STREAM.length]
      streamIdx.current++
      setStreamLines((prev) => {
        const next = [...prev, msg]
        return next.length > 5 ? next.slice(-5) : next
      })
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Header />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className={`pt-[110px] pb-0 max-w-[1400px] mx-auto px-8 grid gap-16 items-start transition-opacity duration-700 ${
          heroVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        {/* Left: headline */}
        <div className="pt-8">
          <div className="mono flex items-center gap-[10px] text-[10px] text-[var(--gray)] tracking-[0.2em] uppercase mb-6">
            <span className="inline-block w-5 h-px bg-[var(--gray)]" />
            Mission Manifest / FY-2026
          </div>
          <h1
            style={{ fontFamily: 'Barlow, sans-serif' }}
            className="text-[clamp(2.5rem,4.5vw,4.2rem)] font-bold leading-[1.0] tracking-[-0.02em] mb-6"
          >
            PRECISION
            <br />
            3D PRINTED
            <br />
            <span className="text-[var(--gray)] font-light">AVIONICS SLEDS.</span>
          </h1>
          <p className="text-[14px] text-[var(--gray)] leading-[1.8] max-w-[440px] mb-6">
            Parametric altimeter sled configurator for high-power rocketry. Submit your airframe
            specs and flight profile — we machine to your tolerances.
          </p>
          {/* Terminal stream */}
          <div className="border-l border-[var(--border-2)] pl-5">
            {streamLines.map((line, i) => (
              <div
                key={i}
                className={`mono text-[11px] text-[#4ade80] leading-[2.0] stream-line ${
                  i === streamLines.length - 1 ? 'opacity-100' : 'opacity-40'
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Right: spec summary card */}
        <div className="pt-8">
          <div className="blueprint-grid border border-[var(--border-2)] p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <span className="mono text-[10px] text-[var(--gray)] tracking-[0.15em] uppercase">
                Active Configuration
              </span>
              <span className="mono text-[9px] text-[#4ade80] border border-[rgba(74,222,128,0.3)] px-[6px] py-[2px] tracking-[0.1em]">
                LIVE
              </span>
            </div>
            {[
              ['Airframe OD', `${config.od.toFixed(1)} mm`],
              ['Airframe ID', `${config.id.toFixed(1)} mm`],
              ['Wall Thickness', `${((config.od - config.id) / 2).toFixed(2)} mm`],
              ['Sled Length', `${Math.round(config.sledLength)} mm`],
              ['Target Velocity', `Mach ${config.mach.toFixed(2)}`],
              ['Peak G-Load', `${Math.round(config.gload)} G`],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between items-center border-b border-[var(--border)] pb-2 last:border-0 last:pb-0"
              >
                <span className="mono text-[11px] text-[var(--gray)]">{k}</span>
                <span className="mono text-[12px] text-white font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DATA READOUT BAR ─────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-8 mt-8">
        <DataReadout config={config} submitted={submitted} />
      </div>

      {/* ── MAIN LAYOUT ──────────────────────────────────────── */}
      <div
        className="max-w-[1400px] mx-auto px-8 mt-6 pb-24"
        style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}
      >
        <PrecisionSidebar config={config} onChange={setConfig} />
        <main>
          <IntakeForm
            config={config}
            onSubmitSuccess={() => setSubmitted(true)}
          />
        </main>
      </div>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] max-w-[1400px] mx-auto px-8 py-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-[6px]">
          <div
            style={{ fontFamily: 'Barlow, sans-serif' }}
            className="text-[13px] font-bold tracking-[0.1em] uppercase"
          >
            DROGUEWORKS
          </div>
          <div className="mono text-[10px] text-[var(--gray)]">
            Parametric hardware for high-power rocketry
          </div>
          <div className="mono text-[10px] text-[var(--gray-2)] mt-1">
            © {new Date().getFullYear()} DrogueWorks. Built for the range, not the shelf.
          </div>
        </div>
        <div className="flex flex-col items-end gap-[6px]">
          <div className="mono flex items-center gap-2 text-[11px] text-[#4ade80]">
            <span className="w-[5px] h-[5px] rounded-full bg-[#4ade80] status-pulse" />
            Hardware Status: Operational
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-[10px] text-[var(--gray)] hover:text-white transition-colors duration-200 no-underline"
          >
            github.com/drogueworks →
          </a>
          <div className="mono text-[9px] text-[var(--gray-2)] mt-1">
            v1.0.0 — Sonnet-4 / CadQuery / Next.js
          </div>
        </div>
      </footer>
    </div>
  )
}
