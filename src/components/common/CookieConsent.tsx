'use client';

import { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'cookie-consent';

// Slim consent banner. Only first-party analytics run on this site, so a
// simple accept/decline is enough — no category settings panel.
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_CONSENT_KEY)) setVisible(true);
  }, []);

  const save = (accepted: boolean) => {
    const value = JSON.stringify({ essential: true, analytics: accepted });
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
    document.cookie = `cookie-consent=${encodeURIComponent(value)}; max-age=31536000; path=/; SameSite=Lax`;
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="tbh-frame fixed bottom-3 left-3 right-3 sm:left-auto sm:max-w-md z-50"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="p-4">
        <p className="font-pixel text-[9px] text-gold uppercase mb-2">Cookies</p>
        <p className="font-sans text-xs text-ink/80 leading-relaxed mb-3">
          This site uses cookies for basic functionality and anonymous analytics.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => save(true)}
            className="tbh-btn font-pixel text-[9px] uppercase px-4 py-2 flex-1"
          >
            Accept
          </button>
          <button
            onClick={() => save(false)}
            className="tbh-btn-ghost font-pixel text-[9px] uppercase px-4 py-2 flex-1"
          >
            Essential only
          </button>
        </div>
      </div>
    </div>
  );
}
