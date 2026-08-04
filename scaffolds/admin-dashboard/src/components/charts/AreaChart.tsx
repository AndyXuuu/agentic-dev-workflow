import { useMemo } from 'react'

import { useTheme } from '../../hooks/useTheme'
import { ApexChart } from './ApexChart'
import { ChartFrame } from './ChartFrame'
import { buildAreaChartOptions } from './apex.options'
import { readChartTheme } from './chart.theme'
import type { ChartSeries, ChartStateProps } from './chart.types'

type AreaChartProps = ChartStateProps & {
  ariaLabel: string
  categories: string[]
  series: ChartSeries[]
  summary: string
  valueSuffix?: string
}

export function AreaChart({
  ariaLabel,
  categories,
  errorDescription,
  onRetry,
  series,
  state = 'data',
  summary,
  valueSuffix = '',
}: AreaChartProps) {
  const { theme } = useTheme()
  const chartTheme = useMemo(() => readChartTheme(theme), [theme])
  const hasData = categories.length > 0 && series.some((item) => item.data.length > 0)
  const resolvedState = state === 'data' && !hasData ? 'empty' : state

  const options = useMemo(
    () => buildAreaChartOptions({ categories, chartTheme, series, valueSuffix }),
    [categories, chartTheme, series, valueSuffix],
  )

  return (
    <ChartFrame ariaLabel={ariaLabel} errorDescription={errorDescription} onRetry={onRetry} state={resolvedState} summary={summary}>
      <ApexChart height={286} options={options} series={series} type="area" />
    </ChartFrame>
  )
}
