import { Download, Plus } from 'lucide-react'
import { useState } from 'react'

import { Link } from '../app/router'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { Panel } from '../components/ui/Panel'
import { ActivityFeed } from '../features/dashboard/ActivityFeed'
import { CategoryDonut } from '../features/dashboard/CategoryDonut'
import { SalesChart } from '../features/dashboard/SalesChart'
import { StatCard } from '../features/dashboard/StatCard'
import { TransactionsTable } from '../features/dashboard/TransactionsTable'
import { dashboardStats, transactions } from '../features/dashboard/dashboard.data'
import { downloadCsv } from '../lib/csv'

function exportTransactions() {
  const header = ['订单', '客户', '日期', '支付方式', '金额', '状态']
  const rows = transactions.map((item) => [item.id, item.customer, item.date, item.payment, item.amount, item.status])
  downloadCsv('transactions.csv', [header, ...rows])
}

export function DashboardPage() {
  const [announcement, setAnnouncement] = useState('')

  const handleExport = () => {
    exportTransactions()
    setAnnouncement('交易数据已导出')
  }

  return (
    <div className="app-page-stack">
      <PageHeader
        actions={
          <>
            <Button className="border-base-300" onClick={handleExport} size="small" startIcon={<Download aria-hidden className="app-icon-sm" />} variant="outline">导出</Button>
            <Link action={{ size: 'small', variant: 'primary' }} to="/products">
              <Plus aria-hidden className="app-icon-sm" />管理商品
            </Link>
          </>
        }
        description="集中查看销售、订单、转化和库存动态。数据为可替换的演示 view model。"
        eyebrow="Dashboard"
        title="经营概览"
      />
      <p aria-live="polite" className="sr-only">{announcement}</p>

      <section aria-label="关键指标" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
      </section>

      <div className="app-layout-gap grid xl:grid-cols-[minmax(0,2fr)_minmax(19rem,1fr)]">
        <Panel description="年度收入与净利润趋势，单位为万元" title="销售表现">
          <SalesChart />
        </Panel>
        <Panel description="按主要商品类目统计订单占比" title="分类份额">
          <CategoryDonut />
        </Panel>
      </div>

      <div className="app-layout-gap grid xl:grid-cols-[minmax(0,2fr)_minmax(19rem,1fr)]">
        <Panel description="最近进入交易系统的五笔订单" title="最近交易">
          <TransactionsTable />
        </Panel>
        <Panel description="订单、库存、履约和营销事件" title="店铺动态">
          <ActivityFeed />
        </Panel>
      </div>
    </div>
  )
}
