/**
 * Shared navigation data for the site header mega menu.
 * Consumed by common/Header.tsx. Minimal skeleton for the
 * "TBH Tier List" game tier-list wiki. Same export names/signatures
 * the Header expects — just returns the new minimal data.
 */

export interface NavDropdownItem {
  label: string;
  href: string;
  icon: string;
}

export interface NavDropdownGroup {
  label: string;
  items: NavDropdownItem[];
}

type Translate = (key: string) => string;

// Guard translate calls so a missing i18n key falls back to a readable label
// instead of throwing and breaking the header render.
function safeT(tNav: Translate, key: string, fallback: string): string {
  try {
    const value = tNav(key);
    return value && value !== key ? value : fallback;
  } catch {
    return fallback;
  }
}

export function buildAiEffectGroups(tNav: Translate): NavDropdownGroup[] {
  return [
    {
      label: safeT(tNav, 'categories.tierLists', 'Tier Lists'),
      items: [
        { label: safeT(tNav, 'dropdown.allTierLists', 'All Tier Lists'), href: '/tier-lists', icon: '🏆' },
        { label: safeT(tNav, 'dropdown.createTierList', 'Create Tier List'), href: '/tier-lists/new', icon: '✏️' },
      ],
    },
    {
      label: safeT(tNav, 'categories.mercado', 'Mercado'),
      items: [
        { label: safeT(tNav, 'dropdown.market', 'Market'), href: '/market', icon: '🛒' },
      ],
    },
    {
      label: safeT(tNav, 'categories.ferramentas', 'Ferramentas'),
      items: [
        { label: safeT(tNav, 'dropdown.tools', 'Tools'), href: '/tools', icon: '🧰' },
      ],
    },
    {
      label: safeT(tNav, 'categories.database', 'Database'),
      items: [
        { label: safeT(tNav, 'dropdown.database', 'Database'), href: '/database', icon: '📚' },
      ],
    },
  ];
}

export function buildVideoDropdown(tNav: Translate): NavDropdownItem[] {
  return [
    { label: safeT(tNav, 'dropdown.database', 'Database'), href: '/database', icon: '📚' },
  ];
}
