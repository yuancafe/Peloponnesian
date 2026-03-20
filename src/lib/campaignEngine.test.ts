import { describe, expect, it } from 'vitest'

import {
  applyChoiceOutcome,
  clampResource,
  createInitialTurnState,
  resolveTurnOutcome,
} from './campaignEngine'

describe('campaignEngine', () => {
  it('applies chapter choices and keeps resources inside legal bounds', () => {
    const initial = createInitialTurnState('athens')
    const updated = applyChoiceOutcome(initial, {
      id: 'double-down-at-sea',
      label: '扩大海上打击',
      detail: '测试用选项',
      relatedEntities: ['雅典'],
      effects: {
        treasury: -18,
        navalPower: 12,
        morale: 6,
        supplies: -9,
        historicalDivergence: 8,
      },
    })

    expect(updated.resources.treasury).toBe(70)
    expect(updated.resources.navalPower).toBe(100)
    expect(updated.resources.supplies).toBe(69)
    expect(updated.historicalDivergence).toBe(8)
    expect(updated.choiceHistory).toHaveLength(1)
  })

  it('resolves turn outcomes with a readable divergence summary', () => {
    const state = applyChoiceOutcome(createInitialTurnState('sparta'), {
      id: 'fortify-decelea',
      label: '提前固守德凯利亚',
      detail: '测试用选项',
      relatedEntities: ['德凯利亚'],
      effects: {
        landPower: 8,
        allyLoyalty: 5,
        treasury: -6,
        historicalDivergence: 10,
      },
    })

    const outcome = resolveTurnOutcome(state, {
      historicalEvent: '史实中斯巴达在德凯利亚建立持久前进基地，长期消耗雅典。',
      divergenceHint: '你更早把压力施加到雅典腹地，战争节奏会明显前移。',
    })

    expect(outcome.nextYear).toBe(state.year + 1)
    expect(outcome.summary).toContain('德凯利亚')
    expect(outcome.summary).toContain('前移')
    expect(outcome.snapshot.resources.landPower).toBeGreaterThan(80)
  })

  it('clamps resource values to the 0-100 range', () => {
    expect(clampResource(-12)).toBe(0)
    expect(clampResource(36)).toBe(36)
    expect(clampResource(140)).toBe(100)
  })
})
