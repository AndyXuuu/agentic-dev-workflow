import { CircleDollarSign, CreditCard, ShoppingBag, TrendingUp } from 'lucide-react'

import { StatusBadge } from '../../components/ui'
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
    <article className="surface-card app-surface-body">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="app-body app-text-secondary font-medium">{stat.label}</p>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
            <p className="app-metric-value font-bold tracking-tight">{stat.value}</p>
            <StatusBadge label={`${positive ? '+' : ''} ${stat.change}%`} tone={positive ? 'success' : 'error'} />
          </div>
        </div>
        <span className="app-text-secondary grid size-10 shrink-0 place-items-center rounded-xl bg-base-200">
          <Icon aria-hidden className="app-icon-lg" />
        </span>
      </div>
      <p className="app-caption app-text-muted mt-3">
        上期 <span className="app-text-secondary font-semibold">{stat.comparison}</span>
      </p>
    </article>
  )
}
