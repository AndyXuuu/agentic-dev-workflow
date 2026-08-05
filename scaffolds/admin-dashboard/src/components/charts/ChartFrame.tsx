import { type ReactNode, useId } from 'react'

import { Button } from '../ui'
import type { ChartStateProps } from './chart.types'

type ChartFrameProps = ChartStateProps & {
  ariaLabel: string
  children: ReactNode
  summary: string
}

export function ChartFrame({
  ariaLabel,
  children,
  errorDescription = '图表数据暂时无法加载。',
  onRetry,
  state = 'data',
  summary,
}: ChartFrameProps) {
  const titleId = useId()
  const summaryId = useId()

  if (state === 'loading') {
    return (
      <div aria-live="polite" className="chart-state" role="status">
        <div>
          <span aria-hidden className="loading loading-spinner loading-lg text-primary" />
          <p className="app-body app-text-secondary mt-3">正在加载图表</p>
        </div>
      </div>
    )
  }

  if (state === 'empty') {
    return (
      <div className="chart-state" role="status">
        <div>
          <p className="font-semibold">暂无图表数据</p>
          <p className="app-body app-text-secondary mt-1">调整筛选条件或稍后重试。</p>
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="chart-state" role="alert">
        <div>
          <p className="font-semibold">图表加载失败</p>
          <p className="app-body app-text-secondary mt-1">{errorDescription}</p>
          {onRetry && <Button className="mt-4" onClick={onRetry} size="small" variant="outline">重新加载</Button>}
        </div>
      </div>
    )
  }

  return (
    <figure aria-labelledby={titleId} aria-describedby={summaryId} className="app-chart">
      <span className="sr-only" id={titleId}>{ariaLabel}</span>
      {children}
      <figcaption className="sr-only" id={summaryId}>{summary}</figcaption>
    </figure>
  )
}
