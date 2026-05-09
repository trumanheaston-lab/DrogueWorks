/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        barlow: ['Barlow', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          base: '#050505',
          1: '#0a0a0a',
          2: '#111111',
          3: '#1a1a1a',
        },
        border: {
          dim: 'rgba(255,255,255,0.08)',
          mid: 'rgba(255,255,255,0.15)',
          bright: 'rgba(255,255,255,0.35)',
        },
        green: {
          status: '#4ade80',
        },
        gray: {
          muted: '#888888',
          dim: '#555555',
          deep: '#333333',
        },
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
}
