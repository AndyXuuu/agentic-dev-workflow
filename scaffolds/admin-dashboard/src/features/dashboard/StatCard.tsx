import { CircleDollarSign, CreditCard, ShoppingBag, TrendingUp } from 'lucide-react'

import type { DashboardStat } from './dashboard.data'

const icons = {
  revenue: CircleDollarSign,
  orders: ShoppingBag,
  average: CreditCard,
  conversion: TrendingUp,
}

export function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = icons[stat.icon]
  const positive = stat.change >= 0

  return (
    <article className="surface-card p-5">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-base-content/62">{stat.label}</p>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            <span className={`badge badge-soft badge-sm ${positive ? 'badge-success' : 'badge-error'}`}>
              {positive ? '+' : ''}
              {stat.change}%
            </span>
          </div>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-base-200 text-base-content/72">
          <Icon aria-hidden size={21} />
        </span>
      </div>
      <p className="mt-4 text-xs text-base-content/48">
        上期 <span className="font-semibold text-base-content/68">{stat.comparison}</span>
      </p>
    </article>
  )
}
