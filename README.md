# 伯罗奔尼撒战争 史诗叙事馆
# Peloponnesian War: Epic Narrative Museum

一个中文为主、可交互浏览的伯罗奔尼撒战争 Web 站点，结合战争总览、分层地图、章节式策略推演、修昔底德专题与知识图谱探索。

An interactive web experience centered on the Peloponnesian War, combining a war overview, layered historical maps, chapter-based strategy play, a Thucydides feature, and an explorable knowledge graph.

## 项目亮点
## Highlights

- 中文史诗叙事体验，覆盖前 431 年至前 404 年的战争主线
- Epic Chinese-language storytelling covering the main arc of the war from 431 BCE to 404 BCE

- 五大战争阶段总览，联动时间、地图、人物与关键事件
- Five war phases linked to timeline, map, people, and turning points

- 分层地图浏览：城邦/组织、人物、事件可切换
- Layered map exploration with switchable views for polities/organizations, people, and events

- 单人章节式策略推演，可从雅典、斯巴达、叙拉古三方视角进入战争
- Single-player chapter-based strategy experience from the perspectives of Athens, Sparta, and Syracuse

- 修昔底德专题，解释他是谁、为何写作、为何重要
- A Thucydides feature explaining who he was, why he wrote, and why the work still matters

- 知识图谱与实体词典联动，可按类型检索人物、地点、事件、城邦与概念
- Connected knowledge graph and entity dictionary for browsing people, places, events, poleis, and concepts by type

## 技术栈
## Tech Stack

- `React 19`
- `TypeScript`
- `Vite`
- 纯前端静态站点 / Fully static frontend site
- 本地 JSON 数据驱动 / Local JSON-driven content

## 本地运行
## Local Development

```bash
npm install
npm run dev
```

默认开发地址通常为：
The local dev server usually runs at:

```text
http://localhost:5173
```

## 常用脚本
## Scripts

```bash
npm run dev
npm run test
npm run build
```

说明：
Notes:

- `npm run build:data`：根据原始图谱与实体详情生成前端使用的数据文件
- `npm run build:data`: generates the frontend data files from the raw graph and entity sources

- `npm run test`：运行 Vitest 测试
- `npm run test`: runs the Vitest suite

- `npm run build`：先生成数据，再执行 TypeScript 构建与 Vite 打包
- `npm run build`: regenerates data, then runs the TypeScript build and Vite production build

## 目录结构
## Project Structure

```text
src/
  components/     UI 组件 / UI components
  data/           人工整理的战争内容 / curated war content
  lib/            图谱、地图、战棋等逻辑 / graph, map, and campaign logic
  App.tsx         主页面 / main application shell

public/
  data/           生成后的实体与图谱 JSON / generated entity and graph JSON
  maps/           地图底图素材 / map assets
  portraits/      核心人物配图 / portrait assets
  social/         社交媒体资源 / social assets

scripts/
  build-greek-data.mjs   数据生成脚本 / data generation script
```

## 数据说明
## Data Notes

- 项目使用统一实体体系，把战争阶段、地图、图谱与战棋内容联动到同一组实体 ID
- The project uses a unified entity system so that phases, maps, the graph, and the strategy module all point to the same entity IDs

- 原始数据会在构建时经过规范化，包括繁简统一、别名合并、错误实体剔除与分类修正
- Raw data is normalized at build time, including simplified-Chinese conversion, alias merging, noisy-entity removal, and category correction

## 部署
## Deployment

这是一个静态站点，适合部署到 Vercel、Cloudflare Pages、Netlify 或任何支持静态文件托管的平台。

This is a static site and can be deployed easily to Vercel, Cloudflare Pages, Netlify, or any static hosting provider.

标准生产构建：
Production build:

```bash
npm install
npm run build
```

构建产物位于：
Build output:

```text
dist/
```

## 仓库信息
## Repository

GitHub:
[https://github.com/yuancafe/Peloponnesian](https://github.com/yuancafe/Peloponnesian)

## 版权与署名
## Credits

© 2026 Leo Yuan Tsao  
SEED Reading Club
