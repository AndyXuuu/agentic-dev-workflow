import { LayoutDashboard, PackageSearch, Palette, Settings, ShoppingBag, Users } from 'lucide-react'
import type { ComponentType, ReactNode } from 'react'

import { type AccessRequirement, evaluateAccess, type Session } from '../auth'
import { DashboardPage } from '../pages/DashboardPage'
import { DesignSystemPage } from '../pages/DesignSystemPage'
import { ResourceListPage } from '../pages/ResourceListPage'
import { SettingsPage } from '../pages/SettingsPage'

export type AppRoute = {
  access: AccessRequirement
  description: string
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  label: string
  navigationLabel: string
  path: string
  render: () => ReactNode
}

export const appRoutes = [
  {
    access: { authentication: 'required', permissions: ['dashboard:read'] },
    path: '/dashboard',
    label: '经营概览',
    navigationLabel: '概览',
    description: '销售、订单和库存指标',
    icon: LayoutDashboard,
    render: () => <DashboardPage />,
  },
  {
    access: { authentication: 'required', permissions: ['orders:read'] },
    path: '/orders',
    label: '订单管理',
    navigationLabel: '订单',
    description: '履约、支付和客户信息',
    icon: ShoppingBag,
    render: () => <ResourceListPage key="orders" resource="orders" />,
  },
  {
    access: { authentication: 'required', permissions: ['products:read'] },
    path: '/products',
    label: '商品管理',
    navigationLabel: '商品',
    description: '目录、价格和库存状态',
    icon: PackageSearch,
    render: () => <ResourceListPage key="products" resource="products" />,
  },
  {
    access: { authentication: 'required', permissions: ['customers:read'] },
    path: '/customers',
    label: '客户管理',
    navigationLabel: '客户',
    description: '客户状态和消费贡献',
    icon: Users,
    render: () => <ResourceListPage key="customers" resource="customers" />,
  },
  {
    access: { authentication: 'required', permissions: ['workspace:manage'] },
    path: '/settings',
    label: '工作区设置',
    navigationLabel: '设置',
    description: '基本信息和通知偏好',
    icon: Settings,
    render: () => <SettingsPage />,
  },
  {
    access: { authentication: 'required', permissions: ['design-system:read'] },
    path: '/design-system',
    label: '设计系统',
    navigationLabel: '设计系统',
    description: 'Token、组件和表格契约',
    icon: Palette,
    render: () => <DesignSystemPage />,
  },
] as const satisfies readonly AppRoute[]

export type AppPath = (typeof appRoutes)[number]['path']

const fallbackRoute = appRoutes[0]
const fallbackPath: AppPath = fallbackRoute.path
const routeByPath = new Map<string, (typeof appRoutes)[number]>(appRoutes.map((route) => [route.path, route]))

export function resolveAppPath(pathname: string): AppPath {
  return routeByPath.has(pathname) ? (pathname as AppPath) : fallbackPath
}

export function getAppRoute(pathname: string): (typeof appRoutes)[number] {
  return routeByPath.get(pathname) ?? fallbackRoute
}

export function getAccessibleAppRoutes(session: Session) {
  return appRoutes.filter((route) => evaluateAccess(session, route.access) === 'allowed')
}
