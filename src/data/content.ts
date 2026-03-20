import type {
  CampaignScenario,
  EntityPortrait,
  LoreEntry,
  MapLayerId,
  MapNode,
  MapRoute,
  TimelineEvent,
  WarPhase,
} from '../types'

export const heroStats = [
  { value: '前431年—前404年', label: '战争主线年份' },
  { value: '3 张分层地图', label: '城邦、人物、事件交替阅读' },
  { value: '18 回合', label: '三阵营章节战役' },
  { value: '390 节点', label: '核心战争关系图谱' },
]

export const mapLayerLabels: Record<MapLayerId, string> = {
  polities: '城邦 / 组织',
  people: '人物',
  events: '事件',
}

export const warPhases: WarPhase[] = [
  {
    id: 'prelude',
    title: '战前局势',
    range: '前446—前431',
    kicker: '恐惧先于长矛',
    summary:
      '三十年和约未能平息希腊世界。雅典凭借海军、贡赋与长墙扩大帝国压力，斯巴达则在伯罗奔尼撒同盟内守住旧秩序，科林斯、科西拉、波提狄亚与麦加拉争端不断把两极推向战争。',
    spark:
      '修昔底德指出，战争最深层原因是雅典力量增长引发斯巴达恐惧，而非单一导火索事件。',
    strategicShape:
      '雅典依海军、财富、港口与盟邦网络维系海上帝国；斯巴达倚赖陆军传统、同盟义务与希腊世界中的保守威望。',
    balance:
      '双方都相信自己还能掌控局势，因此谁也没有在恐惧最强的时候踩刹车。',
    outcome:
      '希腊世界进入长期消耗战准备状态，战争从一开始就注定不会只局限在阿提卡平原。',
    relatedEntities: ['雅典', '斯巴达', '伯里克利', '伯罗奔尼撒战争', '伯罗奔尼撒同盟'],
    markerIds: [],
    startYear: -446,
    endYear: -431,
  },
  {
    id: 'archidamian',
    title: '十年战争',
    range: '前431—前421',
    kicker: '长墙、瘟疫与北方命脉',
    summary:
      '阿基达马斯反复侵入阿提卡，伯里克利坚持守城与海上打击。瘟疫、密提林叛变、派罗斯与斯法克特里亚、伯拉西达北上安菲玻里，让局势在看似僵持中不断偏转。',
    spark:
      '伯里克利选择把帝国命运押在时间、财政与海军，而不是一场荣耀陆战；但瘟疫撕碎了这套计算。',
    strategicShape:
      '雅典用海军和长墙买时间，斯巴达用土地焚毁、盟友调动与边缘突袭寻找雅典体系的薄弱处。',
    balance:
      '局部战役的战略价值被放大，北方安菲玻里一线尤其威胁雅典的粮道、矿区与帝国威望。',
    outcome:
      '伯拉西达与克里昂战死后，双方疲惫求和，尼基阿斯和约出现，但战局真正的裂痕并未弥合。',
    relatedEntities: ['伯里克利', '伯拉西达', '安菲玻里', '派罗斯战役', '修昔底德'],
    markerIds: [],
    startYear: -431,
    endYear: -421,
  },
  {
    id: 'uneasy-peace',
    title: '脆弱和平',
    range: '前421—前416',
    kicker: '和约只是换气',
    summary:
      '尼基阿斯和约没有结束争霸，只是把战场从全面进攻转移到盟约争夺、威望竞争与政治操盘。曼提尼亚战役与弥罗斯危机证明，雅典和斯巴达都在和平期为下一轮战争积累条件。',
    spark:
      '和平期最危险之处，在于每一方都把停战视作重排阵营、恢复元气和试探对手的窗口。',
    strategicShape:
      '雅典借阿尔基比亚德的外交野心四处重组盟约，斯巴达则试图把陆军威望重新焊回希腊大陆。',
    balance:
      '看似没有大规模会战，但每一次选边站都会决定西西里远征前的战略地貌。',
    outcome:
      '弥罗斯对话让雅典的帝国逻辑暴露无遗，希腊世界逐渐意识到：下一轮将不只是续战，而是升级。',
    relatedEntities: ['尼基阿斯和约', '阿尔基比亚德', '弥罗斯对话', '曼提尼亚', '斯巴达'],
    markerIds: [],
    startYear: -421,
    endYear: -416,
  },
  {
    id: 'sicilian-expedition',
    title: '西西里远征',
    range: '前415—前413',
    kicker: '荣耀之航坠入深渊',
    summary:
      '雅典试图以史无前例的远征军重塑西地中海格局，却在神像案、阿尔基比亚德出走、指挥迟疑、港湾反封锁与叙拉古顽抗中把帝国信心彻底押碎。',
    spark:
      '西西里远征不只是一次军事冒险，而是雅典试图证明自己仍能继续扩张、继续定义希腊秩序的总赌局。',
    strategicShape:
      '远征的胜败取决于港湾控制、补给线、同盟响应、陆海协同和指挥统一，而叙拉古恰恰把每一个环节都变成了陷阱。',
    balance:
      '一旦西西里远征失败，雅典失去的不只是舰队，还包括“帝国依然不可击败”的心理护城河。',
    outcome:
      '西西里军全灭后，希腊世界的力量天平急剧倾斜，斯巴达和波斯都看到了绞杀雅典的真实时机。',
    relatedEntities: ['西西里远征', '阿尔基比亚德', '尼基阿斯', '叙拉古城', '吉利普斯'],
    markerIds: [],
    startYear: -415,
    endYear: -413,
  },
  {
    id: 'ionian-war',
    title: '德凯利亚与伊奥尼亚战争',
    range: '前413—前404',
    kicker: '帝国坠海',
    summary:
      '斯巴达在德凯利亚建立前进基地，波斯财政介入海战重建，雅典在政变、财困与盟邦叛离中苦撑。最终羊河之役几乎摧毁全部希望，长墙倒下，战争结束。',
    spark:
      '谁能把陆上封锁、海军建制、波斯金钱和盟友离心连接成一整套消耗系统，谁就能决定最后的胜者。',
    strategicShape:
      '斯巴达学会了海战，雅典则被迫在内乱与外部封锁下用残存舰队守住粮道和合法性。',
    balance:
      '最后阶段的主角不再是单一会战，而是财政、粮食、忠诚度和政治信心的系统性塌陷。',
    outcome:
      '羊河之役与雅典投降标志着古典希腊世界从两极争霸走向新的不稳定时代。',
    relatedEntities: ['德凯利亚', '波斯', '羊河之役', '莱山德', '雅典'],
    markerIds: [],
    startYear: -413,
    endYear: -404,
  },
]

export const mapNodes: MapNode[] = [
  { id: 'athens-polis', entityId: '雅典', label: '雅典', left: '62%', top: '49%', layer: 'polities', icon: 'capital', visibleFromYear: -446, visibleToYear: -404, relatedPhaseIds: ['prelude', 'archidamian', 'uneasy-peace', 'sicilian-expedition', 'ionian-war'], alignment: 'right', summary: '海上帝国与民主政治中心。' },
  { id: 'sparta-polis', entityId: '斯巴达', label: '斯巴达', left: '46%', top: '56%', layer: 'polities', icon: 'capital', visibleFromYear: -446, visibleToYear: -404, relatedPhaseIds: ['prelude', 'archidamian', 'uneasy-peace', 'sicilian-expedition', 'ionian-war'], alignment: 'left', summary: '伯罗奔尼撒同盟盟主。' },
  { id: 'corinth-polis', entityId: '科林斯', label: '科林斯', left: '55%', top: '52%', layer: 'polities', icon: 'capital', visibleFromYear: -446, visibleToYear: -404, relatedPhaseIds: ['prelude', 'archidamian', 'uneasy-peace'], alignment: 'top', summary: '战前外交争端中的关键煽动者。' },
  { id: 'thebes-polis', entityId: '底比斯', label: '底比斯', left: '58%', top: '44%', layer: 'polities', icon: 'capital', visibleFromYear: -446, visibleToYear: -404, relatedPhaseIds: ['prelude', 'archidamian'], alignment: 'left', summary: '波奥提亚强邦，与斯巴达紧密协同。' },
  { id: 'argos-polis', entityId: '阿尔戈斯', label: '阿尔戈斯', left: '49%', top: '56%', layer: 'polities', icon: 'capital', visibleFromYear: -421, visibleToYear: -404, relatedPhaseIds: ['uneasy-peace'], alignment: 'left', summary: '和平期中的关键外交摆动者。' },
  { id: 'amphipolis-polis', entityId: '安菲玻里', label: '安菲玻里', left: '52%', top: '15%', layer: 'polities', icon: 'frontier', visibleFromYear: -431, visibleToYear: -404, relatedPhaseIds: ['archidamian'], alignment: 'right', summary: '雅典北方命脉。' },
  { id: 'syracuse-polis', entityId: '叙拉古城', label: '叙拉古', left: '13%', top: '82%', layer: 'polities', icon: 'capital', visibleFromYear: -415, visibleToYear: -404, relatedPhaseIds: ['sicilian-expedition'], alignment: 'right', summary: '西西里战争的枢纽。' },
  { id: 'miletus-polis', entityId: '米利都', label: '米利都', left: '86%', top: '51%', layer: 'polities', icon: 'frontier', visibleFromYear: -412, visibleToYear: -404, relatedPhaseIds: ['ionian-war'], alignment: 'left', summary: '伊奥尼亚战线的重要海岸据点。' },
  { id: 'lesbos-polis', entityId: '米提列涅', label: '米提列涅', left: '80%', top: '35%', layer: 'polities', icon: 'frontier', visibleFromYear: -428, visibleToYear: -404, relatedPhaseIds: ['archidamian', 'ionian-war'], alignment: 'left', summary: '密提林叛变让帝国治理问题集中爆发。' },

  { id: 'pericles-person', entityId: '伯里克利', label: '伯里克利', left: '63%', top: '50%', layer: 'people', icon: 'person', visibleFromYear: -443, visibleToYear: -429, relatedPhaseIds: ['prelude', 'archidamian'], alignment: 'right', summary: '守城与海军战略的设计者。' },
  { id: 'thucydides-person', entityId: '修昔底德', label: '修昔底德', left: '53%', top: '17%', layer: 'people', icon: 'person', visibleFromYear: -424, visibleToYear: -399, relatedPhaseIds: ['archidamian', 'sicilian-expedition', 'ionian-war'], alignment: 'right', summary: '从流放中观察战争的历史学家。' },
  { id: 'brasidas-person', entityId: '伯拉西达', label: '伯拉西达', left: '51%', top: '18%', layer: 'people', icon: 'person', visibleFromYear: -424, visibleToYear: -422, relatedPhaseIds: ['archidamian'], alignment: 'right', summary: '北线奇兵与斯巴达魅力将领。' },
  { id: 'archidamus-person', entityId: '阿基达马斯', label: '阿基达马斯', left: '46%', top: '55%', layer: 'people', icon: 'person', visibleFromYear: -431, visibleToYear: -427, relatedPhaseIds: ['archidamian'], alignment: 'left', summary: '斯巴达国王，阿提卡入侵的主导者。' },
  { id: 'cleon-person', entityId: '克里昂', label: '克里昂', left: '61%', top: '48%', layer: 'people', icon: 'person', visibleFromYear: -428, visibleToYear: -422, relatedPhaseIds: ['archidamian'], alignment: 'left', summary: '激进民主派政治家。' },
  { id: 'alcibiades-person', entityId: '阿尔基比亚德', label: '阿尔基比亚德', left: '67%', top: '54%', layer: 'people', icon: 'person', visibleFromYear: -420, visibleToYear: -404, relatedPhaseIds: ['uneasy-peace', 'sicilian-expedition', 'ionian-war'], alignment: 'right', summary: '游走于阵营间的高风险政治天才。' },
  { id: 'nicias-person', entityId: '尼基阿斯', label: '尼基阿斯', left: '61%', top: '51%', layer: 'people', icon: 'person', visibleFromYear: -421, visibleToYear: -413, relatedPhaseIds: ['uneasy-peace', 'sicilian-expedition'], alignment: 'left', summary: '谨慎、迟疑，却承担了西西里灾难。' },
  { id: 'gylippus-person', entityId: '吉利普斯', label: '吉利普斯', left: '14%', top: '80%', layer: 'people', icon: 'person', visibleFromYear: -414, visibleToYear: -413, relatedPhaseIds: ['sicilian-expedition'], alignment: 'left', summary: '让叙拉古守势彻底成形的斯巴达顾问。' },
  { id: 'lysander-person', entityId: '莱山德', label: '莱山德', left: '82%', top: '20%', layer: 'people', icon: 'person', visibleFromYear: -407, visibleToYear: -404, relatedPhaseIds: ['ionian-war'], alignment: 'bottom', summary: '在羊河之役中完成致命围猎。' },

  { id: 'potidaea-event', entityId: '波提狄亚', label: '波提狄亚', left: '54%', top: '25%', layer: 'events', icon: 'siege', visibleFromYear: -432, visibleToYear: -430, relatedPhaseIds: ['prelude'], alignment: 'right', summary: '战前秩序崩裂的信号。' },
  { id: 'plataea-event', entityId: '普拉提亚', label: '普拉提亚', left: '57%', top: '46%', layer: 'events', icon: 'siege', visibleFromYear: -431, visibleToYear: -427, relatedPhaseIds: ['archidamian'], alignment: 'left', summary: '围城战揭开全面战争的残酷尺度。' },
  { id: 'pylos-event', entityId: '派罗斯战役', label: '派罗斯', left: '38%', top: '59%', layer: 'events', icon: 'naval', visibleFromYear: -425, visibleToYear: -425, relatedPhaseIds: ['archidamian'], alignment: 'left', summary: '斯巴达战俘危机震动希腊。' },
  { id: 'amphipolis-event', entityId: '安菲玻里战役', label: '安菲玻里', left: '52%', top: '15%', layer: 'events', icon: 'battle', visibleFromYear: -424, visibleToYear: -422, relatedPhaseIds: ['archidamian'], alignment: 'right', summary: '伯拉西达与克里昂共同倒下。' },
  { id: 'mantinea-event', entityId: '曼提尼亚', label: '曼提尼亚', left: '47%', top: '54%', layer: 'events', icon: 'battle', visibleFromYear: -418, visibleToYear: -418, relatedPhaseIds: ['uneasy-peace'], alignment: 'left', summary: '和平期里最具威望意义的会战。' },
  { id: 'melos-event', entityId: '弥罗斯对话', label: '弥罗斯', left: '72%', top: '70%', layer: 'events', icon: 'siege', visibleFromYear: -416, visibleToYear: -416, relatedPhaseIds: ['uneasy-peace'], alignment: 'top', summary: '帝国现实主义的极端表白。' },
  { id: 'sicily-event', entityId: '西西里远征', label: '西西里远征', left: '13%', top: '82%', layer: 'events', icon: 'naval', visibleFromYear: -415, visibleToYear: -413, relatedPhaseIds: ['sicilian-expedition'], alignment: 'right', summary: '雅典帝国的总赌局。' },
  { id: 'decelea-event', entityId: '德凯利亚', label: '德凯利亚', left: '61%', top: '47%', layer: 'events', icon: 'frontier', visibleFromYear: -413, visibleToYear: -404, relatedPhaseIds: ['sicilian-expedition', 'ionian-war'], alignment: 'right', summary: '长期扼住雅典腹地的前进基地。' },
  { id: 'miletus-event', entityId: '波斯', label: '波斯资助', left: '87%', top: '50%', layer: 'events', icon: 'naval', visibleFromYear: -412, visibleToYear: -404, relatedPhaseIds: ['ionian-war'], alignment: 'left', summary: '外部财政让战争进入新阶段。' },
  { id: 'aeospotami-event', entityId: '羊河之役', label: '羊河', left: '82%', top: '20%', layer: 'events', icon: 'naval', visibleFromYear: -405, visibleToYear: -404, relatedPhaseIds: ['ionian-war'], alignment: 'bottom', summary: '雅典最后的海军崩塌点。' },
]

export const mapRoutes: MapRoute[] = [
  {
    id: 'athenian-sea-arc',
    layer: 'timeline',
    points: [
      { left: '62%', top: '49%' },
      { left: '72%', top: '61%' },
      { left: '58%', top: '76%' },
      { left: '13%', top: '82%' },
    ],
    visibleFromYear: -415,
    visibleToYear: -413,
    relatedEntityIds: ['西西里远征', '雅典'],
  },
  {
    id: 'spartan-north-drive',
    layer: 'timeline',
    points: [
      { left: '46%', top: '56%' },
      { left: '49%', top: '43%' },
      { left: '52%', top: '15%' },
    ],
    visibleFromYear: -424,
    visibleToYear: -422,
    relatedEntityIds: ['伯拉西达', '安菲玻里'],
  },
  {
    id: 'ionian-pressure-line',
    layer: 'timeline',
    points: [
      { left: '61%', top: '47%' },
      { left: '74%', top: '42%' },
      { left: '87%', top: '50%' },
      { left: '82%', top: '20%' },
    ],
    visibleFromYear: -413,
    visibleToYear: -404,
    relatedEntityIds: ['德凯利亚', '波斯', '羊河之役'],
  },
]

export const timelineEvents: TimelineEvent[] = [
  { id: 'war-begins', year: -431, title: '战争爆发', summary: '斯巴达与雅典正式进入长期战争，阿提卡、爱琴海与边缘盟邦成为同一张棋盘。', relatedEntityIds: ['雅典', '斯巴达', '伯罗奔尼撒战争'], nodeIds: ['athens-polis', 'sparta-polis'] },
  { id: 'plague', year: -430, title: '雅典瘟疫', summary: '瘟疫撕裂长墙内的人口与信心，伯里克利战略从理性计算变成残酷赌局。', relatedEntityIds: ['雅典', '伯里克利'], nodeIds: ['athens-polis', 'pericles-person'] },
  { id: 'pylos', year: -425, title: '派罗斯与斯法克特里亚', summary: '雅典俘获斯巴达精锐，斯巴达不败神话第一次裂开。', relatedEntityIds: ['派罗斯战役', '斯巴达', '雅典'], nodeIds: ['pylos-event'] },
  { id: 'amphipolis', year: -424, title: '伯拉西达北上', summary: '安菲玻里失守重击雅典北方命脉，也把修昔底德推入漫长流放。', relatedEntityIds: ['伯拉西达', '安菲玻里', '修昔底德'], nodeIds: ['amphipolis-event', 'thucydides-person'] },
  { id: 'peace', year: -421, title: '尼基阿斯和约', summary: '双方停火，但希腊世界只是短暂换气，谁都没有真正放下野心。', relatedEntityIds: ['尼基阿斯和约', '尼基阿斯'], nodeIds: ['nicias-person'] },
  { id: 'melos', year: -416, title: '弥罗斯对话', summary: '帝国与自由的语言在小岛上发生正面冲撞，雅典的统治逻辑被赤裸裸说出。', relatedEntityIds: ['弥罗斯对话', '雅典'], nodeIds: ['melos-event'] },
  { id: 'sicily', year: -415, title: '西西里远征出航', summary: '雅典把希望、财富与傲慢一起送向叙拉古港外。', relatedEntityIds: ['西西里远征', '阿尔基比亚德', '尼基阿斯'], nodeIds: ['sicily-event', 'alcibiades-person', 'nicias-person'] },
  { id: 'decelea', year: -413, title: '德凯利亚与西西里覆没', summary: '一边是叙拉古港内的惨败，一边是斯巴达把刀子钉进雅典腹地。', relatedEntityIds: ['德凯利亚', '西西里远征', '斯巴达'], nodeIds: ['decelea-event', 'syracuse-polis'] },
  { id: 'aeospotami', year: -405, title: '羊河之役', summary: '莱山德在羊河摧毁雅典残余海军，长墙的命运已经被写下。', relatedEntityIds: ['羊河之役', '莱山德', '雅典'], nodeIds: ['aeospotami-event', 'lysander-person'] },
  { id: 'surrender', year: -404, title: '雅典投降', summary: '长墙被拆，雅典帝国终结，希腊世界进入新的权力失衡期。', relatedEntityIds: ['雅典', '斯巴达', '伯罗奔尼撒战争'], nodeIds: ['athens-polis', 'sparta-polis'] },
]

const portraits: Record<string, EntityPortrait> = {
  修昔底德: { src: '/portraits/thucydides.jpg', alt: '修昔底德雕像', credit: 'Wikimedia Commons / Thucydides_pushkin01.jpg' },
  伯里克利: { src: '/portraits/pericles.jpg', alt: '伯里克利雕像', credit: 'Wikimedia Commons / Pericles_Pio-Clementino_Inv269_n2.jpg' },
  阿尔基比亚德: { src: '/portraits/alcibiades.jpg', alt: '阿尔基比亚德绘画细节', credit: 'Wikimedia Commons / Detail_of_Alcibiades_from_Alcibiades_Being_Taught_by_Socrates' },
  伯拉西达: { src: '/portraits/brasidas.jpg', alt: '伯拉西达相关历史插图', credit: 'Wikimedia Commons / He_became_a_target_for_every_arrow_(cropped).jpg' },
  尼基阿斯: { src: '/portraits/nicias.jpg', alt: '尼基阿斯版画', credit: 'Wikimedia Commons / Nicias, p 105 (World’s Famous Orations Vol 1)' },
  莱山德: { src: '/portraits/lysander.jpg', alt: '莱山德石版画', credit: 'Wikimedia Commons / Lysander_outside_the_walls_of_Athens_19th_century_lithograph.jpg' },
  阿基达马斯: { src: '/portraits/archidamus.jpg', alt: '阿基达马斯木刻', credit: 'Wikimedia Commons / Archidamos_II_1629_woodprint.jpg' },
  克里昂: { src: '/portraits/cleon.jpg', alt: '克里昂版画', credit: 'Wikimedia Commons / 76_CLEON_(2).jpg' },
}

export const featuredEntityIds = [
  '修昔底德',
  '伯里克利',
  '阿尔基比亚德',
  '伯拉西达',
  '尼基阿斯',
  '莱山德',
]

export const syntheticEntities = [
  {
    id: '羊河之役',
    name: '羊河之役',
    aliases: ['羊河', 'Aegospotami'],
    category: 'Event' as const,
    degree: 18,
    summary: '前405年，莱山德在羊河附近几乎摧毁了雅典全部残余舰队，雅典从此失去海上生命线。',
    description:
      '羊河之役发生于前405年，是伯罗奔尼撒战争最后阶段最致命的海战。莱山德耐心等待雅典舰队松懈，再突然封死其退路，几乎一举毁灭雅典残余海军。\n\n从这一刻起，雅典不再有能力保护粮道、维持帝国或继续拖延战争。长墙的倒塌与投降，几乎都在羊河之役结束时就已经写定。',
    relatedEntities: ['莱山德', '雅典', '斯巴达', '伯罗奔尼撒战争'],
    relatedPhaseIds: ['ionian-war'],
    searchIndex: '羊河之役 羊河 aegospotami 莱山德 雅典 最后海战',
  },
]

export const entityEnhancements: Record<
  string,
  {
    portrait?: EntityPortrait
    summary?: string
    descriptionAppend?: string
  }
> = {
  修昔底德: {
    portrait: portraits['修昔底德'],
    summary: '在流放中写出《伯罗奔尼撒战争史》的历史学家，他关心的不是一时掌声，而是权力、恐惧与判断失误的反复重演。',
  },
  伯里克利: {
    portrait: portraits['伯里克利'],
    summary: '雅典民主盛期最有威望的政治领袖，也是守城、保舰、拒绝陆战的战略设计者。',
  },
  阿尔基比亚德: {
    portrait: portraits['阿尔基比亚德'],
    summary: '魅力、野心与背叛感并存的政治明星，他的每一次转向都在重写战争地理。',
  },
  伯拉西达: {
    portrait: portraits['伯拉西达'],
    summary: '斯巴达少见的快速机动型将领，凭借宽大与勇武在北线撬动雅典命脉。',
  },
  尼基阿斯: {
    portrait: portraits['尼基阿斯'],
    summary: '谨慎而保守的雅典将军，既是和约的代名词，也背负了西西里远征的灾难结局。',
  },
  莱山德: {
    portrait: portraits['莱山德'],
    summary: '斯巴达后期的关键海军指挥官，他在羊河之役完成对雅典的最后围猎。',
  },
  阿基达马斯: {
    portrait: portraits['阿基达马斯'],
    summary: '战争初期主导阿提卡入侵的斯巴达国王，谨慎却不可避免地把战争推入长期化。',
  },
  克里昂: {
    portrait: portraits['克里昂'],
    summary: '激进民主派领袖与强硬政策代表人物，在修昔底德笔下经常作为“失衡政治语言”的样本。',
  },
}

export const thucydidesLore: LoreEntry[] = [
  {
    id: 'who',
    eyebrow: '作者其人',
    title: '修昔底德既是观察者，也是被战争流放的人',
    body:
      '他不是站在书斋门口写战争的人。前424年安菲玻里失守后，修昔底德被放逐二十年；正是这段脱离雅典政治中心的经历，使他得以跨越阵营收集材料，看到双方如何动员、恐惧、说服与背叛。',
    emphasis:
      '这部书有重量，不是因为它离政治很远，而是因为它写在政治失败之后，仍然不肯放弃追问：一个城邦为何会在自认理性时走向灾难。',
    relatedEntities: ['修昔底德', '安菲玻里', '雅典', '斯巴达'],
  },
  {
    id: 'why-write',
    eyebrow: '写作动机',
    title: '他要留下的是“永恒财富”，不是当时就散场的演说',
    body:
      '修昔底德明确说，他不为讨好同时代听众而写作。他相信，只要人性相似，权力、荣誉、恐惧、利益与误判就会在不同时代以不同形式再次出现。',
    emphasis:
      '所以《伯罗奔尼撒战争史》写的从来不只是战争经过，更是政治共同体在压力之下如何丧失尺度，又如何用语言为自己的决定寻找理由。',
    relatedEntities: ['修昔底德', '伯罗奔尼撒战争史', '伯罗奔尼撒战争'],
  },
  {
    id: 'method',
    eyebrow: '史学方法',
    title: '他的核心不是传奇，而是因果、结构与判断',
    body:
      '修昔底德反复区分借口与真正原因，也会交代传闻的可疑性。在他笔下，瘟疫、密提林、弥罗斯、西西里远征和政变都不是孤立事件，而是制度、资源、领袖判断与群体情绪共同塑成的结果。',
    emphasis:
      '这让他成为后世现实主义政治分析的源头之一：战争不是纯粹激情的燃烧，而是被财政、海军、联盟和话语共同塑形的系统。',
    relatedEntities: ['修昔底德', '瘟疫', '西西里远征', '弥罗斯对话'],
  },
  {
    id: 'legacy',
    eyebrow: '影响至今',
    title: '修昔底德真正留下的，不只是所谓“陷阱”',
    body:
      '现代人常用“修昔底德陷阱”概括强国崛起引发守成者恐惧，但如果只记住这一个标签，就会错过他更复杂的洞见：恐惧会改变语言，语言会改变选择，而选择最终会改变制度与世界。',
    emphasis:
      '阅读修昔底德，不是为了宣告战争必然，而是为了看见：战争前、战争中和战争后，人总在为自己的决定寻找足够漂亮的理由。',
    relatedEntities: ['修昔底德', '雅典', '斯巴达', '伯里克利'],
  },
]

function makeChoice(
  id: string,
  label: string,
  detail: string,
  effects: CampaignScenario['turns'][number]['choices'][number]['effects'],
  relatedEntities: string[],
) {
  return { id, label, detail, effects, relatedEntities }
}

export const campaignScenarios: CampaignScenario[] = [
  {
    id: 'athens',
    factionName: '雅典海上帝国',
    banner: '长墙、舰队、贡赋与民意',
    summary: '你要在帝国自保、财政承压和民主激情之间维持一台仍能运转的战争机器。',
    doctrine: '雅典的真正武器不是勇气本身，而是港口、船、钱、盟邦与时间。',
    victoryLens: '稳住海军与粮道，同时避免偏离度过快失控。',
    turns: [
      { id: 'athens-431', year: 431, title: '伯里克利的第一年', brief: '斯巴达踏入阿提卡，乡村燃烧。你必须决定雅典是否坚持原始战略。', objectives: ['守住长墙内秩序', '避免陆战冲动', '保持海军机动'], historicalEvent: '史实中雅典拒绝在陆上与斯巴达决战，而是靠长墙与舰队扛住第一轮冲击。', divergenceHint: '你越早脱离伯里克利路线，雅典越可能在战争初期就失去战略优势。', relatedEntities: ['伯里克利', '雅典', '斯巴达'], choices: [makeChoice('hold-walls', '固守长墙', '坚持伯里克利路线，以海军和财政拖住对手。', { treasury: -6, navalPower: 4, supplies: -5, morale: -2, historicalDivergence: 2 }, ['雅典', '伯里克利']), makeChoice('raid-harder', '扩大沿海袭掠', '用更大规模海上打击回应阿提卡被焚。', { treasury: -12, navalPower: 8, morale: 4, supplies: -8, historicalDivergence: 7 }, ['雅典']), makeChoice('seek-land-battle', '出城求战', '响应民意，以一场陆战证明雅典并不畏惧。', { landPower: -10, navalPower: -6, morale: 6, historicalDivergence: 18 }, ['雅典', '斯巴达'])] },
      { id: 'athens-430', year: 430, title: '瘟疫之城', brief: '长墙内的瘟疫让士气、秩序与判断同时崩坏。', objectives: ['阻止秩序崩解', '保证舰队仍能行动', '维持对伯里克利战略的最低信任'], historicalEvent: '史实中瘟疫重创雅典人口与信心，伯里克利的理性战略被情绪化压力严重侵蚀。', divergenceHint: '你越急着用激烈行动止血，越可能提前把帝国拖入更深的内耗。', relatedEntities: ['雅典', '伯里克利', '瘟疫'], choices: [makeChoice('ration-discipline', '严格配给与纪律', '压住城内恐慌，让军政机器继续运转。', { morale: -4, supplies: 4, treasury: -4, historicalDivergence: 3 }, ['雅典']), makeChoice('symbolic-expedition', '发动象征性远征', '用一次可见行动换回一些民心与自信。', { navalPower: 3, morale: 5, treasury: -8, historicalDivergence: 8 }, ['雅典']), makeChoice('appease-assembly', '迎合公民大会', '为了安抚焦躁民意而改变战略节奏。', { morale: 3, allyLoyalty: -4, historicalDivergence: 12 }, ['雅典', '伯里克利'])] },
      { id: 'athens-428', year: 428, title: '密提林与帝国尺度', brief: '叛变爆发，雅典必须决定如何在恐惧中维持帝国秩序。', objectives: ['震慑盟邦', '避免帝国失控', '不要让报复吞掉长期统治能力'], historicalEvent: '史实中雅典在密提林问题上先激烈后回撤，显示民主冲动与修正并存。', divergenceHint: '极端恐怖与过度宽宥都会放大帝国治理风险。', relatedEntities: ['密提林叛变', '克里昂', '戴奥多都斯'], choices: [makeChoice('limited-punishment', '有限惩罚', '惩处主谋，保留长期统治空间。', { allyLoyalty: 6, morale: 1, treasury: -3, historicalDivergence: 3 }, ['密提林叛变']), makeChoice('terror-example', '制造恐惧样板', '以极端方式警告所有盟邦。', { morale: 5, allyLoyalty: -9, supplies: -4, historicalDivergence: 16 }, ['克里昂']), makeChoice('fleet-pressure', '舰队巡航威慑', '把裁决压后，用海上威慑换时间。', { treasury: -9, navalPower: 4, allyLoyalty: 2, historicalDivergence: 8 }, ['雅典'])] },
      { id: 'athens-425', year: 425, title: '派罗斯机会窗口', brief: '斯巴达出现难得破口，你能把局部胜利变成谈判筹码，还是扩大战果？', objectives: ['评估战俘与威望价值', '不要过度消耗海军', '决定谈还是逼'], historicalEvent: '派罗斯与斯法克特里亚让雅典短暂占据心理上风。', divergenceHint: '你若把胜利转化为结构性优势，战争会被重新定速。', relatedEntities: ['派罗斯战役', '斯巴达', '雅典'], choices: [makeChoice('leverage-captives', '以战俘换谈判空间', '用稀有优势争取更有利的停火。', { treasury: 3, morale: 3, historicalDivergence: 4 }, ['派罗斯战役']), makeChoice('press-advantage', '继续压迫斯巴达', '把罕见优势继续推大。', { navalPower: -3, morale: 7, allyLoyalty: 5, historicalDivergence: 10 }, ['雅典', '斯巴达']), makeChoice('secure-fronts', '先稳固外围战线', '不急于冒进，把优势转成更稳的边缘控制。', { supplies: 5, allyLoyalty: 4, treasury: -4, historicalDivergence: 6 }, ['雅典'])] },
      { id: 'athens-415', year: 415, title: '西西里总赌局', brief: '阿尔基比亚德鼓动远征，尼基阿斯警告风险。帝国是否继续向外伸展，取决于你。', objectives: ['判断扩张与过载', '保留海军骨架', '避免一次远征掏空本土'], historicalEvent: '史实中雅典全力远征西西里，最终遭到灾难性失败。', divergenceHint: '任何对远征规模的改变，都会改写雅典后期的承压能力。', relatedEntities: ['西西里远征', '阿尔基比亚德', '尼基阿斯'], choices: [makeChoice('grand-expedition', '全规模远征', '把荣耀与风险一起押上。', { treasury: -18, navalPower: -8, morale: 10, supplies: -12, historicalDivergence: 6 }, ['西西里远征', '阿尔基比亚德']), makeChoice('limited-expedition', '有限远征', '测试西西里局势，保留更多主力。', { treasury: -10, navalPower: -2, morale: 3, allyLoyalty: -2, historicalDivergence: 13 }, ['西西里远征', '尼基阿斯']), makeChoice('cancel-expedition', '取消远征', '把资源留给爱琴海与本土。', { treasury: 6, navalPower: 5, morale: -8, historicalDivergence: 22 }, ['雅典', '西西里远征'])] },
      { id: 'athens-405', year: 405, title: '最后舰队', brief: '伊奥尼亚、德凯利亚与内乱后，雅典只剩最后一线海上希望。', objectives: ['保住粮道', '判断是否冒险出击', '尽量避免总覆没'], historicalEvent: '史实中雅典在羊河之役几乎损失全部舰队，战后很快投降。', divergenceHint: '到战争末期，每一个判断失误都会被放大成无法挽回的结构性崩塌。', relatedEntities: ['羊河之役', '莱山德', '雅典'], choices: [makeChoice('hold-discipline', '保持谨慎纪律', '不给莱山德寻找瞬时破绽的机会。', { navalPower: 2, morale: -2, historicalDivergence: 10 }, ['羊河之役']), makeChoice('aggressive-sortie', '主动寻求决战', '用一次冒险出击换取反转可能。', { navalPower: -12, morale: 5, historicalDivergence: 17 }, ['莱山德', '雅典']), makeChoice('save-remnants', '优先保全残余力量', '承认局势艰难，尽量留住可以谈判的筹码。', { morale: -6, supplies: 3, treasury: 2, historicalDivergence: 12 }, ['雅典'])] },
    ],
  },
  {
    id: 'sparta',
    factionName: '斯巴达同盟',
    banner: '陆军威势、盟友动员与迟来的海军化',
    summary: '你要把一个擅长陆战的传统强邦，慢慢改造成真正能击倒雅典帝国的战争机器。',
    doctrine: '光烧阿提卡的田地不够，你必须学会如何持续扼住雅典的系统而不是一时羞辱它。',
    victoryLens: '稳住同盟、积累陆上压迫，并在后期建成足以摧毁雅典的海军。',
    turns: [
      { id: 'sparta-431', year: 431, title: '第一次侵入阿提卡', brief: '传统入侵能制造压力，却未必足够击倒雅典。', objectives: ['保持同盟整齐', '让雅典付出成本', '避免战略想象力不足'], historicalEvent: '史实中斯巴达反复入侵阿提卡，却未迫使雅典出城决战。', divergenceHint: '如果斯巴达更早转向长期封锁与海军化，战争节奏会明显改变。', relatedEntities: ['斯巴达', '阿基达马斯', '雅典'], choices: [makeChoice('seasonal-invasion', '维持传统侵入', '按旧节奏进军，让盟友跟得上。', { landPower: 4, treasury: -3, morale: 2, historicalDivergence: 2 }, ['阿基达马斯']), makeChoice('pressure-allies', '加压盟友总动员', '短期压迫更强，但同盟疲惫会更快显现。', { landPower: 8, allyLoyalty: -9, treasury: -5, historicalDivergence: 10 }, ['伯罗奔尼撒同盟']), makeChoice('study-sea-war', '提前筹划海军', '减少短期入侵，把资源慢慢引向未来海战。', { navalPower: 8, treasury: -10, historicalDivergence: 14 }, ['斯巴达'])] },
      { id: 'sparta-425', year: 425, title: '派罗斯震荡', brief: '斯巴达精锐被困，威望受损。你要不要为一次耻辱改变整个战争思路？', objectives: ['评估谈判与复仇', '处理威望裂口', '重新定义对雅典的节奏'], historicalEvent: '派罗斯让斯巴达第一次必须面对“战败后怎么办”。', divergenceHint: '如果你把这次打击当成系统变革的信号，斯巴达会更早进入下一阶段。', relatedEntities: ['派罗斯战役', '斯巴达', '雅典'], choices: [makeChoice('seek-pragmatic-truce', '现实谈判', '优先止损与稳住威望。', { treasury: 2, morale: -2, historicalDivergence: 5 }, ['派罗斯战役']), makeChoice('double-down-land', '更强硬地回到陆地施压', '试图用传统优势抹掉羞辱。', { landPower: 5, allyLoyalty: -3, historicalDivergence: 8 }, ['斯巴达']), makeChoice('learn-and-rebuild', '借失败推动重建', '承认旧打法不足，开始调整结构。', { navalPower: 6, treasury: -6, historicalDivergence: 11 }, ['斯巴达'])] },
      { id: 'sparta-424', year: 424, title: '伯拉西达北上', brief: '北线行动让斯巴达第一次展现出比传统更灵活的面貌。', objectives: ['利用伯拉西达魅力', '打击雅典北方命脉', '决定是否放权给名将'], historicalEvent: '史实中伯拉西达夺取安菲玻里，重创雅典。', divergenceHint: '你若更彻底支持伯拉西达，北线能更强；但斯巴达内部的政治平衡也会被改变。', relatedEntities: ['伯拉西达', '安菲玻里', '修昔底德'], choices: [makeChoice('back-brasidas', '全力支持伯拉西达', '让他继续以魅力和速度撬动北线。', { landPower: 6, allyLoyalty: 7, morale: 5, treasury: -6, historicalDivergence: 12 }, ['伯拉西达']), makeChoice('limit-generals', '限制个人权势', '维持传统慎重，避免个人功名压倒共同体。', { morale: -3, historicalDivergence: 5 }, ['伯拉西达', '斯巴达']), makeChoice('convert-win-to-peace', '把战果换成议和', '利用胜势逼雅典接受更现实的秩序。', { treasury: 3, allyLoyalty: 3, historicalDivergence: 7 }, ['尼基阿斯和约'])] },
      { id: 'sparta-418', year: 418, title: '曼提尼亚与威望回收', brief: '和平期的大战能重塑希腊世界对斯巴达陆军的想象。', objectives: ['恢复传统威望', '稳住同盟', '让雅典的外交布局失去支点'], historicalEvent: '曼提尼亚战役重建了斯巴达陆军的象征地位。', divergenceHint: '你若在胜利后继续扩张外交，而非仅满足于威望回归，会更早给雅典施压。', relatedEntities: ['曼提尼亚', '阿尔戈斯', '斯巴达'], choices: [makeChoice('restore-fear', '让希腊重新敬畏斯巴达', '把胜利用于重建威望秩序。', { morale: 6, allyLoyalty: 4, historicalDivergence: 4 }, ['曼提尼亚']), makeChoice('tighten-peloponnesian-net', '趁势加紧同盟控制', '进一步压实伯罗奔尼撒体系。', { allyLoyalty: 6, treasury: -4, historicalDivergence: 8 }, ['伯罗奔尼撒同盟']), makeChoice('prepare-western-turn', '开始把目光移向西西里与海战', '不止恢复声望，而是提前寻找杀死雅典体系的新入口。', { navalPower: 5, treasury: -7, historicalDivergence: 11 }, ['斯巴达'])] },
      { id: 'sparta-413', year: 413, title: '德凯利亚与波斯金钱', brief: '西西里覆没后，雅典终于露出致命破口。', objectives: ['扼住雅典腹地', '扩大海军', '处理对波斯资金的依赖'], historicalEvent: '史实中斯巴达在德凯利亚设据点，并借波斯资助完成海军增长。', divergenceHint: '越早越深地绑定波斯，越能提速，但也越改变战争性质。', relatedEntities: ['德凯利亚', '波斯', '雅典'], choices: [makeChoice('fortify-decelea', '固守德凯利亚', '让雅典腹地变成持续失血点。', { landPower: 8, allyLoyalty: 5, treasury: -6, historicalDivergence: 10 }, ['德凯利亚']), makeChoice('court-persia', '全面争取波斯', '用外部财政快速补齐海军短板。', { navalPower: 14, treasury: 10, allyLoyalty: -4, historicalDivergence: 15 }, ['波斯']), makeChoice('balanced-pressure', '陆海平衡压迫', '不押单一路线，稳步把雅典拖死。', { landPower: 4, navalPower: 4, morale: 2, historicalDivergence: 6 }, ['斯巴达'])] },
      { id: 'sparta-405', year: 405, title: '羊河收网', brief: '雅典的残余海军仍可能反扑，收网要比猎杀更重要。', objectives: ['不给雅典翻盘空间', '判断决战还是围猎', '准备战后秩序'], historicalEvent: '史实中莱山德在羊河完成彻底围猎。', divergenceHint: '此时的区别不在于能否获胜，而在于胜利会有多彻底。', relatedEntities: ['羊河之役', '莱山德', '雅典'], choices: [makeChoice('patient-ambush', '耐心围猎', '逼雅典先犯错，再一击摧毁。', { navalPower: 6, morale: 5, historicalDivergence: 4 }, ['莱山德', '羊河之役']), makeChoice('force-battle', '主动迫战', '用压迫逼雅典应战，尽快结束战争。', { navalPower: -5, morale: 6, historicalDivergence: 10 }, ['莱山德']), makeChoice('prepare-postwar-order', '边打边准备战后秩序', '把注意力一部分移向胜后希腊布局。', { treasury: 4, allyLoyalty: 3, historicalDivergence: 8 }, ['斯巴达'])] },
    ],
  },
  {
    id: 'syracuse',
    factionName: '叙拉古与西西里防卫方',
    banner: '守城、港湾与援军',
    summary: '你不是整场战争的起点，却是雅典帝国在最危险时刻撞上的石墙。',
    doctrine: '强大的远征军最怕的不是正面抵抗，而是被陌生地理、延误和反包围一步步拖进死局。',
    victoryLens: '拖慢雅典节奏，守住港湾，争取援军，把围城战变成远征军自己的坟场。',
    turns: [
      { id: 'syracuse-415', year: 415, title: '远征阴影降临', brief: '雅典舰队即将抵达，叙拉古必须在恐慌和整备之间选择。', objectives: ['迅速整军', '避免港湾被快速控制', '争取西西里支援'], historicalEvent: '史实中叙拉古最初反应并不统一，但很快被外来威胁逼向防御动员。', divergenceHint: '你越早把威胁当真，雅典越难在港外建立节奏。', relatedEntities: ['叙拉古城', '西西里远征'], choices: [makeChoice('urgent-mobilization', '紧急总动员', '先把防御工事和守军厚度拉起来。', { treasury: -9, landPower: 8, morale: 4, historicalDivergence: 8 }, ['叙拉古城']), makeChoice('seek-sicilian-league', '先稳西西里联盟', '把孤城变成区域防线。', { allyLoyalty: 10, treasury: -4, historicalDivergence: 6 }, ['西西里']), makeChoice('wait-and-assess', '观望雅典真实规模', '避免过早消耗，但可能错过防御窗口。', { treasury: 4, landPower: -6, historicalDivergence: 14 }, ['雅典'])] },
      { id: 'syracuse-414', year: 414, title: '反围城工程', brief: '雅典试图通过工事把你锁死，你必须在城墙、反工事与港湾机动间选择。', objectives: ['阻断雅典攻城节奏', '保持港湾通道', '防止士气塌陷'], historicalEvent: '史实中叙拉古通过反工事和持续调整守住了命脉。', divergenceHint: '你若更重视港湾机动，战局会更早转入海战。', relatedEntities: ['叙拉古城', '尼基阿斯'], choices: [makeChoice('layered-defenses', '加厚城防与反工事', '让雅典每一步推进都更昂贵。', { landPower: 8, supplies: -4, historicalDivergence: 4 }, ['叙拉古城']), makeChoice('harbor-initiative', '抢夺港湾主动权', '提早把冲突拉到水面。', { navalPower: 8, supplies: -6, morale: 4, historicalDivergence: 9 }, ['叙拉古城', '雅典']), makeChoice('harass-supply-lines', '袭扰远征补给', '不在正面硬碰，而是让雅典自己变慢。', { supplies: 6, treasury: -3, historicalDivergence: 7 }, ['西西里远征'])] },
      { id: 'syracuse-414b', year: 414, title: '请求斯巴达顾问', brief: '吉利普斯是否应被尽快引入，将决定守势是否真正成形。', objectives: ['争取外援', '维持城内决心', '避免孤军作战'], historicalEvent: '吉利普斯的抵达显著强化了叙拉古的抵抗与反击能力。', divergenceHint: '如果外援更早整合，雅典会更早失去主动。', relatedEntities: ['吉利普斯', '叙拉古城', '斯巴达'], choices: [makeChoice('send-urgent-envoys', '火速求援', '尽快把斯巴达经验引入西西里。', { allyLoyalty: 6, landPower: 4, treasury: -4, historicalDivergence: 6 }, ['吉利普斯']), makeChoice('hold-alone', '依靠本地力量', '避免外援牵制，但风险更高。', { morale: 2, historicalDivergence: 11 }, ['叙拉古城']), makeChoice('regional-command', '先统一西西里指挥', '把内外线先捏成一个指挥系统。', { allyLoyalty: 8, morale: 2, historicalDivergence: 8 }, ['西西里'])] },
      { id: 'syracuse-413', year: 413, title: '港湾决战', brief: '雅典已经疲惫，你要决定是在港湾内强顶，还是继续拖垮对方。', objectives: ['封死雅典撤退路线', '保住己方主力', '把守势变成反杀'], historicalEvent: '史实中叙拉古最终在港湾与陆上双重压缩雅典。', divergenceHint: '你越主动追击，结局越彻底，但代价也越高。', relatedEntities: ['西西里远征', '叙拉古城', '尼基阿斯'], choices: [makeChoice('seal-the-harbor', '封死港湾', '直接让雅典陷入绝境。', { navalPower: 10, supplies: -5, historicalDivergence: 7 }, ['叙拉古城']), makeChoice('grind-them-down', '继续拖垮雅典', '让远征军先自行衰竭。', { landPower: 5, morale: 3, historicalDivergence: 5 }, ['西西里远征']), makeChoice('risk-total-pursuit', '穷追不舍', '试图把胜利变成彻底歼灭。', { morale: 10, landPower: -4, navalPower: -4, historicalDivergence: 12 }, ['尼基阿斯'])] },
      { id: 'syracuse-412', year: 412, title: '胜后如何利用震撼', brief: '雅典远征军覆没之后，西西里胜利是否要继续转化为更大地缘影响？', objectives: ['决定扩大战略回报还是保守守成', '巩固西西里安全', '影响后续联盟态势'], historicalEvent: '史实中西西里胜利极大提振了反雅典阵营的信心。', divergenceHint: '你若更主动把胜利输送到更大网络中，西线就不只是防守成功。', relatedEntities: ['叙拉古城', '斯巴达', '雅典'], choices: [makeChoice('fortify-west', '巩固西西里', '先把战果锁住，不急着继续扩展。', { allyLoyalty: 4, treasury: 3, historicalDivergence: 4 }, ['叙拉古城']), makeChoice('project-influence', '把胜利外溢成政治影响', '主动把西西里胜利送进更大的希腊政治网络。', { allyLoyalty: 8, morale: 5, historicalDivergence: 9 }, ['斯巴达']), makeChoice('rebuild-fleet', '优先重建舰队', '让叙拉古不仅守得住，也能继续发声。', { navalPower: 7, treasury: -5, historicalDivergence: 8 }, ['叙拉古城'])] },
      { id: 'syracuse-405', year: 405, title: '雅典将倾的余波', brief: '到战争末年，你已不再只是一座幸存城市，而是决定战后秩序的重要旁观者。', objectives: ['守住西西里成果', '判断是否更深卷入希腊本土秩序', '处理胜利后的战略克制'], historicalEvent: '雅典的崩塌证明，西西里战场并非边角，而是整场战争的真正转折点。', divergenceHint: '胜利后的克制与扩张，同样会决定叙拉古的历史位置。', relatedEntities: ['羊河之役', '叙拉古城', '雅典'], choices: [makeChoice('guard-the-victory', '守住成果', '让叙拉古成为西西里稳定支点。', { treasury: 4, allyLoyalty: 5, historicalDivergence: 5 }, ['叙拉古城']), makeChoice('speak-into-order', '主动介入战后秩序', '把胜利者姿态转成更大影响力。', { morale: 5, allyLoyalty: 6, historicalDivergence: 9 }, ['斯巴达', '雅典']), makeChoice('withdraw-to-strength', '收缩但强固', '避免过度暴露，把资源重新内聚。', { supplies: 5, navalPower: 3, historicalDivergence: 6 }, ['叙拉古城'])] },
    ],
  },
]
