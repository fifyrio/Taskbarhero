'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';

// Tier lists, save import, login and the language switcher are hidden until
// those features actually work — see the P0 launch checklist.
const NAV_ITEMS = [
  { label: 'Database', href: '/database' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#2a0806] bg-[linear-gradient(180deg,#3a0d0a_0%,#240806_100%)] shadow-[inset_0_-1px_0_rgba(246,183,60,0.25),0_4px_14px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Gold-framed logo chip */}
          <Link href="/" prefetch={false} className="tbh-frame tbh-frame-hover flex items-center gap-2.5 px-3 py-1.5 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/game/ui/Icon_Gold.png"
              alt=""
              width={22}
              height={22}
              className="w-[22px] h-[22px] object-contain [image-rendering:pixelated]"
            />
            <span className="flex flex-col leading-none">
              <span className="font-pixel text-sm text-gold group-hover:brightness-110 transition">
                TBH
              </span>
              <span className="hidden sm:block font-mono text-[9px] uppercase tracking-[0.15em] text-tan mt-1">
                Task Bar Hero Wiki
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="font-pixel text-[10px] text-tan hover:text-gold transition-colors py-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-dim hover:text-gold p-2"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-[max(2rem,env(safe-area-inset-bottom))] border-t border-line bg-surface/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-4 font-mono text-sm uppercase tracking-wider">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className="font-pixel text-[10px] text-tan hover:text-gold transition-colors px-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
