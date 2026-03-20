import { useEffect, useMemo, useState } from 'react'

import { EntityDrawer } from './components/EntityDrawer'
import { GraphExplorer } from './components/GraphExplorer'
import {
  campaignScenarios,
  entityEnhancements,
  featuredEntityIds,
  heroStats,
  mapLayerLabels,
  mapNodes,
  mapRoutes,
  syntheticEntities,
  thucydidesLore,
  timelineEvents,
  warPhases,
} from './data/content'
import {
  advanceFromResolution,
  createCampaignSaveData,
  createInitialCampaignRoundState,
  selectChoiceForRound,
} from './lib/campaignFlow'
import {
  buildEntityMap,
  ensureGraphContainsEntities,
  mergeEntityCatalog,
} from './lib/entityCatalog'
import { getActiveTimelineEvents, getVisibleMapNodes, resolveMarkerEntityId } from './lib/mapUtils'
import type {
  CampaignRoundState,
  CampaignSaveData,
  EntityRecord,
  GraphData,
  MapLayerId,
  MapRoute,
  ResourceState,
  ScenarioId,
  TimelineEvent,
  WarPhase,
} from './types'
import './App.css'

const CAMPAIGN_STORAGE_KEY = 'peloponnesian-campaign-state-v2'
const RESOURCE_LABELS: Record<keyof ResourceState, string> = {
  treasury: '国库',
  navalPower: '海军',
  landPower: '陆军',
  supplies: '补给',
  allyLoyalty: '盟邦忠诚',
  morale: '士气',
}

function buildDefaultCampaignState(): CampaignSaveData {
  return createCampaignSaveData({
    athens: createInitialCampaignRoundState('athens'),
    sparta: createInitialCampaignRoundState('sparta'),
    syracuse: createInitialCampaignRoundState('syracuse'),
  })
}

function isRoundState(candidate: unknown): candidate is CampaignRoundState {
  if (!candidate || typeof candidate !== 'object') return false
  const round = candidate as CampaignRoundState
  return (
    typeof round.status === 'string' &&
    round.turnState != null &&
    typeof round.turnState.turnIndex === 'number' &&
    typeof round.turnState.year === 'number'
  )
}

function readStoredCampaignState(): CampaignSaveData {
  if (typeof window === 'undefined') {
    return buildDefaultCampaignState()
  }

  const raw = window.localStorage.getItem(CAMPAIGN_STORAGE_KEY)
  if (!raw) {
    return buildDefaultCampaignState()
  }

  try {
    const parsed = JSON.parse(raw) as Partial<CampaignSaveData>
    return createCampaignSaveData({
      athens: isRoundState(parsed.athens)
        ? parsed.athens
        : createInitialCampaignRoundState('athens'),
      sparta: isRoundState(parsed.sparta)
        ? parsed.sparta
        : createInitialCampaignRoundState('sparta'),
      syracuse: isRoundState(parsed.syracuse)
        ? parsed.syracuse
        : createInitialCampaignRoundState('syracuse'),
    })
  } catch {
    return buildDefaultCampaignState()
  }
}

async function loadJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`${url} 加载失败`)
  }
  return (await response.json()) as T
}

function formatAncientYear(year: number): string {
  return `前${Math.abs(year)}年`
}

function formatPhaseRange(phase: WarPhase): string {
  return `${formatAncientYear(phase.startYear)}—${formatAncientYear(phase.endYear)}`
}

function resolvePhaseForYear(year: number): WarPhase {
  return (
    warPhases.find((phase) => year >= phase.startYear && year <= phase.endYear) ?? warPhases[0]
  )
}

function yearToInputValue(year: number): number {
  return year
}

function inputValueToYear(value: number): number {
  return value
}

function toPointsString(route: MapRoute): string {
  return route.points
    .map((point) => `${Number.parseFloat(point.left)},${Number.parseFloat(point.top)}`)
    .join(' ')
}

function describeCampaignEnding(roundState: CampaignRoundState): string {
  const divergence = roundState.turnState.historicalDivergence

  if (divergence >= 45) {
    return '你已经把这条战线推离修昔底德笔下的主航道，赢下的更像是一条新的希腊历史分支。'
  }

  if (divergence >= 20) {
    return '你的推演与史实明显分岔，但战争仍在沿着权力、恐惧与误判的原始逻辑向前滚动。'
  }

  return '你的路径仍大体贴着史实主线，像是在亲手重走那些改变希腊世界的决定性转折。'
}

function App() {
  const [loadedEntities, setLoadedEntities] = useState<EntityRecord[]>([])
  const [loadedCoreGraph, setLoadedCoreGraph] = useState<GraphData | null>(null)
  const [loadedFullGraph, setLoadedFullGraph] = useState<GraphData | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPhaseId, setSelectedPhaseId] = useState(warPhases[0].id)
  const [selectedScenarioId, setSelectedScenarioId] = useState<ScenarioId>('athens')
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null)
  const [selectedLayer, setSelectedLayer] = useState<MapLayerId>('events')
  const [selectedYear, setSelectedYear] = useState(timelineEvents[0].year)
  const [campaignState, setCampaignState] = useState<CampaignSaveData>(readStoredCampaignState)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      loadJson<EntityRecord[]>('/data/entities.json'),
      loadJson<GraphData>('/data/graph-core.json'),
      loadJson<GraphData>('/data/graph-full.json'),
    ])
      .then(([entities, coreGraph, fullGraph]) => {
        if (cancelled) return
        setLoadedEntities(entities)
        setLoadedCoreGraph(coreGraph)
        setLoadedFullGraph(fullGraph)
      })
      .catch((error: Error) => {
        if (cancelled) return
        setLoadError(error.message)
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(campaignState))
  }, [campaignState])

  const entities = useMemo(
    () => mergeEntityCatalog(loadedEntities, entityEnhancements, syntheticEntities),
    [loadedEntities],
  )
  const entityMap = useMemo(() => buildEntityMap(entities), [entities])

  const requiredGraphIds = useMemo(
    () =>
      new Set([
        ...featuredEntityIds,
        ...warPhases.flatMap((phase) => phase.relatedEntities),
        ...mapNodes.map((node) => node.entityId),
        ...timelineEvents.flatMap((event) => event.relatedEntityIds),
        ...syntheticEntities.map((entity) => entity.id),
      ]),
    [],
  )

  const coreGraph = useMemo(
    () => ensureGraphContainsEntities(loadedCoreGraph, entityMap, requiredGraphIds),
    [entityMap, loadedCoreGraph, requiredGraphIds],
  )
  const fullGraph = useMemo(
    () => ensureGraphContainsEntities(loadedFullGraph, entityMap, requiredGraphIds),
    [entityMap, loadedFullGraph, requiredGraphIds],
  )

  const selectedPhase =
    warPhases.find((phase) => phase.id === selectedPhaseId) ?? resolvePhaseForYear(selectedYear)
  const selectedScenario =
    campaignScenarios.find((scenario) => scenario.id === selectedScenarioId) ??
    campaignScenarios[0]
  const selectedRoundState = campaignState[selectedScenarioId]
  const selectedTurn =
    selectedScenario.turns[selectedRoundState.turnState.turnIndex] ?? null
  const selectedEntity = selectedEntityId ? entityMap[selectedEntityId] ?? null : null
  const featuredEntities = featuredEntityIds
    .map((entityId) => entityMap[entityId])
    .filter((entity): entity is EntityRecord => Boolean(entity))

  const visibleNodes = useMemo(
    () => getVisibleMapNodes(mapNodes, selectedLayer, selectedYear),
    [selectedLayer, selectedYear],
  )
  const activeEvents = useMemo(
    () => getActiveTimelineEvents(timelineEvents, selectedYear),
    [selectedYear],
  )
  const activeTimelineEvent =
    activeEvents[activeEvents.length - 1] ?? timelineEvents[0]
  const activeTimelineNodeIds = new Set(activeTimelineEvent?.nodeIds ?? [])
  const visibleRoutes = useMemo(
    () =>
      mapRoutes.filter((route) => {
        if (selectedYear < route.visibleFromYear || selectedYear > route.visibleToYear) {
          return false
        }
        if (selectedLayer === 'events') {
          return route.layer === 'events' || route.layer === 'timeline'
        }
        return route.layer === selectedLayer
      }),
    [selectedLayer, selectedYear],
  )

  function openEntity(entityId: string) {
    if (!entityMap[entityId]) return
    setSelectedEntityId(entityId)
  }

  function syncPhaseAndYear(nextYear: number) {
    const phase = resolvePhaseForYear(nextYear)
    setSelectedYear(nextYear)
    setSelectedPhaseId(phase.id)
  }

  function handlePhaseSelect(phase: WarPhase) {
    setSelectedPhaseId(phase.id)
    const latestEventWithinPhase =
      [...timelineEvents]
        .filter((event) => event.year >= phase.startYear && event.year <= phase.endYear)
        .sort((left, right) => left.year - right.year)
        .at(-1) ?? timelineEvents[0]

    setSelectedYear(latestEventWithinPhase.year)
    document.getElementById('war-overview')?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleMapNodeClick(nodeId: string) {
    const entityId = resolveMarkerEntityId(mapNodes, nodeId)
    if (entityId) {
      openEntity(entityId)
    }
  }

  function handleTimelineEventSelect(event: TimelineEvent) {
    syncPhaseAndYear(event.year)
  }

  function handleScenarioChoice(choiceIndex: number) {
    if (!selectedTurn) return
    const choice = selectedTurn.choices[choiceIndex]
    const nextRoundState = selectChoiceForRound(
      selectedRoundState,
      choice,
      selectedTurn.id,
      {
        historicalEvent: selectedTurn.historicalEvent,
        divergenceHint: selectedTurn.divergenceHint,
      },
    )

    setCampaignState((current) => ({
      ...current,
      [selectedScenarioId]: nextRoundState,
    }))

    const firstRelated = choice.relatedEntities.find((entityId) => entityMap[entityId])
    if (firstRelated) {
      openEntity(firstRelated)
    }
  }

  function handleAdvanceCampaign() {
    setCampaignState((current) => ({
      ...current,
      [selectedScenarioId]: advanceFromResolution(current[selectedScenarioId], selectedScenario),
    }))
  }

  function resetScenario(scenarioId: ScenarioId) {
    setCampaignState((current) => ({
      ...current,
      [scenarioId]: createInitialCampaignRoundState(scenarioId),
    }))
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <p className="eyebrow">Peloponnesian War Chronicle</p>
          <div className="brand-title">海与长墙之间</div>
        </div>
        <nav className="topnav">
          <a href="#war-overview">战争总览</a>
          <a href="#war-map">战争地图</a>
          <a href="#campaign">战争推演</a>
          <a href="#thucydides">修昔底德</a>
          <a href="#graph">知识图谱</a>
        </nav>
      </header>

      <main className="page">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">中文史诗叙事馆</p>
            <h1>伯罗奔尼撒战争</h1>
            <p className="hero-lead">
              这不是把事件贴在一条时间线上，而是把一场战争拆回它真实的构成：
              城邦、舰队、议会、港湾、恐惧、野心、错误判断，以及那些在战败后仍坚持追问因果的人。
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#war-overview">
                先看战争全貌
              </a>
              <a className="secondary-button" href="#campaign">
                进入策略推演
              </a>
            </div>

            <div className="hero-stats">
              {heroStats.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-side">
            <div className="quote-card sacred-panel">
              <p className="quote-mark quote-mark-open">“</p>
              <p className="quote-copy">
                修昔底德关心的从来不只是胜负。他写的是一个世界如何在自认理性时，依然一步步走向更大灾难。
              </p>
              <p className="quote-mark quote-mark-close">”</p>
            </div>

            <div className="hero-figures sacred-panel">
              <div className="section-cap">战争中的关键面孔</div>
              <div className="hero-portrait-grid">
                {featuredEntities.slice(0, 6).map((entity) => (
                  <button
                    key={entity.id}
                    className="portrait-card"
                    onClick={() => openEntity(entity.id)}
                    type="button"
                  >
                    {entity.portrait ? (
                      <img src={entity.portrait.src} alt={entity.portrait.alt} />
                    ) : (
                      <div className="portrait-fallback">{entity.name}</div>
                    )}
                    <span>{entity.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="war-overview" className="story-section">
          <div className="section-heading">
            <p className="eyebrow">第一章</p>
            <h2>战争总览</h2>
            <p>
              战争并不是突然“开始”的。真正推动希腊世界坠入深渊的，是力量增长带来的恐惧、
              同盟结构的拉扯，以及每一方都相信自己仍然能控制局势的错觉。
            </p>
          </div>

          <div className="overview-layout">
            <div className="phase-rail">
              {warPhases.map((phase) => (
                <button
                  key={phase.id}
                  className={`phase-button ${selectedPhase.id === phase.id ? 'active' : ''}`}
                  onClick={() => handlePhaseSelect(phase)}
                  type="button"
                >
                  <span>{phase.kicker}</span>
                  <strong>{phase.title}</strong>
                  <small>{formatPhaseRange(phase)}</small>
                </button>
              ))}
            </div>

            <div className="phase-card sacred-panel">
              <div className="phase-card-header">
                <div>
                  <p className="eyebrow">{selectedPhase.kicker}</p>
                  <h3>{selectedPhase.title}</h3>
                </div>
                <div className="phase-date-badge">{formatPhaseRange(selectedPhase)}</div>
              </div>

              <p className="phase-summary">{selectedPhase.summary}</p>

              <div className="phase-columns">
                <article className="phase-copy-block">
                  <div className="section-cap">深层起因</div>
                  <p>{selectedPhase.spark}</p>
                </article>
                <article className="phase-copy-block">
                  <div className="section-cap">战略形态</div>
                  <p>{selectedPhase.strategicShape}</p>
                </article>
                <article className="phase-copy-block">
                  <div className="section-cap">战局变化</div>
                  <p>{selectedPhase.balance}</p>
                </article>
                <article className="phase-copy-block">
                  <div className="section-cap">结果与后果</div>
                  <p>{selectedPhase.outcome}</p>
                </article>
              </div>

              <div className="chip-row phase-chip-row">
                {selectedPhase.relatedEntities.map((entityId) => (
                  <button
                    key={entityId}
                    className="chip-button"
                    onClick={() => openEntity(entityId)}
                    type="button"
                  >
                    {entityMap[entityId]?.name ?? entityId}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="war-map" className="story-section">
          <div className="section-heading">
            <p className="eyebrow">第二章</p>
            <h2>战争地图</h2>
            <p>
              同一张底图，三种观看方式。你可以切到城邦和组织，看联盟与战略支点；切到人物，看谁在何处改变战局；
              也可以切到事件层，沿时间线把战争一步步推进到羊河之役。
            </p>
          </div>

          <div className="map-layout">
            <div className="map-card sacred-panel">
              <div className="map-toolbar">
                <div className="graph-modes">
                  {(Object.keys(mapLayerLabels) as MapLayerId[]).map((layer) => (
                    <button
                      key={layer}
                      className={`segmented-button ${selectedLayer === layer ? 'active' : ''}`}
                      onClick={() => setSelectedLayer(layer)}
                      type="button"
                    >
                      {mapLayerLabels[layer]}
                    </button>
                  ))}
                </div>

                <div className="timeline-control">
                  <label htmlFor="timeline-year">
                    时间推进 <strong>{formatAncientYear(selectedYear)}</strong>
                  </label>
                  <div className="timeline-endpoints" aria-hidden="true">
                    <span>{formatAncientYear(timelineEvents[0].year)}</span>
                    <span>{formatAncientYear(timelineEvents[timelineEvents.length - 1].year)}</span>
                  </div>
                  <input
                    id="timeline-year"
                    type="range"
                    min={yearToInputValue(timelineEvents[0].year)}
                    max={yearToInputValue(timelineEvents[timelineEvents.length - 1].year)}
                    step={1}
                    value={yearToInputValue(selectedYear)}
                    onChange={(event) =>
                      syncPhaseAndYear(inputValueToYear(Number(event.target.value)))
                    }
                  />
                </div>
              </div>

              <div className="map-stage">
                <img
                  className="war-map-image"
                  src="/maps/peloponnesian-war-map-alt.jpg"
                  alt="伯罗奔尼撒战争地图"
                />

                <svg className="map-routes" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {visibleRoutes.map((route) => (
                    <polyline
                      key={route.id}
                      points={toPointsString(route)}
                      className={`map-route ${route.layer === 'timeline' ? 'timeline' : ''}`}
                    />
                  ))}
                </svg>

                {visibleNodes.map((node) => (
                  <button
                    key={node.id}
                    className={`map-node ${node.icon} ${
                      activeTimelineNodeIds.has(node.id) ? 'current' : ''
                    }`}
                    style={{ left: node.left, top: node.top }}
                    onClick={() => handleMapNodeClick(node.id)}
                    type="button"
                  >
                    <span className="map-node-core" />
                    <span className={`map-node-label align-${node.alignment ?? 'right'}`}>
                      {node.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="timeline-track">
                {timelineEvents.map((event) => (
                  <button
                    key={event.id}
                    className={`timeline-dot ${event.year === selectedYear ? 'active' : ''}`}
                    onClick={() => handleTimelineEventSelect(event)}
                    type="button"
                  >
                    <span>{formatAncientYear(event.year)}</span>
                    <strong>{event.title}</strong>
                  </button>
                ))}
              </div>
            </div>

            <aside className="map-side">
              <div className="resource-card sacred-panel">
                <div className="section-cap">当前地图叙事</div>
                <h3>{activeTimelineEvent.title}</h3>
                <p className="map-narrative">{activeTimelineEvent.summary}</p>
                <div className="chip-row">
                  {activeTimelineEvent.relatedEntityIds.map((entityId) => (
                    <button
                      key={entityId}
                      className="chip-button"
                      onClick={() => openEntity(entityId)}
                      type="button"
                    >
                      {entityMap[entityId]?.name ?? entityId}
                    </button>
                  ))}
                </div>
              </div>

              <div className="resource-card sacred-panel">
                <div className="section-cap">本层可读节点</div>
                <div className="map-node-list">
                  {visibleNodes.map((node) => (
                    <button
                      key={node.id}
                      className="node-list-item"
                      onClick={() => handleMapNodeClick(node.id)}
                      type="button"
                    >
                      <strong>{node.label}</strong>
                      <span>{node.summary ?? '打开查看详情。'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="resource-card sacred-panel">
                <div className="section-cap">已推进到的事件</div>
                <div className="timeline-summary-list">
                  {activeEvents.map((event) => (
                    <button
                      key={event.id}
                      className="timeline-summary-item"
                      onClick={() => handleTimelineEventSelect(event)}
                      type="button"
                    >
                      <strong>{formatAncientYear(event.year)}</strong>
                      <span>{event.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="campaign" className="story-section">
          <div className="section-heading">
            <p className="eyebrow">第三章</p>
            <h2>战争推演</h2>
            <p>
              你现在不再只是旁观者。选择一方阵营，从资源、盟友、士气、海陆力量与历史偏离度出发，
              把每一轮局势推进下去。每次做出选择后，系统会先结算并解释，再由你亲手点入下一轮。
            </p>
          </div>

          <div className="scenario-tabs">
            {campaignScenarios.map((scenario) => (
              <button
                key={scenario.id}
                className={`scenario-tab ${
                  selectedScenarioId === scenario.id ? 'active' : ''
                }`}
                onClick={() => setSelectedScenarioId(scenario.id)}
                type="button"
              >
                <span>{scenario.banner}</span>
                <strong>{scenario.factionName}</strong>
              </button>
            ))}
          </div>

          <div className="campaign-layout">
            <div className="campaign-main">
              <div className="campaign-summary-card sacred-panel">
                <p className="eyebrow">{selectedScenario.banner}</p>
                <h3>{selectedScenario.factionName}</h3>
                <p>{selectedScenario.summary}</p>
                <div className="campaign-kickers">
                  <div>
                    <div className="section-cap">战略信条</div>
                    <p>{selectedScenario.doctrine}</p>
                  </div>
                  <div>
                    <div className="section-cap">胜利视角</div>
                    <p>{selectedScenario.victoryLens}</p>
                  </div>
                </div>
              </div>

              <div className="turn-card sacred-panel">
                <div className="turn-header">
                  <div>
                    <p className="eyebrow">
                      第 {selectedRoundState.turnState.turnIndex + 1} / {selectedScenario.turns.length} 轮
                    </p>
                    <h3>
                      {selectedTurn
                        ? `${formatAncientYear(-selectedTurn.year)} · ${selectedTurn.title}`
                        : '战役结束'}
                    </h3>
                  </div>
                  <button
                    className="ghost-button"
                    onClick={() => resetScenario(selectedScenario.id)}
                    type="button"
                  >
                    重开此战役
                  </button>
                </div>

                {selectedTurn ? (
                  <>
                    <p className="turn-brief">{selectedTurn.brief}</p>
                    <ul className="objective-list">
                      {selectedTurn.objectives.map((objective) => (
                        <li key={objective}>{objective}</li>
                      ))}
                    </ul>

                    {selectedRoundState.status === 'choosing' ? (
                      <div className="choice-grid">
                        {selectedTurn.choices.map((choice, index) => (
                          <article key={choice.id} className="choice-card">
                            <div className="choice-card-header">
                              <strong>{choice.label}</strong>
                              <span>{choice.id}</span>
                            </div>
                            <p>{choice.detail}</p>
                            <div className="effect-badges">
                              {Object.entries(choice.effects).map(([key, value]) => (
                                <span key={key} className="pill">
                                  {key} {value! > 0 ? '+' : ''}
                                  {value}
                                </span>
                              ))}
                            </div>
                            <button
                              className="primary-button choice-action"
                              onClick={() => handleScenarioChoice(index)}
                              type="button"
                            >
                              采用此策略
                            </button>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <div className="resolution-card sacred-panel inner">
                        <div className="section-cap">本轮结算</div>
                        <h4>
                          已选择：
                          {
                            selectedTurn.choices.find(
                              (choice) => choice.id === selectedRoundState.selectedChoiceId,
                            )?.label
                          }
                        </h4>
                        <p>{selectedRoundState.resolution?.summary}</p>
                        <p className="resolution-note">
                          史实并不会自动翻页。你需要先消化本轮后果，再决定进入下一轮。
                        </p>
                        <button
                          className="primary-button"
                          onClick={handleAdvanceCampaign}
                          type="button"
                        >
                          下一轮
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="history-card sacred-panel inner">
                    <div className="section-cap">战役结束</div>
                    <p>{describeCampaignEnding(selectedRoundState)}</p>
                    <button
                      className="primary-button"
                      onClick={() => resetScenario(selectedScenario.id)}
                      type="button"
                    >
                      再推演一次
                    </button>
                  </div>
                )}
              </div>
            </div>

            <aside className="campaign-side">
              <div className="campaign-timeline-card sacred-panel">
                <div className="section-cap">战争资源</div>
                <div className="resource-meter-list">
                  {(Object.entries(selectedRoundState.turnState.resources) as Array<
                    [keyof ResourceState, number]
                  >).map(([key, value]) => (
                    <div key={key} className="resource-meter">
                      <span>{RESOURCE_LABELS[key]}</span>
                      <div className="resource-bar">
                        <div className="resource-fill" style={{ width: `${value}%` }} />
                      </div>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="campaign-timeline-card sacred-panel">
                <div className="section-cap">历史偏离度</div>
                <p className="divergence-score">{selectedRoundState.turnState.historicalDivergence}</p>
                <p>{describeCampaignEnding(selectedRoundState)}</p>
              </div>

              <div className="campaign-timeline-card sacred-panel">
                <div className="section-cap">已走过的选择</div>
                <div className="history-list">
                  {selectedRoundState.turnState.choiceHistory.length > 0 ? (
                    selectedRoundState.turnState.choiceHistory.map((entry) => (
                      <div key={`${entry.turnId}-${entry.choiceId}`} className="history-item">
                        <strong>{entry.label}</strong>
                        <span>{entry.turnId}</span>
                      </div>
                    ))
                  ) : (
                    <p>战役尚未开始。</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="thucydides" className="story-section">
          <div className="section-heading">
            <p className="eyebrow">第四章</p>
            <h2>修昔底德为何写这本书</h2>
            <p>
              他并不是给胜利者写赞歌，而是在政治失败和流放之后，试图留下一个仍可被后世使用的解释框架。
            </p>
          </div>

          <div className="lore-grid">
            {thucydidesLore.map((entry) => (
              <article key={entry.id} className="lore-card sacred-panel">
                <p className="eyebrow">{entry.eyebrow}</p>
                <h3>{entry.title}</h3>
                <p>{entry.body}</p>
                <blockquote>{entry.emphasis}</blockquote>
                <div className="chip-row">
                  {entry.relatedEntities.map((entityId) => (
                    <button
                      key={entityId}
                      className="chip-button"
                      onClick={() => openEntity(entityId)}
                      type="button"
                    >
                      {entityMap[entityId]?.name ?? entityId}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="graph" className="story-section">
          <div className="section-heading">
            <p className="eyebrow">第五章</p>
            <h2>知识图谱</h2>
            <p>
              这里默认先展示战争核心子图，再允许你切到更大的网络。人物、城邦、事件、概念与文献都可以直接点开，
              进一步跳回地图、阶段和战棋中的对应位置。
            </p>
          </div>

          {isLoading ? (
            <div className="loading-card sacred-panel">
              <p>正在装配图谱、实体与地图叙事……</p>
            </div>
          ) : loadError ? (
            <div className="error-card sacred-panel">
              <p>{loadError}</p>
            </div>
          ) : (
            <GraphExplorer
              coreGraph={coreGraph}
              fullGraph={fullGraph}
              entities={entities}
              entityMap={entityMap}
              externalSelectedId={selectedEntityId}
              onOpenEntity={openEntity}
            />
          )}
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer-copy">
          <span>© 2026 </span>
          <a href="https://www.yuan.cafe" target="_blank" rel="noreferrer">
            Leo Yuan Tsao
          </a>
          <span> </span>
          <a href="https://yuandian.club" target="_blank" rel="noreferrer">
            SEED Reading Club
          </a>
        </div>

        <div className="site-footer-socials" aria-label="社交媒体链接">
          <a
            className="social-link"
            href="https://github.com/yuancafe"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            title="GitHub"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.58 2 12.24c0 4.53 2.87 8.37 6.84 9.73.5.1.66-.22.66-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.22-3.37-1.22-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.9 1.58 2.35 1.13 2.92.86.09-.67.35-1.13.63-1.39-2.22-.26-4.56-1.15-4.56-5.11 0-1.13.39-2.05 1.03-2.77-.1-.26-.45-1.31.1-2.74 0 0 .84-.27 2.75 1.06A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.52.37 1.91-1.33 2.75-1.06 2.75-1.06.55 1.43.2 2.48.1 2.74.64.72 1.03 1.64 1.03 2.77 0 3.97-2.35 4.84-4.59 5.1.36.32.68.94.68 1.9 0 1.38-.01 2.49-.01 2.83 0 .27.18.59.67.49A10.27 10.27 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z" />
            </svg>
          </a>

          <a
            className="social-link"
            href="https://www.linkedin.com/in/yuan-cao/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3C4.17 3 3.3 3.9 3.3 5s.87 2 1.95 2 1.95-.9 1.95-2S6.33 3 5.25 3Zm14.45 9.87c0-3.28-1.72-4.81-4.02-4.81-1.85 0-2.67 1.03-3.13 1.75V8.5H9.18V20h3.37v-6.4c0-.34.02-.69.13-.93.27-.69.88-1.4 1.91-1.4 1.35 0 1.89 1.06 1.89 2.62V20h3.37l-.01-7.13Z" />
            </svg>
          </a>

          <a
            className="social-link"
            href="https://www.instagram.com/leo.yuan.cao/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            title="Instagram"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9Zm9.95 1.35a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z" />
            </svg>
          </a>

          <div className="social-link social-link-wechat" aria-label="WeChat" title="WeChat">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9.44 4C5.33 4 2 6.76 2 10.17c0 1.93 1.07 3.65 2.74 4.79L4 18l3.15-1.58c.73.19 1.49.3 2.29.3 4.11 0 7.44-2.76 7.44-6.17S13.55 4 9.44 4Zm-2.6 5.39a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Zm5.2 0a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Zm7.03 2.53c-2.72 0-4.93 1.84-4.93 4.1 0 2.26 2.21 4.1 4.93 4.1.53 0 1.04-.07 1.52-.2L23 21l-.69-2.08C23.37 18.2 24 17.17 24 16.02c0-2.26-2.21-4.1-4.93-4.1Zm-1.72 3.42a.63.63 0 1 1 0 1.26.63.63 0 0 1 0-1.26Zm3.44 0a.63.63 0 1 1 0 1.26.63.63 0 0 1 0-1.26Z" />
            </svg>
            <div className="wechat-popover">
              <img src="/social/wechat-qrcode.jpg" alt="Leo Yuan Tsao 微信二维码" />
              <span>微信扫码关注</span>
            </div>
          </div>
        </div>
      </footer>

      <EntityDrawer
        entity={selectedEntity}
        entityMap={entityMap}
        isOpen={selectedEntity != null}
        phases={warPhases}
        onClose={() => setSelectedEntityId(null)}
        onSelectEntity={openEntity}
        onJumpToPhase={(phaseId) => {
          const phase = warPhases.find((item) => item.id === phaseId)
          if (phase) {
            handlePhaseSelect(phase)
          }
        }}
      />
    </div>
  )
}

export default App
