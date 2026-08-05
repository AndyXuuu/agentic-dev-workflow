import { type ReactNode, useId } from 'react'

export type RadioGroupOption = {
  description?: string
  disabled?: boolean
  label: ReactNode
  value: string
}

type RadioGroupProps = {
  defaultValue?: string
  disabled?: boolean
  error?: string
  label: ReactNode
  name?: string
  onValueChange?: (value: string) => void
  options: readonly RadioGroupOption[]
  orientation?: 'horizontal' | 'vertical'
  required?: boolean
  value?: string
}

export function RadioGroup({
  defaultValue,
  disabled = false,
  error,
  label,
  name,
  onValueChange,
  options,
  orientation = 'vertical',
  required = false,
  value,
}: RadioGroupProps) {
  const generatedId = useId()
  const groupName = name ?? `${generatedId}-group`
  const errorId = error ? `${generatedId}-error` : undefined

  return (
    <fieldset aria-describedby={errorId} className="form-control" disabled={disabled}>
      <legend className="label-text mb-1.5 font-medium">
        {label}
        {required && <span aria-hidden className="app-required-indicator"> *</span>}
      </legend>
      <div className={orientation === 'horizontal' ? 'app-choice-group app-choice-group--horizontal' : 'app-choice-group'}>
        {options.map((option) => (
          <label className="app-choice-control" key={option.value}>
            <input
              className="radio radio-primary"
              defaultChecked={value === undefined ? defaultValue === option.value : undefined}
              disabled={option.disabled}
              name={groupName}
              onChange={(event) => {
                if (event.target.checked) onValueChange?.(option.value)
              }}
              required={required}
              type="radio"
              value={option.value}
              {...(value !== undefined ? { checked: value === option.value } : {})}
            />
            <span>
              <span className="app-control-text block font-medium">{option.label}</span>
              {option.description && <span className="app-caption app-text-muted mt-0.5 block">{option.description}</span>}
            </span>
          </label>
        ))}
      </div>
      {error && <p className="app-caption app-text-error mt-1" id={errorId}>{error}</p>}
    </fieldset>
  )
}
