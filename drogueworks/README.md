# DrogueWorks

**Parametric altimeter sled configurator for high-power rocketry.**  
SpaceX-minimalist mission control interface. Built with Next.js 14, Tailwind CSS, and Framer Motion.

---

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (available, extend as needed)
- **Lucide React** (available for icons)
- **Formspree** (form submission backend)

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Formspree Setup (Required for live form submissions)

1. Go to [https://formspree.io/](https://formspree.io/) and create a free account.
2. Create a new form and copy your **Form ID** (e.g. `xpzvjqkw`).
3. Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FORMSPREE_ID=xpzvjqkw
```

4. Restart the dev server.

Without the env variable, the form runs in **dev mode** — it simulates success and logs the full JSON payload to the browser console.

---

## JSON Payload Structure

Each submission exports a JSON object structured for downstream CadQuery mapping:

```json
{
  "brand": "wildman",
  "series": "Darkstar",
  "od": "54.00",
  "id": "52.40",
  "altimeter_primary": "stratologger_cf",
  "altimeter_secondary": "none",
  "battery": "9v_lithium",
  "switch_type": "rotary",
  "mach": "0.80",
  "gload": "15",
  "motor_class": "J",
  "recovery": "dual_deploy",
  "constraints": "Rocky desert playa...",
  "pilot_handle": "BRAVO-7",
  "email": "pilot@example.com",
  "_precision_config": {
    "od_mm": 54,
    "id_mm": 52.4,
    "wall_mm": "0.80",
    "sled_length_mm": 152,
    "target_mach": 0.8,
    "peak_gload": 15
  },
  "_timestamp": "2026-05-08T...",
  "_version": "1.0.0"
}
```

---

## Deploy on Render

1. Push to GitHub.
2. In Render → **New Web Service** → connect your repo.
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variable: `NEXT_PUBLIC_FORMSPREE_ID=your_id`
6. Deploy.

---

## File Structure

```
drogueworks/
├── app/
│   ├── globals.css        # Glass effects, terminal scrollbars, design tokens
│   ├── layout.tsx         # Root layout with font loading + metadata
│   └── page.tsx           # Main landing page
├── components/
│   ├── Header.tsx         # Minimalist nav + live status indicator
│   ├── PrecisionSidebar.tsx  # NL terminal + sliders + status log
│   ├── StatusLog.tsx      # Live telemetry stream
│   ├── DataReadout.tsx    # Computed metrics bar
│   └── IntakeForm.tsx     # Structured intake form with validation
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## Design Language

- **Background**: `#050505` (Midnight)
- **Text**: `#FFFFFF` (Pure white)
- **Accents**: `#888888` (Muted grey)
- **Status**: `#4ade80` (Operational green)
- **Typography**: Barlow (headers) + JetBrains Mono (data/terminal)
- **UI**: 1px borders, glassmorphism panels, 0px border-radius, tactical buttons

---

*"Hardware for the range, not the shelf."*
