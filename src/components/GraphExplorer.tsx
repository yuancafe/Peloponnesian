import { useEffect, useMemo, useState, type FormEvent } from 'react'

import { shouldAutoFocusGraph } from '../lib/graphInteraction'
import type {
  EntityRecord,
  GraphData,
  GraphNodeRecord,
  NormalizedCategory,
} from '../types'

interface GraphExplorerProps {
  coreGraph: GraphData | null
  fullGraph: GraphData | null
  entities: EntityRecord[]
  entityMap: Record<string, EntityRecord>
  externalSelectedId?: string | null
  onOpenEntity: (id: string) => void
}

type GraphMode = 'core' | 'full'
type GraphCategory = 'all' | NormalizedCategory

interface PositionedNode extends GraphNodeRecord {
  x: number
  y: number
  radius: number
}

interface Offset {
  x: number
  y: number
}

const GRAPH_WIDTH = 1120
const GRAPH_HEIGHT = 840
const NODES_PER_RING = 12
const GRAPH_CENTER_X = GRAPH_WIDTH / 2
const GRAPH_CENTER_Y = GRAPH_HEIGHT / 2
const CATEGORY_ORDER: NormalizedCategory[] = [
  'Person',
  'Polis',
  'Place',
  'Event',
  'Organization',
  'Concept',
  'Document',
  'Period',
  'Artifact',
  'Other',
]

const categoryLabelMap: Record<GraphCategory, string> = {
  all: '全部',
  Person: '人物',
  Place: '地点',
  Event: '事件',
  Polis: '城邦',
  Organization: '组织',
  Concept: '概念',
  Document: '文献',
  Period: '时期',
  Artifact: '器物',
  Other: '其他',
}

const colorMap: Record<NormalizedCategory, string> = {
  Person: '#d0a14a',
  Place: '#5f8798',
  Event: '#8f3020',
  Polis: '#d8c08f',
  Organization: '#47674a',
  Concept: '#5f4d7b',
  Document: '#7f6a58',
  Period: '#446b76',
  Artifact: '#8d4f63',
  Other: '#60666d',
}

function hashString(input: string): number {
  let hash = 0
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function shouldShowLabel(
  node: GraphNodeRecord,
  scale: number,
  highlighted: boolean,
): boolean {
  if (highlighted) return true
  if (scale >= 1.74) return true
  if (scale >= 1.36) return node.degree >= 5
  if (scale >= 1.08) return node.degree >= 9
  return node.degree >= 14
}

function layoutNodes(nodes: GraphNodeRecord[]): PositionedNode[] {
  const byCategory = new Map<NormalizedCategory, GraphNodeRecord[]>()
  for (const node of nodes) {
    const bucket = byCategory.get(node.category) ?? []
    bucket.push(node)
    byCategory.set(node.category, bucket)
  }

  const presentCategories = CATEGORY_ORDER.filter((category) => byCategory.has(category))
  const segmentCount = Math.max(presentCategories.length, 1)

  return presentCategories.flatMap((category, categoryIndex) => {
    const segmentNodes = [...(byCategory.get(category) ?? [])].sort(
      (left, right) => right.degree - left.degree || left.id.localeCompare(right.id, 'zh-Hans-CN'),
    )
    const segmentCenter = -Math.PI / 2 + (Math.PI * 2 * categoryIndex) / segmentCount
    const segmentSpan = (Math.PI * 2) / segmentCount * 0.82

    return segmentNodes.map((node, nodeIndex) => {
      const ring = Math.floor(nodeIndex / NODES_PER_RING)
      const slot = nodeIndex % NODES_PER_RING
      const ringSize = Math.min(NODES_PER_RING, segmentNodes.length - ring * NODES_PER_RING)
      const ratio = ringSize <= 1 ? 0.5 : slot / (ringSize - 1)
      const jitterSeed = hashString(`${node.id}-${node.category}`)
      const angleJitter = ((jitterSeed % 19) - 9) * 0.0031
      const radiusJitter = (Math.floor(jitterSeed / 19) % 28) - 14
      const angle = segmentCenter - segmentSpan / 2 + segmentSpan * ratio + angleJitter
      const radius = 176 + ring * 88 + clamp(20 - node.degree, 0, 14) * 2.6 + radiusJitter
      const radiusY = radius * 0.83

      return {
        ...node,
        x: GRAPH_CENTER_X + Math.cos(angle) * radius,
        y: GRAPH_CENTER_Y + Math.sin(angle) * radiusY,
        radius: clamp(4 + node.degree * 0.28, 5, 22),
      }
    })
  })
}

export function GraphExplorer({
  coreGraph,
  fullGraph,
  entities,
  entityMap,
  externalSelectedId,
  onOpenEntity,
}: GraphExplorerProps) {
  const [mode, setMode] = useState<GraphMode>('core')
  const [category, setCategory] = useState<GraphCategory>('all')
  const [dictionaryCategory, setDictionaryCategory] = useState<NormalizedCategory | null>(null)
  const [search, setSearch] = useState('')
  const [manualSelectedId, setManualSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [cameraState, setCameraState] = useState({
    scale: 1,
    panX: 0,
    panY: 0,
  })
  const [timeTick, setTimeTick] = useState(0)
  const [nodeOffsets, setNodeOffsets] = useState<Record<string, Offset>>({})
  const [dragState, setDragState] = useState<{
    active: boolean
    startX: number
    startY: number
    originPanX: number
    originPanY: number
  } | null>(null)
  const [nodeDragState, setNodeDragState] = useState<{
    nodeId: string
    startX: number
    startY: number
    originOffsetX: number
    originOffsetY: number
  } | null>(null)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeTick(Date.now())
    }, 60)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const activeGraph = mode === 'core' ? coreGraph : fullGraph
  const nodes = useMemo(() => activeGraph?.nodes ?? [], [activeGraph])
  const availableCategories = [
    'all',
    ...CATEGORY_ORDER.filter((item) => nodes.some((node) => node.category === item)),
  ] as GraphCategory[]

  const filteredNodes = useMemo(
    () => nodes.filter((node) => category === 'all' || node.category === category),
    [category, nodes],
  )
  const filteredNodeIds = useMemo(
    () => new Set(filteredNodes.map((node) => node.id)),
    [filteredNodes],
  )
  const filteredLinks = useMemo(
    () =>
      (activeGraph?.links ?? []).filter(
        (link) => filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target),
      ),
    [activeGraph?.links, filteredNodeIds],
  )

  const positionedNodes = useMemo(() => layoutNodes(filteredNodes), [filteredNodes])
  const positionMap = useMemo(
    () => Object.fromEntries(positionedNodes.map((node) => [node.id, node])) as Record<string, PositionedNode>,
    [positionedNodes],
  )

  const selectedId =
    manualSelectedId && filteredNodeIds.has(manualSelectedId)
      ? manualSelectedId
      : externalSelectedId && filteredNodeIds.has(externalSelectedId)
        ? externalSelectedId
        : null

  function focusNode(nodeId: string) {
    const node = positionMap[nodeId]
    if (!node) return
    const nextScale = clamp(cameraState.scale < 0.92 ? 0.92 : cameraState.scale, 0.75, 1.55)

    setCameraState({
      scale: nextScale,
      panX: GRAPH_CENTER_X - node.x * nextScale,
      panY: GRAPH_CENTER_Y - node.y * nextScale,
    })
  }

  function getAnimatedPosition(node: PositionedNode): Offset {
    const seed = hashString(node.id)
    const phase = (seed % 360) * (Math.PI / 180)
    const driftX = Math.sin(timeTick * 0.001 + phase) * (2.4 + (seed % 3))
    const driftY = Math.cos(timeTick * 0.0012 + phase * 1.3) * (1.9 + ((seed >> 3) % 3))
    const manual = nodeOffsets[node.id] ?? { x: 0, y: 0 }

    return {
      x: node.x + driftX + manual.x,
      y: node.y + driftY + manual.y,
    }
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const keyword = search.trim().toLowerCase()
    if (!keyword) return

    const match = Object.values(entityMap).find((entity) => entity.searchIndex.includes(keyword))
    if (!match) return

    const existsInCurrent = filteredNodeIds.has(match.id)
    if (!existsInCurrent && mode === 'core' && fullGraph?.nodes.some((node) => node.id === match.id)) {
      setMode('full')
      setCategory('all')
      setManualSelectedId(match.id)
      return
    }

    if (!existsInCurrent) return

    setManualSelectedId(match.id)
    if (shouldAutoFocusGraph('search')) {
      focusNode(match.id)
    }
  }

  function handleWheel(event: React.WheelEvent<SVGSVGElement>) {
    event.preventDefault()
    const direction = event.deltaY > 0 ? -0.12 : 0.12
    setCameraState((current) => ({
      ...current,
      scale: clamp(Number((current.scale + direction).toFixed(2)), 0.62, 2.1),
    }))
  }

  function handlePointerDown(event: React.PointerEvent<SVGRectElement>) {
    setDragState({
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      originPanX: cameraState.panX,
      originPanY: cameraState.panY,
    })
  }

  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    if (nodeDragState) {
      setNodeOffsets((current) => ({
        ...current,
        [nodeDragState.nodeId]: {
          x: nodeDragState.originOffsetX + (event.clientX - nodeDragState.startX) / cameraState.scale,
          y: nodeDragState.originOffsetY + (event.clientY - nodeDragState.startY) / cameraState.scale,
        },
      }))
      return
    }

    if (!dragState?.active) return
    setDragState((current) => {
      if (!current) return current
      setCameraState((camera) => ({
        ...camera,
        panX: current.originPanX + (event.clientX - current.startX),
        panY: current.originPanY + (event.clientY - current.startY),
      }))
      return current
    })
  }

  function handlePointerUp() {
    setNodeDragState(null)
    setDragState(null)
  }

  const selectedEntity = selectedId ? entityMap[selectedId] ?? null : null
  const dictionaryGroups = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    const source = keyword
      ? entities.filter((entity) => entity.searchIndex.includes(keyword))
      : entities
    const grouped = new Map<GraphCategory, EntityRecord[]>()

    for (const entity of source) {
      const bucket = grouped.get(entity.category) ?? []
      bucket.push(entity)
      grouped.set(entity.category, bucket)
    }

    return CATEGORY_ORDER.filter((item) => grouped.has(item)).map((item) => ({
      category: item,
      label: categoryLabelMap[item],
      entries: (grouped.get(item) ?? []).sort((left, right) =>
        left.name.localeCompare(right.name, 'zh-Hans-CN'),
      ),
    }))
  }, [entities, search])
  const visibleDictionaryGroups = useMemo(
    () =>
      dictionaryCategory == null
        ? []
        : dictionaryGroups.filter((group) => group.category === dictionaryCategory),
    [dictionaryCategory, dictionaryGroups],
  )
  const animatedPositionMap = useMemo(
    () =>
      Object.fromEntries(
        positionedNodes.map((node) => [node.id, getAnimatedPosition(node)]),
      ) as Record<string, Offset>,
    [nodeOffsets, positionedNodes, timeTick],
  )

  return (
    <div className="graph-explorer">
      <div className="graph-toolbar">
        <div className="graph-modes">
          <button
            className={`segmented-button ${mode === 'core' ? 'active' : ''}`}
            onClick={() => setMode('core')}
            type="button"
          >
            战争核心子图
          </button>
          <button
            className={`segmented-button ${mode === 'full' ? 'active' : ''}`}
            onClick={() => setMode('full')}
            type="button"
          >
            完整图谱
          </button>
        </div>

        <form className="graph-search-form" onSubmit={handleSearchSubmit}>
          <label className="search-field">
            <span>搜索实体</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="阿尔基比亚德 / 亚西比德 / 羊河之役"
            />
          </label>
          <button className="secondary-button graph-search-button" type="submit">
            定位
          </button>
          <button
            className="ghost-button graph-reset-button"
            type="button"
            onClick={() => setCameraState({ scale: 1, panX: 0, panY: 0 })}
          >
            重置视角
          </button>
        </form>
      </div>

      <div className="category-strip">
        {availableCategories.map((item) => (
          <button
            key={item}
            className={`filter-chip ${category === item ? 'active' : ''}`}
            onClick={() => setCategory(item)}
            type="button"
          >
            {categoryLabelMap[item]}
          </button>
        ))}
      </div>

      <div className="graph-layout">
        <div className="graph-canvas-card">
          <div className="graph-help">
            节点会缓慢自行漂移。悬停仅高亮，单击选中，双击打开实体卡片；拖拽背景可平移，选中节点后可拖动该节点。
          </div>
          <svg
            className={`graph-svg ${dragState?.active ? 'dragging' : ''}`}
            viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
            onWheel={handleWheel}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <defs>
              <radialGradient id="graphGlow" cx="50%" cy="50%" r="65%">
                <stop offset="0%" stopColor="rgba(210, 165, 92, 0.35)" />
                <stop offset="100%" stopColor="rgba(210, 165, 92, 0)" />
              </radialGradient>
            </defs>

            <rect
              x="0"
              y="0"
              width={GRAPH_WIDTH}
              height={GRAPH_HEIGHT}
              className="graph-hitbox"
              onPointerDown={handlePointerDown}
            />

            <g transform={`translate(${cameraState.panX} ${cameraState.panY}) scale(${cameraState.scale})`}>
              <circle cx={GRAPH_CENTER_X} cy={GRAPH_CENTER_Y} r="248" className="graph-ring ring-one" />
              <circle cx={GRAPH_CENTER_X} cy={GRAPH_CENTER_Y} r="392" className="graph-ring ring-two" />
              <circle cx={GRAPH_CENTER_X} cy={GRAPH_CENTER_Y} r="536" className="graph-ring ring-three" />

              {filteredLinks.map((link) => {
                const source = animatedPositionMap[link.source]
                const target = animatedPositionMap[link.target]
                if (!source || !target) return null
                const isHighlighted =
                  selectedId != null &&
                  (link.source === selectedId ||
                    link.target === selectedId ||
                    link.source === hoveredId ||
                    link.target === hoveredId)

                return (
                  <line
                    key={`${link.source}-${link.target}`}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    className={`graph-edge ${isHighlighted ? 'highlighted' : ''}`}
                  />
                )
              })}

              {positionedNodes.map((node) => {
                const position = animatedPositionMap[node.id]
                if (!position) return null
                const highlighted = node.id === selectedId || node.id === hoveredId
                const showLabel = shouldShowLabel(node, cameraState.scale, highlighted)
                return (
                  <g
                    key={node.id}
                    className="graph-node"
                    onMouseEnter={() => setHoveredId(node.id)}
                    onMouseLeave={() => setHoveredId((current) => (current === node.id ? null : current))}
                    onPointerDown={(event) => {
                      if (selectedId !== node.id) return
                      event.stopPropagation()
                      const manual = nodeOffsets[node.id] ?? { x: 0, y: 0 }
                      setNodeDragState({
                        nodeId: node.id,
                        startX: event.clientX,
                        startY: event.clientY,
                        originOffsetX: manual.x,
                        originOffsetY: manual.y,
                      })
                    }}
                    onClick={() => {
                      setManualSelectedId(node.id)
                      if (shouldAutoFocusGraph('node-click')) {
                        focusNode(node.id)
                      }
                    }}
                    onDoubleClick={() => onOpenEntity(node.id)}
                  >
                    {highlighted ? (
                      <circle cx={position.x} cy={position.y} r={node.radius * 2.2} fill="url(#graphGlow)" />
                    ) : null}
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r={node.radius}
                      fill={colorMap[node.category]}
                      stroke={highlighted ? '#f6ddb1' : '#f0ddba'}
                      strokeWidth={highlighted ? 2.4 : 1.1}
                    />
                    {showLabel ? (
                      <text
                        x={position.x}
                        y={position.y - node.radius - 10}
                        className="graph-label"
                        style={{
                          fontSize: `${Math.max(8.5, 11 / Math.max(cameraState.scale, 1))}px`,
                          strokeWidth: `${Math.max(2.2, 3.5 / Math.max(cameraState.scale, 1))}px`,
                        }}
                      >
                        {node.label}
                      </text>
                    ) : null}
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        <aside className="graph-side-card">
          {selectedEntity ? (
            <>
              <p className="eyebrow">已选实体</p>
              <h3>{selectedEntity.name}</h3>
              <div className="entity-meta-row compact">
                <span className="pill pill-solid">
                  {categoryLabelMap[selectedEntity.category] ?? selectedEntity.category}
                </span>
                <span className="pill">关联度 {selectedEntity.degree}</span>
              </div>
              <p className="graph-entity-summary">{selectedEntity.summary}</p>
              <div className="graph-related-list">
                {selectedEntity.relatedEntities.slice(0, 10).map((relatedId) => {
                  const related = entityMap[relatedId]
                  if (!related) return null

                  return (
                    <button
                      key={relatedId}
                      className="chip-button"
                      onClick={() => {
                        setManualSelectedId(relatedId)
                        focusNode(relatedId)
                      }}
                      type="button"
                    >
                      {related.name}
                    </button>
                  )
                })}
              </div>
              <button
                className="primary-button graph-open-button"
                onClick={() => onOpenEntity(selectedEntity.id)}
                type="button"
              >
                打开完整介绍
              </button>
            </>
          ) : (
            <>
              <p className="eyebrow">知识图谱</p>
              <h3>把战争拆成可追踪的关系网络</h3>
              <p className="graph-entity-summary">
                这里把人物、城邦、事件、概念和文献放到同一张图上。你可以先看核心子图，再切到完整网络，追踪“恐惧如何走向战争”“西西里如何改变雅典命运”“修昔底德为何把某些事件放得特别重”。
              </p>
            </>
          )}
        </aside>
      </div>

      <section className="graph-dictionary sacred-panel">
        <div className="graph-dictionary-header">
          <div>
            <p className="eyebrow">图谱词典</p>
            <h3>按类型浏览全部实体</h3>
          </div>
          <p className="graph-dictionary-note">
            {search.trim()
              ? `当前按“${search.trim()}”过滤结果。`
              : '先点一个类型，再展开该类全部实体。'}
          </p>
        </div>

        <div className="graph-dictionary-filters">
          {dictionaryGroups.map((group) => (
            <button
              key={group.category}
              className={`filter-chip ${dictionaryCategory === group.category ? 'active' : ''}`}
              type="button"
              onClick={() =>
                setDictionaryCategory((current) =>
                  current === group.category ? null : group.category,
                )
              }
            >
              {group.label} {group.entries.length}
            </button>
          ))}
        </div>

        <div className="graph-dictionary-grid">
          {visibleDictionaryGroups.map((group) => (
            <article key={group.category} className="dictionary-group">
              <div className="dictionary-group-header">
                <span className="pill pill-solid">{group.label}</span>
                <span className="pill">{group.entries.length} 项</span>
              </div>

              <div className="dictionary-list">
                {group.entries.map((entity) => (
                  <button
                    key={entity.id}
                    className={`dictionary-item ${selectedId === entity.id ? 'active' : ''}`}
                    type="button"
                    onClick={() => {
                      if (
                        mode === 'core' &&
                        !filteredNodeIds.has(entity.id) &&
                        fullGraph?.nodes.some((node) => node.id === entity.id)
                      ) {
                        setMode('full')
                        setCategory('all')
                        setManualSelectedId(entity.id)
                        return
                      }
                      setManualSelectedId(entity.id)
                      if (shouldAutoFocusGraph('search')) focusNode(entity.id)
                    }}
                    onDoubleClick={() => onOpenEntity(entity.id)}
                  >
                    <span>{entity.name}</span>
                  </button>
                ))}
              </div>
            </article>
          ))}

          {visibleDictionaryGroups.length === 0 ? (
            <div className="dictionary-empty">
              词典默认折叠。请选择上方任一类型，再浏览该类实体。
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
