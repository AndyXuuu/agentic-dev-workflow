import { AreaChart } from '../../components/charts/AreaChart'
import { salesSeries } from './dashboard.data'

export function SalesChart() {
  return (
    <AreaChart
      ariaLabel="年度销售趋势"
      categories={salesSeries.map((item) => item.month)}
      series={[
        { name: '收入', data: salesSeries.map((item) => item.revenue) },
        { name: '净利润', data: salesSeries.map((item) => item.profit) },
      ]}
      summary="收入从一月三十一万增长到十二月一百四十二万，净利润同期增长到六十二万。"
      valueSuffix="万"
    />
  )
}
