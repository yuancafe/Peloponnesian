import type { GraphData, GraphLinkRecord, GraphNodeRecord, NormalizedCategory } from '../types'

const SIMPLIFIED_CHAR_MAP: Record<string, string> = {
  亞: '亚',
  爾: '尔',
  羅: '罗',
  萊: '莱',
  凱: '凯',
  德: '德',
  敘: '叙',
  戰: '战',
  爭: '争',
  聯: '联',
  國: '国',
  約: '约',
  遠: '远',
  艦: '舰',
  義: '义',
  麥: '麦',
  諾: '诺',
  馬: '马',
  開: '开',
  烏: '乌',
  魯: '鲁',
  圖: '图',
  書: '书',
  譯: '译',
  專: '专',
  對: '对',
  外: '外',
  龍: '龙',
  龜: '龟',
  倫: '伦',
  鄉: '乡',
  關: '关',
  門: '门',
  陽: '阳',
  陰: '阴',
  隊: '队',
  鄰: '邻',
  醫: '医',
  風: '风',
  飛: '飞',
  黃: '黄',
  齊: '齐',
  魚: '鱼',
  鳳: '凤',
  鴉: '鸦',
  鶴: '鹤',
  萬: '万',
  與: '与',
  東: '东',
  絲: '丝',
  兩: '两',
  嚴: '严',
  個: '个',
  豐: '丰',
  為: '为',
  麗: '丽',
  舉: '举',
  麼: '么',
  樂: '乐',
  於: '于',
  雲: '云',
  親: '亲',
  億: '亿',
  從: '从',
  倉: '仓',
  儀: '仪',
  們: '们',
  價: '价',
  眾: '众',
  優: '优',
  會: '会',
  傳: '传',
  傷: '伤',
  偽: '伪',
  體: '体',
  餘: '余',
  來: '来',
  偵: '侦',
  側: '侧',
  儉: '俭',
  僑: '侨',
  僱: '雇',
  兒: '儿',
  內: '内',
  冊: '册',
  劃: '划',
  劉: '刘',
  劇: '剧',
  劍: '剑',
  動: '动',
  務: '务',
  勝: '胜',
  勞: '劳',
  勢: '势',
  勳: '勋',
  匯: '汇',
  區: '区',
  協: '协',
  華: '华',
  單: '单',
  盧: '卢',
  衛: '卫',
  卻: '却',
  厭: '厌',
  厲: '厉',
  參: '参',
  雙: '双',
  發: '发',
  變: '变',
  叢: '丛',
  吳: '吴',
  呂: '吕',
  員: '员',
  啟: '启',
  喚: '唤',
  喪: '丧',
  嗚: '呜',
  嘆: '叹',
  嘗: '尝',
  嘩: '哗',
  嚀: '咛',
  圍: '围',
  園: '园',
  圓: '圆',
  團: '团',
  場: '场',
  塊: '块',
  壞: '坏',
  壟: '垄',
  備: '备',
  復: '复',
  夢: '梦',
  奪: '夺',
  奮: '奋',
  奧: '奥',
  婦: '妇',
  媽: '妈',
  學: '学',
  寶: '宝',
  實: '实',
  寧: '宁',
  審: '审',
  寫: '写',
  寬: '宽',
  將: '将',
  導: '导',
  屆: '届',
  屬: '属',
  岡: '冈',
  島: '岛',
  峽: '峡',
  崙: '仑',
  嶼: '屿',
  嶺: '岭',
  嶽: '岳',
  巖: '岩',
  巔: '巅',
  幣: '币',
  幹: '干',
  庫: '库',
  廠: '厂',
  廣: '广',
  張: '张',
  彌: '弥',
  彎: '弯',
  彙: '汇',
  彥: '彦',
  後: '后',
  徵: '征',
  恆: '恒',
  恥: '耻',
  悅: '悦',
  惡: '恶',
  愛: '爱',
  慄: '栗',
  慘: '惨',
  慶: '庆',
  應: '应',
  懷: '怀',
  懶: '懒',
  戲: '戏',
  戶: '户',
  拋: '抛',
  挾: '挟',
  捨: '舍',
  掃: '扫',
  採: '采',
  揚: '扬',
  換: '换',
  擁: '拥',
  擇: '择',
  擔: '担',
  擠: '挤',
  擴: '扩',
  擺: '摆',
  擾: '扰',
  撫: '抚',
  撲: '扑',
  數: '数',
  斂: '敛',
  斃: '毙',
  斷: '断',
  時: '时',
  晉: '晋',
  晝: '昼',
  暈: '晕',
  曆: '历',
  曉: '晓',
  朧: '胧',
  條: '条',
  楊: '杨',
  極: '极',
  構: '构',
  槍: '枪',
  樓: '楼',
  標: '标',
  樣: '样',
  樞: '枢',
  橫: '横',
  檔: '档',
  檢: '检',
  檯: '台',
  歡: '欢',
  歲: '岁',
  歷: '历',
  歸: '归',
  殘: '残',
  殯: '殡',
  殲: '歼',
  氣: '气',
  澤: '泽',
  漢: '汉',
  灣: '湾',
  濟: '济',
  濤: '涛',
  濫: '滥',
  濱: '滨',
  灑: '洒',
  無: '无',
  煉: '炼',
  煙: '烟',
  煩: '烦',
  產: '产',
  畝: '亩',
  畫: '画',
  疇: '畴',
  療: '疗',
  瘋: '疯',
  皺: '皱',
  盜: '盗',
  盞: '盏',
  監: '监',
  盤: '盘',
  睜: '睁',
  矚: '瞩',
  礙: '碍',
  禮: '礼',
  禍: '祸',
  禪: '禅',
  種: '种',
  穀: '谷',
  積: '积',
  稱: '称',
  穩: '稳',
  競: '竞',
  築: '筑',
  簡: '简',
  簽: '签',
  籠: '笼',
  籤: '签',
  籲: '吁',
  粵: '粤',
  糧: '粮',
  糾: '纠',
  紀: '纪',
  紅: '红',
  紋: '纹',
  納: '纳',
  紙: '纸',
  級: '级',
  紛: '纷',
  紮: '扎',
  紹: '绍',
  終: '终',
  組: '组',
  結: '结',
  絕: '绝',
  統: '统',
  經: '经',
  綁: '绑',
  綜: '综',
  綱: '纲',
  維: '维',
  綻: '绽',
  綰: '绾',
  網: '网',
  緊: '紧',
  緒: '绪',
  線: '线',
  締: '缔',
  編: '编',
  緣: '缘',
  縣: '县',
  縱: '纵',
  總: '总',
  績: '绩',
  織: '织',
  繩: '绳',
  繪: '绘',
  繼: '继',
  續: '续',
  纜: '缆',
  罈: '坛',
  羈: '羁',
  翹: '翘',
  聖: '圣',
  聞: '闻',
  職: '职',
  肅: '肃',
  脅: '胁',
  脈: '脉',
  腦: '脑',
  腳: '脚',
  脫: '脱',
  脹: '胀',
  興: '兴',
  舊: '旧',
  艙: '舱',
  艱: '艰',
  藝: '艺',
  節: '节',
  莊: '庄',
  葉: '叶',
  蒼: '苍',
  蓋: '盖',
  製: '制',
  複: '复',
  襲: '袭',
  覺: '觉',
  覽: '览',
  觀: '观',
  計: '计',
  訂: '订',
  討: '讨',
  訓: '训',
  記: '记',
  許: '许',
  訴: '诉',
  診: '诊',
  註: '注',
  詠: '咏',
  詢: '询',
  試: '试',
  詩: '诗',
  誇: '夸',
  誠: '诚',
  說: '说',
  誰: '谁',
  課: '课',
  調: '调',
  諸: '诸',
  謀: '谋',
  議: '议',
  讓: '让',
  貝: '贝',
  貞: '贞',
  負: '负',
  財: '财',
  貢: '贡',
  責: '责',
  貫: '贯',
  販: '贩',
  貪: '贪',
  貴: '贵',
  貸: '贷',
  費: '费',
  貿: '贸',
  賂: '赂',
  資: '资',
  賈: '贾',
  賊: '贼',
  賓: '宾',
  賜: '赐',
  賦: '赋',
  賬: '账',
  質: '质',
  賴: '赖',
  贈: '赠',
  趙: '赵',
  趨: '趋',
  躍: '跃',
  輕: '轻',
  輸: '输',
  轄: '辖',
  辦: '办',
  農: '农',
  這: '这',
  進: '进',
  週: '周',
  遊: '游',
  運: '运',
  過: '过',
  還: '还',
  邁: '迈',
  迎: '迎',
  違: '违',
  連: '连',
  遲: '迟',
  遷: '迁',
  選: '选',
  遺: '遗',
  邏: '逻',
  郵: '邮',
  鄭: '郑',
  醜: '丑',
  釋: '释',
  錄: '录',
  鐘: '钟',
  鐵: '铁',
  鑑: '鉴',
  長: '长',
  閃: '闪',
  閉: '闭',
  閔: '闵',
  陣: '阵',
  陳: '陈',
  陸: '陆',
  隨: '随',
  際: '际',
  險: '险',
  雜: '杂',
  雞: '鸡',
  難: '难',
  電: '电',
  霧: '雾',
  靈: '灵',
  靜: '静',
  頁: '页',
  頂: '顶',
  頃: '顷',
  項: '项',
  順: '顺',
  須: '须',
  頌: '颂',
  頓: '顿',
  頗: '颇',
  領: '领',
  頜: '颌',
  頡: '颉',
  頤: '颐',
  頭: '头',
  頸: '颈',
  顆: '颗',
  題: '题',
  顏: '颜',
  類: '类',
  顧: '顾',
  顯: '显',
  飄: '飘',
  餓: '饿',
  館: '馆',
  馮: '冯',
  駐: '驻',
  駕: '驾',
  騎: '骑',
  騷: '骚',
  驅: '驱',
  驚: '惊',
  驗: '验',
  髒: '脏',
  髮: '发',
  鬥: '斗',
  鬧: '闹',
  點: '点',
  齋: '斋',
  齒: '齿',
  龐: '庞',
}

const CANONICAL_NAME_MAP: Record<string, string> = {
  亚西比德: '阿尔基比亚德',
  亚西比得: '阿尔基比亚德',
  阿尔基比阿德: '阿尔基比亚德',
  亚西比底: '阿尔基比亚德',
  安菲波利: '安菲玻里',
  安菲波里: '安菲玻里',
  安菲波里之战: '安菲玻里战役',
  安菲波里之役: '安菲玻里战役',
  安菲波里城: '安菲玻里',
  拉栖代梦: '斯巴达',
  拉栖代梦人: '斯巴达',
  伯罗奔尼撒联盟: '伯罗奔尼撒同盟',
  伯罗奔尼撒联邦: '伯罗奔尼撒同盟',
  帕德嫩神庙: '帕特农神庙',
  羊河口海战: '羊河之役',
  羊河口之战: '羊河之役',
  阿尔吉努萨伊海战: '阿吉纽西海战',
  阿尔吉努萨伊群岛: '阿吉纽西群岛',
}

const EXCLUDED_ENTITY_NAMES = new Set([
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

const POLIS_NAMES = new Set([
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

const PLACE_NAMES = new Set([
  '埃及',
])

export function canonicalizeEntityName(name: string): string {
  const simplified = [...name].map((char) => SIMPLIFIED_CHAR_MAP[char] ?? char).join('')
  return CANONICAL_NAME_MAP[simplified] ?? simplified
}

export function isExcludedEntityName(name: string): boolean {
  return EXCLUDED_ENTITY_NAMES.has(canonicalizeEntityName(name))
}

export function normalizeEntityCategory(
  rawCategory: string | undefined,
  rawName: string,
): NormalizedCategory {
  const name = canonicalizeEntityName(rawName)

  if (POLIS_NAMES.has(name)) {
    return 'Polis'
  }

  if (PLACE_NAMES.has(name)) {
    return 'Place'
  }

  if (name === '伯罗奔尼撒战争') {
    return 'Event'
  }

  if (name === '伯罗奔尼撒战争史') {
    return 'Document'
  }

  switch (rawCategory) {
    case 'Person':
    case 'Place':
    case 'Event':
    case 'Organization':
    case 'Concept':
    case 'Document':
    case 'Period':
    case 'Artifact':
      return rawCategory
    default:
      return 'Other'
  }
}

export function buildEntitySearchIndex(record: {
  id?: string
  name: string
  aliases: string[]
  summary: string
}): string {
  return [record.id ?? '', record.name, ...record.aliases, record.summary]
    .join(' ')
    .toLowerCase()
}

export function dedupeStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))]
}

export function normalizeDescription(description: string): string {
  return description
    .replaceAll('<SEP>', '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function selectCoreGraph(
  graph: GraphData,
  seeds: string[],
  depth = 1,
): GraphData {
  const canonicalSeeds = seeds.map(canonicalizeEntityName)
  const adjacency = new Map<string, Set<string>>()

  for (const link of graph.links) {
    const source = canonicalizeEntityName(link.source)
    const target = canonicalizeEntityName(link.target)
    if (!adjacency.has(source)) adjacency.set(source, new Set())
    if (!adjacency.has(target)) adjacency.set(target, new Set())
    adjacency.get(source)?.add(target)
    adjacency.get(target)?.add(source)
  }

  const visited = new Set(canonicalSeeds)
  let frontier = [...canonicalSeeds]

  for (let step = 0; step < depth; step += 1) {
    const nextFrontier: string[] = []
    for (const nodeId of frontier) {
      for (const neighbor of adjacency.get(nodeId) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          nextFrontier.push(neighbor)
        }
      }
    }
    frontier = nextFrontier
  }

  const nodes = graph.nodes.filter((node) => visited.has(canonicalizeEntityName(node.id)))
  const links = graph.links.filter((link) => {
    const source = canonicalizeEntityName(link.source)
    const target = canonicalizeEntityName(link.target)
    return visited.has(source) && visited.has(target)
  })

  return { nodes, links }
}

export function makeGraphNode(input: {
  id: string
  category: string | undefined
  degree: number
  aliases?: string[]
  summary?: string
}): GraphNodeRecord {
  const id = canonicalizeEntityName(input.id)
  return {
    id,
    label: id,
    name: id,
    category: normalizeEntityCategory(input.category, id),
    degree: input.degree,
    aliases: dedupeStrings((input.aliases ?? []).map(canonicalizeEntityName).filter((alias) => alias !== id)),
    summary: input.summary ?? '',
  }
}

export function makeGraphLink(source: string, target: string): GraphLinkRecord {
  return {
    source: canonicalizeEntityName(source),
    target: canonicalizeEntityName(target),
  }
}
