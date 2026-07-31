import { CATEGORY_CHIPS } from './mockData';

export default function CategoryChips() {
  return (
    <nav
      aria-label="Filtrar categorias"
      className="flex gap-2 mb-12 overflow-x-auto pb-4 scrollbar-hide"
    >
      {CATEGORY_CHIPS.map((chip) => (
        <button
          key={chip.label}
          type="button"
          className={`flex-shrink-0 px-5 py-1.5 font-mono text-xs uppercase tracking-wide border transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-gold ${
            chip.active
              ? 'bg-gold/10 border-gold text-gold'
              : 'border-line text-tan/80 hover:border-gold hover:text-gold'
          }`}
        >
          {chip.label}
        </button>
      ))}
    </nav>
  );
}
