import type { InputHTMLAttributes, ReactNode } from 'react'

import { FormField } from './FormField'

type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  containerClassName?: string
  error?: string
  hint?: string
  label: ReactNode
  labelHidden?: boolean
  startIcon?: ReactNode
}

export function TextInput({
  className,
  containerClassName,
  error,
  hint,
  id,
  label,
  labelHidden,
  required,
  startIcon,
  ...props
}: TextInputProps) {
  return (
    <FormField className={containerClassName} controlId={id} error={error} hint={hint} label={label} labelHidden={labelHidden} required={required}>
      {(controlProps) => startIcon ? (
        <div className={['input input-bordered flex w-full min-w-0 items-center gap-2 bg-base-100', error ? 'input-error' : '', className].filter(Boolean).join(' ')}>
          {startIcon}
          <input className="min-w-0 grow" required={required} {...controlProps} {...props} />
        </div>
      ) : (
        <input
          className={['input input-bordered w-full', error ? 'input-error' : '', className].filter(Boolean).join(' ')}
          required={required}
          {...controlProps}
          {...props}
        />
      )}
    </FormField>
  )
}
