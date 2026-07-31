// Mock data (pt-BR) for the TBH Tier List Wiki homepage.
// No backend wiring — realistic placeholder content only.

export type Rarity =
  | 'uncommon'
  | 'rare'
  | 'legendary'
  | 'immortal'
  | 'arcana'
  | 'divine';

export type TierLabel = 'S' | 'A' | 'B' | 'C';

export interface TierRow {
  tier: TierLabel;
  slots: Rarity[];
}

export interface TierEntity {
  id: string;
  title: string;
  author: string;
  upvotes: string;
  comments?: number;
  hot?: boolean;
  tierRows: TierRow[];
  size: 'xl' | 'wide' | 'small';
}

export interface CategoryChip {
  label: string;
  active?: boolean;
}

export interface TickerItem {
  name: string;
  price: string;
  delta: string;
  dir: 'up' | 'down' | 'flat';
  icon: string;
  rarity: Rarity;
}

export interface RecentPost {
  id: string;
  tier: TierLabel;
  tierHot: boolean;
  title: string;
  author: string;
  timestamp: string;
  votes: string;
  dots: Rarity[];
}

export interface Tool {
  title: string;
  code: string;
  icon: string;
}

export interface CategoryTile {
  label: string;
  count: string;
  icon: string;
}

export interface Creator {
  handle: string;
  lists: string;
  followers: string;
  icon: string;
  rarity?: Rarity;
  gold?: boolean;
}

export const CATEGORY_CHIPS: CategoryChip[] = [
  { label: 'TODOS', active: true },
  { label: 'TANKS' },
  { label: 'SUPORTES' },
  { label: 'DPS_FÍSICO' },
  { label: 'DPS_MÁGICO' },
  { label: 'EQUIPAMENTO_S' },
];

export const TRENDING: TierEntity[] = [
  {
    id: 'meta-pvp-s4',
    title: 'META PVP SEASON 4: THE VOID RISES',
    author: 'OPERADOR_X99',
    upvotes: '1.2k',
    comments: 42,
    hot: true,
    size: 'xl',
    tierRows: [
      { tier: 'S', slots: ['divine', 'arcana', 'legendary'] },
      { tier: 'A', slots: ['immortal', 'rare'] },
    ],
  },
  {
    id: 'fast-level-runes',
    title: 'FAST_LEVEL_RUNES',
    author: 'RUNE_SMITH',
    upvotes: '842',
    size: 'wide',
    tierRows: [{ tier: 'S', slots: ['arcana', 'divine'] }],
  },
  {
    id: 'core-dps-build',
    title: 'CORE_DPS_BUILD',
    author: 'DPS_KING',
    upvotes: '512',
    size: 'small',
    tierRows: [{ tier: 'A', slots: ['legendary'] }],
  },
  {
    id: 'tank-stamina-v2',
    title: 'TANK_STAMINA_V2',
    author: 'WALL_MAN',
    upvotes: '388',
    size: 'small',
    tierRows: [{ tier: 'B', slots: ['rare'] }],
  },
  {
    id: 'farm-valley-meta',
    title: 'FARM_VALLEY_META',
    author: 'GRINDER_PRO',
    upvotes: '674',
    size: 'wide',
    tierRows: [{ tier: 'S', slots: ['immortal', 'immortal'] }],
  },
  {
    id: 'afk-dungeon',
    title: 'AFK_DUNGEON',
    author: 'IDLE_HERO',
    upvotes: '210',
    size: 'small',
    tierRows: [{ tier: 'C', slots: ['uncommon'] }],
  },
  {
    id: 'magic-burst',
    title: 'MAGIC_BURST',
    author: 'ARCANE_ONE',
    upvotes: '456',
    size: 'small',
    tierRows: [{ tier: 'S', slots: ['arcana'] }],
  },
];

export const TICKER: TickerItem[] = [
  { name: 'ARCANE CRYSTAL', price: '42.5K', delta: '▲ 2.4%', dir: 'up', icon: 'diamond', rarity: 'divine' },
  { name: 'DRAGON BONE', price: '14.2K', delta: '▼ 0.8%', dir: 'down', icon: 'skull', rarity: 'legendary' },
  { name: 'VOID ESSENCE', price: '8.9K', delta: '▲ 11%', dir: 'up', icon: 'bloodtype', rarity: 'immortal' },
  { name: 'STAR SHARD', price: '124K', delta: '▲ 0.2%', dir: 'up', icon: 'auto_awesome', rarity: 'arcana' },
  { name: 'MANA POTION XL', price: '450', delta: '▼ 1.5%', dir: 'down', icon: 'water_drop', rarity: 'rare' },
  { name: 'IRON INGOT', price: '12', delta: '— 0.0%', dir: 'flat', icon: 'hardware', rarity: 'uncommon' },
  { name: 'DIVINE TOKEN', price: '1.2M', delta: '▲ 5.6%', dir: 'up', icon: 'token', rarity: 'divine' },
  { name: 'SUN CRYSTAL', price: '88K', delta: '▼ 4.1%', dir: 'down', icon: 'flare', rarity: 'legendary' },
];

export const RECENT: RecentPost[] = [
  {
    id: 'r1',
    tier: 'S',
    tierHot: true,
    title: 'Melhores Builds para Invocador das Sombras [Patch 1.0.4]',
    author: 'SHADOW_LORD',
    timestamp: '2024-05-12 // 14:22:05',
    votes: '+412',
    dots: ['arcana', 'divine'],
  },
  {
    id: 'r2',
    tier: 'B',
    tierHot: false,
    title: 'Guia de Farm: Vale dos Ancestrais (Solo)',
    author: 'FARMER_BOT',
    timestamp: '2024-05-12 // 13:45:12',
    votes: '+281',
    dots: ['rare'],
  },
  {
    id: 'r3',
    tier: 'A',
    tierHot: true,
    title: "COMO DERROTAR O BOSS 'TASKMASTER'",
    author: 'RAID_LEADER',
    timestamp: '2024-05-12 // 12:10:00',
    votes: '+156',
    dots: ['legendary'],
  },
  {
    id: 'r4',
    tier: 'S',
    tierHot: true,
    title: 'DISCUSSÃO: BUFF NO CAJADO DE ARCANA?',
    author: 'DATA_MINER',
    timestamp: '2024-05-12 // 11:05:32',
    votes: '+89',
    dots: ['immortal'],
  },
  {
    id: 'r5',
    tier: 'C',
    tierHot: false,
    title: 'NEWBIE EQUIPMENT PROGRESSION',
    author: 'GUIDE_MASTER',
    timestamp: '2024-05-12 // 09:44:21',
    votes: '+2.1k',
    dots: ['uncommon'],
  },
];

export const TOOLS: Tool[] = [
  { title: 'Farming Optimizer', code: 'ROI_CALC_V2', icon: 'trending_up' },
  { title: 'BiS Finder', code: 'BEST_IN_SLOT', icon: 'search_check' },
  { title: 'Damage Calculator', code: 'DPS_SIM_PRO', icon: 'calculate' },
  { title: 'Cube Leveling', code: 'UPGRADE_SIM', icon: 'view_in_ar' },
  { title: 'Drop Finder', code: 'LOOT_TABLES', icon: 'inventory_2' },
  { title: 'Save Inspector', code: 'SAVE_PARSER', icon: 'save' },
];

export const CATEGORIES: CategoryTile[] = [
  { label: 'GEAR', count: '1,240 ITEMS', icon: 'shield' },
  { label: 'MATERIALS', count: '4.8K ITEMS', icon: 'category' },
  { label: 'STAGES', count: '84 AREAS', icon: 'map' },
  { label: 'MONSTERS', count: '312 ENTITIES', icon: 'pest_control_rodent' },
  { label: 'RUNES', count: '156 TYPES', icon: 'diamond' },
  { label: 'BUFFS', count: '92 EFFECTS', icon: 'bolt' },
  { label: 'HEROES', count: '24 CLASSES', icon: 'person' },
  { label: 'PETS', count: '12 COMPANIONS', icon: 'pets' },
  { label: 'CUBE', count: 'UPGRADE_SIM', icon: 'view_in_ar' },
  { label: 'ALCHEMY', count: '64 RECIPES', icon: 'experiment' },
];

export const CREATORS: Creator[] = [
  { handle: 'X_CODE_X', lists: '124 TIER_LISTS', followers: '12.4K FOLLOWERS', icon: 'smart_toy', gold: true },
  { handle: 'SHADOW_LORD', lists: '82 TIER_LISTS', followers: '8.1K FOLLOWERS', icon: 'person_outline' },
  { handle: 'DATA_MINER', lists: '56 TIER_LISTS', followers: '5.2K FOLLOWERS', icon: 'psychology', rarity: 'arcana' },
  { handle: 'RAID_LEADER', lists: '41 TIER_LISTS', followers: '4.8K FOLLOWERS', icon: 'shield_moon', rarity: 'immortal' },
  { handle: 'GRINDER_PRO', lists: '104 TIER_LISTS', followers: '2.4K FOLLOWERS', icon: 'star', rarity: 'divine' },
];

export const WEEKLY_BEST = [
  { rank: '#1', pct: '98% UPVOTED', title: 'ABYSS WALKER BUILD', slots: ['divine', 'divine', 'arcana'] as Rarity[], featured: true },
  { rank: '#2', pct: '94% UPVOTED', title: 'DRAGON SLAYER V5', slots: ['immortal', 'legendary'] as Rarity[] },
  { rank: '#3', pct: '89% UPVOTED', title: 'ENDLESS GOLD GUIDE', slots: ['rare'] as Rarity[] },
  { rank: '#4', pct: '85% UPVOTED', title: 'S-RANK RUNES 1.4', slots: ['arcana'] as Rarity[] },
  { rank: '#5', pct: '81% UPVOTED', title: 'STARTER SET META', slots: ['uncommon'] as Rarity[] },
];
