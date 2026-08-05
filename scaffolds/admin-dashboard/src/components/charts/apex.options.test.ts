import { describe, expect, it } from 'vitest'

import { buildBarChartOptions } from './apex.options'
import type { ChartTheme } from './chart.theme'

const chartTheme: ChartTheme = {
  grid: 'grid-color',
  label: 'label-color',
  mode: 'light',
  palette: ['series-1', 'series-2'],
  surface: 'surface-color',
}

describe('bar chart visual contract', () => {
  it('keeps category spacing and separates adjacent grouped bars with the chart surface', () => {
    const options = buildBarChartOptions({
      categories: ['直营'],
      chartTheme,
      series: [{ name: '本期', data: [72] }, { name: '目标', data: [80] }],
      valueSuffix: '万',
    })

    expect(options.plotOptions?.bar?.columnWidth).toBe('54%')
    expect(options.stroke).toMatchObject({ colors: ['surface-color'], width: 2 })
  })
})
