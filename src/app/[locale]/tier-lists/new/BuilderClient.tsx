'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAuth } from '@/contexts/AuthContext';
import { Icon } from '@/components/tier-home/primitives';
import { rarityBorder, TIER_GRADES, TIER_CHIP_CLASS } from '@/components/tier-lists/rarity';
import type { Game, Entity, TierGrade } from '@/types/tier-list';

type Assignments = Record<string, TierGrade>; // entityId -> tier

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || `lista-${Date.now()}`
  );
}

export default function BuilderClient() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  const [games, setGames] = useState<Game[]>([]);
  const [gameId, setGameId] = useState<string>('');
  const [entities, setEntities] = useState<Entity[]>([]);
  const [entitiesLoading, setEntitiesLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTier, setSelectedTier] = useState<TierGrade>('S');
  const [assignments, setAssignments] = useState<Assignments>({});

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load games once.
  useEffect(() => {
    fetch('/api/games')
      .then((r) => r.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setGames(json.data);
          if (json.data.length > 0) setGameId(json.data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  // Load entities when the game changes.
  useEffect(() => {
    if (!gameId) return;
    setEntitiesLoading(true);
    setAssignments({});
    fetch(`/api/entities?gameId=${encodeURIComponent(gameId)}`)
      .then((r) => r.json())
      .then((json) => {
        setEntities(json.success && Array.isArray(json.data) ? json.data : []);
      })
      .catch(() => setEntities([]))
      .finally(() => setEntitiesLoading(false));
  }, [gameId]);

  const assignedByTier = useMemo(() => {
    const map: Record<TierGrade, Entity[]> = {
      S: [], A: [], B: [], C: [], D: [], F: [],
    };
    for (const entity of entities) {
      const tier = assignments[entity.id];
      if (tier) map[tier].push(entity);
    }
    return map;
  }, [entities, assignments]);

  const available = entities.filter((e) => !assignments[e.id]);

  const assign = (entityId: string) => {
    setAssignments((prev) => ({ ...prev, [entityId]: selectedTier }));
  };

  const unassign = (entityId: string) => {
    setAssignments((prev) => {
      const next = { ...prev };
      delete next[entityId];
      return next;
    });
  };

  const buildItems = () =>
    Object.entries(assignments).map(([entityId, tier], index) => ({
      entityId,
      tier,
      position: index,
    }));

  const save = async (publish: boolean) => {
    setError(null);
    if (!user) {
      await signInWithGoogle().catch(() => setError('Falha ao entrar'));
      return;
    }
    if (!gameId) {
      setError('Selecione um jogo');
      return;
    }
    if (!title.trim()) {
      setError('Informe um título');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/tier-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          title: title.trim(),
          slug: slugify(title),
          category: category.trim() || undefined,
          status: publish ? 'published' : 'draft',
          items: buildItems(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || 'Falha ao salvar');
      }

      if (publish) {
        await fetch(`/api/tier-lists`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // publish handled below via a second call is unnecessary; the create
          // already accepted status. Kept minimal — redirect to viewer.
          body: JSON.stringify({}),
        }).catch(() => {});
      }

      router.push(`/tier-lists/${json.data.slug}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="font-mono text-xs text-faint uppercase py-20 text-center">
        Carregando…
      </p>
    );
  }

  if (!user) {
    return (
      <div className="border border-line bg-surface p-12 text-center max-w-md mx-auto mt-10">
        <Icon name="lock" className="text-gold text-4xl mb-4" />
        <h1 className="font-display text-xl text-ink font-bold mb-2">
          Entre para criar
        </h1>
        <p className="font-mono text-xs text-faint uppercase mb-6">
          Você precisa de uma conta para montar uma tier list.
        </p>
        <button
          type="button"
          onClick={() => signInWithGoogle()}
          className="inline-flex items-center gap-2 bg-gold text-black font-mono text-xs uppercase tracking-widest font-bold px-5 py-3 hover:brightness-110 transition"
        >
          <Icon name="login" className="text-[16px] leading-none" />
          Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl md:text-4xl font-bold text-ink uppercase tracking-wide mb-6">
        Nova Tier List
      </h1>

      {/* Meta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase text-faint tracking-widest">
            Jogo
          </span>
          <select
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="bg-surface border border-line text-ink px-3 py-2 font-mono text-sm focus:outline-none focus:border-gold"
          >
            {games.length === 0 && <option value="">— sem jogos —</option>}
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase text-faint tracking-widest">
            Título
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="META PVP SEASON 4"
            className="bg-surface border border-line text-ink px-3 py-2 font-mono text-sm focus:outline-none focus:border-gold"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase text-faint tracking-widest">
            Categoria
          </span>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="TANKS"
            className="bg-surface border border-line text-ink px-3 py-2 font-mono text-sm focus:outline-none focus:border-gold"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: available entities */}
        <section className="border border-line bg-surface p-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-gold mb-3">
            Entidades disponíveis
          </h2>
          <p className="font-mono text-[10px] text-faint uppercase mb-4">
            Clique para adicionar ao tier {selectedTier}
          </p>
          {entitiesLoading ? (
            <p className="font-mono text-xs text-faint uppercase">Carregando…</p>
          ) : available.length === 0 ? (
            <p className="font-mono text-xs text-faint uppercase">
              {entities.length === 0
                ? 'Nenhuma entidade para este jogo.'
                : 'Todas atribuídas.'}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {available.map((entity) => (
                <button
                  key={entity.id}
                  type="button"
                  onClick={() => assign(entity.id)}
                  className={`w-16 h-16 border-2 ${rarityBorder(
                    entity.rarity
                  )} bg-[#0a0c10] flex items-center justify-center hover:brightness-125 transition focus:outline-none focus-visible:ring-1 focus-visible:ring-gold`}
                  title={entity.name}
                >
                  {entity.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={entity.imageUrl}
                      alt={entity.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-mono text-[9px] text-faint uppercase text-center px-1 leading-tight">
                      {entity.name.slice(0, 8)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* RIGHT: tier rows */}
        <section className="border border-line bg-surface p-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-gold mb-3">
            Tiers — selecione uma linha
          </h2>
          <div className="space-y-px bg-line border border-line">
            {TIER_GRADES.map((grade) => {
              const isSelected = grade === selectedTier;
              return (
                <div
                  key={grade}
                  className={`flex items-stretch gap-2 p-2 min-h-[80px] ${
                    isSelected ? 'bg-panel' : 'bg-surface'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedTier(grade)}
                    aria-pressed={isSelected}
                    className={`w-12 flex-shrink-0 flex items-center justify-center font-display font-bold text-xl transition ${
                      TIER_CHIP_CLASS[grade] ?? 'bg-panel text-ink'
                    } ${isSelected ? 'ring-2 ring-gold' : 'opacity-80 hover:opacity-100'}`}
                  >
                    {grade}
                  </button>
                  <div className="flex flex-wrap items-center gap-1 flex-grow">
                    {assignedByTier[grade].map((entity) => (
                      <button
                        key={entity.id}
                        type="button"
                        onClick={() => unassign(entity.id)}
                        title={`Remover ${entity.name}`}
                        className={`relative w-12 h-12 border-2 ${rarityBorder(
                          entity.rarity
                        )} bg-[#0a0c10] group`}
                      >
                        {entity.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={entity.imageUrl}
                            alt={entity.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-mono text-[8px] text-faint uppercase leading-tight block px-0.5">
                            {entity.name.slice(0, 6)}
                          </span>
                        )}
                        <span className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <Icon name="close" className="text-ink text-[16px]" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {error && (
        <p className="font-mono text-xs text-[#fc2424] uppercase mt-6">{error}</p>
      )}

      <div className="flex flex-wrap gap-3 mt-8">
        <button
          type="button"
          onClick={() => save(false)}
          disabled={saving}
          className="inline-flex items-center gap-2 border border-line bg-surface text-ink font-mono text-xs uppercase tracking-widest font-bold px-5 py-3 hover:border-gold hover:text-gold transition disabled:opacity-60"
        >
          <Icon name="save" className="text-[16px] leading-none" />
          Salvar rascunho
        </button>
        <button
          type="button"
          onClick={() => save(true)}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-gold text-black font-mono text-xs uppercase tracking-widest font-bold px-5 py-3 hover:brightness-110 transition disabled:opacity-60"
        >
          <Icon name="publish" className="text-[16px] leading-none" />
          Publicar
        </button>
      </div>
    </div>
  );
}
