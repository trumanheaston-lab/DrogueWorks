'use client'

import { useEffect, useRef, useState } from 'react'

type LogLevel = 'ok' | 'info' | 'warn' | 'error'

interface LogEntry {
  id: number
  time: string
  message: string
  level: LogLevel
}

const TELEMETRY_POOL: { message: string; level: LogLevel }[] = [
  { message: '[GEOMETRY_OK]', level: 'ok' },
  { message: '[DRAG_COEFF_CALCULATED]', level: 'ok' },
  { message: '[WALL_THICKNESS_NOMINAL]', level: 'ok' },
  { message: '[MATERIALS_DB_LOADED]', level: 'ok' },
  { message: '[TOLERANCE_CHECK_PASS]', level: 'ok' },
  { message: '[CAD_KERNEL_STANDBY]', level: 'warn' },
  { message: '[NLP_MODULE_READY]', level: 'info' },
  { message: '[AWAITING_PILOT_INPUT]', level: 'info' },
  { message: '[THERMAL_MODEL_IDLE]', level: 'info' },
  { message: '[EXPORT_QUEUE_EMPTY]', level: 'info' },
  { message: '[CADQUERY_KERNEL_INIT]', level: 'info' },
  { message: '[DIMENSION_VALIDATE_OK]', level: 'ok' },
  { message: '[MASS_ESTIMATE_READY]', level: 'ok' },
  { message: '[SURFACE_FINISH_DEFAULT]', level: 'info' },
]

const INITIAL_ENTRIES: { message: string; level: LogLevel }[] = [
  { message: '[GEOMETRY_ENGINE_OK]', level: 'ok' },
  { message: '[MATERIALS_DB_LOADED]', level: 'ok' },
  { message: '[AWAITING_PILOT_INPUT]', level: 'info' },
]

const levelColor: Record<LogLevel, string> = {
  ok:    'text-[#4ade80]',
  info:  'text-[#60a5fa]',
  warn:  'text-[#fbbf24]',
  error: 'text-[#f87171]',
}

function getTime(): string {
  const d = new Date()
  return `${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}

let _id = 100

export interface StatusLogHandle {
  addEntry: (message: string, level?: LogLevel) => void
}

interface StatusLogProps {
  onReady?: (handle: StatusLogHandle) => void
}

export default function StatusLog({ onReady }: StatusLogProps) {
  const [entries, setEntries] = useState<LogEntry[]>(() =>
    INITIAL_ENTRIES.map((e, i) => ({
      id: i,
      time: '00:0' + i,
      message: e.message,
      level: e.level,
    }))
  )
  const scrollRef = useRef<HTMLDivElement>(null)

  const addEntry = (message: string, level: LogLevel = 'ok') => {
    const entry: LogEntry = { id: _id++, time: getTime(), message, level }
    setEntries((prev) => {
      const next = [...prev, entry]
      return next.length > 60 ? next.slice(-60) : next
    })
  }

  // Expose handle to parent
  useEffect(() => {
    if (onReady) onReady({ addEntry })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-stream telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      const pick = TELEMETRY_POOL[Math.floor(Math.random() * TELEMETRY_POOL.length)]
      addEntry(pick.message, pick.level)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [entries])

  return (
    <div className="glass" style={{ borderTop: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-[10px] border-b border-[var(--border)]">
        <span className="mono text-[10px] text-[var(--gray)] tracking-[0.15em] uppercase">
          System Status
        </span>
        <span className="mono text-[9px] text-[var(--gray-2)] border border-[var(--border)] px-[6px] py-[2px]">
          {String(entries.length).padStart(2, '0')}
        </span>
      </div>

      {/* Log body */}
      <div
        ref={scrollRef}
        className="terminal-scroll overflow-y-auto"
        style={{ maxHeight: '180px', padding: '10px 16px' }}
      >
        {entries.map((e, idx) => (
          <div
            key={e.id}
            className={`mono flex gap-2 text-[10px] leading-[1.9] ${
              idx === entries.length - 1 ? 'log-entry-new' : ''
            }`}
          >
            <span className="text-[var(--gray-2)] min-w-[36px]">{e.time}</span>
            <span className={levelColor[e.level]}>{e.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
