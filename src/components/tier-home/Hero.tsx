import { Icon } from './primitives';

export default function Hero() {
  return (
    <section
      aria-labelledby="tbh-hero-heading"
      className="mb-10 border border-line p-6 sm:p-10 bg-[#0f1116] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-gold opacity-40 hidden sm:block">
        {'// AUTHENTICATED_SESSION_OK'}
      </div>
      <div className="relative z-10 max-w-xl">
        <h1
          id="tbh-hero-heading"
          className="font-display text-4xl sm:text-5xl text-gold uppercase mb-4 tracking-tighter font-bold drop-shadow-[0_0_14px_rgba(246,183,60,0.35)]"
        >
          TIER LIST WIKI
        </h1>
        <p className="font-sans text-sm sm:text-base text-tan/90 leading-relaxed mb-8">
          Explore, analise e colabore com a comunidade para definir o meta atual do TBH. Otimize
          seus equipamentos e domine as fendas temporais.
        </p>

        <div className="relative mb-8 max-w-lg">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-faint text-lg pointer-events-none"
          />
          <input
            type="search"
            placeholder="TERMINAL_SEARCH..."
            aria-label="Buscar tier lists"
            className="w-full bg-panel border border-line py-3 pl-11 pr-4 text-sm font-mono text-ink uppercase placeholder:text-faint focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-colors"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            className="bg-gold text-surface font-mono text-sm px-8 py-4 font-bold uppercase tracking-wide transition-[filter,transform] hover:brightness-110 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Criar tier list
          </button>
          <button
            type="button"
            className="border border-line text-ink font-mono text-sm px-8 py-4 font-bold uppercase tracking-wide transition-colors hover:bg-panel hover:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Explorar rankings
          </button>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none select-none">
        <Icon name="monitoring" className="text-[220px] leading-none" />
      </div>
    </section>
  );
}
