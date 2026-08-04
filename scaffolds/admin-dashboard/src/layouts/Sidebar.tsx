import {
  Boxes,
  ChevronRight,
  LayoutDashboard,
  PackageSearch,
  Palette,
  Settings,
  ShoppingBag,
  Users,
  X,
} from 'lucide-react'
import { type ComponentType, useEffect, useRef } from 'react'

import { Link, type AppPath, usePath } from '../app/router'

type NavItem = {
  label: string
  path: AppPath
  icon: ComponentType<{ size?: number; 'aria-hidden'?: boolean }>
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
  mobileOpen: boolean
  onClose: () => void
}

function SidebarContent({ mobile, onClose }: { mobile: boolean; onClose?: () => void }) {
  const currentPath = usePath()

  return (
    <aside className="app-shell-sidebar flex h-full flex-col border-r border-base-300 bg-base-100">
      <div className="app-shell-header flex items-center gap-3 border-b border-base-300 px-4">
        <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-content shadow-sm">
          <Boxes aria-hidden size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="app-section-title truncate font-bold tracking-tight">Admin Workspace</p>
          <p className="app-caption app-text-muted truncate">Operations workspace</p>
        </div>
        {mobile && (
          <button aria-label="关闭导航" className="btn btn-ghost btn-square btn-sm" data-autofocus onClick={onClose} type="button">
            <X aria-hidden size={19} />
          </button>
        )}
      </div>

      <nav aria-label="主导航" className="flex-1 overflow-y-auto p-3">
        <p className="app-caption app-text-muted mb-2 px-3 font-semibold uppercase tracking-widest">Workspace</p>
        <ul className="menu w-full gap-1 p-0">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <Link
                  aria-current={currentPath === item.path ? 'page' : undefined}
                  className={`app-nav-item group rounded-xl px-3 ${currentPath === item.path ? 'active font-semibold' : ''}`}
                  onNavigate={mobile ? onClose : undefined}
                  to={item.path}
                >
                  <Icon aria-hidden size={19} />
                  <span>{item.label}</span>
                  <ChevronRight aria-hidden className="ml-auto opacity-35 group-hover:opacity-70" size={16} />
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-base-300 p-3">
        <div className="rounded-2xl bg-base-200 p-3">
          <p className="app-body font-semibold">演示工作区</p>
          <p className="app-caption app-text-muted mt-1">替换 Mock repository 后即可接入真实服务。</p>
        </div>
      </div>
    </aside>
  )
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (mobileOpen && !dialog.open) {
      dialog.showModal()
      document.body.dataset.overlayOpen = 'true'
      queueMicrotask(() => dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus())
    } else if (!mobileOpen && dialog.open) {
      dialog.close()
    }
    return () => {
      delete document.body.dataset.overlayOpen
    }
  }, [mobileOpen])

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <SidebarContent mobile={false} />
      </div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Escape 已由原生 dialog 的 cancel 事件处理；点击事件只补充鼠标背景关闭。 */}
      <dialog
        aria-label="移动导航"
        className="mobile-nav-dialog lg:hidden"
        onCancel={(event) => {
          event.preventDefault()
          onClose()
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
        onClose={() => {
          delete document.body.dataset.overlayOpen
        }}
        ref={dialogRef}
      >
        {mobileOpen && <SidebarContent mobile onClose={onClose} />}
      </dialog>
    </>
  )
}
