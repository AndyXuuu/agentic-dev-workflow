import { type ReactNode, useEffect, useState } from 'react'
import { Menu } from 'lucide-react'

import { useSession } from '../auth'
import { Button } from '../components/ui'
import { Sidebar } from './Sidebar'
import { CommandSearch } from './CommandSearch'

export function AdminShell({ children }: { children: ReactNode }) {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { state } = useSession()
  const authenticated = state.status === 'authenticated'

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (authenticated && (event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [authenticated])

  useEffect(() => {
    if (!authenticated) {
      setMobileOpen(false)
      setSearchOpen(false)
    }
  }, [authenticated])

  return (
    <div
      className="app-shell-root min-h-screen bg-base-200 text-base-content"
      data-sidebar-collapsed={desktopCollapsed || undefined}
    >
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <Sidebar
        collapsed={desktopCollapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onToggleCollapsed={() => setDesktopCollapsed((collapsed) => !collapsed)}
      />
      <div className="app-shell-main">
        <main id="main-content" className="app-content mx-auto w-full">
          {authenticated && <div className="app-mobile-shell-actions lg:hidden">
            <Button
              aria-controls="mobile-navigation-drawer"
              aria-expanded={mobileOpen}
              aria-label="打开导航"
              onClick={() => setMobileOpen(true)}
              square
              variant="ghost"
            >
              <Menu aria-hidden className="app-icon-lg" />
            </Button>
          </div>}
          {children}
        </main>
      </div>
      {authenticated && <CommandSearch onClose={() => setSearchOpen(false)} open={searchOpen} />}
    </div>
  )
}
