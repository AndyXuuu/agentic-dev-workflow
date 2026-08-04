import { useId } from 'react'

export type ProgressTone = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'

const DEFAULT_MAX = 100

const toneClasses: Record<ProgressTone, string> = {
  primary: 'app-progress-bar--primary',
  success: 'app-progress-bar--success',
  warning: 'app-progress-bar--warning',
  error: 'app-progress-bar--error',
  info: 'app-progress-bar--info',
  neutral: 'app-progress-bar--neutral',
}

type ProgressBarProps = {
  label: string
  value?: number
  max?: number
  valueLabel?: string
  tone?: ProgressTone
  className?: string
}

function normalizeMax(max: number) {
  return Number.isFinite(max) && max > 0 ? max : DEFAULT_MAX
}

function normalizeValue(value: number, max: number) {
  if (!Number.isFinite(value)) {
    return 0
  }

  return Math.min(Math.max(value, 0), max)
}

export function ProgressBar({
  label,
  value,
  max = DEFAULT_MAX,
  valueLabel,
  tone = 'primary',
  className = '',
}: ProgressBarProps) {
  const progressId = useId()
  const normalizedMax = normalizeMax(max)
  const normalizedValue = value === undefined ? undefined : normalizeValue(value, normalizedMax)
  const percentage = normalizedValue === undefined ? undefined : Math.round((normalizedValue / normalizedMax) * 100)
  const visibleValue = valueLabel ?? (percentage === undefined ? '处理中' : `${percentage}%`)

  return (
    <div className={`app-progress-bar ${toneClasses[tone]} ${className}`.trim()}>
      <div className="app-progress-bar__header">
        <label className="app-progress-bar__label" htmlFor={progressId}>{label}</label>
        <span className="app-caption app-progress-bar__value">{visibleValue}</span>
      </div>
      <progress
        aria-valuetext={valueLabel}
        className="progress app-progress-bar__track"
        id={progressId}
        max={normalizedMax}
        value={normalizedValue}
      />
    </div>
  )
}
