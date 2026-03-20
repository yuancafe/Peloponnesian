import { describe, expect, it } from 'vitest'

import type { CampaignScenario, TurnChoice } from '../types'
import {
  advanceFromResolution,
  createCampaignSaveData,
  createInitialCampaignRoundState,
  selectChoiceForRound,
} from './campaignFlow'

const sampleChoice: TurnChoice = {
  id: 'hold-walls',
  label: '固守长墙',
  detail: '避免在陆地与斯巴达决战。',
  effects: { treasury: -6, navalPower: 4, historicalDivergence: 2 },
  relatedEntities: ['雅典', '伯里克利'],
}

const sampleScenario: CampaignScenario = {
  id: 'athens',
  factionName: '雅典海上帝国',
  banner: '测试横幅',
  summary: '测试场景',
  doctrine: '测试 doctrine',
  victoryLens: '测试 victory',
  turns: [
    {
      id: 'athens-431',
      year: 431,
      title: '第一轮',
      brief: '测试',
      objectives: ['目标 1'],
      historicalEvent: '史实事件 A',
      divergenceHint: '偏离提示 A',
      relatedEntities: ['雅典'],
      choices: [sampleChoice],
    },
    {
      id: 'athens-430',
      year: 430,
      title: '第二轮',
      brief: '测试',
      objectives: ['目标 2'],
      historicalEvent: '史实事件 B',
      divergenceHint: '偏离提示 B',
      relatedEntities: ['雅典'],
      choices: [sampleChoice],
    },
  ],
}

describe('campaignFlow', () => {
  it('keeps the round in resolution state until the player explicitly advances', () => {
    const initial = createInitialCampaignRoundState('athens')
    const resolved = selectChoiceForRound(initial, sampleChoice, 'athens-431', {
      historicalEvent: '史实中雅典依靠长墙与舰队应对最初冲击。',
      divergenceHint: '你的判断仍贴近伯里克利的原始构想。',
    })

    expect(resolved.status).toBe('resolved')
    expect(resolved.selectedChoiceId).toBe('hold-walls')
    expect(resolved.turnState.turnIndex).toBe(0)
    expect(resolved.resolution?.summary).toContain('伯里克利')

    const advanced = advanceFromResolution(resolved, sampleScenario)
    expect(advanced.status).toBe('choosing')
    expect(advanced.turnState.turnIndex).toBe(1)
  })

  it('serializes enough information to restore the exact round state after refresh', () => {
    const resolved = selectChoiceForRound(
      createInitialCampaignRoundState('athens'),
      sampleChoice,
      'athens-431',
      {
        historicalEvent: '史实事件',
        divergenceHint: '偏离提示',
      },
    )

    const save = createCampaignSaveData({
      athens: resolved,
      sparta: createInitialCampaignRoundState('sparta'),
      syracuse: createInitialCampaignRoundState('syracuse'),
    })

    expect(save.athens.status).toBe('resolved')
    expect(save.athens.selectedChoiceId).toBe('hold-walls')
    expect(save.athens.turnState.turnIndex).toBe(0)
  })
})
