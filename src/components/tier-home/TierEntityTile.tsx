import type { TierEntity } from './mockData';
import { Icon, TierBadge, RaritySlot } from './primitives';

interface TierEntityTileProps {
  entity: TierEntity;
}

const SPAN_CLASS: Record<TierEntity['size'], string> = {
  xl: 'md:col-span-2 md:row-span-2',
  wide: 'md:col-span-2',
  small: '',
};

export default function TierEntityTile({ entity }: TierEntityTileProps) {
  const isXl = entity.size === 'xl';
  const slotSize = isXl ? 'lg' : entity.size === 'wide' ? 'md' : 'sm';

  return (
    <article
      className={`${SPAN_CLASS[entity.size]} bg-panel border border-line p-4 sm:p-5 tbh-lift group relative flex flex-col cursor-pointer focus-within:ring-1 focus-within:ring-gold`}
    >
      <div className="flex justify-between items-start gap-3 mb-4">
        <div className="min-w-0">
          <h3
            className={`font-display ${
              isXl ? 'text-xl sm:text-2xl text-gold' : 'text-sm text-ink font-mono truncate'
            } leading-tight group-hover:text-gold transition-colors`}
          >
            {entity.title}
          </h3>
          {isXl && (
            <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-faint uppercase">
              <span className="w-5 h-5 bg-gold/20 rounded-full flex items-center justify-center text-gold text-[9px]">
                {entity.author.charAt(0)}
              </span>
              {entity.author} <span className="mx-1 text-line">/</span> 2H ATRÁS
            </div>
          )}
          {!isXl && (
            <div className="mt-1 font-mono text-[9px] text-faint uppercase">BY: {entity.author}</div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {entity.hot && (
            <span className="bg-gold/20 text-gold px-2 py-0.5 text-[9px] font-bold font-mono">
              HOT
            </span>
          )}
          <div className="flex items-center gap-1.5 text-faint text-[10px] font-mono">
            <Icon name="thumb_up" className="text-xs" /> {entity.upvotes}
            {typeof entity.comments === 'number' && (
              <>
                <Icon name="forum" className="text-xs ml-1" /> {entity.comments}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-auto">
        {entity.tierRows.map((row) => (
          <div key={row.tier} className="flex items-center gap-3">
            <TierBadge tier={row.tier} size={isXl ? 'lg' : 'sm'} />
            <div className="flex gap-2">
              {row.slots.map((rarity, i) => (
                <RaritySlot key={`${rarity}-${i}`} rarity={rarity} size={slotSize} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
