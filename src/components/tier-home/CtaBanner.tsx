export default function CtaBanner() {
  return (
    <section aria-labelledby="tbh-cta" className="mb-4">
      <div className="bg-[#242832] border-2 border-gold/50 p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(246,183,60,0.1),transparent)] pointer-events-none" />
        <div className="relative z-10 text-center md:text-left">
          <h2
            id="tbh-cta"
            className="font-display text-2xl sm:text-3xl text-gold mb-2 uppercase tracking-tight font-bold"
          >
            Envie sua tier list
          </h2>
          <p className="font-sans text-sm text-tan/90 max-w-md">
            Compartilhe seu conhecimento estratégico com milhares de jogadores e ganhe o selo de
            &apos;ESTRATEGISTA_X&apos; na comunidade.
          </p>
        </div>
        <button
          type="button"
          className="relative z-10 bg-gold text-surface font-mono text-sm sm:text-base px-8 sm:px-10 py-4 sm:py-5 font-bold uppercase transition-transform hover:scale-105 active:scale-100 shadow-[0_0_20px_rgba(246,183,60,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          PUBLICAR_AGORA.EXE
        </button>
      </div>
    </section>
  );
}
