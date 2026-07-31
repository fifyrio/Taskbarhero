'use client';

import Header from '@/components/common/Header';
import {
  Hero,
  CategoryChips,
  TrendingBento,
  WeeklyBest,
  RecentList,
  ToolsGrid,
  MarketTicker,
  CategoriesGrid,
  CreatorsRow,
  CtaBanner,
} from '@/components/tier-home';

/**
 * TBH Tier List Wiki — immersive game tier-list homepage.
 * Dark "gamer luxury" surface with gold accents and rarity glows.
 * Uses the shared <Header/>; the shared <Footer/> is rendered by the locale layout.
 */
export default function HomePageClient() {
  return (
    <div className="tbh-root tbh-grain font-display min-h-screen">
      <div className="tbh-scanline" aria-hidden />
      <Header />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
        <Hero />
        <CategoryChips />
        <TrendingBento />
        <WeeklyBest />
        <RecentList />
        <ToolsGrid />
        <MarketTicker />
        <CategoriesGrid />
        <CreatorsRow />
        <CtaBanner />
      </main>
    </div>
  );
}
