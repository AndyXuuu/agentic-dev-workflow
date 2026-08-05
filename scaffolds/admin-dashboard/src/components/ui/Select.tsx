import type { ReactNode, SelectHTMLAttributes } from 'react'

import { FormField } from './FormField'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  containerClassName?: string
  error?: string
  hint?: string
  label: ReactNode
  labelHidden?: boolean
}

export function Select({ className, containerClassName, error, hint, id, label, labelHidden, required, children, ...props }: SelectProps) {
  return (
    <FormField className={containerClassName} controlId={id} error={error} hint={hint} label={label} labelHidden={labelHidden} required={required}>
      {(controlProps) => (
        <select
          className={['select select-bordered w-full bg-base-100', error ? 'select-error' : '', className].filter(Boolean).join(' ')}
          required={required}
          {...controlProps}
          {...props}
        >
          {children}
        </select>
      )}
    </FormField>
  )
}
