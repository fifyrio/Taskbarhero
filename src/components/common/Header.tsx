'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, loading, signInWithGoogle, signOut } = useAuth();

  const tNav = useTranslations('common.navigation');
  const tHeader = useTranslations('common.header');
  const tBtn = useTranslations('common.buttons');

  // Guard translate so missing i18n keys fall back to readable labels.
  const safeT = (fn: (key: string) => string, key: string, fallback: string): string => {
    try {
      const value = fn(key);
      return value && value !== key ? value : fallback;
    } catch {
      return fallback;
    }
  };

  type DropdownItem = { label: string; href: string; icon: string };
  type DropdownGroup = { label: string; items: DropdownItem[] };
  type NavItem = {
    label: string;
    href: string;
    highlight?: boolean;
    dropdown?: DropdownItem[];
    groups?: DropdownGroup[];
  };

  const navItems: NavItem[] = [
    { label: safeT(tNav, 'tierLists', 'Tier Lists'), href: '/tier-lists' },
    { label: safeT(tNav, 'createTierList', 'Criar tier list'), href: '/tier-lists/new', highlight: true }
  ];

  const signInLabel = safeT(tBtn, 'signIn', 'Entrar');
  const getStartedLabel = safeT(tBtn, 'getStarted', 'Criar tier list');

  return (
    <header className="tbh-root bg-surface/90 backdrop-blur-md border-b border-line sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Text logo — TBH // TIER LIST WIKI */}
          <Link href="/" prefetch={false} className="flex items-baseline gap-2 group">
            <span className="font-display text-2xl font-black uppercase tracking-tighter text-gold drop-shadow-[0_0_8px_rgba(246,183,60,0.4)] group-hover:brightness-110 transition">
              TBH
            </span>
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.15em] text-dim">
              {'// Tier List Wiki'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
            {navItems.map((item) => (
              item.highlight ? (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className="text-gold border-b border-gold pb-0.5 hover:brightness-110 transition"
                >
                  {item.label}
                </Link>
              ) : item.groups ? (
                <div key={item.href} className="group">
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="text-dim hover:text-gold transition-colors flex items-center gap-1 py-2"
                  >
                    {item.label}
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>

                  {/* Mega Menu */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[min(1120px,calc(100vw-2rem))] max-h-[80vh] overflow-y-auto bg-panel border border-line shadow-[0_25px_70px_rgba(0,0,0,0.5)] p-4 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out columns-2 lg:columns-3 xl:columns-4 gap-4">
                    {item.groups.map((groupItem) => (
                      <div key={groupItem.label} className="break-inside-avoid mb-4">
                        <h3 className="px-3 pb-2 mb-1 text-[11px] font-bold uppercase tracking-widest text-gold border-b border-line">
                          {groupItem.label}
                        </h3>
                        <ul className="space-y-0.5">
                          {groupItem.items.map((dropdownItem) => (
                            <li key={dropdownItem.href}>
                              <Link
                                href={dropdownItem.href}
                                prefetch={false}
                                className="flex items-center px-3 py-2 text-sm text-ink hover:bg-surface hover:text-gold transition-colors"
                              >
                                <span className="text-base mr-2">{dropdownItem.icon}</span>
                                <span className="font-medium truncate">{dropdownItem.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : item.dropdown ? (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="text-dim hover:text-gold transition-colors flex items-center gap-1 py-2"
                  >
                    {item.label}
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>

                  <div className="absolute top-full left-0 mt-0 w-60 bg-panel border border-line shadow-[0_25px_70px_rgba(0,0,0,0.5)] py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.href}
                        href={dropdownItem.href}
                        prefetch={false}
                        className="flex items-center px-4 py-3 text-ink hover:bg-surface hover:text-gold transition-colors"
                      >
                        <span className="text-lg mr-3">{dropdownItem.icon}</span>
                        <span className="font-medium truncate">{dropdownItem.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className="text-dim hover:text-gold transition-colors py-2"
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Import save ghost action */}
            <Link
              href="/tier-lists/new"
              prefetch={false}
              className="hidden lg:inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-dim border border-line px-3 py-1.5 hover:text-gold hover:border-gold transition-colors"
            >
              {safeT(tHeader, 'importSave', 'Import save')}
            </Link>

            <LanguageSwitcher />

            {loading ? (
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            ) : user ? (
              <div className="relative group">
                <div className="flex items-center gap-2 bg-panel border border-line px-3 py-2 hover:border-gold transition-colors cursor-pointer">
                  {profile && (
                    <span className="font-mono text-xs text-gold">{profile.credits}</span>
                  )}
                  <div className="w-7 h-7 bg-gold flex items-center justify-center">
                    <span className="text-sm font-bold text-surface">
                      {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <div className="absolute right-0 top-full mt-0 w-52 bg-panel border border-line shadow-[0_25px_70px_rgba(0,0,0,0.5)] py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-2 border-b border-line">
                    <p className="text-sm font-medium text-ink">{user.user_metadata?.full_name || 'User'}</p>
                    <p className="text-xs text-dim truncate">{user.email}</p>
                    {profile && (
                      <p className="font-mono text-xs text-gold mt-1">{profile.credits} credits</p>
                    )}
                  </div>
                  <Link href="/billing" prefetch={false} className="flex items-center px-4 py-2 text-sm text-dim hover:text-gold hover:bg-surface transition-colors">
                    {safeT(tNav, 'billing', 'Billing')}
                  </Link>
                  <Link href="/assets" prefetch={false} className="flex items-center px-4 py-2 text-sm text-dim hover:text-gold hover:bg-surface transition-colors">
                    {safeT(tNav, 'assets', 'Assets')}
                  </Link>
                  <Link href="/prompt-history" prefetch={false} className="flex items-center px-4 py-2 text-sm text-dim hover:text-gold hover:bg-surface transition-colors">
                    {safeT(tNav, 'prompts', 'History')}
                  </Link>
                  <Link href="/settings/api-keys" prefetch={false} className="flex items-center px-4 py-2 text-sm text-dim hover:text-gold hover:bg-surface transition-colors">
                    {safeT(tNav, 'apiKeys', 'API Keys')}
                  </Link>
                  <button
                    onClick={signOut}
                    className="w-full text-left px-4 py-2 text-sm text-dim hover:text-gold hover:bg-surface transition-colors"
                  >
                    {safeT(tBtn, 'signOut', 'Logout')}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={signInWithGoogle}
                  className="font-mono text-xs uppercase tracking-wider text-dim hover:text-gold transition-colors px-2 py-2"
                >
                  {signInLabel}
                </button>
                <button
                  onClick={signInWithGoogle}
                  className="bg-gold text-surface font-mono text-xs uppercase tracking-wider font-bold px-4 py-2 hover:bg-white transition-colors"
                >
                  {getStartedLabel}
                </button>
              </>
            )}
          </div>

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
          <div className="md:hidden pt-4 pb-[max(2rem,env(safe-area-inset-bottom))] border-t border-line bg-surface/95 backdrop-blur-sm max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain">
            <nav className="flex flex-col space-y-4 font-mono text-sm uppercase tracking-wider">
              <div className="px-4 flex justify-end">
                <LanguageSwitcher />
              </div>
              {navItems.map((item) => (
                item.highlight ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    className="text-gold border border-gold px-4 py-3 text-center mx-4 hover:bg-gold hover:text-surface transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : item.groups ? (
                  <div key={item.href} className="px-4">
                    <div className="text-dim py-2">{item.label}</div>
                    <div className="ml-2 space-y-3">
                      {item.groups.map((groupItem) => (
                        <details key={groupItem.label} className="group/cat">
                          <summary className="cursor-pointer list-none flex items-center justify-between px-2 py-2 text-[11px] font-bold uppercase tracking-widest text-gold border-b border-line">
                            <span>{groupItem.label}</span>
                            <svg className="w-3.5 h-3.5 transition-transform group-open/cat:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </summary>
                          <div className="ml-2 mt-1 space-y-1">
                            {groupItem.items.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.href}
                                href={dropdownItem.href}
                                prefetch={false}
                                className="flex items-center py-1.5 text-sm text-dim hover:text-gold transition-colors normal-case"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <span className="text-base mr-2">{dropdownItem.icon}</span>
                                <span className="font-medium">{dropdownItem.label}</span>
                              </Link>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                ) : item.dropdown ? (
                  <div key={item.href} className="px-4">
                    <div className="text-dim py-2">{item.label}</div>
                    <div className="ml-4 space-y-2">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.href}
                          href={dropdownItem.href}
                          prefetch={false}
                          className="flex items-center py-2 text-dim hover:text-gold transition-colors normal-case"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="text-lg mr-3">{dropdownItem.icon}</span>
                          <span className="font-medium">{dropdownItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    className="text-dim hover:text-gold transition-colors px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-line px-4">
                {loading ? (
                  <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
                ) : user ? (
                  <>
                    <div className="bg-panel border border-line px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold flex items-center justify-center">
                          <span className="text-lg font-bold text-surface">
                            {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink normal-case truncate">{user.user_metadata?.full_name || 'User'}</p>
                          <p className="text-xs text-dim normal-case truncate">{user.email}</p>
                          {profile && (
                            <p className="font-mono text-xs text-gold mt-1">{profile.credits} credits</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link href="/billing" prefetch={false} className="py-2 text-sm text-dim hover:text-gold transition-colors" onClick={() => setIsMenuOpen(false)}>
                      {safeT(tNav, 'billing', 'Billing')}
                    </Link>
                    <Link href="/assets" prefetch={false} className="py-2 text-sm text-dim hover:text-gold transition-colors" onClick={() => setIsMenuOpen(false)}>
                      {safeT(tNav, 'assets', 'Assets')}
                    </Link>
                    <Link href="/prompt-history" prefetch={false} className="py-2 text-sm text-dim hover:text-gold transition-colors" onClick={() => setIsMenuOpen(false)}>
                      {safeT(tNav, 'prompts', 'History')}
                    </Link>
                    <Link href="/settings/api-keys" prefetch={false} className="py-2 text-sm text-dim hover:text-gold transition-colors" onClick={() => setIsMenuOpen(false)}>
                      {safeT(tNav, 'apiKeys', 'API Keys')}
                    </Link>
                    <button onClick={signOut} className="text-left py-2 text-sm text-dim hover:text-gold transition-colors">
                      {safeT(tBtn, 'signOut', 'Logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={signInWithGoogle}
                      className="w-full text-dim hover:text-gold border border-line py-2.5 transition-colors"
                    >
                      {signInLabel}
                    </button>
                    <button
                      onClick={signInWithGoogle}
                      className="w-full bg-gold text-surface font-bold py-2.5 hover:bg-white transition-colors"
                    >
                      {getStartedLabel}
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
