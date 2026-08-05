import type { ReactNode, TextareaHTMLAttributes } from 'react'

import { FormField } from './FormField'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  containerClassName?: string
  error?: string
  hint?: string
  label: ReactNode
  labelHidden?: boolean
}

export function Textarea({ className, containerClassName, error, hint, id, label, labelHidden, required, ...props }: TextareaProps) {
  return (
    <FormField className={containerClassName} controlId={id} error={error} hint={hint} label={label} labelHidden={labelHidden} required={required}>
      {(controlProps) => (
        <textarea
          className={['textarea textarea-bordered w-full', error ? 'textarea-error' : '', className].filter(Boolean).join(' ')}
          required={required}
          {...controlProps}
          {...props}
        />
      )}
    </FormField>
  )
}
