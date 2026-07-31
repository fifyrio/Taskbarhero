import { RECENT } from './mockData';
import { SectionHeader, RarityDot } from './primitives';

export default function RecentList() {
  return (
    <section aria-labelledby="tbh-recent" className="mb-16">
      <div id="tbh-recent">
        <SectionHeader title="PUBLICAÇÕES RECENTES" />
      </div>
      <ul className="bg-line space-y-px font-mono text-[11px] uppercase">
        {RECENT.map((post) => (
          <li key={post.id}>
            <a
              href="#"
              className="bg-surface p-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between group hover:bg-panel transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex gap-1 flex-shrink-0">
                  {post.dots.map((rarity, i) => (
                    <RarityDot key={`${rarity}-${i}`} rarity={rarity} />
                  ))}
                </div>
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-bold flex-shrink-0 ${
                    post.tierHot ? 'bg-gold/20 text-gold' : 'bg-panel text-faint'
                  }`}
                >
                  TIER_{post.tier}
                </span>
                <span className="text-ink group-hover:text-gold transition-colors truncate normal-case">
                  {post.title}
                </span>
              </div>
              <div className="flex items-center gap-4 md:gap-6 flex-shrink-0 pl-5 md:pl-0">
                <span className="text-gold">BY: {post.author}</span>
                <span className="text-faint hidden sm:inline">{post.timestamp}</span>
                <span className="text-ink w-12 text-right">{post.votes}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
