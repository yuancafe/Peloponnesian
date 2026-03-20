import { describe, expect, it } from 'vitest'

import {
  buildEntitySearchIndex,
  canonicalizeEntityName,
  isExcludedEntityName,
  normalizeEntityCategory,
  selectCoreGraph,
} from './graphUtils'
import type { GraphData } from '../types'

describe('graphUtils', () => {
  it('normalizes aliases and category mismatches for core war entities', () => {
    expect(canonicalizeEntityName('亚西比德')).toBe('阿尔基比亚德')
    expect(canonicalizeEntityName('亞西比得')).toBe('阿尔基比亚德')
    expect(canonicalizeEntityName('阿尔基比亚德')).toBe('阿尔基比亚德')
    expect(canonicalizeEntityName('伯羅奔尼撒戰爭')).toBe('伯罗奔尼撒战争')
    expect(canonicalizeEntityName('伯羅奔尼撒聯盟')).toBe('伯罗奔尼撒同盟')
    expect(canonicalizeEntityName('帕德嫩神庙')).toBe('帕特农神庙')

    expect(normalizeEntityCategory('Concept', '雅典')).toBe('Polis')
    expect(normalizeEntityCategory('Place', '斯巴达')).toBe('Polis')
    expect(normalizeEntityCategory('Document', '伯罗奔尼撒战争')).toBe('Event')
    expect(normalizeEntityCategory('Artifact', '埃及')).toBe('Place')
  })

  it('filters out publication and translator noise that should not appear as war entities', () => {
    expect(isExcludedEntityName('人民大学出版社')).toBe(true)
    expect(isExcludedEntityName('中国对外翻译出版公司')).toBe(true)
    expect(isExcludedEntityName('周作人')).toBe(true)
    expect(isExcludedEntityName('斯巴达')).toBe(false)
  })

  it('builds a search index that includes aliases', () => {
    const index = buildEntitySearchIndex({
      id: '阿尔基比亚德',
      name: '阿尔基比亚德',
      aliases: ['亚西比德'],
      summary: '一位善于煽动与转向联盟的雅典政治人物',
    })

    expect(index).toContain('阿尔基比亚德')
    expect(index).toContain('亚西比德')
    expect(index).toContain('联盟')
  })

  it('selects a focused core graph around key war seeds', () => {
    const graph: GraphData = {
      nodes: [
        { id: '雅典', label: '雅典', name: '雅典', category: 'Polis', degree: 12, aliases: [], summary: '' },
        { id: '斯巴达', label: '斯巴达', name: '斯巴达', category: 'Polis', degree: 11, aliases: [], summary: '' },
        { id: '阿尔基比亚德', label: '阿尔基比亚德', name: '阿尔基比亚德', category: 'Person', degree: 6, aliases: [], summary: '' },
        { id: '波斯', label: '波斯', name: '波斯', category: 'Organization', degree: 5, aliases: [], summary: '' },
        { id: '随机节点', label: '随机节点', name: '随机节点', category: 'Concept', degree: 1, aliases: [], summary: '' },
      ],
      links: [
        { source: '雅典', target: '阿尔基比亚德' },
        { source: '斯巴达', target: '波斯' },
      ],
    }

    const core = selectCoreGraph(graph, ['雅典', '斯巴达'])

    expect(core.nodes.map((node) => node.id)).toEqual(
      expect.arrayContaining(['雅典', '斯巴达', '阿尔基比亚德', '波斯']),
    )
    expect(core.nodes.map((node) => node.id)).not.toContain('随机节点')
    expect(core.links).toHaveLength(2)
  })
})
