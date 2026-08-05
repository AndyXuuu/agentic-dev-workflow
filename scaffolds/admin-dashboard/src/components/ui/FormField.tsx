import { type ReactNode, useId } from 'react'

export type FormFieldControlProps = {
  'aria-describedby'?: string
  'aria-invalid'?: true
  id: string
}

type FormFieldProps = {
  children: (controlProps: FormFieldControlProps) => ReactNode
  className?: string
  controlId?: string
  error?: string
  hint?: string
  label: ReactNode
  labelHidden?: boolean
  required?: boolean
}

export function FormField({ children, className, controlId, error, hint, label, labelHidden = false, required = false }: FormFieldProps) {
  const generatedId = useId()
  const id = controlId ?? `${generatedId}-control`
  const message = error ?? hint
  const messageId = message ? `${generatedId}-${error ? 'error' : 'hint'}` : undefined

  return (
    <div className={['form-control block', className].filter(Boolean).join(' ')}>
      <label className={labelHidden ? 'sr-only' : 'label-text mb-1.5 block font-medium'} htmlFor={id}>
        {label}
        {required && <span aria-hidden className="app-required-indicator"> *</span>}
      </label>
      {children({
        'aria-describedby': messageId,
        'aria-invalid': error ? true : undefined,
        id,
      })}
      {message && (
        <span className={error ? 'app-caption app-text-error mt-1' : 'app-caption app-text-muted mt-1'} id={messageId}>
          {message}
        </span>
      )}
    </div>
  )
}
