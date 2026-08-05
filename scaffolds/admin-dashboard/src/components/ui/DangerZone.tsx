import { ShieldAlert } from 'lucide-react'
import { useId } from 'react'

import { Button } from './Button'

export type DangerZoneAction = {
  id: string
  title: string
  description: string
  impact: string
  recovery: string
  triggerLabel: string
  confirmLabel: string
  confirmationPhrase?: string
}

type DangerZoneProps = {
  actions: readonly DangerZoneAction[]
  description?: string
  onSelect: (action: DangerZoneAction) => void
  title?: string
}

export function DangerZone({
  actions,
  description = '这里的操作可能改变服务状态或破坏数据。执行前请确认影响范围与恢复方式。',
  onSelect,
  title = '危险操作',
}: DangerZoneProps) {
  const titleId = useId()
  const descriptionIdPrefix = useId()

  return (
    <section aria-labelledby={titleId} className="surface-card app-danger-zone">
      <div className="app-panel-header">
        <div className="flex items-start gap-3">
          <span aria-hidden className="app-danger-zone-icon">
            <ShieldAlert className="app-icon-md" />
          </span>
          <div>
            <h2 className="app-section-title" id={titleId}>{title}</h2>
            <p className="app-section-description mt-0.5">{description}</p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-base-300/70">
        {actions.map((action) => {
          const descriptionId = `${descriptionIdPrefix}-${action.id}`
          return (
            <article className="app-danger-zone-action" key={action.id}>
              <div className="min-w-0">
                <h3 className="app-body font-semibold">{action.title}</h3>
                <p className="app-caption app-text-muted mt-1" id={descriptionId}>{action.description}</p>
              </div>
              <Button
                aria-describedby={descriptionId}
                onClick={() => onSelect(action)}
                size="small"
                variant="dangerOutline"
              >
                {action.triggerLabel}
              </Button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
