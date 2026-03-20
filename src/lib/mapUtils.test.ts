import { describe, expect, it } from 'vitest'

import type { MapNode, TimelineEvent } from '../types'
import {
  getActiveTimelineEvents,
  getVisibleMapNodes,
  resolveMarkerEntityId,
} from './mapUtils'

const nodes: MapNode[] = [
  {
    id: 'athens-polis',
    entityId: '雅典',
    label: '雅典',
    left: '62%',
    top: '49%',
    layer: 'polities',
    icon: 'capital',
    visibleFromYear: -446,
    visibleToYear: -404,
    relatedPhaseIds: ['prelude', 'archidamian'],
  },
  {
    id: 'pericles-person',
    entityId: '伯里克利',
    label: '伯里克利',
    left: '62%',
    top: '48%',
    layer: 'people',
    icon: 'person',
    visibleFromYear: -443,
    visibleToYear: -429,
    relatedPhaseIds: ['prelude', 'archidamian'],
  },
  {
    id: 'aeospotami-event',
    entityId: '羊河之役',
    label: '羊河',
    left: '82%',
    top: '20%',
    layer: 'events',
    icon: 'naval',
    visibleFromYear: -405,
    visibleToYear: -404,
    relatedPhaseIds: ['ionian-war'],
  },
]

const timeline: TimelineEvent[] = [
  {
    id: 'war-begins',
    year: -431,
    title: '战争爆发',
    summary: '雅典与斯巴达正式进入长期战争。',
    relatedEntityIds: ['雅典', '斯巴达'],
    nodeIds: ['athens-polis'],
  },
  {
    id: 'aeospotami',
    year: -405,
    title: '羊河之役',
    summary: '莱山德几乎摧毁雅典海军。',
    relatedEntityIds: ['羊河之役', '莱山德'],
    nodeIds: ['aeospotami-event'],
  },
]

describe('mapUtils', () => {
  it('filters visible map nodes by layer and year', () => {
    expect(getVisibleMapNodes(nodes, 'polities', -431).map((node) => node.id)).toEqual([
      'athens-polis',
    ])
    expect(getVisibleMapNodes(nodes, 'people', -431).map((node) => node.id)).toEqual([
      'pericles-person',
    ])
    expect(getVisibleMapNodes(nodes, 'events', -405).map((node) => node.id)).toEqual([
      'aeospotami-event',
    ])
  })

  it('returns timeline events up to the chosen year', () => {
    expect(getActiveTimelineEvents(timeline, -431).map((event) => event.id)).toEqual([
      'war-begins',
    ])
    expect(getActiveTimelineEvents(timeline, -405).map((event) => event.id)).toEqual([
      'war-begins',
      'aeospotami',
    ])
  })

  it('resolves entity ids directly from map nodes so special markers like 羊河 can open details', () => {
    expect(resolveMarkerEntityId(nodes, 'aeospotami-event')).toBe('羊河之役')
    expect(resolveMarkerEntityId(nodes, 'athens-polis')).toBe('雅典')
  })
})
