import { describe, expect, it } from 'vitest'

import { shouldAutoFocusGraph } from './graphInteraction'

describe('graphInteraction', () => {
  it('never auto-focuses on hover or drag events', () => {
    expect(shouldAutoFocusGraph('hover')).toBe(false)
    expect(shouldAutoFocusGraph('drag')).toBe(false)
  })

  it('only allows camera focus on explicit actions like search or node click', () => {
    expect(shouldAutoFocusGraph('search')).toBe(true)
    expect(shouldAutoFocusGraph('node-click')).toBe(true)
    expect(shouldAutoFocusGraph('double-click')).toBe(true)
  })
})
