# 伯罗奔尼撒战争 史诗叙事馆
# Peloponnesian War: Epic Narrative Museum

这是一个使用 [knowledge2skills](https://github.com/yuancafe/knowledge2skills) 开发的实例项目。  
它展示了如何把领域知识、图谱数据、原始史料整理与前端交互设计结合起来，快速生成一个可浏览、可探索、可游玩的中文历史网站。

This project is a showcase built with [knowledge2skills](https://github.com/yuancafe/knowledge2skills).  
It demonstrates how domain knowledge, graph-structured data, curated source material, and frontend interaction design can be combined to produce an explorable, playable, Chinese-language history website.

## 这个项目是什么
## What This Project Is

本项目围绕伯罗奔尼撒战争构建了一个“史诗叙事馆”式 Web 体验，不只是静态介绍页，而是把历史内容组织成多个互相联动的模块：

This project turns the Peloponnesian War into an “epic narrative museum” on the web. It is not just a static information page, but a multi-module historical experience with linked content and interactions:

- 战争总览
- War overview

- 地图叙事
- Narrative map

- 策略推演
- Strategy simulation

- 修昔底德专题
- Thucydides feature

- 知识图谱与实体词典
- Knowledge graph and entity dictionary

## 用 knowledge2skills 做了什么
## What Was Built with knowledge2skills

借助 `knowledge2skills`，这个项目完成了从知识到网站体验的转化流程，包括：

With `knowledge2skills`, this project turns knowledge into a working website experience, including:

- 将战争相关图谱数据转成前端可直接消费的实体数据与关系网络
- Converting war-related graph data into frontend-ready entities and relationship graphs

- 对人物、地点、事件、城邦、组织、概念进行统一命名、去重和规范化
- Normalizing, deduplicating, and standardizing people, places, events, poleis, organizations, and concepts

- 剔除错误关联实体，修正常见别名、繁简差异和分类错误
- Removing noisy entities and correcting aliases, simplified/traditional variants, and category mistakes

- 将结构化知识组织成可视化时间线、地图、图谱和互动叙事
- Reorganizing structured knowledge into visual timelines, maps, graphs, and interactive narrative modules

- 把知识内容进一步包装成具有审美方向和沉浸感的中文历史站点
- Packaging the knowledge into a Chinese historical site with a deliberate visual direction and immersive presentation

## 网站功能
## Site Features

### 1. 战争总览
### 1. War Overview

- 以五个阶段梳理战争主线，从战前局势一直讲到前 404 年雅典失败
- Organizes the war into five major phases, from prewar tensions to the Athenian collapse in 404 BCE

- 联动时间、人物、关键事件与阶段说明
- Connects phases to timeline shifts, people, turning points, and strategic explanations

### 2. 分层地图
### 2. Layered Map

- 在同一张底图上切换不同信息层：城邦/组织、人物、事件
- Lets users switch layers on a shared map base: polities/organizations, people, and events

- 支持按时间推进查看战局变化
- Supports timeline-based progression to follow how the war evolves geographically

- 地图节点可点击查看实体详情
- Map nodes are clickable and open linked entity details

### 3. 战争策略推演
### 3. Strategy Simulation

- 从雅典、斯巴达、叙拉古三个视角进入战争
- Allows players to enter the war from the perspectives of Athens, Sparta, or Syracuse

- 采用章节式回合结构，而不是一次性做完的静态选择
- Uses a chapter-based turn structure instead of a one-shot branching choice flow

- 每轮包含资源变化、历史对照、偏离分析与下一轮推进
- Each round includes resource shifts, historical comparison, divergence analysis, and progression to the next turn

### 4. 修昔底德专题
### 4. Thucydides Feature

- 介绍修昔底德本人、流放经历、写作动机与史学方法
- Introduces Thucydides himself, his exile, motives for writing, and historiographical method

- 解释他为什么不只是记录战争，而是在分析权力、恐惧与判断
- Explains why he was not merely recording war, but analyzing power, fear, and political judgment

### 5. 知识图谱与实体词典
### 5. Knowledge Graph and Entity Dictionary

- 默认展示战争核心子图，也可切换到更完整的关系网络
- Shows a core war graph by default, with an option to switch to a larger network

- 支持搜索、聚焦、点击实体、查看关联关系
- Supports search, focus, entity selection, and relationship browsing

- 提供按类型展开的实体词典，方便系统化查阅
- Includes a type-based entity dictionary for systematic browsing

## 技术实现
## Technical Stack

- `React`
- `TypeScript`
- `Vite`
- 静态前端部署
- Static frontend deployment

项目核心数据流包括：
The core project data flow includes:

- 原始图谱与实体详情
- raw graph and entity details

- 构建脚本生成规范化 JSON
- a build script that generates normalized JSON

- 前端统一实体系统驱动地图、图谱、叙事与战棋
- a unified frontend entity system powering the map, graph, narrative, and strategy modules

## 本地运行
## Local Development

```bash
npm install
npm run dev
```

## 构建
## Build

```bash
npm run build
```

构建前会先自动执行数据生成脚本：
The build automatically runs the data generation step first:

```bash
npm run build:data
```

## 仓库
## Repository

GitHub:
[https://github.com/yuancafe/Peloponnesian](https://github.com/yuancafe/Peloponnesian)

Knowledge2skills:
[https://github.com/yuancafe/knowledge2skills](https://github.com/yuancafe/knowledge2skills)
