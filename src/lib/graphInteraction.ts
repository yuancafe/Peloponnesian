export type GraphIntent = 'hover' | 'drag' | 'search' | 'node-click' | 'double-click'

export function shouldAutoFocusGraph(intent: GraphIntent): boolean {
  return intent === 'search' || intent === 'node-click' || intent === 'double-click'
}
