# TBH Wiki SEO 方案(2026-08-09)

数据来源:Similarweb(2026-07 全球,新鲜)+ Semrush(库滞后,仅作旁证)。
关键词明细见同目录 `seo-keywords.csv`(可直接作为程序化页面/选题的种子数据)。

## 1. 市场与竞争

游戏 "TBH: Task Bar Hero" 处于爆发期,"tbh" 词族 4 万+ 词、总流量 328万/月,几乎全部是近 3 个月的新词。

| 竞品 | 月访问量 | 打法 |
|---|---|---|
| taskbarhero.wiki | 745万 | 程序化实体页(items/monsters/pets)+ /es/ /pt/ 多语言 |
| taskbarherowiki.com | 60.8万 | 同名截流,数据型 wiki("searchable and filterable") |
| probonk.com | 37.9万 | 同类工具站 |
| tbh.city | 23.3万 | 工具站 |
| mobalytics.gg | 4842万 | 已上 TBH builds,是 "tbh build" SERP 领先者 |
| 长尾仿站 | - | task-bar-hero.wiki / tbhwiki.com / tbh-task-bar-hero.wiki / ninewiki.com |

我们的差异化:**tier list UGC(投票/排行)+ 工具页**,这两块竞品都没做透。

## 2. 页面架构方案(按优先级)

### P0 头部词(本周)
目标词:tbh wiki 274.5K/KD22、tbh: task bar hero 90.8K/KD18、task bar hero 403K/KD26、tbh task bar hero wiki 10.5K。
动作:首页 title/H1 定为 "TBH Wiki — Task Bar Hero (TBH) Guides, Builds & Tier Lists";补充品牌变体(tbhwiki、taskbarhero)到 metadata;上线 sitemap + 提交 GSC。

### P1 Builds 集群(第 1-2 周,新增路由 `/builds`)
每个职业一页 + 索引页,总可捕获量 ~10万/月,KD 几乎全部为"-"(无人竞争):

| 路由 | 目标词(月量) |
|---|---|
| /builds | tbh build 18.7K、tbh builds 14.6K、build tbh 4K |
| /builds/sorcerer | tbh sorcerer build 15.6K、sorcerer build tbh 4.6K |
| /builds/ranger | tbh ranger build 14.6K、ranger build tbh 4.3K、tbh solo ranger build 3.4K |
| /builds/priest | tbh priest build 11.7K、priest build tbh 4K |
| /builds/knight | tbh knight build 3.8K |
| /builds/hell-act-2-9 等场景 build | skill build for hell act 2-9 5K |

页面内嵌对应职业的 tier list(复用 tier_lists 表),形成 UGC 差异化。

### P2 程序化实体页(第 2-4 周,复用 entities 表)
竞品 4 万词长尾的来源。路由:`/items/[slug]`、`/monsters/[slug]`、`/runes/[slug]`、`/pets/[slug]`。
已验证有量的实体词:darksteel ingot tbh 5.1K、frozen orb tbh 4K、tbh blue golem 4.6K、burning skeleton tbh 3.8K、tbh giant fly 3.7K、fire spirit tbh 3.3K、tbh explosive bolt 3.9K、skewer shot tbh 7.5K、tbh rune tree 7.8K、tbh runes 6.7K、tbh rarity 4.5K、tbh pet 3.7K/tbh pets 3.4K。
关键点:实体页同时吃"裸实体名"流量(竞品靠 giant fly 1.9K、hero pet 480、rune axe 320 这类词排名),页内互链到所属 build/tier list。

### P3 工具页(第 3-5 周,新增 `/tools/*`)
| 路由 | 目标词 | 说明 |
|---|---|---|
| /tools/index | tbh index 16.8K、tbhindex 4.6K | 竞品 tbhindex.com 单站在做 |
| /tools/market | tbh market 8.8K、tbh マーケット 9.6K、tbh 相場 3.9K | 价格/行情表 |
| /tools/calculator | tbh calculator 5.8K | KD72 偏高,做工具而非文章 |
| /tools/farming | tbh farm 5.3K、tbh farming 4K、tbh pet farm 3.7K | 刷图效率 |
| /tools/grades | tbh grades 3.8K、tbh rarity 4.5K | 品级对照,直连 tier list |

### P4 攻略/FAQ(持续,`/guides/*`)
关卡页:tbh hell 3-7 4.9K、hell 3-9 4.2K、torment 3-3 3.8K、tbh 攻略 50.6K(中文)。
FAQ 选题(来自问题查询,竞价为零):how to get pet (2K)、how to level up cube (782)、do soulstones get consumed (775)、when does chest drop (669)、how to sell item (654)、where to get minor emerald (610)、how to use/remove decoration (609/561)、does all elemental resistance include chaos (1.2K)。
FAQ 用 FAQPage 结构化数据,一页多问。

### P5 Tier List 主场(持续)
目标词:tbh best team 4.3K、tbh grades、tbh rarity + "tier list" 变体。
把已发布 UGC tier list 接入首页(替换 tier-home 的 mock 数据),published 列表页做成 `/tier-lists/best-team` 这类 SEO 着陆页。

## 3. 多语言优先级(next-intl 已就绪,逐个放开)

| 优先级 | 语言 | 依据 |
|---|---|---|
| 1 | 日语 /ja | 长尾最丰富:tbh ビルド 5.3K、ソーサラー ビルド 5.4K、ルーン 6.5K、周回 5.9K+周回おすすめ 5.7K、効果範囲 7.9K、詠唱速度 6.3K、攻撃速度 4.7K、移動速度 4K、カオス耐性 4.1K、物理ダメージ 3.6K、レアリティ 3.9K、レンジャー 5.5K |
| 2 | 印尼语 /id、越南语 /vi | 流量大盘:印尼 47%、越南 20%(移动端),竞品未覆盖 |
| 3 | 中文 /zh | tbh 攻略 50.6K/KD-、塔斯克巴英雄 12.7K、tbh 意思 3.3K |
| 4 | 西语 /es、葡语 /pt | 竞品已做且有排名;问题词有西语(como pasar el boss 1-10 pesadilla 1.4K) |
| 5 | 韩语 /ko、法语 /fr、土耳其语 /tr | KR +112% 增长;FR 是 Semrush 里唯一有 "taskbar hero" 量的国家;tbh ne demek 3.8K(土语) |
| 暂缓 | 德语、意大利语 | 无信号 |

## 4. 技术要点

- Canonical 一律 `https://www.taskbarherowiki.co`(taskbarhero.wiki 是竞品域名,永不引用)
- 英文无 `/en` 前缀保持现状;新语言逐个在 `src/i18n/config.ts` 放开
- 实体页 → build 页 → tier list 页三层内链;每个实体页带 Breadcrumb + ItemList 结构化数据
- 注意与 "tbh"(俚语 to be honest)、"tbhk"(动漫 Toilet-bound Hanako-kun)、"tbhq"(食品添加剂)的歧义词区隔,页面命名始终带 "Task Bar Hero" 上下文
- 外链启动:参考 backlink-building 技能,首发 taskbarhero 相关 subreddit/Steam 社区 + 游戏导航站
