export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral'

const toneClasses: Record<StatusTone, string> = {
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  info: 'badge-info',
  neutral: 'badge-neutral',
}

type StatusBadgeProps = {
  label: string
  tone?: StatusTone
}

export function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  return <span className={`badge badge-soft badge-sm whitespace-nowrap ${toneClasses[tone]}`}>{label}</span>
}
