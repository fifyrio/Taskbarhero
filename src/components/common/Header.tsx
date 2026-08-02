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
    <header className="tbh-root bg-surface/90 backdrop-blur-md border-b border-line sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Text logo */}
          <Link href="/" prefetch={false} className="flex items-baseline gap-2 group">
            <span className="font-display text-2xl font-black uppercase tracking-tighter text-gold drop-shadow-[0_0_8px_rgba(246,183,60,0.4)] group-hover:brightness-110 transition">
              TBH
            </span>
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.15em] text-dim">
              {'// Task Bar Hero Wiki'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className="text-dim hover:text-gold transition-colors py-2"
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
                  className="text-dim hover:text-gold transition-colors px-4"
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
