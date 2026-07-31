import { CATEGORIES } from './mockData';
import { Icon, SectionHeader } from './primitives';

export default function CategoriesGrid() {
  return (
    <section aria-labelledby="tbh-categories" className="mb-16">
      <div id="tbh-categories">
        <SectionHeader title="CATEGORIAS DA DATABASE" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-line border border-line">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            type="button"
            className="bg-panel p-6 flex flex-col items-center justify-center gap-1 group hover:bg-gold/5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
          >
            <Icon name={cat.icon} className="text-3xl mb-3 text-faint group-hover:text-gold transition-colors" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink">{cat.label}</span>
            <span className="font-mono text-[9px] text-faint">{cat.count}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
