import { TRENDING } from './mockData';
import { SectionHeader } from './primitives';
import TierEntityTile from './TierEntityTile';

export default function TrendingBento() {
  return (
    <section aria-labelledby="tbh-trending" className="mb-16">
      <div id="tbh-trending">
        <SectionHeader title="EM TENDÊNCIA" tag="LIVE_FEED.SYS" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:auto-rows-[180px]">
        {TRENDING.map((entity) => (
          <TierEntityTile key={entity.id} entity={entity} />
        ))}
      </div>
    </section>
  );
}
