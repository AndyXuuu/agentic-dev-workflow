import { useMemo } from 'react'

import { useTheme } from '../../hooks/useTheme'
import { ApexChart } from './ApexChart'
import { ChartFrame } from './ChartFrame'
import { buildDonutChartOptions } from './apex.options'
import { readChartTheme } from './chart.theme'
import type { ChartStateProps } from './chart.types'

type DonutChartProps = ChartStateProps & {
  ariaLabel: string
  labels: string[]
  series: number[]
  summary: string
  totalLabel: string
}

export function DonutChart({
  ariaLabel,
  errorDescription,
  labels,
  onRetry,
  series,
  state = 'data',
  summary,
  totalLabel,
}: DonutChartProps) {
  const { theme } = useTheme()
  const chartTheme = useMemo(() => readChartTheme(theme), [theme])
  const total = series.reduce((sum, value) => sum + value, 0)
  const resolvedState = state === 'data' && (labels.length === 0 || total === 0) ? 'empty' : state

  const options = useMemo(
    () => buildDonutChartOptions({ chartTheme, labels, series, total, totalLabel }),
    [chartTheme, labels, series, total, totalLabel],
  )

  return (
    <ChartFrame ariaLabel={ariaLabel} errorDescription={errorDescription} onRetry={onRetry} state={resolvedState} summary={summary}>
      <ApexChart options={options} series={series} type="donut" />
    </ChartFrame>
  )
}
