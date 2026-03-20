import type {
  CampaignResolution,
  ChoiceHistoryEntry,
  ResourceState,
  ScenarioId,
  TurnChoice,
  TurnChoiceEffect,
  TurnState,
} from '../types'

const INITIAL_RESOURCES: Record<ScenarioId, ResourceState> = {
  athens: {
    treasury: 88,
    navalPower: 88,
    landPower: 52,
    supplies: 78,
    allyLoyalty: 72,
    morale: 76,
  },
  sparta: {
    treasury: 56,
    navalPower: 38,
    landPower: 84,
    supplies: 74,
    allyLoyalty: 68,
    morale: 79,
  },
  syracuse: {
    treasury: 62,
    navalPower: 60,
    landPower: 70,
    supplies: 66,
    allyLoyalty: 64,
    morale: 71,
  },
}

const INITIAL_YEAR: Record<ScenarioId, number> = {
  athens: 431,
  sparta: 431,
  syracuse: 415,
}

const RESOURCE_KEYS = [
  'treasury',
  'navalPower',
  'landPower',
  'supplies',
  'allyLoyalty',
  'morale',
] as const

export function clampResource(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function createInitialTurnState(scenarioId: ScenarioId): TurnState {
  return {
    scenarioId,
    year: INITIAL_YEAR[scenarioId],
    turnIndex: 0,
    resources: { ...INITIAL_RESOURCES[scenarioId] },
    historicalDivergence: 0,
    choiceHistory: [],
  }
}

function applyEffects(resources: ResourceState, effects: TurnChoiceEffect): ResourceState {
  const next = { ...resources }
  for (const key of RESOURCE_KEYS) {
    next[key] = clampResource(next[key] + (effects[key] ?? 0))
  }
  return next
}

function makeChoiceHistoryEntry(choice: TurnChoice, turnId?: string): ChoiceHistoryEntry {
  return {
    choiceId: choice.id,
    label: choice.label,
    turnId,
    effects: choice.effects,
  }
}

export function applyChoiceOutcome(
  state: TurnState,
  choice: TurnChoice,
  turnId?: string,
): TurnState {
  return {
    ...state,
    resources: applyEffects(state.resources, choice.effects),
    historicalDivergence: clampResource(
      state.historicalDivergence + (choice.effects.historicalDivergence ?? 0),
    ),
    choiceHistory: [...state.choiceHistory, makeChoiceHistoryEntry(choice, turnId)],
  }
}

export function resolveTurnOutcome(
  state: TurnState,
  input: { historicalEvent: string; divergenceHint: string },
): CampaignResolution {
  const tone =
    state.historicalDivergence >= 45
      ? '你已经明显偏离修昔底德笔下的主线'
      : state.historicalDivergence >= 20
        ? '你正在把史实推向另一条更紧张的支线'
        : '你仍大体行走在史实允许的轨道之内'

  return {
    nextYear: state.year + 1,
    summary: `${input.historicalEvent} ${input.divergenceHint} ${tone}。`,
    snapshot: state,
  }
}
