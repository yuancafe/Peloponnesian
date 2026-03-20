import {
  applyChoiceOutcome,
  createInitialTurnState,
  resolveTurnOutcome,
} from './campaignEngine'
import type {
  CampaignRoundState,
  CampaignSaveData,
  CampaignScenario,
  CampaignResolution,
  ScenarioId,
  TurnChoice,
} from '../types'

export function createInitialCampaignRoundState(scenarioId: ScenarioId): CampaignRoundState {
  return {
    status: 'choosing',
    turnState: createInitialTurnState(scenarioId),
    selectedChoiceId: null,
    resolution: null,
  }
}

export function selectChoiceForRound(
  roundState: CampaignRoundState,
  choice: TurnChoice,
  turnId: string,
  analysisInput: { historicalEvent: string; divergenceHint: string },
): CampaignRoundState {
  const updatedTurnState = applyChoiceOutcome(roundState.turnState, choice, turnId)
  const resolution = resolveTurnOutcome(updatedTurnState, analysisInput)

  return {
    status: 'resolved',
    turnState: updatedTurnState,
    selectedChoiceId: choice.id,
    resolution,
  }
}

export function advanceFromResolution(
  roundState: CampaignRoundState,
  scenario: CampaignScenario,
): CampaignRoundState {
  const nextTurnIndex = roundState.turnState.turnIndex + 1
  const isComplete = nextTurnIndex >= scenario.turns.length

  return {
    status: isComplete ? 'complete' : 'choosing',
    turnState: {
      ...roundState.turnState,
      turnIndex: nextTurnIndex,
      year: roundState.resolution?.nextYear ?? roundState.turnState.year,
    },
    selectedChoiceId: null,
    resolution: isComplete ? roundState.resolution : null,
  }
}

export function createCampaignSaveData(data: CampaignSaveData): CampaignSaveData {
  return data
}

export function getRoundResolution(roundState: CampaignRoundState): CampaignResolution | null {
  return roundState.resolution
}
