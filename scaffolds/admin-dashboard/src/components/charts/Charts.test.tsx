import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ThemeProvider } from '../../hooks/useTheme'
import { AreaChart } from './AreaChart'
import { BarChart } from './BarChart'
import { DonutChart } from './DonutChart'

function renderWithTheme(component: React.ReactNode) {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('shared charts', () => {
  it('exposes a contextual label and data summary for chart consumers', () => {
    renderWithTheme(
      <AreaChart
        ariaLabel="季度收入趋势"
        categories={['第一季度', '第二季度']}
        series={[{ name: '收入', data: [120, 160] }]}
        summary="收入由一百二十万增长到一百六十万。"
      />,
    )

    expect(screen.getByRole('figure', { name: '季度收入趋势' })).toHaveAccessibleDescription('收入由一百二十万增长到一百六十万。')
  })

  it('renders an empty state when a chart has no meaningful data', () => {
    renderWithTheme(
      <DonutChart ariaLabel="空分类占比" labels={[]} series={[]} summary="没有分类数据。" totalLabel="总数" />,
    )

    expect(screen.getByRole('status')).toHaveTextContent('暂无图表数据')
  })

  it('exposes the bar chart context without relying on the visual bars alone', () => {
    renderWithTheme(
      <BarChart
        ariaLabel="渠道业绩对比"
        categories={['直营', '分销']}
        series={[{ name: '业绩', data: [72, 54] }]}
        summary="直营渠道业绩高于分销渠道。"
        valueSuffix="万"
      />,
    )

    expect(screen.getByRole('figure', { name: '渠道业绩对比' })).toHaveAccessibleDescription('直营渠道业绩高于分销渠道。')
  })

  it('offers recovery when the chart data request fails', () => {
    const onRetry = vi.fn()
    renderWithTheme(
      <AreaChart
        ariaLabel="失败趋势图"
        categories={[]}
        onRetry={onRetry}
        series={[]}
        state="error"
        summary="图表当前不可用。"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '重新加载' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
