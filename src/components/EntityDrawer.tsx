import type { EntityRecord, WarPhase } from '../types'

interface EntityDrawerProps {
  entity: EntityRecord | null
  entityMap: Record<string, EntityRecord>
  isOpen: boolean
  phases: WarPhase[]
  onClose: () => void
  onSelectEntity: (id: string) => void
  onJumpToPhase: (phaseId: string) => void
}

const categoryLabelMap: Record<string, string> = {
  Person: '人物',
  Place: '地点',
  Event: '事件',
  Polis: '城邦',
  Organization: '组织',
  Concept: '概念',
  Document: '文献',
  Period: '时期',
  Artifact: '器物',
  Other: '其他',
}

export function EntityDrawer({
  entity,
  entityMap,
  isOpen,
  phases,
  onClose,
  onSelectEntity,
  onJumpToPhase,
}: EntityDrawerProps) {
  const relatedPhases = phases.filter((phase) => entity?.relatedPhaseIds.includes(phase.id))

  return (
    <div className={`entity-drawer-shell ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
      <button
        className={`entity-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
        aria-label="关闭实体详情"
        type="button"
      />
      <aside key={entity?.id ?? 'empty'} className={`entity-drawer ${isOpen ? 'open' : ''}`}>
        <div className="entity-drawer-header">
          <div>
            <p className="eyebrow">知识卡片</p>
            <h3>{entity?.name ?? '实体详情'}</h3>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="关闭详情" type="button">
            关闭
          </button>
        </div>

        {entity ? (
          <div className="entity-drawer-content">
            {entity.portrait ? (
              <figure className="entity-portrait-block">
                <img
                  className="entity-portrait"
                  src={entity.portrait.src}
                  alt={entity.portrait.alt}
                />
                <figcaption>{entity.portrait.credit}</figcaption>
              </figure>
            ) : (
              <div className="entity-portrait-fallback">
                <span>{entity.name}</span>
              </div>
            )}

            <div className="entity-meta-row">
              <span className="pill pill-solid">{categoryLabelMap[entity.category] ?? '实体'}</span>
              <span className="pill">关联度 {entity.degree}</span>
              {entity.aliases.length > 0 ? (
                <span className="pill">别名 {entity.aliases.slice(0, 3).join(' / ')}</span>
              ) : null}
            </div>

            <div className="entity-copy">
              <p className="entity-summary">{entity.summary}</p>
              {entity.description.split('\n').map((paragraph) =>
                paragraph.trim() ? (
                  <p key={`${entity.id}-${paragraph.slice(0, 18)}`}>{paragraph}</p>
                ) : null,
              )}
            </div>

            {relatedPhases.length > 0 ? (
              <section className="drawer-block">
                <div className="section-cap">关联战局阶段</div>
                <div className="chip-row">
                  {relatedPhases.map((phase) => (
                    <button
                      key={phase.id}
                      className="chip-button"
                      onClick={() => onJumpToPhase(phase.id)}
                      type="button"
                    >
                      {phase.title}
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            {entity.relatedEntities.length > 0 ? (
              <section className="drawer-block">
                <div className="section-cap">关系延展</div>
                <div className="chip-row">
                  {entity.relatedEntities.slice(0, 18).map((relatedId) => {
                    const related = entityMap[relatedId]
                    if (!related) return null

                    return (
                      <button
                        key={relatedId}
                        className="chip-button"
                        onClick={() => onSelectEntity(relatedId)}
                        type="button"
                      >
                        {related.name}
                      </button>
                    )
                  })}
                </div>
              </section>
            ) : null}
          </div>
        ) : (
          <div className="entity-drawer-empty">
            <p>从地图、战棋、战争阶段或知识图谱中点开任一实体，这里都会显示中文介绍与关联信息。</p>
          </div>
        )}
      </aside>
    </div>
  )
}
