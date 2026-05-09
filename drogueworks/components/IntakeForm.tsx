'use client'

import { useState } from 'react'
import type { ConfigState } from './PrecisionSidebar'

// ── Replace with your Formspree form ID ──────────────────────────────
// Sign up at https://formspree.io/ → new form → copy the ID (e.g. "xpzvjqkw")
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? 'YOUR_FORMSPREE_ID'

interface IntakeFormProps {
  config: ConfigState
  onSubmitSuccess: () => void
}

interface FormErrors {
  [key: string]: string
}

interface FieldMeta {
  name: string
  label: string
  type: 'text' | 'number' | 'email' | 'select' | 'textarea'
  placeholder?: string
  required?: boolean
  unit?: string
  step?: number
  min?: number
  max?: number
  options?: { value: string; label: string }[]
  colSpan?: 'full'
}

const SECTIONS: {
  num: string
  title: string
  desc: string
  fields: FieldMeta[]
}[] = [
  {
    num: '01',
    title: 'Airframe Specification',
    desc: 'STRUCTURAL / GEOMETRY',
    fields: [
      {
        name: 'brand',
        label: 'Manufacturer',
        type: 'select',
        required: true,
        options: [
          { value: '', label: '— SELECT MANUFACTURER —' },
          { value: 'loc', label: 'LOC Precision' },
          { value: 'wildman', label: 'Wildman Rocketry' },
          { value: 'madcow', label: 'Madcow Rocketry' },
          { value: 'custom', label: 'Custom / Other' },
        ],
      },
      {
        name: 'series',
        label: 'Airframe Series',
        type: 'text',
        placeholder: 'e.g. Darkstar, Torrent, Punisher...',
      },
      {
        name: 'od',
        label: 'Outer Diameter (OD)',
        type: 'number',
        placeholder: '54.00',
        required: true,
        unit: 'mm',
        step: 0.01,
        min: 20,
        max: 160,
      },
      {
        name: 'id',
        label: 'Inner Diameter (ID)',
        type: 'number',
        placeholder: '52.40',
        required: true,
        unit: 'mm',
        step: 0.01,
        min: 18,
        max: 158,
      },
    ],
  },
  {
    num: '02',
    title: 'Electronics Package',
    desc: 'AVIONICS / POWER',
    fields: [
      {
        name: 'altimeter_primary',
        label: 'Primary Altimeter',
        type: 'select',
        required: true,
        options: [
          { value: '', label: '— SELECT DEVICE —' },
          { value: 'stratologger_cf', label: 'PerfectFlite StratologgerCF' },
          { value: 'raven3', label: 'Featherweight Raven 3' },
          { value: 'raven4', label: 'Featherweight Raven 4' },
          { value: 'rrc3', label: 'Missile Works RRC3' },
          { value: 'eggtimer_quantum', label: 'Eggtimer Quantum' },
          { value: 'eggfinder', label: 'Eggtimer EggFinder' },
          { value: 'custom', label: 'Custom Device' },
        ],
      },
      {
        name: 'altimeter_secondary',
        label: 'Secondary Altimeter',
        type: 'select',
        options: [
          { value: 'none', label: '— NONE —' },
          { value: 'stratologger_cf', label: 'PerfectFlite StratologgerCF' },
          { value: 'raven3', label: 'Featherweight Raven 3' },
          { value: 'rrc3', label: 'Missile Works RRC3' },
          { value: 'custom', label: 'Custom Device' },
        ],
      },
      {
        name: 'battery',
        label: 'Battery Type',
        type: 'select',
        required: true,
        options: [
          { value: '', label: '— SELECT CELL —' },
          { value: '9v_alkaline', label: '9V Alkaline' },
          { value: '9v_lithium', label: '9V Lithium (Energizer L522)' },
          { value: 'lipo_2s', label: '2S LiPo 300–600mAh' },
          { value: 'lipo_1s', label: '1S LiPo 400mAh' },
          { value: 'aa_2x', label: '2× AA' },
        ],
      },
      {
        name: 'switch_type',
        label: 'Switch / Arming Method',
        type: 'select',
        options: [
          { value: 'rotary', label: 'Rotary Switch' },
          { value: 'magnetic', label: 'Magnetic (Reed Switch)' },
          { value: 'shunt', label: 'Shunt Connector' },
          { value: 'none', label: 'Integrated / None' },
        ],
      },
    ],
  },
  {
    num: '03',
    title: 'Flight Profile',
    desc: 'PERFORMANCE / ENVIRONMENT',
    fields: [
      {
        name: 'mach',
        label: 'Target Velocity',
        type: 'number',
        placeholder: '0.80',
        required: true,
        unit: 'Mach',
        step: 0.01,
        min: 0.1,
        max: 3.0,
      },
      {
        name: 'gload',
        label: 'Peak G-Load',
        type: 'number',
        placeholder: '15',
        required: true,
        unit: 'G',
        step: 1,
        min: 1,
        max: 250,
      },
      {
        name: 'motor_class',
        label: 'Motor Class',
        type: 'select',
        options: [
          { value: '', label: '— OPTIONAL —' },
          ...['H', 'I', 'J', 'K', 'L', 'M'].map((c) => ({ value: c, label: c })),
        ],
      },
      {
        name: 'recovery',
        label: 'Recovery System',
        type: 'select',
        options: [
          { value: 'dual_deploy', label: 'Dual Deployment' },
          { value: 'single', label: 'Single Main' },
          { value: 'streamer', label: 'Streamer' },
          { value: 'tumble', label: 'Tumble / Passive' },
        ],
      },
    ],
  },
  {
    num: '04',
    title: 'Custom Constraints',
    desc: 'FREE FORM / NLP',
    fields: [
      {
        name: 'constraints',
        label: 'Mission Parameters & Constraints',
        type: 'textarea',
        colSpan: 'full',
        placeholder:
          "Describe specific requirements — terrain conditions, deployment events, structural concerns, aesthetic preferences...\n\ne.g. 'extra beefy for hard landings on rocky desert playa, dual StratologgerCF setup with independent batteries, needs 3/8-20 eyebolt pass-through at forward closure'",
      },
      {
        name: 'pilot_handle',
        label: 'Pilot Handle / Callsign',
        type: 'text',
        placeholder: 'callsign or name',
      },
      {
        name: 'email',
        label: 'Email for Confirmation',
        type: 'email',
        placeholder: 'you@example.com',
      },
    ],
  },
]

function validate(data: Record<string, string>): FormErrors {
  const errors: FormErrors = {}
  if (!data.brand) errors.brand = 'Required'
  if (!data.od) errors.od = 'Required'
  else if (parseFloat(data.od) <= 0) errors.od = 'Must be > 0'
  if (!data.id) errors.id = 'Required'
  else if (parseFloat(data.id) >= parseFloat(data.od || '0')) errors.id = 'Must be less than OD'
  if (!data.altimeter_primary) errors.altimeter_primary = 'Required'
  if (!data.battery) errors.battery = 'Required'
  if (!data.mach) errors.mach = 'Required'
  if (!data.gload) errors.gload = 'Required'
  return errors
}

export default function IntakeForm({ config, onSubmitSuccess }: IntakeFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({
    od: String(config.od),
    id: String(config.id),
    mach: String(config.mach),
    gload: String(config.gload),
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => { const e = { ...prev }; delete e[name]; return e })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errs = validate(formData)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setSubmitting(true)

    // Build the full JSON payload (for CadQuery mapping)
    const payload = {
      ...formData,
      _precision_config: {
        od_mm: config.od,
        id_mm: config.id,
        wall_mm: ((config.od - config.id) / 2).toFixed(2),
        sled_length_mm: config.sledLength,
        target_mach: config.mach,
        peak_gload: config.gload,
      },
      _timestamp: new Date().toISOString(),
      _version: '1.0.0',
    }

    try {
      if (FORMSPREE_ID === 'YOUR_FORMSPREE_ID') {
        // Dev mode: log JSON and simulate success
        console.log('DrogueWorks Manifest JSON:\n', JSON.stringify(payload, null, 2))
        await new Promise((r) => setTimeout(r, 900))
      } else {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Submission failed')
      }
      setSubmitted(true)
      onSubmitSuccess()
    } catch {
      setErrors({ _form: 'Submission failed. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="border border-[var(--border-2)]">
        <div className="px-6 py-12 flex flex-col items-center gap-6 text-center">
          {/* Checkmark */}
          <div className="w-12 h-12 border border-[#4ade80] flex items-center justify-center">
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <polyline points="1,7 7,13 19,1" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          </div>
          <div>
            <div
              style={{ fontFamily: 'Barlow, sans-serif' }}
              className="text-[20px] font-600 tracking-[0.08em] uppercase mb-2"
            >
              Manifest Accepted
            </div>
            <div className="mono text-[12px] text-[var(--gray)] max-w-[440px] leading-[1.8]">
              Your configuration has been queued for fabrication review. Expect a response within
              24–48 hours. JSON payload logged to console for CadQuery integration.
            </div>
          </div>
          <div className="mono text-[10px] text-[#4ade80] border border-[rgba(74,222,128,0.25)] px-4 py-2 tracking-[0.12em]">
            [FABRICATION_QUEUE +1] — STATUS: PENDING REVIEW
          </div>
        </div>
      </div>
    )
  }

  return (
    <form className="border border-[var(--border-2)]" onSubmit={handleSubmit} noValidate>
      {SECTIONS.map((section) => (
        <div key={section.num}>
          {/* Section header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)] bg-[var(--bg-1)]">
            <span className="mono text-[10px] text-[var(--gray-2)] border border-[var(--border)] px-[6px] py-[2px] min-w-[28px] text-center">
              {section.num}
            </span>
            <span
              style={{ fontFamily: 'Barlow, sans-serif' }}
              className="text-[13px] font-semibold tracking-[0.08em] uppercase"
            >
              {section.title}
            </span>
            <span className="mono text-[10px] text-[var(--gray)] ml-auto">
              {section.desc}
            </span>
          </div>

          {/* Fields grid */}
          <div className="p-5 bg-[var(--bg)] border-b border-[var(--border)] grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map((field) => (
              <div
                key={field.name}
                className={`flex flex-col gap-[6px] ${field.colSpan === 'full' ? 'md:col-span-2' : ''}`}
              >
                <label className="mono text-[10px] text-[var(--gray)] tracking-[0.12em] uppercase flex items-center gap-[6px]">
                  {field.label}
                  {field.required && <span className="text-[#ef4444] text-[8px]">✱</span>}
                </label>

                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] ?? ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={`field-select ${errors[field.name] ? 'error' : ''}`}
                    required={field.required}
                  >
                    {field.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] ?? ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className={`field-textarea ${errors[field.name] ? 'error' : ''}`}
                  />
                ) : (
                  <div className="relative">
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] ?? ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      step={field.step}
                      min={field.min}
                      max={field.max}
                      required={field.required}
                      className={`field-input ${field.unit ? 'pr-[52px]' : ''} ${errors[field.name] ? 'error' : ''}`}
                    />
                    {field.unit && (
                      <span className="mono absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--gray)] pointer-events-none">
                        {field.unit}
                      </span>
                    )}
                  </div>
                )}

                {errors[field.name] && (
                  <span className="mono text-[10px] text-[#ef4444]">
                    ✕ {errors[field.name]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Submit row */}
      <div className="flex items-center justify-between gap-4 px-5 py-5 bg-[var(--bg)] flex-wrap gap-y-4">
        {errors._form && (
          <span className="mono text-[11px] text-[#f87171]">✕ {errors._form}</span>
        )}
        <div className="mono text-[10px] text-[var(--gray)] leading-[1.8]">
          <div>
            Exports as{' '}
            <span className="text-white">.JSON</span> for CadQuery mapping
          </div>
          <div>Form → Fabrication review → DXF/STEP delivery</div>
        </div>
        <button type="submit" className="btn-tactical" disabled={submitting}>
          {submitting ? (
            <>
              <span className="mono text-[11px] tracking-[0.1em]">TRANSMITTING</span>
              <span className="term-cursor" />
            </>
          ) : (
            'SUBMIT MANIFEST →'
          )}
        </button>
      </div>
    </form>
  )
}
