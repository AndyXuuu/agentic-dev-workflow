import { useMemo } from 'react'

import { useTheme } from '../../hooks/useTheme'
import { ApexChart } from './ApexChart'
import { ChartFrame } from './ChartFrame'
import { buildBarChartOptions } from './apex.options'
import { readChartTheme } from './chart.theme'
import type { ChartSeries, ChartStateProps } from './chart.types'

type BarChartProps = ChartStateProps & {
  ariaLabel: string
  categories: string[]
  series: ChartSeries[]
  summary: string
  valueSuffix?: string
}

export function BarChart({
  ariaLabel,
  categories,
  errorDescription,
  onRetry,
  series,
  state = 'data',
  summary,
  valueSuffix = '',
}: BarChartProps) {
  const { theme } = useTheme()
  const chartTheme = useMemo(() => readChartTheme(theme), [theme])
  const hasData = categories.length > 0 && series.some((item) => item.data.some((value) => value !== 0))
  const resolvedState = state === 'data' && !hasData ? 'empty' : state

  const options = useMemo(
    () => buildBarChartOptions({ categories, chartTheme, series, valueSuffix }),
    [categories, chartTheme, series, valueSuffix],
  )

  return (
    <ChartFrame ariaLabel={ariaLabel} errorDescription={errorDescription} onRetry={onRetry} state={resolvedState} summary={summary}>
      <ApexChart options={options} series={series} type="bar" />
    </ChartFrame>
  )
}
