'use client'

import { useEffect, useState } from 'react'
import type { ConfigState } from './PrecisionSidebar'

interface DataReadoutProps {
  config: ConfigState
  submitted: boolean
}

function computeMetrics(c: ConfigState) {
  const wall = (c.od - c.id) / 2
  // Simplified hollow cylinder mass: ρ_Al × π × ((OD/2)² - (ID/2)²) × L
  const mass = Math.PI * ((c.od / 2) ** 2 - (c.id / 2) ** 2) * c.sledLength * 0.0000027
  // Simplified drag approximation
  const drag = 0.28 + c.mach * 0.04
  return {
    wall: wall.toFixed(2),
    mass: mass.toFixed(1),
    drag: drag.toFixed(3),
    length: Math.round(c.sledLength),
  }
}

export default function DataReadout({ config, submitted }: DataReadoutProps) {
  const [metrics, setMetrics] = useState(() => computeMetrics(config))
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const next = computeMetrics(config)
    setMetrics(next)
    setFlash(true)
    const t = setTimeout(() => setFlash(false), 400)
    return () => clearTimeout(t)
  }, [config])

  const state = submitted ? 'QUEUED' : 'AWAITING'
  const stateDelta = submitted ? '● ACCEPTED' : '● PENDING INPUT'
  const stateColor = submitted ? 'text-[#4ade80]' : 'text-[var(--gray)]'

  const cells = [
    { label: 'Est. Mass',      value: metrics.mass,           unit: 'g',  delta: '▲ NOMINAL' },
    { label: 'Wall Thickness', value: metrics.wall,           unit: 'mm', delta: '▲ CALIPER VERIFIED' },
    { label: 'Drag Coeff',     value: metrics.drag,           unit: 'Cd', delta: '▲ CALCULATED' },
    { label: 'Sled Length',    value: String(metrics.length), unit: 'mm', delta: '▲ STD CONFIG' },
    { label: 'Config State',   value: state,                  unit: '',   delta: stateDelta, small: true, deltaColor: stateColor },
  ]

  return (
    <div className="flex border border-[var(--border-2)]">
      {cells.map((c, i) => (
        <div
          key={c.label}
          className={`flex-1 px-[18px] py-4 ${i < cells.length - 1 ? 'border-r border-[var(--border)]' : ''}`}
        >
          <div className="mono text-[9px] text-[var(--gray-2)] tracking-[0.15em] uppercase mb-[6px]">
            {c.label}
          </div>
          <div
            className={`mono font-medium transition-colors duration-200 ${c.small ? 'text-[13px]' : 'text-[18px]'} ${flash ? 'text-[var(--green)]' : 'text-white'}`}
          >
            {c.value}
            {c.unit && (
              <span className="text-[11px] text-[var(--gray)] ml-[3px]">{c.unit}</span>
            )}
          </div>
          <div className={`mono text-[10px] mt-[2px] ${c.deltaColor ?? 'text-[#4ade80]'}`}>
            {c.delta}
          </div>
        </div>
      ))}
    </div>
  )
}
