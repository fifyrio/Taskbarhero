// English only for now. Non-English content is incomplete (mixed-language
// pages) — re-add locales here once their translations are actually finished.
export const locales = ['en'] as const;
export const defaultLocale = 'en';

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
};
