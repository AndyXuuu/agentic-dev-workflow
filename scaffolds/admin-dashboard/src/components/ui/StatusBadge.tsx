export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral'

const toneClasses: Record<StatusTone, string> = {
  success: 'app-status-badge--success',
  warning: 'app-status-badge--warning',
  error: 'app-status-badge--error',
  info: 'app-status-badge--info',
  neutral: 'app-status-badge--neutral',
}

type StatusBadgeProps = {
  label: string
  tone?: StatusTone
}

export function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  return <span className={`badge badge-sm app-status-badge whitespace-nowrap ${toneClasses[tone]}`}>{label}</span>
}
