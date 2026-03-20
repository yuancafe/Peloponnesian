export type NormalizedCategory =
  | 'Person'
  | 'Place'
  | 'Event'
  | 'Polis'
  | 'Organization'
  | 'Concept'
  | 'Document'
  | 'Period'
  | 'Artifact'
  | 'Other'

export interface EntityRecord {
  id: string
  name: string
  aliases: string[]
  category: NormalizedCategory
  degree: number
  summary: string
  description: string
  relatedEntities: string[]
  relatedPhaseIds: string[]
  searchIndex: string
  portrait?: EntityPortrait
}

export interface EntityPortrait {
  src: string
  alt: string
  credit: string
}

export interface GraphNodeRecord {
  id: string
  label: string
  name: string
  category: NormalizedCategory
  degree: number
  aliases: string[]
  summary: string
}

export interface GraphLinkRecord {
  source: string
  target: string
}

export interface GraphData {
  nodes: GraphNodeRecord[]
  links: GraphLinkRecord[]
}

export type MapLayerId = 'polities' | 'people' | 'events'
export type MapNodeIcon = 'capital' | 'battle' | 'siege' | 'naval' | 'frontier' | 'person'

export interface MapMarker {
  id: string
  label: string
  left: string
  top: string
  alignment?: 'left' | 'right' | 'top' | 'bottom'
  phaseIds: string[]
  category: 'capital' | 'battle' | 'siege' | 'naval' | 'frontier'
}

export interface MapNode {
  id: string
  entityId: string
  label: string
  left: string
  top: string
  layer: MapLayerId
  icon: MapNodeIcon
  visibleFromYear: number
  visibleToYear: number
  relatedPhaseIds: string[]
  alignment?: 'left' | 'right' | 'top' | 'bottom'
  summary?: string
}

export interface MapRoute {
  id: string
  layer: MapLayerId | 'timeline'
  points: Array<{ left: string; top: string }>
  visibleFromYear: number
  visibleToYear: number
  relatedEntityIds: string[]
}

export interface TimelineEvent {
  id: string
  year: number
  title: string
  summary: string
  relatedEntityIds: string[]
  nodeIds: string[]
}

export interface WarPhase {
  id: string
  title: string
  range: string
  startYear: number
  endYear: number
  kicker: string
  summary: string
  spark: string
  strategicShape: string
  balance: string
  outcome: string
  relatedEntities: string[]
  markerIds: string[]
}

export type ScenarioId = 'athens' | 'sparta' | 'syracuse'

export interface ResourceState {
  treasury: number
  navalPower: number
  landPower: number
  supplies: number
  allyLoyalty: number
  morale: number
}

export interface TurnChoiceEffect extends Partial<ResourceState> {
  historicalDivergence?: number
}

export interface TurnChoice {
  id: string
  label: string
  detail: string
  effects: TurnChoiceEffect
  relatedEntities: string[]
}

export interface CampaignTurn {
  id: string
  year: number
  title: string
  brief: string
  objectives: string[]
  historicalEvent: string
  divergenceHint: string
  relatedEntities: string[]
  choices: TurnChoice[]
}

export interface CampaignScenario {
  id: ScenarioId
  factionName: string
  banner: string
  summary: string
  doctrine: string
  victoryLens: string
  turns: CampaignTurn[]
}

export interface ChoiceHistoryEntry {
  choiceId: string
  label: string
  turnId?: string
  effects: TurnChoiceEffect
}

export interface TurnState {
  scenarioId: ScenarioId
  year: number
  turnIndex: number
  resources: ResourceState
  historicalDivergence: number
  choiceHistory: ChoiceHistoryEntry[]
}

export interface CampaignResolution {
  nextYear: number
  summary: string
  snapshot: TurnState
}

export type CampaignPhaseStatus = 'choosing' | 'resolved' | 'complete'

export interface CampaignRoundState {
  status: CampaignPhaseStatus
  turnState: TurnState
  selectedChoiceId: string | null
  resolution: CampaignResolution | null
}

export interface CampaignSaveData {
  athens: CampaignRoundState
  sparta: CampaignRoundState
  syracuse: CampaignRoundState
}

export interface LoreEntry {
  id: string
  title: string
  eyebrow: string
  body: string
  emphasis: string
  relatedEntities: string[]
}
