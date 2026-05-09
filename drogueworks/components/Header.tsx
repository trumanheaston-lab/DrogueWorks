'use client'

import { useEffect, useState } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`header-blur fixed top-0 left-0 right-0 z-50 h-[52px] flex items-center justify-between px-8 transition-all duration-300 ${
        scrolled ? 'border-b border-[var(--border-2)]' : 'border-b border-[var(--border)]'
      }`}
    >
      {/* LOGO */}
      <a href="#" className="flex items-center gap-0 no-underline">
        <span
          style={{ fontFamily: 'Barlow, sans-serif' }}
          className="text-[15px] font-bold tracking-[0.15em] uppercase text-white"
        >
          DROGUE
        </span>
        <span
          style={{ fontFamily: 'Barlow, sans-serif' }}
          className="text-[15px] font-light tracking-[0.15em] uppercase text-[var(--gray)]"
        >
          WORKS
        </span>
      </a>

      {/* NAV */}
      <nav className="hidden md:flex items-center gap-8">
        {['Products', 'Docs', 'GitHub'].map((item) => (
          <a
            key={item}
            href={item === 'GitHub' ? 'https://github.com' : '#'}
            target={item === 'GitHub' ? '_blank' : undefined}
            rel={item === 'GitHub' ? 'noopener noreferrer' : undefined}
            className="mono text-[11px] text-[var(--gray)] hover:text-white transition-colors duration-200 tracking-[0.1em] uppercase no-underline"
          >
            {item}
          </a>
        ))}
      </nav>

      {/* STATUS */}
      <div className="mono flex items-center gap-2 text-[10px] text-[var(--green)] tracking-[0.1em] uppercase">
        <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)] status-pulse" />
        <span className="hidden sm:inline">Systems Nominal</span>
      </div>
    </header>
  )
}
