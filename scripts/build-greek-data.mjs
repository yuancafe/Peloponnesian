import fs from 'node:fs'
import path from 'node:path'

const rootDir = process.cwd()
const rawGraphPath = path.join(rootDir, 'public/data/raw/graph_data.json')
const rawEntityPath = path.join(rootDir, 'public/data/raw/entity_details.json')
const outputEntityPath = path.join(rootDir, 'public/data/entities.json')
const outputCoreGraphPath = path.join(rootDir, 'public/data/graph-core.json')
const outputFullGraphPath = path.join(rootDir, 'public/data/graph-full.json')

const simplifiedCharMap = new Map([
  ['亞', '亚'], ['爾', '尔'], ['羅', '罗'], ['萊', '莱'], ['凱', '凯'], ['敘', '叙'],
  ['戰', '战'], ['爭', '争'], ['聯', '联'], ['國', '国'], ['約', '约'], ['遠', '远'],
  ['艦', '舰'], ['義', '义'], ['麥', '麦'], ['諾', '诺'], ['馬', '马'], ['開', '开'],
  ['圖', '图'], ['書', '书'], ['譯', '译'], ['專', '专'], ['對', '对'], ['龍', '龙'],
  ['龜', '龟'], ['倫', '伦'], ['鄉', '乡'], ['關', '关'], ['門', '门'], ['陽', '阳'], ['陰', '阴'],
  ['隊', '队'], ['鄰', '邻'], ['醫', '医'], ['風', '风'], ['飛', '飞'], ['黃', '黄'],
  ['齊', '齐'], ['魚', '鱼'], ['鳳', '凤'], ['鴉', '鸦'], ['鶴', '鹤'], ['萬', '万'],
  ['與', '与'], ['東', '东'], ['絲', '丝'], ['兩', '两'], ['嚴', '严'], ['個', '个'],
  ['豐', '丰'], ['為', '为'], ['麗', '丽'], ['舉', '举'], ['麼', '么'], ['樂', '乐'],
  ['於', '于'], ['雲', '云'], ['親', '亲'], ['億', '亿'], ['從', '从'], ['倉', '仓'],
  ['儀', '仪'], ['們', '们'], ['價', '价'], ['眾', '众'], ['優', '优'], ['會', '会'],
  ['傳', '传'], ['傷', '伤'], ['偽', '伪'], ['體', '体'], ['餘', '余'], ['來', '来'],
  ['偵', '侦'], ['側', '侧'], ['儉', '俭'], ['僑', '侨'], ['僱', '雇'], ['兒', '儿'],
  ['內', '内'], ['冊', '册'], ['劃', '划'], ['劉', '刘'], ['劇', '剧'], ['劍', '剑'],
  ['動', '动'], ['務', '务'], ['勝', '胜'], ['勞', '劳'], ['勢', '势'], ['勳', '勋'],
  ['匯', '汇'], ['區', '区'], ['協', '协'], ['華', '华'], ['喪', '丧'], ['單', '单'],
  ['盧', '卢'], ['衛', '卫'], ['卻', '却'], ['厭', '厌'], ['厲', '厉'], ['參', '参'],
  ['雙', '双'], ['發', '发'], ['變', '变'], ['叢', '丛'], ['吳', '吴'], ['呂', '吕'],
  ['員', '员'], ['啟', '启'], ['喚', '唤'], ['嗚', '呜'], ['嘆', '叹'], ['嘗', '尝'],
  ['嘩', '哗'], ['嚀', '咛'], ['圍', '围'], ['園', '园'], ['圓', '圆'], ['團', '团'],
  ['場', '场'], ['塊', '块'], ['壞', '坏'], ['壟', '垄'], ['備', '备'], ['復', '复'],
  ['夢', '梦'], ['奪', '夺'], ['奮', '奋'], ['奧', '奥'], ['婦', '妇'], ['媽', '妈'],
  ['學', '学'], ['寶', '宝'], ['實', '实'], ['寧', '宁'], ['審', '审'], ['寫', '写'],
  ['寬', '宽'], ['將', '将'], ['導', '导'], ['屆', '届'], ['屬', '属'], ['岡', '冈'],
  ['島', '岛'], ['峽', '峡'], ['崙', '仑'], ['嶼', '屿'], ['嶺', '岭'], ['嶽', '岳'],
  ['巖', '岩'], ['巔', '巅'], ['幣', '币'], ['幹', '干'], ['庫', '库'], ['廠', '厂'],
  ['廣', '广'], ['張', '张'], ['彌', '弥'], ['彎', '弯'], ['彙', '汇'], ['彥', '彦'],
  ['後', '后'], ['徵', '征'], ['恆', '恒'], ['恥', '耻'], ['悅', '悦'], ['惡', '恶'],
  ['愛', '爱'], ['慄', '栗'], ['慘', '惨'], ['慶', '庆'], ['懷', '怀'], ['懶', '懒'],
  ['戲', '戏'], ['戶', '户'], ['拋', '抛'], ['挾', '挟'], ['捨', '舍'], ['掃', '扫'],
  ['採', '采'], ['揚', '扬'], ['換', '换'], ['擁', '拥'], ['擇', '择'], ['擔', '担'],
  ['擠', '挤'], ['擴', '扩'], ['擺', '摆'], ['擾', '扰'], ['撫', '抚'], ['撲', '扑'],
  ['數', '数'], ['斂', '敛'], ['斃', '毙'], ['斷', '断'], ['時', '时'], ['晉', '晋'],
  ['晝', '昼'], ['暈', '晕'], ['曆', '历'], ['曉', '晓'], ['朧', '胧'], ['條', '条'],
  ['楊', '杨'], ['極', '极'], ['構', '构'], ['槍', '枪'], ['樓', '楼'], ['標', '标'],
  ['樣', '样'], ['樞', '枢'], ['橫', '横'], ['檔', '档'], ['檢', '检'], ['檯', '台'],
  ['歡', '欢'], ['歲', '岁'], ['歷', '历'], ['歸', '归'], ['殘', '残'], ['殯', '殡'],
  ['殲', '歼'], ['氣', '气'], ['澤', '泽'], ['漢', '汉'], ['灣', '湾'], ['濟', '济'],
  ['濤', '涛'], ['濫', '滥'], ['濱', '滨'], ['灑', '洒'], ['無', '无'], ['煉', '炼'],
  ['煙', '烟'], ['煩', '烦'], ['產', '产'], ['畝', '亩'], ['畫', '画'], ['疇', '畴'],
  ['療', '疗'], ['瘋', '疯'], ['皺', '皱'], ['盜', '盗'], ['盞', '盏'], ['監', '监'],
  ['盤', '盘'], ['睜', '睁'], ['矚', '瞩'], ['礙', '碍'], ['禮', '礼'], ['禍', '祸'],
  ['禪', '禅'], ['種', '种'], ['穀', '谷'], ['積', '积'], ['稱', '称'], ['穩', '稳'],
  ['競', '竞'], ['築', '筑'], ['簡', '简'], ['簽', '签'], ['籠', '笼'], ['籤', '签'],
  ['籲', '吁'], ['粵', '粤'], ['糧', '粮'], ['糾', '纠'], ['紀', '纪'], ['紅', '红'],
  ['紋', '纹'], ['納', '纳'], ['紙', '纸'], ['級', '级'], ['紛', '纷'], ['紮', '扎'],
  ['紹', '绍'], ['終', '终'], ['組', '组'], ['結', '结'], ['絕', '绝'], ['統', '统'],
  ['經', '经'], ['綁', '绑'], ['綜', '综'], ['綱', '纲'], ['維', '维'], ['綻', '绽'],
  ['綰', '绾'], ['網', '网'], ['緊', '紧'], ['緒', '绪'], ['線', '线'], ['締', '缔'],
  ['編', '编'], ['緣', '缘'], ['縣', '县'], ['縱', '纵'], ['總', '总'], ['績', '绩'],
  ['織', '织'], ['繩', '绳'], ['繪', '绘'], ['繼', '继'], ['續', '续'], ['纜', '缆'],
  ['罈', '坛'], ['羈', '羁'], ['翹', '翘'], ['聖', '圣'], ['聞', '闻'], ['職', '职'],
  ['肅', '肃'], ['脅', '胁'], ['脈', '脉'], ['腦', '脑'], ['腳', '脚'], ['脫', '脱'],
  ['脹', '胀'], ['興', '兴'], ['舊', '旧'], ['艙', '舱'], ['艱', '艰'], ['藝', '艺'],
  ['節', '节'], ['莊', '庄'], ['葉', '叶'], ['蒼', '苍'], ['蓋', '盖'], ['製', '制'],
  ['複', '复'], ['襲', '袭'], ['覺', '觉'], ['覽', '览'], ['觀', '观'], ['計', '计'],
  ['訂', '订'], ['討', '讨'], ['訓', '训'], ['記', '记'], ['許', '许'], ['訴', '诉'],
  ['診', '诊'], ['註', '注'], ['詠', '咏'], ['詢', '询'], ['試', '试'], ['詩', '诗'],
  ['誇', '夸'], ['誠', '诚'], ['說', '说'], ['誰', '谁'], ['課', '课'], ['調', '调'],
  ['諸', '诸'], ['謀', '谋'], ['議', '议'], ['讓', '让'], ['貝', '贝'], ['貞', '贞'],
  ['負', '负'], ['財', '财'], ['貢', '贡'], ['責', '责'], ['貫', '贯'], ['販', '贩'],
  ['貪', '贪'], ['貴', '贵'], ['貸', '贷'], ['費', '费'], ['貿', '贸'], ['賂', '赂'],
  ['資', '资'], ['賈', '贾'], ['賊', '贼'], ['賓', '宾'], ['賜', '赐'], ['賦', '赋'],
  ['賬', '账'], ['質', '质'], ['賴', '赖'], ['贈', '赠'], ['趙', '赵'], ['趨', '趋'],
  ['躍', '跃'], ['輕', '轻'], ['輸', '输'], ['轄', '辖'], ['辦', '办'], ['農', '农'],
  ['這', '这'], ['進', '进'], ['週', '周'], ['遊', '游'], ['運', '运'], ['過', '过'],
  ['還', '还'], ['邁', '迈'], ['違', '违'], ['連', '连'], ['遲', '迟'], ['遷', '迁'],
  ['選', '选'], ['遺', '遗'], ['邏', '逻'], ['郵', '邮'], ['鄭', '郑'], ['醜', '丑'],
  ['釋', '释'], ['錄', '录'], ['鐘', '钟'], ['鐵', '铁'], ['鑑', '鉴'], ['長', '长'],
  ['閃', '闪'], ['閉', '闭'], ['閔', '闵'], ['陣', '阵'], ['陳', '陈'], ['陸', '陆'],
  ['隨', '随'], ['際', '际'], ['險', '险'], ['雜', '杂'], ['雞', '鸡'], ['難', '难'],
  ['電', '电'], ['霧', '雾'], ['靈', '灵'], ['靜', '静'], ['頁', '页'], ['頂', '顶'],
  ['頃', '顷'], ['項', '项'], ['順', '顺'], ['須', '须'], ['頌', '颂'], ['頓', '顿'],
  ['頗', '颇'], ['領', '领'], ['頜', '颌'], ['頡', '颉'], ['頤', '颐'], ['頭', '头'],
  ['頸', '颈'], ['顆', '颗'], ['題', '题'], ['顏', '颜'], ['類', '类'], ['顧', '顾'],
  ['顯', '显'], ['飄', '飘'], ['餓', '饿'], ['館', '馆'], ['馮', '冯'], ['駐', '驻'],
  ['駕', '驾'], ['騎', '骑'], ['騷', '骚'], ['驅', '驱'], ['驚', '惊'], ['驗', '验'],
  ['髒', '脏'], ['髮', '发'], ['鬥', '斗'], ['鬧', '闹'], ['點', '点'], ['齋', '斋'],
  ['齒', '齿'], ['龐', '庞'],
])

const aliasMap = new Map([
  ['亚西比德', '阿尔基比亚德'],
  ['亚西比得', '阿尔基比亚德'],
  ['阿尔基比阿德', '阿尔基比亚德'],
  ['亚西比底', '阿尔基比亚德'],
  ['安菲波利', '安菲玻里'],
  ['安菲波里', '安菲玻里'],
  ['安菲波里之战', '安菲玻里战役'],
  ['安菲波里之役', '安菲玻里战役'],
  ['安菲波里城', '安菲玻里'],
  ['拉栖代梦', '斯巴达'],
  ['拉栖代梦人', '斯巴达'],
  ['伯罗奔尼撒联盟', '伯罗奔尼撒同盟'],
  ['伯罗奔尼撒联邦', '伯罗奔尼撒同盟'],
  ['帕德嫩神庙', '帕特农神庙'],
  ['羊河口海战', '羊河之役'],
  ['羊河口之战', '羊河之役'],
  ['阿尔吉努萨伊海战', '阿吉纽西海战'],
  ['阿尔吉努萨伊群岛', '阿吉纽西群岛'],
])

const canonicalAliases = new Map([
  ['阿尔基比亚德', ['亚西比德', '亚西比得', '阿尔基比阿德']],
  ['安菲玻里', ['安菲波利', '安菲波里']],
  ['斯巴达', ['拉栖代梦', '拉栖代梦人']],
  ['伯罗奔尼撒同盟', ['伯罗奔尼撒联盟']],
])

const excludedEntityNames = new Set([
  '人民大学出版社',
  '中国对外翻译出版公司',
  '周作人',
  '朱雁冰',
  '刘宗坤',
  '阎克文',
  '新中国',
  '商务印书馆',
  '何兆武',
  '钱永祥',
])

const polisNames = new Set([
  '雅典',
  '斯巴达',
  '底比斯',
  '科林斯',
  '叙拉古',
  '叙拉古城',
  '阿尔戈斯',
  '弥罗斯',
  '普拉提亚',
  '安菲玻里',
  '米提列涅',
  '科西拉',
  '米利都',
  '萨摩斯',
  '麦加拉',
  '埃吉纳',
  '托洛涅',
])

const placeNames = new Set([
  '埃及',
])

const phaseAssignments = new Map([
  ['伯里克利', ['prelude', 'archidamian']],
  ['伯罗奔尼撒战争', ['prelude', 'archidamian', 'uneasy-peace', 'sicilian-expedition', 'ionian-war']],
  ['伯拉西达', ['archidamian']],
  ['安菲玻里', ['archidamian']],
  ['安菲玻里战役', ['archidamian']],
  ['尼基阿斯和约', ['uneasy-peace']],
  ['弥罗斯对话', ['uneasy-peace']],
  ['西西里远征', ['sicilian-expedition']],
  ['叙拉古城', ['sicilian-expedition']],
  ['德凯利亚', ['sicilian-expedition', 'ionian-war']],
  ['波斯', ['ionian-war']],
  ['羊河之役', ['ionian-war']],
  ['修昔底德', ['archidamian', 'sicilian-expedition', 'ionian-war']],
  ['雅典', ['prelude', 'archidamian', 'uneasy-peace', 'sicilian-expedition', 'ionian-war']],
  ['斯巴达', ['prelude', 'archidamian', 'uneasy-peace', 'sicilian-expedition', 'ionian-war']],
])

function canonicalizeName(name) {
  const simplified = [...String(name ?? '')]
    .map((char) => simplifiedCharMap.get(char) ?? char)
    .join('')
  return aliasMap.get(simplified) ?? simplified
}

function isExcludedEntityName(name) {
  return excludedEntityNames.has(canonicalizeName(name))
}

function dedupe(values) {
  return [...new Set(values.filter(Boolean))]
}

function normalizeCategory(rawCategory, name) {
  const canonical = canonicalizeName(name)
  if (polisNames.has(canonical)) {
    return 'Polis'
  }
  if (placeNames.has(canonical)) {
    return 'Place'
  }
  if (canonical === '伯罗奔尼撒战争') {
    return 'Event'
  }
  if (canonical === '伯罗奔尼撒战争史') {
    return 'Document'
  }
  return rawCategory ?? 'Other'
}

function normalizeDescription(text) {
  return String(text ?? '')
    .replaceAll('<SEP>', '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function summaryFromDescription(text) {
  return text.split(/\n+/)[0].slice(0, 88).trim()
}

function buildSearchIndex(record) {
  return [record.id, record.name, ...record.aliases, record.summary]
    .join(' ')
    .toLowerCase()
}

function selectCoreGraph(graph, seeds, depth = 1) {
  const visited = new Set(seeds.map(canonicalizeName))
  const adjacency = new Map()

  for (const link of graph.links) {
    const source = canonicalizeName(link.source)
    const target = canonicalizeName(link.target)
    if (!adjacency.has(source)) adjacency.set(source, new Set())
    if (!adjacency.has(target)) adjacency.set(target, new Set())
    adjacency.get(source).add(target)
    adjacency.get(target).add(source)
  }

  let frontier = [...visited]
  for (let step = 0; step < depth; step += 1) {
    const next = []
    for (const id of frontier) {
      for (const neighbor of adjacency.get(id) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          next.push(neighbor)
        }
      }
    }
    frontier = next
  }

  return {
    nodes: graph.nodes.filter((node) => visited.has(node.id)),
    links: graph.links.filter((link) => visited.has(link.source) && visited.has(link.target)),
  }
}

const rawGraph = JSON.parse(fs.readFileSync(rawGraphPath, 'utf8'))
const rawEntities = JSON.parse(fs.readFileSync(rawEntityPath, 'utf8'))

const entityMap = new Map()

for (const [rawName, details] of Object.entries(rawEntities)) {
  const id = canonicalizeName(rawName)
  if (!id || isExcludedEntityName(id)) continue
  const normalizedDescription = normalizeDescription(details.description)
  const relatedEntities = dedupe(
    (details.neighbors ?? [])
      .map(canonicalizeName)
      .filter((name) => name !== id && !isExcludedEntityName(name)),
  )
  const existing = entityMap.get(id)

  const aliases = dedupe([
    ...(existing?.aliases ?? []),
    ...(canonicalAliases.get(id) ?? []),
    rawName !== id ? rawName : '',
  ]).filter((alias) => alias !== id)

  entityMap.set(id, {
    id,
    name: id,
    aliases,
    category: normalizeCategory(details.category, id),
    degree: Math.max(details.degree ?? 0, existing?.degree ?? 0),
    summary: existing?.summary ?? summaryFromDescription(normalizedDescription),
    description: dedupe([existing?.description ?? '', normalizedDescription]).join('\n\n'),
    relatedEntities: dedupe([...(existing?.relatedEntities ?? []), ...relatedEntities]),
    relatedPhaseIds: dedupe([...(existing?.relatedPhaseIds ?? []), ...(phaseAssignments.get(id) ?? [])]),
  })
}

const fullGraph = {
  nodes: [],
  links: [],
}

const mergedNodes = new Map()

for (const node of rawGraph.nodes) {
  const id = canonicalizeName(node.id)
  if (!id || isExcludedEntityName(id)) continue
  const existing = entityMap.get(id)
  const merged = {
    id,
    label: id,
    name: id,
    category: normalizeCategory(node.category, id),
    degree: Math.max(node.degree ?? 0, existing?.degree ?? 0),
    aliases: dedupe([...(existing?.aliases ?? []), ...(canonicalAliases.get(id) ?? [])]).filter((alias) => alias !== id),
    summary: existing?.summary ?? '',
  }
  mergedNodes.set(id, merged)
}

const linkSet = new Set()
for (const link of rawGraph.links) {
  const source = canonicalizeName(link.source)
  const target = canonicalizeName(link.target)
  if (!source || !target || isExcludedEntityName(source) || isExcludedEntityName(target)) continue
  if (source === target) continue
  const key = [source, target].sort().join('::')
  if (linkSet.has(key)) continue
  linkSet.add(key)
  fullGraph.links.push({ source, target })
}

fullGraph.nodes = [...mergedNodes.values()].sort((a, b) => b.degree - a.degree)

const entities = [...entityMap.values()]
  .map((entity) => ({
    ...entity,
    searchIndex: buildSearchIndex(entity),
  }))
  .sort((a, b) => b.degree - a.degree)

const coreSeeds = [
  '雅典',
  '斯巴达',
  '修昔底德',
  '伯里克利',
  '伯拉西达',
  '阿尔基比亚德',
  '尼基阿斯',
  '西西里远征',
  '安菲玻里',
  '伯罗奔尼撒战争',
  '德凯利亚',
]

const coreGraph = selectCoreGraph(fullGraph, coreSeeds, 1)

fs.writeFileSync(outputEntityPath, JSON.stringify(entities, null, 2))
fs.writeFileSync(outputFullGraphPath, JSON.stringify(fullGraph, null, 2))
fs.writeFileSync(outputCoreGraphPath, JSON.stringify(coreGraph, null, 2))

console.log(`写入实体 ${entities.length} 条`)
console.log(`写入核心图谱节点 ${coreGraph.nodes.length} 条，完整图谱节点 ${fullGraph.nodes.length} 条`)
