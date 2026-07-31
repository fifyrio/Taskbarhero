import { Link } from '@/i18n/routing';
import type { TierListSummary } from '@/types/tier-list';
import { Icon } from '@/components/tier-home/primitives';

interface TierListCardProps {
  list: TierListSummary;
}

/** Discovery card linking to the viewer, styled to match the dark/gold home. */
export default function TierListCard({ list }: TierListCardProps) {
  return (
    <Link
      href={`/tier-lists/${list.slug}`}
      className="tbh-lift group block bg-surface border border-line p-4 hover:border-gold/60 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        {list.category ? (
          <span className="font-mono text-[10px] uppercase tracking-widest text-gold bg-gold/10 px-2 py-1">
            {list.category}
          </span>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
            TIER_LIST
          </span>
        )}
        <span className="font-mono text-[10px] text-faint flex items-center gap-1">
          <Icon name="thumb_up" className="text-[12px] leading-none" />
          {list.upvotes}
        </span>
      </div>

      <h3 className="font-display text-base md:text-lg text-ink font-bold leading-tight group-hover:text-gold transition-colors line-clamp-2 mb-4">
        {list.title}
      </h3>

      <div className="flex items-center justify-between font-mono text-[10px] uppercase text-faint pt-3 border-t border-line/60">
        <span className="text-gold truncate">
          {list.authorName ? `BY: ${list.authorName}` : 'ANÔNIMO'}
        </span>
        <span className="flex items-center gap-1 flex-shrink-0">
          <Icon name="forum" className="text-[12px] leading-none" />
          {list.commentCount}
        </span>
      </div>
    </Link>
  );
}
