import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import Header from '@/components/common/Header';
import { Icon } from '@/components/tier-home/primitives';
import {
  getDatasetMeta,
  getRows,
  idField,
  rowName,
  rowIconUrl,
  type DatasetMeta,
  type Row,
} from '@/lib/database';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 60;

export function generateMetadata({
  params: { locale, dataset },
}: {
  params: { locale: string; dataset: string };
}): Metadata {
  const meta = getDatasetMeta(dataset);
  const baseUrl = SITE_URL;
  const path = locale === 'en' ? `/database/${dataset}` : `/${locale}/database/${dataset}`;
  const label = meta?.label ?? dataset;
  return {
    title: `${label} | Taskbar Hero Database`,
    description: `All ${label} in TBH: Task Bar Hero — ${meta?.rows ?? 0} entries with stats and details.`,
    alternates: { canonical: `${baseUrl}${path}` },
  };
}

// Up to 4 extra scalar columns to preview in the table (skips i18n + the id/name).
function previewColumns(meta: DatasetMeta, rows: Row[]): string[] {
  const id = idField(meta);
  const out: string[] = [];
  for (const c of meta.columns) {
    if (c === id || c.endsWith('_i18n') || /name/i.test(c) || /icon|path|prefab|animator|sprite|portrait/i.test(c)) {
      continue;
    }
    const sample = rows.find((r) => r[c] !== null && r[c] !== undefined)?.[c];
    if (sample === undefined) continue;
    if (typeof sample === 'object') continue;
    out.push(c);
    if (out.length >= 4) break;
  }
  return out;
}

function cell(value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object') return Array.isArray(value) ? `[${value.length}]` : '{…}';
  return String(value);
}

export default function DatasetListPage({
  params: { locale, dataset },
  searchParams,
}: {
  params: { locale: string; dataset: string };
  searchParams: { page?: string };
}) {
  const meta = getDatasetMeta(dataset);
  if (!meta) notFound();

  const rows = getRows(dataset);
  const id = idField(meta);
  const cols = previewColumns(meta, rows);

  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = rows.slice(start, start + PAGE_SIZE);

  return (
    <div className="tbh-root tbh-grain font-display min-h-screen">
      <div className="tbh-scanline" aria-hidden />
      <Header />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        <nav className="font-mono text-[11px] uppercase tracking-widest text-faint mb-4">
          <Link href="/database" prefetch={false} className="hover:text-gold transition-colors">
            Database
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gold">{meta.label}</span>
        </nav>

        <header className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <h1 className="font-display text-2xl md:text-4xl font-bold text-ink uppercase tracking-wide">
            {meta.label}
          </h1>
          <span className="font-mono text-xs text-faint uppercase">
            {rows.length.toLocaleString()} entries · {meta.group}
          </span>
        </header>

        <div className="border border-line bg-surface overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line font-mono text-[11px] uppercase tracking-wider text-faint">
                <th className="px-3 py-2.5 font-medium">{id}</th>
                <th className="px-3 py-2.5 font-medium">Name</th>
                {cols.map((c) => (
                  <th key={c} className="px-3 py-2.5 font-medium hidden md:table-cell">{c}</th>
                ))}
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r) => {
                const key = String(r[id]);
                return (
                  <tr key={key} className="border-b border-line/50 hover:bg-panel transition-colors">
                    <td className="px-3 py-2.5 font-mono text-xs text-faint">{key}</td>
                    <td className="px-3 py-2.5">
                      <Link
                        href={`/database/${dataset}/${encodeURIComponent(key)}`}
                        prefetch={false}
                        className="flex items-center gap-2.5 text-sm text-ink hover:text-gold font-medium transition-colors"
                      >
                        {(() => {
                          const icon = rowIconUrl(r);
                          return icon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={icon} alt="" width={24} height={24} className="w-6 h-6 shrink-0 object-contain [image-rendering:pixelated]" />
                          ) : null;
                        })()}
                        {rowName(r, meta, locale)}
                      </Link>
                    </td>
                    {cols.map((c) => (
                      <td key={c} className="px-3 py-2.5 font-mono text-xs text-dim hidden md:table-cell">
                        {cell(r[c])}
                      </td>
                    ))}
                    <td className="px-3 py-2.5 text-right">
                      <Link
                        href={`/database/${dataset}/${encodeURIComponent(key)}`}
                        prefetch={false}
                        className="text-faint hover:text-gold transition-colors"
                        aria-label="View details"
                      >
                        <Icon name="chevron_right" className="text-[18px]" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 font-mono text-xs uppercase tracking-wider">
            <PageLink dataset={dataset} page={page - 1} disabled={page <= 1} label="← Prev" />
            <span className="text-faint">
              {page} / {totalPages}
            </span>
            <PageLink dataset={dataset} page={page + 1} disabled={page >= totalPages} label="Next →" />
          </div>
        )}
      </main>
    </div>
  );
}

function PageLink({
  dataset,
  page,
  disabled,
  label,
}: {
  dataset: string;
  page: number;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return <span className="text-line px-4 py-2 border border-line/50">{label}</span>;
  }
  return (
    <Link
      href={`/database/${dataset}?page=${page}`}
      prefetch={false}
      className="text-dim hover:text-gold border border-line px-4 py-2 hover:border-gold transition-colors"
    >
      {label}
    </Link>
  );
}
