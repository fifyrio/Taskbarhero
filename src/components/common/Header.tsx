'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';

// Tier lists, save import, login and the language switcher are hidden until
// those features actually work — see the P0 launch checklist.
const NAV_ITEMS = [
  { label: 'Database', href: '/database', icon: '/game/ui/Icon_Guides.png' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="tbh-taskbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Start button */}
          <Link href="/" prefetch={false} className="tbh-btn flex items-center gap-2 px-3 py-1.5 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/game/ui/Icon_Gold.png"
              alt=""
              width={18}
              height={18}
              className="w-[18px] h-[18px] object-contain [image-rendering:pixelated]"
            />
            <span className="font-pixel text-[11px]">TBH</span>
          </Link>
          <span className="hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-dim mr-auto ml-4">
            <span className="tbh-led" aria-hidden />
            task_bar_hero.wiki — database online
          </span>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="font-pixel text-[10px] text-tan hover:text-gold transition-colors py-2"
              >
                <span className="inline-flex items-center gap-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.icon} alt="" width={16} height={16} className="w-4 h-4 object-contain [image-rendering:pixelated]" />
                  {item.label}
                </span>
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
