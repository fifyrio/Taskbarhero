import { TOOLS } from './mockData';
import { Icon, SectionHeader } from './primitives';

export default function ToolsGrid() {
  return (
    <section aria-labelledby="tbh-tools" className="mb-16">
      <div id="tbh-tools">
        <SectionHeader title="FERRAMENTAS" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((tool) => (
          <button
            key={tool.code}
            type="button"
            className="bg-panel border border-line p-5 hover:border-gold transition-colors flex items-center gap-4 group text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-gold"
          >
            <span className="w-10 h-10 border border-gold/20 flex items-center justify-center text-gold group-hover:bg-gold/10 transition-colors flex-shrink-0">
              <Icon name={tool.icon} />
            </span>
            <span>
              <span className="block font-mono text-xs text-ink uppercase">{tool.title}</span>
              <span className="block text-[9px] text-faint font-mono">{tool.code}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
