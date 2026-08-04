import { Bell, Menu, Moon, Search, Sun } from 'lucide-react'

import type { Theme } from '../hooks/useTheme'

type TopbarProps = {
  theme: Theme
  onMenu: () => void
  onSearch: () => void
  onToggleTheme: () => void
}

export function Topbar({ theme, onMenu, onSearch, onToggleTheme }: TopbarProps) {
  const dark = theme === 'business'

  return (
    <header className="sticky top-0 z-30 border-b border-base-300/80 bg-base-100/90 backdrop-blur-xl">
      <div className="app-shell-header flex items-center gap-2 px-4 sm:px-5 lg:px-6">
        <button className="btn btn-ghost btn-square lg:hidden" onClick={onMenu} type="button">
          <span className="sr-only">打开导航</span>
          <Menu aria-hidden size={21} />
        </button>

        <button
          aria-label="搜索订单、商品或客户"
          className="btn btn-ghost app-text-secondary min-w-0 justify-start px-3 sm:w-64"
          onClick={onSearch}
          type="button"
        >
          <Search aria-hidden size={18} />
          <span className="hidden truncate sm:inline">搜索订单、商品或客户</span>
          <kbd className="kbd kbd-sm ml-auto hidden lg:inline-flex">⌘ K</kbd>
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            aria-label={dark ? '切换到亮色主题' : '切换到暗色主题'}
            className="btn btn-ghost btn-square"
            onClick={onToggleTheme}
            type="button"
          >
            {dark ? <Sun aria-hidden size={20} /> : <Moon aria-hidden size={20} />}
          </button>
          <span aria-label="没有新通知" className="indicator app-text-muted grid size-9 place-items-center" role="status">
            <span className="indicator-item badge badge-primary badge-xs right-2 top-2" />
            <Bell aria-hidden size={20} />
          </span>
          <div className="ml-1 flex h-9 items-center gap-2 rounded-xl px-2">
            <span className="avatar placeholder">
              <span className="app-caption app-text-accent grid size-8 place-items-center rounded-lg bg-primary/12 font-bold">
                DA
              </span>
            </span>
            <span className="hidden text-left md:block">
              <span className="app-control-text block font-semibold">Demo Admin</span>
              <span className="app-caption app-text-muted block">Administrator</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
