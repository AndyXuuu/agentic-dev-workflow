import { type InputHTMLAttributes, type ReactNode, useId } from 'react'

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'checked' | 'defaultChecked' | 'role' | 'type'> & {
  checked: boolean
  description?: string
  error?: string
  label: ReactNode
}

export function Switch({ checked, className, description, error, id, label, ...props }: SwitchProps) {
  const generatedId = useId()
  const controlId = id ?? `${generatedId}-control`
  const message = error ?? description
  const messageId = message ? `${generatedId}-${error ? 'error' : 'description'}` : undefined

  return (
    <div>
      <label className="app-switch-control" htmlFor={controlId}>
        <span className="min-w-0 flex-1">
          <span className="app-control-text block font-semibold">{label}</span>
          {message && <span className={error ? 'app-caption app-text-error mt-1 block' : 'app-caption app-text-muted mt-1 block'} id={messageId}>{message}</span>}
        </span>
        <input
          aria-describedby={messageId}
          aria-invalid={error ? true : undefined}
          aria-checked={checked}
          checked={checked}
          className={['toggle toggle-primary', className].filter(Boolean).join(' ')}
          id={controlId}
          role="switch"
          type="checkbox"
          {...props}
        />
      </label>
    </div>
  )
}
