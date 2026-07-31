# TBH Tier List — 项目进度（新会话续接用）

Next.js 14 tier-list 站，复用 easynanobanana 栈（已剔支付+AI）。沉浸游戏 UI（gold #f6b73c / surface #14161b / 稀有度色 / DOS 字体）。

## 已完成
- 骨架：复制 easynanobanana → 剔支付/AI → build 绿，dev :3001 200
- 首页：stitch v4 设计组件化 `src/components/tier-home/*`，Header 重构沉浸 TBH
- 数据模型：`supabase/migrations/20260731_tier_lists.sql`（6 表+RLS+trigger）、`supabase/seed_tier_lists.sql`（games+8 entities）
- 类型 `src/types/tier-list.ts` + repository `src/lib/tier-lists.ts`（含 getGames/getEntitiesByGame/trending/recent/bySlug/create/setItems/vote）
- Supabase 凭据已入 `.env`（project uqdlaiakurrltutwmmxr），`.mcp.json` 加了 supabase MCP（已 OAuth 认证）
- 路由/builder agent：3 路由(`/tier-lists`,`/[slug]`,`/new`)+API+首页接真数据（后台 agent 建，检查是否完成）

## 已完成（本会话 2026-07-31）
- **DB 已建**：远端库空 → 先 bootstrap migration（uuid-ossp + user_profiles + generate_referral_code + RLS），再 tier_lists migration，再 seed（1 game tbh + 8 entities）
- **demo 数据**：种了 1 published tier list `melhor-gear-meta-atual`（demo user + 8 items 跨 S~D）供联调/展示
- **联调过**：`/tier-lists` 200 显示 trending，`/tier-lists/[slug]` 200 渲染标题+entities，`/api/games` 返真数据；首页仍 mock（landing 展示用，empty DB 不适合真数据）
- **SEO 品牌清完**：src/ + messages/*.json 全部 Easy Nano Banana/Nano Banana → Taskbar Hero，easynanobanana.com → taskbarhero.wiki，support 邮箱同换
- **build 绿**（修 2 处 eslint error：jsx `//` 注释、未装的 no-explicit-any disable 注释）
- **security advisor**：无 CRITICAL/缺 RLS；修了 2 函数 search_path；仅剩 leaked-password protection（Auth 后台开关，需手动）
- **.env.example 重写**：只留 Supabase 三键 + 可选 app url/GA（原 Waffo/KIE 已删）

## 待办
1. Vercel 部署：填 3 个 Supabase env（URL/anon/service_role），域名 taskbarhero.wiki
2. Supabase Auth 后台开 leaked-password protection（可选）
3. 首页真数据（可选，等有 UGC 后把 mock 换真库 trending/recent）
4. 移动端 tab bar 组件化（可选）

## 关键
- Stitch project id: 9774036255620381813；设计档 .stitch/designs/home_v4.html + home_mobile.html
- `.env` 含 GOOGLE_STITCH + Supabase 三键，已 gitignore，勿提交
- middleware.ts + supabase.ts 有 env guard（无凭据不崩）
