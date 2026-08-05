import type { StatusTone } from '../../components/ui'

export type DashboardStat = {
  label: string
  value: string
  change: number
  comparison: string
  icon: 'revenue' | 'orders' | 'average' | 'conversion'
}

export const dashboardStats: DashboardStat[] = [
  { label: '总收入', value: '¥1,423,845', change: 12.4, comparison: '¥1,266,760', icon: 'revenue' },
  { label: '订单总数', value: '5,821', change: 8.7, comparison: '5,355', icon: 'orders' },
  { label: '平均客单价', value: '¥244.60', change: 3.4, comparison: '¥236.50', icon: 'average' },
  { label: '转化率', value: '2.84%', change: -1.2, comparison: '2.87%', icon: 'conversion' },
]

export const salesSeries = [
  { month: '1月', revenue: 31, profit: 11 },
  { month: '2月', revenue: 40, profit: 15 },
  { month: '3月', revenue: 28, profit: 8 },
  { month: '4月', revenue: 51, profit: 18 },
  { month: '5月', revenue: 42, profit: 12 },
  { month: '6月', revenue: 109, profit: 49 },
  { month: '7月', revenue: 100, profit: 40 },
  { month: '8月', revenue: 120, profit: 52 },
  { month: '9月', revenue: 80, profit: 31 },
  { month: '10月', revenue: 95, profit: 39 },
  { month: '11月', revenue: 110, profit: 45 },
  { month: '12月', revenue: 142, profit: 62 },
]

export const categoryShare = [
  { label: '电子产品', value: 2037 },
  { label: '服装', value: 1455 },
  { label: '家居厨具', value: 1164 },
  { label: '美妆护理', value: 698 },
  { label: '图书爱好', value: 467 },
]

export type Transaction = {
  id: string
  customer: string
  email: string
  initials: string
  date: string
  payment: string
  amount: string
  status: string
  tone: StatusTone
}

export const transactions: Transaction[] = [
  { id: '#ORD-9952', customer: 'Sarah Jenkins', email: 'sarah@example.com', initials: 'SJ', date: '2026-08-04', payment: 'Visa · 4242', amount: '¥1,290', status: '已完成', tone: 'success' },
  { id: '#ORD-9951', customer: 'Michael Chen', email: 'michael@example.com', initials: 'MC', date: '2026-08-03', payment: 'Apple Pay', amount: '¥3,495', status: '已完成', tone: 'success' },
  { id: '#ORD-9950', customer: 'Emma Watson', email: 'emma@example.com', initials: 'EW', date: '2026-08-03', payment: 'PayPal', amount: '¥452', status: '待处理', tone: 'warning' },
  { id: '#ORD-9949', customer: 'David Ross', email: 'david@example.com', initials: 'DR', date: '2026-08-02', payment: 'Mastercard · 8812', amount: '¥899', status: '失败', tone: 'error' },
  { id: '#ORD-9948', customer: 'Sophia Martinez', email: 'sophia@example.com', initials: 'SM', date: '2026-08-01', payment: 'Google Pay', amount: '¥1,500', status: '已退款', tone: 'info' },
]

export const activities = [
  { title: '收到新订单', description: '订单 #ORD-9952 已进入待履约队列。', time: '5 分钟前', tone: 'success' },
  { title: '商品库存告警', description: '智能保温杯库存已降至安全线以下。', time: '1 小时前', tone: 'error' },
  { title: '批量发货完成', description: '华东仓 45 个订单已交付承运商。', time: '3 小时前', tone: 'info' },
  { title: '收到五星评价', description: '降噪耳机新增一条五星商品评价。', time: '5 小时前', tone: 'warning' },
  { title: '营销活动已启用', description: 'SUMMER_26 活动已按计划上线。', time: '1 天前', tone: 'neutral' },
] as const
