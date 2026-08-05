import {
  Boxes,
  ChevronRight,
  LayoutDashboard,
  PackageSearch,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  ShoppingBag,
  Users,
  X,
} from 'lucide-react'
import { type ComponentType, useEffect, useRef } from 'react'

import { Link, type AppPath, usePath } from '../app/router'
import { Button } from '../components/ui/Button'
import { acquirePageScrollLock } from '../lib/overlayScrollLock'
import { AccountMenu } from './AccountMenu'

type NavItem = {
  label: string
  path: AppPath
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
}

const navigation: NavItem[] = [
  { label: '概览', path: '/dashboard', icon: LayoutDashboard },
  { label: '订单', path: '/orders', icon: ShoppingBag },
  { label: '商品', path: '/products', icon: PackageSearch },
  { label: '客户', path: '/customers', icon: Users },
  { label: '设置', path: '/settings', icon: Settings },
  { label: '设计系统', path: '/design-system', icon: Palette },
]

type SidebarProps = {
  collapsed: boolean
  mobileOpen: boolean
  onClose: () => void
  onToggleCollapsed: () => void
}

type SidebarContentProps = {
  collapsed?: boolean
  mobile: boolean
  navigationId: string
  onClose?: () => void
  onToggleCollapsed?: () => void
}

function SidebarContent({ collapsed = false, mobile, navigationId, onClose, onToggleCollapsed }: SidebarContentProps) {
  const currentPath = usePath()

  return (
    <aside
      className="app-shell-sidebar flex h-full flex-col border-r border-base-300 bg-base-100"
      data-collapsed={!mobile && collapsed || undefined}
    >
      <div className={`app-shell-header flex items-center border-b border-base-300 ${collapsed && !mobile ? 'justify-center px-2' : 'gap-3 px-4'}`}>
        {(!collapsed || mobile) && (
          <>
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-content shadow-sm">
              <Boxes aria-hidden className="app-icon-lg" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="app-section-title truncate font-bold tracking-tight">Admin Workspace</p>
              <p className="app-caption app-text-muted truncate">Operations workspace</p>
            </div>
          </>
        )}
        {mobile && (
          <Button aria-label="关闭导航" data-autofocus onClick={onClose} size="small" square variant="ghost">
            <X aria-hidden className="app-icon-sm" />
          </Button>
        )}
        {!mobile && (
          <Button
            aria-controls={navigationId}
            aria-expanded={!collapsed}
            aria-label={collapsed ? '展开侧栏' : '收起侧栏'}
            onClick={onToggleCollapsed}
            size="small"
            square
            variant="ghost"
          >
            {collapsed
              ? <PanelLeftOpen aria-hidden className="app-icon-md" />
              : <PanelLeftClose aria-hidden className="app-icon-md" />}
          </Button>
        )}
      </div>

      <nav
        aria-label="主导航"
        className={`flex-1 overflow-y-auto ${collapsed && !mobile ? 'p-2' : 'p-3'}`}
        id={navigationId}
      >
        {(!collapsed || mobile) && (
          <p className="app-caption app-text-muted mb-2 px-3 font-semibold uppercase tracking-widest">Workspace</p>
        )}
        <ul className="menu w-full gap-1 p-0">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <Link
                  aria-current={currentPath === item.path ? 'page' : undefined}
                  className={`app-nav-item group rounded-xl ${collapsed && !mobile ? 'justify-center px-0' : 'px-3'} ${currentPath === item.path ? 'active font-semibold' : ''}`}
                  onNavigate={mobile ? onClose : undefined}
                  to={item.path}
                >
                  <Icon aria-hidden className="app-icon-md" />
                  <span className={collapsed && !mobile ? 'sr-only' : undefined}>{item.label}</span>
                  {(!collapsed || mobile) && (
                    <ChevronRight aria-hidden className="app-icon-sm ml-auto opacity-35 group-hover:opacity-70" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className={`border-t border-base-300 ${collapsed && !mobile ? 'p-2' : 'p-3'}`}>
        <AccountMenu collapsed={collapsed && !mobile} onNavigate={mobile ? onClose : undefined} />
      </div>
    </aside>
  )
}

export function Sidebar({ collapsed, mobileOpen, onClose, onToggleCollapsed }: SidebarProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (mobileOpen && !dialog.open) {
      dialog.showModal()
      queueMicrotask(() => dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus())
    } else if (!mobileOpen && dialog.open) {
      dialog.close()
    }
  }, [mobileOpen])

  useEffect(() => mobileOpen ? acquirePageScrollLock() : undefined, [mobileOpen])

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <SidebarContent
          collapsed={collapsed}
          mobile={false}
          navigationId="desktop-primary-navigation"
          onToggleCollapsed={onToggleCollapsed}
        />
      </div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape 已由原生 dialog 的 cancel 事件处理；点击事件只补充鼠标背景关闭。 */}
      <dialog
        aria-label="移动导航"
        className="mobile-nav-dialog lg:hidden"
        id="mobile-navigation-drawer"
        onCancel={(event) => {
          event.preventDefault()
          onClose()
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
        ref={dialogRef}
      >
        {mobileOpen && <SidebarContent mobile navigationId="mobile-primary-navigation" onClose={onClose} />}
      </dialog>
    </>
  )
}
