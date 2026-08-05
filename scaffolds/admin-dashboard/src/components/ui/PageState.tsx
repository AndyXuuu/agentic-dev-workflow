import { AlertTriangle, Inbox, LoaderCircle } from 'lucide-react'

import { Button } from './Button'

type PageStateProps = {
  description: string
  surface?: boolean
  title: string
} & (
  | { state: 'loading'; onRetry?: never }
  | { state: 'empty'; onRetry?: never }
  | { state: 'error'; onRetry: () => void }
)

export function PageState(props: PageStateProps) {
  const Icon = props.state === 'loading' ? LoaderCircle : props.state === 'empty' ? Inbox : AlertTriangle
  const className = `${props.surface === false ? '' : 'surface-card '}app-surface-body grid min-h-60 place-items-center text-center`

  return (
    <div aria-live={props.state === 'error' ? undefined : 'polite'} className={className} role={props.state === 'error' ? 'alert' : 'status'}>
      <div className="max-w-sm">
        <span className="app-text-muted mx-auto grid size-12 place-items-center rounded-2xl bg-base-200">
          <Icon aria-hidden className={`app-icon-xl${props.state === 'loading' ? ' animate-spin' : ''}`} />
        </span>
        <h2 className="app-section-title mt-4">{props.title}</h2>
        <p className="app-section-description mt-1.5">{props.description}</p>
        {props.state === 'error' && (
          <Button className="mt-5" onClick={props.onRetry} size="small" variant="primary">
            重新加载
          </Button>
        )}
      </div>
    </div>
  )
}
