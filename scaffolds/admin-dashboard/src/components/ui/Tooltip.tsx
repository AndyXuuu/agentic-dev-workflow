import { type ReactNode, useId } from 'react'

export type TooltipTriggerProps = {
  'aria-describedby': string
}

type TooltipProps = {
  children: (triggerProps: TooltipTriggerProps) => ReactNode
  label: ReactNode
  placement?: 'right' | 'top'
}

export function Tooltip({ children, label, placement = 'top' }: TooltipProps) {
  const tooltipId = useId()

  return (
    <span className={`app-tooltip app-tooltip--${placement}`}>
      {children({ 'aria-describedby': tooltipId })}
      <span className="app-tooltip__content" id={tooltipId} role="tooltip">{label}</span>
    </span>
  )
}
