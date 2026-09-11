// Per-dataset SEO overrides for the database index pages (/database/[dataset]).
// Targets the high-volume "bare entity" search terms from the SEO plan
// (tbh runes 6.7K, tbh rune tree 7.8K, tbh pets 3.4K, tbh rarity 4.5K, …)
// without spinning up duplicate parallel routes. Datasets not listed here fall
// back to the generic "<Label> Database" title.

export interface DatasetSeo {
  title: string;
  description: string;
  keywords: string[];
}

export const DATASET_SEO: Record<string, DatasetSeo> = {
  runes: {
    title: 'TBH Runes & Rune Tree — Full Task Bar Hero Rune List',
    description:
      'Every rune in TBH: Task Bar Hero and how the rune tree branches — all rune nodes, max levels and unlock paths for War, Wealth, Growth and more.',
    keywords: ['tbh runes', 'tbh rune tree', 'tbh rune', 'task bar hero runes', 'tbh rune list'],
  },
  pets: {
    title: 'TBH Pets — Every Pet & How to Unlock Them (Task Bar Hero)',
    description:
      'Full TBH: Task Bar Hero pet list with unlock conditions — which monster to defeat for each pet, plus stats and effects.',
    keywords: ['tbh pets', 'tbh pet', 'how to get pet tbh', 'task bar hero pets', 'tbh pet list'],
  },
  items: {
    title: 'TBH Items & Gear Database — Task Bar Hero Item List',
    description:
      'Browse every item and gear piece in TBH: Task Bar Hero — grades, stats, drop sources and crafting recipes for the full item list.',
    keywords: ['tbh items', 'tbh item list', 'tbh gear', 'task bar hero items'],
  },
  gear: {
    title: 'TBH Gear Database — Weapons & Armor (Task Bar Hero)',
    description:
      'All gear in TBH: Task Bar Hero — weapons, off-hands and armor by grade with base stats and the stat each type scales.',
    keywords: ['tbh gear', 'task bar hero gear', 'tbh weapons', 'tbh armor'],
  },
  skills: {
    title: 'TBH Skills — Full Task Bar Hero Skill List & Values',
    description:
      'Every active and passive skill in TBH: Task Bar Hero with triggers, ranges, damage types and per-level values.',
    keywords: ['tbh skills', 'tbh skill list', 'task bar hero skills'],
  },
  monsters: {
    title: 'TBH Monsters — Task Bar Hero Enemy & Boss List',
    description:
      'Every monster and boss in TBH: Task Bar Hero — where each appears, the stages they spawn in and the pets they unlock.',
    keywords: ['tbh monsters', 'tbh bosses', 'task bar hero monsters', 'tbh enemy list'],
  },
  stages: {
    title: 'TBH Stages — Task Bar Hero Level & Act List',
    description:
      'All stages in TBH: Task Bar Hero by act — waves, bosses and level data for Normal, Hell and Torment difficulties.',
    keywords: ['tbh stages', 'tbh levels', 'task bar hero stages', 'tbh act list'],
  },
  unique_mods: {
    title: 'TBH Unique Mods — Every Unique Gear Effect & Where to Get It',
    description:
      'All 36 unique mods in TBH: Task Bar Hero explained — cooldown reduces, extra projectiles, element changes and class bonuses, with every weapon and armor piece that carries each mod.',
    keywords: ['tbh unique mods', 'tbh unique mod', 'task bar hero unique mods', 'tbh unique gear effects', 'tbh gear mods'],
  },
  passive_skills: {
    title: 'TBH Passive Skills — Full List with Stats & Values',
    description:
      'Every passive skill in TBH: Task Bar Hero — the stat each passive boosts (attack, HP, armor, regen and more), flat vs multiplicative type and per-level values.',
    keywords: ['tbh passive skills', 'tbh passives', 'task bar hero passive skills', 'tbh passive skill list'],
  },
  heroes: {
    title: 'TBH Heroes — Task Bar Hero Class List, Stats & Skills',
    description:
      'Every hero class in TBH: Task Bar Hero — base stats, skills and weapons for Knight, Ranger, Sorcerer, Priest, Hunter and Slayer.',
    keywords: ['tbh heroes', 'tbh classes', 'task bar hero heroes', 'tbh characters'],
  },
};
