import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function Panel({ title, description, action, children, className = '' }: PanelProps) {
  return (
    <section className={`surface-card ${className}`}>
      <div className="app-panel-header">
        <div>
          <h2 className="app-section-title">{title}</h2>
          {description && <p className="app-section-description mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
