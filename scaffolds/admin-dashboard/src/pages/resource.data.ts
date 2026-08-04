import type { StatusTone } from '../components/ui/StatusBadge'

export type ResourceKey = 'orders' | 'products' | 'customers'

export type ResourceRow = {
  id: string
  title: string
  subtitle: string
  meta: string
  value: string
  status: string
  tone: StatusTone
}

export const resourceConfig: Record<ResourceKey, { title: string; description: string; primaryAction: string; search: string }> = {
  orders: { title: '订单管理', description: '查询履约状态、支付结果与客户信息。', primaryAction: '创建订单', search: '搜索订单或客户' },
  products: { title: '商品管理', description: '维护商品目录、价格和库存状态。', primaryAction: '添加商品', search: '搜索商品或分类' },
  customers: { title: '客户管理', description: '查看客户状态、消费贡献和最近活动。', primaryAction: '添加客户', search: '搜索客户或邮箱' },
}

export const resourceRows: Record<ResourceKey, ResourceRow[]> = {
  orders: [
    { id: 'ORD-9952', title: 'Sarah Jenkins', subtitle: 'sarah@example.com', meta: '2026-08-04 · Visa', value: '¥1,290', status: '已完成', tone: 'success' },
    { id: 'ORD-9951', title: 'Michael Chen', subtitle: 'michael@example.com', meta: '2026-08-03 · Apple Pay', value: '¥3,495', status: '已完成', tone: 'success' },
    { id: 'ORD-9950', title: 'Emma Watson', subtitle: 'emma@example.com', meta: '2026-08-03 · PayPal', value: '¥452', status: '待处理', tone: 'warning' },
  ],
  products: [
    { id: 'SKU-1001', title: '无线降噪耳机', subtitle: '电子产品', meta: '库存 85 · 已售 1,205', value: '¥899', status: '销售中', tone: 'success' },
    { id: 'SKU-1002', title: '人体工学办公椅', subtitle: '家具', meta: '库存 12 · 已售 842', value: '¥1,699', status: '低库存', tone: 'warning' },
    { id: 'SKU-1003', title: '智能保温杯', subtitle: '厨具', meta: '库存 0 · 已售 620', value: '¥299', status: '已售罄', tone: 'error' },
  ],
  customers: [
    { id: 'CUS-2201', title: 'Sarah Jenkins', subtitle: 'sarah@example.com', meta: '最近购买 5 分钟前', value: '¥8,420', status: '活跃', tone: 'success' },
    { id: 'CUS-2202', title: 'Michael Chen', subtitle: 'michael@example.com', meta: '最近购买 1 天前', value: '¥6,580', status: '活跃', tone: 'success' },
    { id: 'CUS-2203', title: 'Emma Watson', subtitle: 'emma@example.com', meta: '最近购买 30 天前', value: '¥1,240', status: '待唤回', tone: 'warning' },
  ],
}
