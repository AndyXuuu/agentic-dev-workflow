import type { ReactNode } from 'react'

type PageHeaderProps = {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="app-caption app-text-accent font-bold uppercase tracking-[0.16em]">{eyebrow}</p>}
        <h1 className="app-page-title mt-1">{title}</h1>
        <p className="app-page-description mt-1">{description}</p>
      </div>
      {actions && <div className="app-control-gap flex flex-wrap items-center">{actions}</div>}
    </header>
  )
}
