import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import Header from '@/components/common/Header';
import SearchBox from '@/components/wiki-home/SearchBox';
import { search } from '@/lib/search';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

const RESULT_LIMIT = 100;

export function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
}): Metadata {
  const q = (searchParams.q ?? '').trim();
  return {
    title: q ? `Search: ${q}` : 'Search',
    description: `Search the TBH: Task Bar Hero database — heroes, items, monsters, skills and stages.`,
    alternates: { canonical: `${SITE_URL}/search` },
    robots: { index: false, follow: true },
  };
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? '').trim();
  const results = q.length >= 2 ? search(q, RESULT_LIMIT) : [];

  // Group by dataset, preserving relevance order within groups.
  const groups: { dataset: string; label: string; items: typeof results }[] = [];
  for (const r of results) {
    let g = groups.find((x) => x.dataset === r.dataset);
    if (!g) {
      g = { dataset: r.dataset, label: r.label, items: [] };
      groups.push(g);
    }
    g.items.push(r);
  }

  return (
    <div className="tbh-root tbh-grain font-display min-h-screen">
      <div className="tbh-scanline" aria-hidden />
      <Header />
      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-8">
        <p className="tbh-banner inline-block font-mono text-[11px] uppercase tracking-widest mb-4">
          Search
        </p>
        <div className="mb-8">
          <SearchBox />
        </div>

        {q.length < 2 ? (
          <p className="font-mono text-sm text-dim">Type at least two characters to search.</p>
        ) : results.length === 0 ? (
          <p className="font-mono text-sm text-dim">
            No results for <span className="text-gold">&quot;{q}&quot;</span>.
          </p>
        ) : (
          <>
            <p className="font-mono text-xs text-faint mb-6">
              {results.length}{results.length >= RESULT_LIMIT ? '+' : ''} results for{' '}
              <span className="text-gold">&quot;{q}&quot;</span>
            </p>
            <div className="space-y-8">
              {groups.map((g) => (
                <section key={g.dataset}>
                  <div className="flex items-baseline justify-between mb-3 border-b border-line pb-2">
                    <h2 className="font-pixel text-[11px] uppercase text-gold">{g.label}</h2>
                    <Link
                      href={`/database/${g.dataset}`}
                      prefetch={false}
                      className="font-mono text-[10px] uppercase tracking-widest text-faint hover:text-gold"
                    >
                      All {g.label} →
                    </Link>
                  </div>
                  <ul className="tbh-frame divide-y divide-line/50">
                    {g.items.map((r) => (
                      <li key={`${r.dataset}-${r.key}`}>
                        <Link
                          href={`/database/${r.dataset}/${encodeURIComponent(r.key)}`}
                          prefetch={false}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-panel transition-colors group"
                        >
                          <span className="w-8 h-8 shrink-0 bg-panel border border-line flex items-center justify-center overflow-hidden">
                            {r.icon && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={r.icon} alt="" width={32} height={32} className="w-full h-full object-contain [image-rendering:pixelated]" />
                            )}
                          </span>
                          <span className="text-sm text-ink group-hover:text-gold transition-colors">
                            {r.name}
                          </span>
                          <span className="ml-auto font-mono text-[10px] text-faint">#{r.key}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
