import { DonutChart } from '../../components/charts/DonutChart'
import { categoryShare } from './dashboard.data'

export function CategoryDonut() {
  return (
    <DonutChart
      ariaLabel="商品分类订单占比"
      labels={categoryShare.map((item) => item.label)}
      series={categoryShare.map((item) => item.value)}
      summary="电子产品占比最高，其次为服装和家居厨具。"
      totalLabel="订单总数"
    />
  )
}
