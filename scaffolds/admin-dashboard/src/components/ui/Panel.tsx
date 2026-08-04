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
      <div className="flex flex-col gap-3 border-b border-base-300/70 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-semibold tracking-tight">{title}</h2>
          {description && <p className="mt-1 text-sm text-base-content/55">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
