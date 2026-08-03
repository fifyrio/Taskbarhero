// Reverse drop/recipe indexes: answers "where does item X come from" and
// "what is item X used for" from the raw drop tables.
//
// Chain: stage -> box item (MonsterDropItemKey / BossDropItemKey)
//        box   -> drop table (DropKey = boxId * 10 + variant)
//        drop  -> weighted rows -> ITEMGROUP (item_groups members) or ITEM
// Crafting/synthesis/cube recipes reference drop tables by DropKey directly.

import { getRows, Row } from '@/lib/database';

const DATA_LOCALE: Record<string, string> = {
  en: 'en-US', zh: 'zh-Hans', 'zh-TW': 'zh-Hant', de: 'de-DE', es: 'es-ES',
  fr: 'fr-FR', id: 'id-ID', it: 'it-IT', ja: 'ja-JP', ko: 'ko-KR',
  pt: 'pt-BR', ru: 'ru-RU', th: 'th-TH', vi: 'vi-VN',
};

function pick(i18n: unknown, locale: string): string {
  if (!i18n || typeof i18n !== 'object') return '';
  const map = i18n as Record<string, string>;
  return map[DATA_LOCALE[locale] ?? 'en-US'] ?? map['en-US'] ?? Object.values(map)[0] ?? '';
}

interface DropIndexes {
  itemsById: Map<number, Row>;
  groupsByItem: Map<number, number[]>;
  groupMembers: Map<number, number[]>;
  /** DropKeys whose pool can yield the item (via its groups or directly). */
  dropKeysByItem: Map<number, Set<number>>;
  dropRowsByKey: Map<number, Row[]>;
  boxIds: Set<number>;
  /** boxId -> stages referencing it, with the role + per-mille rate. */
  stagesByBox: Map<number, { stage: Row; role: 'monster' | 'boss'; rate: number }[]>;
  synthDropKeys: Map<number, Row[]>;
  /** CraftingRecipeKey -> its material rows (one per MaterialIndex). */
  craftRecipes: Map<number, Row[]>;
  craftByDropKey: Map<number, number[]>;
  craftByMaterial: Map<number, number[]>;
  cubeByDropKey: Map<number, Row[]>;
}

let idx: DropIndexes | null = null;

function push<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const list = map.get(key);
  if (list) list.push(value);
  else map.set(key, [value]);
}

function buildIndexes(): DropIndexes {
  const itemsById = new Map<number, Row>();
  const boxIds = new Set<number>();
  for (const r of getRows('items')) {
    const id = Number(r.id);
    itemsById.set(id, r);
    if (r.type === 'STAGEBOX') boxIds.add(id);
  }

  const groupsByItem = new Map<number, number[]>();
  const groupMembers = new Map<number, number[]>();
  for (const r of getRows('item_groups')) {
    const group = Number(r.ItemGroupKey);
    const item = Number(r.ItemKey);
    push(groupsByItem, item, group);
    push(groupMembers, group, item);
  }

  const dropRowsByKey = new Map<number, Row[]>();
  const dropKeysByGroup = new Map<number, number[]>();
  const dropKeysByDirectItem = new Map<number, number[]>();
  for (const r of getRows('drops')) {
    const dropKey = Number(r.DropKey);
    push(dropRowsByKey, dropKey, r);
    const reward = Number(r.RewardKey);
    if (r.REWARDTYPE === 'ITEMGROUP') push(dropKeysByGroup, reward, dropKey);
    else if (r.REWARDTYPE === 'ITEM') push(dropKeysByDirectItem, reward, dropKey);
  }

  const dropKeysByItem = new Map<number, Set<number>>();
  const addDropKey = (item: number, dropKey: number) => {
    const set = dropKeysByItem.get(item);
    if (set) set.add(dropKey);
    else dropKeysByItem.set(item, new Set([dropKey]));
  };
  groupsByItem.forEach((groups, item) => {
    for (const g of groups) for (const dk of dropKeysByGroup.get(g) ?? []) addDropKey(item, dk);
  });
  dropKeysByDirectItem.forEach((dks, item) => {
    for (const dk of dks) addDropKey(item, dk);
  });

  const stagesByBox = new Map<number, { stage: Row; role: 'monster' | 'boss'; rate: number }[]>();
  for (const s of getRows('stages')) {
    if (s.MonsterDropItemKey != null) {
      push(stagesByBox, Number(s.MonsterDropItemKey), {
        stage: s, role: 'monster', rate: Number(s.MonsterDropItemRate ?? 0),
      });
    }
    if (s.BossDropItemKey != null) {
      push(stagesByBox, Number(s.BossDropItemKey), {
        stage: s, role: 'boss', rate: Number(s.BossDropItemRate ?? 0),
      });
    }
  }

  const synthDropKeys = new Map<number, Row[]>();
  for (const r of getRows('synthesis_drops')) push(synthDropKeys, Number(r.DropKey), r);

  const craftRecipes = new Map<number, Row[]>();
  const craftByDropKey = new Map<number, number[]>();
  const craftByMaterial = new Map<number, number[]>();
  for (const r of getRows('crafting_recipes')) {
    const key = Number(r.CraftingRecipeKey);
    push(craftRecipes, key, r);
  }
  craftRecipes.forEach((rows, key) => {
    const dropKey = Number(rows[0].DropKey);
    push(craftByDropKey, dropKey, key);
    for (const r of rows) {
      const material = Number(String(r.Material).split('_')[0]);
      if (!Number.isNaN(material)) push(craftByMaterial, material, key);
    }
  });

  const cubeByDropKey = new Map<number, Row[]>();
  for (const r of getRows('cube_sub_recipes')) {
    if (r.DropKey != null) push(cubeByDropKey, Number(r.DropKey), r);
  }

  return {
    itemsById, groupsByItem, groupMembers, dropKeysByItem, dropRowsByKey,
    boxIds, stagesByBox, synthDropKeys, craftRecipes, craftByDropKey,
    craftByMaterial, cubeByDropKey,
  };
}

function indexes(): DropIndexes {
  if (!idx) idx = buildIndexes();
  return idx;
}

// ---------------------------------------------------------------------------
// Public result shapes
// ---------------------------------------------------------------------------

export interface ItemRef {
  id: string;
  name: string;
  grade: string | null;
  icon: string | null;
}

export interface StageDropSource {
  box: ItemRef;
  /** Share of this box's base drop pool that can yield the item (0-100). */
  poolShare: number | null;
  /** Number of items sharing the pools the item appears in. */
  poolSize: number;
  stages: {
    key: string;
    name: string;
    act: number | null;
    stageNo: number | null;
    role: 'monster' | 'boss';
    /** Drop chance per kill, percent (rate is per-mille in the data). */
    chance: number;
  }[];
}

export interface CraftingSource {
  recipeKey: number;
  craftingType: string;
  tier: number;
  materials: { item: ItemRef | null; rawKey: string; amount: number }[];
}

export interface SynthesisSource {
  tier: number;
  grade: string;
  synthesisType: string;
  itemLevel: number;
}

export interface CraftingUse {
  recipeKey: number;
  craftingType: string;
  tier: number;
  amount: number;
  /** Sample of items the recipe's drop table can produce. */
  produces: ItemRef[];
}

export interface ItemSources {
  stageDrops: StageDropSource[];
  crafting: CraftingSource[];
  synthesis: SynthesisSource[];
  cubeRecipes: { name: string }[];
  usedIn: CraftingUse[];
}

function itemRef(id: number, locale: string): ItemRef {
  const row = indexes().itemsById.get(id);
  if (!row) return { id: String(id), name: `Item ${id}`, grade: null, icon: null };
  return {
    id: String(id),
    name: pick(row.name, locale) || String(id),
    grade: row.grade == null ? null : String(row.grade),
    icon: row.icon == null ? null : String(row.icon),
  };
}

/** Pool share (%) of `itemId` inside drop table `dropKey`, base variant only. */
function poolShare(dropKey: number, itemId: number): { share: number | null; poolSize: number } {
  const ix = indexes();
  const rows = (ix.dropRowsByKey.get(dropKey) ?? []).filter((r) => r.HeroKeyCondition == null);
  const total = rows.reduce((sum, r) => sum + Number(r.Weight ?? 0), 0);
  if (total <= 0) return { share: null, poolSize: 0 };
  let weight = 0;
  let poolSize = 0;
  const groups = new Set(ix.groupsByItem.get(itemId) ?? []);
  for (const r of rows) {
    const reward = Number(r.RewardKey);
    if (r.REWARDTYPE === 'ITEMGROUP' && groups.has(reward)) {
      weight += Number(r.Weight ?? 0);
      poolSize = Math.max(poolSize, (ix.groupMembers.get(reward) ?? []).length);
    } else if (r.REWARDTYPE === 'ITEM' && reward === itemId) {
      weight += Number(r.Weight ?? 0);
      poolSize = Math.max(poolSize, 1);
    }
  }
  if (weight === 0) return { share: null, poolSize: 0 };
  return { share: (weight / total) * 100, poolSize };
}

/** Sample items a drop table can produce (base variant), capped. */
function dropResults(dropKey: number, locale: string, cap = 6): ItemRef[] {
  const ix = indexes();
  const out: ItemRef[] = [];
  const seen = new Set<number>();
  for (const r of ix.dropRowsByKey.get(dropKey) ?? []) {
    if (r.HeroKeyCondition != null) continue;
    const reward = Number(r.RewardKey);
    const members = r.REWARDTYPE === 'ITEMGROUP' ? ix.groupMembers.get(reward) ?? [] : [reward];
    for (const m of members) {
      if (seen.has(m)) continue;
      seen.add(m);
      out.push(itemRef(m, locale));
      if (out.length >= cap) return out;
    }
  }
  return out;
}

export function getItemSources(itemId: string | number, locale = 'en'): ItemSources {
  const ix = indexes();
  const id = Number(itemId);
  const dropKeys = Array.from(ix.dropKeysByItem.get(id) ?? []);

  const stageDrops: StageDropSource[] = [];
  const crafting: CraftingSource[] = [];
  const synthesis: SynthesisSource[] = [];
  const cubeRecipes: { name: string }[] = [];

  for (const dk of dropKeys) {
    const boxId = Math.floor(dk / 10);
    if (ix.boxIds.has(boxId)) {
      const share = poolShare(dk, id);
      const stages = (ix.stagesByBox.get(boxId) ?? []).map((s) => ({
        key: String(s.stage.StageKey),
        name: pick(s.stage.StageNameKey_i18n, locale) || String(s.stage.StageKey),
        act: s.stage.Act == null ? null : Number(s.stage.Act),
        stageNo: s.stage.StageNo == null ? null : Number(s.stage.StageNo),
        role: s.role,
        chance: s.rate / 10, // per-mille -> percent
      }));
      if (stages.length > 0) {
        stageDrops.push({ box: itemRef(boxId, locale), poolShare: share.share, poolSize: share.poolSize, stages });
      }
    }
    for (const recipeKey of ix.craftByDropKey.get(dk) ?? []) {
      const rows = ix.craftRecipes.get(recipeKey) ?? [];
      if (rows.length === 0) continue;
      crafting.push({
        recipeKey,
        craftingType: String(rows[0].ItemCraftingType ?? ''),
        tier: Number(rows[0].RecipeTier ?? 0),
        materials: rows
          .slice()
          .sort((a, b) => Number(a.MaterialIndex ?? 0) - Number(b.MaterialIndex ?? 0))
          .map((r) => {
            const [key, amount] = String(r.Material).split('_');
            const materialId = Number(key);
            return {
              item: Number.isNaN(materialId) ? null : itemRef(materialId, locale),
              rawKey: String(r.Material),
              amount: Number(amount ?? 1),
            };
          }),
      });
    }
    for (const s of ix.synthDropKeys.get(dk) ?? []) {
      synthesis.push({
        tier: Number(s.RecipeTier ?? 0),
        grade: String(s.GRADE ?? ''),
        synthesisType: String(s.ItemSynthesisType ?? ''),
        itemLevel: Number(s.ItemLevel ?? 0),
      });
    }
    for (const c of ix.cubeByDropKey.get(dk) ?? []) {
      const name = pick(c.SubRecipeNameStringKey_i18n, locale) || String(c.CubeSubRecipeKey);
      if (!cubeRecipes.some((x) => x.name === name)) cubeRecipes.push({ name });
    }
  }

  // Recipes that consume this item as a material, with what they produce.
  const usedIn: CraftingUse[] = (ix.craftByMaterial.get(id) ?? []).map((recipeKey) => {
    const rows = ix.craftRecipes.get(recipeKey) ?? [];
    const own = rows.find((r) => String(r.Material).startsWith(`${id}_`));
    return {
      recipeKey,
      craftingType: String(rows[0]?.ItemCraftingType ?? ''),
      tier: Number(rows[0]?.RecipeTier ?? 0),
      amount: Number(String(own?.Material ?? '_1').split('_')[1] ?? 1),
      produces: dropResults(Number(rows[0]?.DropKey), locale),
    };
  });

  // Deduplicate synthesis entries (same tier/grade/type can appear per level).
  const synthKeySet = new Set<string>();
  const synthesisDeduped = synthesis.filter((s) => {
    const k = `${s.synthesisType}|${s.grade}|${s.tier}`;
    if (synthKeySet.has(k)) return false;
    synthKeySet.add(k);
    return true;
  });

  // Sort stage drop sources: highest pool share first.
  stageDrops.sort((a, b) => (b.poolShare ?? 0) - (a.poolShare ?? 0));

  return { stageDrops, crafting, synthesis: synthesisDeduped, cubeRecipes, usedIn };
}

// ---------------------------------------------------------------------------
// Monster & stage guides (reuse the same indexes)
// ---------------------------------------------------------------------------

export interface MonsterStageAppearance {
  key: string;
  name: string;
  act: number | null;
  no: number | null;
  boss: boolean;
  spawnPct: number | null;
  box: ItemRef | null;
  boxChance: number | null;
}

export interface MonsterGuide {
  appearances: MonsterStageAppearance[];
}

interface PrecomputedStageRef {
  key: number;
  act?: number;
  no?: number;
  boss?: boolean;
  spawnPct?: number;
}

export function getMonsterGuide(monsterKey: string | number, locale = 'en'): MonsterGuide | null {
  const monster = getRows('monsters').find((r) => String(r.MonsterKey) === String(monsterKey));
  if (!monster) return null;
  const stagesByKey = new Map<number, Row>();
  for (const s of getRows('stages')) stagesByKey.set(Number(s.StageKey), s);

  const refs = (monster.stages as PrecomputedStageRef[] | null) ?? [];
  const appearances: MonsterStageAppearance[] = refs.map((ref) => {
    const stage = stagesByKey.get(Number(ref.key));
    const boxKey = stage
      ? (ref.boss ? stage.BossDropItemKey : stage.MonsterDropItemKey)
      : null;
    const rate = stage
      ? Number((ref.boss ? stage.BossDropItemRate : stage.MonsterDropItemRate) ?? 0)
      : 0;
    return {
      key: String(ref.key),
      name: stage ? pick(stage.StageNameKey_i18n, locale) || String(ref.key) : String(ref.key),
      act: ref.act ?? null,
      no: ref.no ?? null,
      boss: Boolean(ref.boss),
      spawnPct: ref.spawnPct ?? null,
      box: boxKey == null ? null : itemRef(Number(boxKey), locale),
      boxChance: boxKey == null ? null : rate / 10,
    };
  });
  return { appearances };
}

export interface StageGuide {
  waveMonsters: { key: string; name: string; portrait: string | null; boss: boolean }[];
  drops: {
    box: ItemRef;
    role: 'monster' | 'boss';
    chance: number;
    preview: ItemRef[];
  }[];
  firstClear: ItemRef[];
  soulstone: { item: ItemRef; amount: number } | null;
}

/** All drop-table keys attached to a box (boxId * 10 + variant). */
function boxDropKeys(boxId: number): number[] {
  const ix = indexes();
  const out: number[] = [];
  for (let variant = 0; variant <= 9; variant++) {
    const dk = boxId * 10 + variant;
    if (ix.dropRowsByKey.has(dk)) out.push(dk);
  }
  return out;
}

function boxPreview(boxId: number, locale: string): ItemRef[] {
  const seen = new Set<string>();
  const out: ItemRef[] = [];
  for (const dk of boxDropKeys(boxId)) {
    for (const item of dropResults(dk, locale, 8)) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      out.push(item);
      if (out.length >= 8) return out;
    }
  }
  return out;
}

export function getStageGuide(stageKey: string | number, locale = 'en'): StageGuide | null {
  const stage = getRows('stages').find((r) => String(r.StageKey) === String(stageKey));
  if (!stage) return null;

  const monstersByKey = new Map<number, Row>();
  for (const m of getRows('monsters')) monstersByKey.set(Number(m.MonsterKey), m);

  const monsterRef = (key: number, boss: boolean) => {
    const m = monstersByKey.get(key);
    return {
      key: String(key),
      name: m ? pick(m.MonsterNameStringKey_i18n, locale) || String(key) : String(key),
      portrait: m?.portrait == null ? null : String(m.portrait),
      boss,
    };
  };

  const waveMonsters = String(stage.Monsters ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .map((tok) => monsterRef(Number(tok.split('_')[0]), false));
  if (stage.BossMonsterKey != null) {
    waveMonsters.push(monsterRef(Number(stage.BossMonsterKey), true));
  }

  const drops: StageGuide['drops'] = [];
  if (stage.MonsterDropItemKey != null) {
    const boxId = Number(stage.MonsterDropItemKey);
    drops.push({
      box: itemRef(boxId, locale),
      role: 'monster',
      chance: Number(stage.MonsterDropItemRate ?? 0) / 10,
      preview: boxPreview(boxId, locale),
    });
  }
  if (stage.BossDropItemKey != null) {
    const boxId = Number(stage.BossDropItemKey);
    drops.push({
      box: itemRef(boxId, locale),
      role: 'boss',
      chance: Number(stage.BossDropItemRate ?? 0) / 10,
      preview: boxPreview(boxId, locale),
    });
  }

  const firstClear =
    stage.FirstClearDropKey == null ? [] : dropResults(Number(stage.FirstClearDropKey), locale, 8);

  const soulstone =
    stage.SoulstoneItemKey == null
      ? null
      : {
          item: itemRef(Number(stage.SoulstoneItemKey), locale),
          amount: Number(stage.SoulstoneAmount ?? 0),
        };

  return { waveMonsters, drops, firstClear, soulstone };
}
