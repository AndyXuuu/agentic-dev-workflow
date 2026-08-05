import { type InputHTMLAttributes, type ReactNode, useEffect, useId, useRef } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  description?: string
  error?: string
  indeterminate?: boolean
  label: ReactNode
  labelHidden?: boolean
}

export function Checkbox({ className, description, error, id, indeterminate = false, label, labelHidden = false, ...props }: CheckboxProps) {
  const generatedId = useId()
  const controlId = id ?? `${generatedId}-control`
  const message = error ?? description
  const messageId = message ? `${generatedId}-${error ? 'error' : 'description'}` : undefined
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <div>
      <label className="app-choice-control" htmlFor={controlId}>
        <input
          aria-describedby={messageId}
          aria-invalid={error ? true : undefined}
          className={['checkbox checkbox-primary', className].filter(Boolean).join(' ')}
          id={controlId}
          ref={inputRef}
          type="checkbox"
          {...props}
        />
        <span className={labelHidden ? 'sr-only' : 'app-control-text font-medium'}>{label}</span>
      </label>
      {message && <p className={error ? 'app-caption app-text-error app-choice-message' : 'app-caption app-text-muted app-choice-message'} id={messageId}>{message}</p>}
    </div>
  )
}
