import type { MapLayerId, MapNode, TimelineEvent } from '../types'

export function getVisibleMapNodes(
  nodes: MapNode[],
  layer: MapLayerId,
  year: number,
): MapNode[] {
  return nodes.filter(
    (node) =>
      node.layer === layer && year >= node.visibleFromYear && year <= node.visibleToYear,
  )
}

export function getActiveTimelineEvents(
  timeline: TimelineEvent[],
  year: number,
): TimelineEvent[] {
  return timeline
    .filter((event) => event.year <= year)
    .sort((left, right) => left.year - right.year)
}

export function resolveMarkerEntityId(nodes: MapNode[], markerId: string): string | null {
  return nodes.find((node) => node.id === markerId)?.entityId ?? null
}
