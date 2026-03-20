import { buildEntitySearchIndex, dedupeStrings } from './graphUtils'
import type { EntityRecord, EntityPortrait, GraphData, GraphNodeRecord } from '../types'

interface EntityEnhancement {
  portrait?: EntityPortrait
  summary?: string
  descriptionAppend?: string
}

function mergeEntity(base: EntityRecord | undefined, incoming: EntityRecord): EntityRecord {
  if (!base) {
    return {
      ...incoming,
      aliases: dedupeStrings(incoming.aliases),
    }
  }

  return {
    ...base,
    ...incoming,
    aliases: dedupeStrings([...base.aliases, ...incoming.aliases]),
    relatedEntities: dedupeStrings([...base.relatedEntities, ...incoming.relatedEntities]),
    relatedPhaseIds: dedupeStrings([...base.relatedPhaseIds, ...incoming.relatedPhaseIds]),
    degree: Math.max(base.degree, incoming.degree),
  }
}

export function mergeEntityCatalog(
  loadedEntities: EntityRecord[],
  enhancements: Record<string, EntityEnhancement>,
  syntheticEntities: EntityRecord[],
): EntityRecord[] {
  const merged = new Map<string, EntityRecord>()

  for (const entity of [...loadedEntities, ...syntheticEntities]) {
    merged.set(entity.id, mergeEntity(merged.get(entity.id), entity))
  }

  return [...merged.values()]
    .map((entity) => {
      const enhancement = enhancements[entity.id]
      const summary = enhancement?.summary ?? entity.summary
      const description = enhancement?.descriptionAppend
        ? `${entity.description}\n\n${enhancement.descriptionAppend}`
        : entity.description

      return {
        ...entity,
        summary,
        description,
        portrait: enhancement?.portrait ?? entity.portrait,
        aliases: dedupeStrings(entity.aliases),
        relatedEntities: dedupeStrings(entity.relatedEntities),
        relatedPhaseIds: dedupeStrings(entity.relatedPhaseIds),
        searchIndex: buildEntitySearchIndex({
          id: entity.id,
          name: entity.name,
          aliases: dedupeStrings(entity.aliases),
          summary,
        }),
      }
    })
    .sort((left, right) => right.degree - left.degree || left.name.localeCompare(right.name, 'zh-Hans-CN'))
}

export function buildEntityMap(entities: EntityRecord[]): Record<string, EntityRecord> {
  return Object.fromEntries(entities.map((entity) => [entity.id, entity]))
}

function makeGraphNodeFromEntity(entity: EntityRecord): GraphNodeRecord {
  return {
    id: entity.id,
    label: entity.name,
    name: entity.name,
    category: entity.category,
    degree: entity.degree,
    aliases: entity.aliases,
    summary: entity.summary,
  }
}

export function ensureGraphContainsEntities(
  graph: GraphData | null,
  entityMap: Record<string, EntityRecord>,
  requiredIds: Iterable<string>,
): GraphData | null {
  if (!graph) {
    return null
  }

  const nodes = new Map<string, GraphNodeRecord>(
    graph.nodes.map((node) => {
      const entity = entityMap[node.id]
      return [
        node.id,
        entity
          ? {
              ...node,
              aliases: entity.aliases,
              summary: entity.summary,
              category: entity.category,
              degree: Math.max(node.degree, entity.degree),
            }
          : node,
      ]
    }),
  )
  const links = new Set(graph.links.map((link) => `${link.source}:::${link.target}`))

  for (const id of requiredIds) {
    const entity = entityMap[id]
    if (!entity) continue

    if (!nodes.has(id)) {
      nodes.set(id, makeGraphNodeFromEntity(entity))
    }

    for (const relatedId of entity.relatedEntities) {
      if (!entityMap[relatedId]) continue
      if (!nodes.has(relatedId)) continue

      const forwardKey = `${id}:::${relatedId}`
      const reverseKey = `${relatedId}:::${id}`
      if (!links.has(forwardKey) && !links.has(reverseKey)) {
        links.add(forwardKey)
      }
    }
  }

  return {
    nodes: [...nodes.values()],
    links: [...links].map((key) => {
      const [source, target] = key.split(':::')
      return { source, target }
    }),
  }
}
