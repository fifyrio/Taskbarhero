'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Icon } from '@/components/tier-home/primitives';

interface SearchResult {
  dataset: string;
  label: string;
  key: string;
  name: string;
  icon: string | null;
}

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced fetch against the search API.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const json = await res.json();
        setResults(json.success ? json.data : []);
        setOpen(true);
      } catch {
        // aborted or failed — leave prior results
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  // Close the dropdown on outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function go(r: SearchResult) {
    setOpen(false);
    setQuery('');
    router.push(`/database/${r.dataset}/${encodeURIComponent(r.key)}`);
  }

  return (
    <div ref={boxRef} className="relative max-w-lg">
      <span
        aria-hidden
        className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[#3ddc97] pointer-events-none"
      >
        &gt;
      </span>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && query.trim().length >= 2) {
            setOpen(false);
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
          }
        }}
        placeholder="search_database --all"
        aria-label="Search the database"
        className="w-full bg-[#0d1015] border border-line py-3 pl-8 pr-4 text-sm font-mono text-ink placeholder:text-faint caret-[#3ddc97] focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors"
      />

      {open && (query.trim().length >= 2) && (
        <div className="absolute z-30 left-0 right-0 mt-1 bg-panel border border-line shadow-[0_25px_70px_rgba(0,0,0,0.5)] max-h-[420px] overflow-y-auto">
          {loading && results.length === 0 ? (
            <div className="px-4 py-3 font-mono text-xs text-faint uppercase">Searching…</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 font-mono text-xs text-faint uppercase">No results</div>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={`${r.dataset}-${r.key}`}>
                  <button
                    type="button"
                    onClick={() => go(r)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface transition-colors border-b border-line/40 last:border-0"
                  >
                    <span className="w-8 h-8 shrink-0 bg-surface border border-line flex items-center justify-center overflow-hidden">
                      {r.icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.icon} alt="" width={32} height={32} className="w-full h-full object-contain [image-rendering:pixelated]" />
                      ) : (
                        <Icon name="category" className="text-faint text-[16px]" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-ink truncate">{r.name}</span>
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-faint">{r.label}</span>
                    </span>
                    <Icon name="chevron_right" className="text-faint text-[16px]" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
