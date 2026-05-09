'use client'

import { useEffect, useRef, useState } from 'react'
import StatusLog, { StatusLogHandle } from './StatusLog'

export interface ConfigState {
  od: number
  id: number
  sledLength: number
  mach: number
  gload: number
}

interface PrecisionSidebarProps {
  config: ConfigState
  onChange: (config: ConfigState) => void
}

const SUGGESTIONS = [
  '3in Wildman, Stratologger, Mach 0.8',
  '4in LOC, dual Raven, high-G rocky terrain',
  '54mm Madcow, RRC3, dual deploy',
]

export default function PrecisionSidebar({ config, onChange }: PrecisionSidebarProps) {
  const [nlValue, setNlValue] = useState('')
  const logHandleRef = useRef<StatusLogHandle | null>(null)

  const update = (key: keyof ConfigState, raw: string) => {
    const val = parseFloat(raw)
    if (isNaN(val)) return
    const next = { ...config, [key]: val }
    onChange(next)
    logHandleRef.current?.addEntry(`[${key.toUpperCase()}_UPDATED] → ${val}`, 'ok')
  }

  const applySuggestion = (s: string) => {
    setNlValue(s)
    logHandleRef.current?.addEntry(`[NLP_PARSED] "${s.slice(0, 32)}..."`, 'info')
  }

  return (
    <aside className="sticky top-[72px] flex flex-col" style={{ gap: 0 }}>

      {/* ── NATURAL LANGUAGE TERMINAL ─────────────────────── */}
      <div className="glass">
        <div className="flex items-center justify-between px-4 py-[10px] border-b border-[var(--border)]">
          <span className="mono text-[10px] text-[var(--gray)] tracking-[0.15em] uppercase">
            Natural Language Terminal
          </span>
          <span className="mono text-[9px] text-[var(--gray-2)] border border-[var(--border)] px-[6px] py-[2px]">
            NLP
          </span>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]">
          <span className="mono text-[12px] text-[var(--green)] select-none">›</span>
          <input
            type="text"
            value={nlValue}
            onChange={(e) => setNlValue(e.target.value)}
            placeholder="describe your configuration..."
            className="flex-1 bg-transparent border-none outline-none mono text-[12px] text-white placeholder:text-[var(--gray-2)] caret-[var(--green)]"
          />
          <span className="term-cursor" />
        </div>

        {/* Suggestions */}
        <div className="px-4 py-2 border-b border-[var(--border)]">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => applySuggestion(s)}
              className="block w-full text-left mono text-[10px] text-[var(--gray-2)] hover:text-white transition-colors duration-200 py-[3px] tracking-[0.04em] cursor-pointer bg-transparent border-none"
            >
              <span className="text-[var(--gray-3)]">&gt; </span>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── PRECISION SLIDERS ─────────────────────────────── */}
      <div className="glass" style={{ borderTop: 0 }}>
        <div className="flex items-center justify-between px-4 py-[10px] border-b border-[var(--border)]">
          <span className="mono text-[10px] text-[var(--gray)] tracking-[0.15em] uppercase">
            Precision Controls
          </span>
          <span className="mono text-[9px] text-[#4ade80] border border-[rgba(74,222,128,0.3)] px-[6px] py-[2px]">
            LIVE
          </span>
        </div>

        {[
          { key: 'od',        label: 'Outer Diameter', unit: 'mm',  min: 29,  max: 98,  step: 0.5  },
          { key: 'id',        label: 'Inner Diameter', unit: 'mm',  min: 27,  max: 96,  step: 0.1  },
          { key: 'sledLength',label: 'Sled Length',    unit: 'mm',  min: 80,  max: 300, step: 1    },
          { key: 'mach',      label: 'Target Mach',   unit: 'M',   min: 0.1, max: 2.5, step: 0.01 },
          { key: 'gload',     label: 'Peak G-Load',   unit: 'G',   min: 5,   max: 150, step: 1    },
        ].map((s, idx) => {
          const val = config[s.key as keyof ConfigState]
          const isLast = idx === 4
          return (
            <div
              key={s.key}
              className={`px-4 py-3 flex flex-col gap-2 ${!isLast ? 'border-b border-[var(--border)]' : ''}`}
            >
              <div className="flex justify-between items-center">
                <span className="mono text-[10px] text-[var(--gray)] tracking-[0.1em] uppercase">
                  {s.label}
                </span>
                <span className="mono text-[12px] text-white">
                  {s.step < 1 ? val.toFixed(s.step === 0.01 ? 2 : 1) : Math.round(val)}
                  <span className="text-[9px] text-[var(--gray)] ml-[2px]">{s.unit}</span>
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={val}
                onChange={(e) => update(s.key as keyof ConfigState, e.target.value)}
              />
            </div>
          )
        })}
      </div>

      {/* ── STATUS LOG ────────────────────────────────────── */}
      <StatusLog onReady={(h) => { logHandleRef.current = h }} />

    </aside>
  )
}
