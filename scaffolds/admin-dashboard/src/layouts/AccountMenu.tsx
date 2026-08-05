import { ChevronsUpDown, LogOut, Moon, Palette, Settings, Sun } from 'lucide-react'

import { useNavigate } from '../app/router'
import { getAccessibleAppRoutes } from '../app/routes'
import { useSession } from '../auth'
import { DropdownMenu, type DropdownMenuItem, Tooltip } from '../components/ui'
import { useTheme } from '../hooks/useTheme'

type AccountMenuProps = {
  collapsed?: boolean
  onNavigate?: () => void
}

export function AccountMenu({ collapsed = false, onNavigate }: AccountMenuProps) {
  const navigate = useNavigate()
  const { signOut, state } = useSession()
  const { theme, toggleTheme } = useTheme()
  const dark = theme === 'business'

  if (state.status !== 'authenticated') return null

  const { actor } = state.session
  const accessiblePaths = new Set(getAccessibleAppRoutes(state.session).map((route) => route.path))
  const initials = actor.displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase())
    .join('') || 'A'

  const navigateTo = (path: '/design-system' | '/settings') => {
    navigate(path)
    onNavigate?.()
  }

  const items: DropdownMenuItem[] = [
    {
      id: 'theme',
      label: dark ? '切换到亮色主题' : '切换到暗色主题',
      description: '更改当前设备的界面外观',
      icon: dark ? <Sun aria-hidden className="app-icon-md" /> : <Moon aria-hidden className="app-icon-md" />,
      onSelect: toggleTheme,
    },
  ]
  if (accessiblePaths.has('/settings')) {
    items.push({
      id: 'settings',
      label: '工作区设置',
      description: '管理工作区偏好',
      icon: <Settings aria-hidden className="app-icon-md" />,
      onSelect: () => navigateTo('/settings'),
    })
  }
  if (accessiblePaths.has('/design-system')) {
    items.push({
      id: 'design-system',
      label: '设计系统',
      description: '查看组件与 Token',
      icon: <Palette aria-hidden className="app-icon-md" />,
      onSelect: () => navigateTo('/design-system'),
    })
  }
  items.push({
    id: 'sign-out',
    label: '退出登录',
    description: '结束当前浏览器会话',
    icon: <LogOut aria-hidden className="app-icon-md" />,
    onSelect: () => void signOut(),
  })

  const menu = (triggerDescribedBy?: string) => (
    <DropdownMenu
      align="start"
      items={items}
      label="账户导航"
      triggerDescribedBy={triggerDescribedBy}
      trigger={(
        <span className={`flex min-w-0 flex-1 items-center ${collapsed ? 'justify-center' : 'gap-2'}`}>
          <span className="avatar placeholder">
            <span className="app-caption app-text-accent grid size-8 place-items-center rounded-lg bg-primary/12 font-bold">
              {initials}
            </span>
          </span>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 text-left">
                <span className="app-control-text block truncate font-semibold">{actor.displayName}</span>
                <span className="app-caption app-text-muted block truncate">{actor.roleLabel}</span>
              </span>
              <ChevronsUpDown aria-hidden className="app-icon-sm app-text-muted" />
            </>
          )}
        </span>
      )}
      triggerClassName={`app-sidebar-account${collapsed ? ' app-sidebar-account--collapsed' : ''}`}
    />
  )

  return collapsed
    ? <Tooltip label="账户导航" placement="right">{({ 'aria-describedby': describedBy }) => menu(describedBy)}</Tooltip>
    : menu()
}
