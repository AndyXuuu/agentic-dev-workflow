import { AlertTriangle, Inbox, LoaderCircle } from 'lucide-react'

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
  const className = `${props.surface === false ? '' : 'surface-card '}grid min-h-72 place-items-center p-6 text-center`

  return (
    <div aria-live="polite" className={className} role={props.state === 'error' ? 'alert' : 'status'}>
      <div className="max-w-sm">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-base-200 text-base-content/55">
          <Icon aria-hidden className={props.state === 'loading' ? 'animate-spin' : undefined} size={23} />
        </span>
        <h2 className="mt-4 text-lg font-semibold">{props.title}</h2>
        <p className="mt-2 text-sm leading-6 text-base-content/55">{props.description}</p>
        {props.state === 'error' && (
          <button className="btn btn-primary btn-sm mt-5" onClick={props.onRetry} type="button">
            重新加载
          </button>
        )}
      </div>
    </div>
  )
}
