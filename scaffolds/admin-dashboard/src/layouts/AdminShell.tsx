import { type ReactNode, useEffect, useState } from 'react'

import { useTheme } from '../hooks/useTheme'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { CommandSearch } from './CommandSearch'

export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="app-shell-main">
        <Topbar
          onSearch={() => setSearchOpen(true)}
          theme={theme}
          onMenu={() => setMobileOpen(true)}
          onToggleTheme={toggleTheme}
        />
        <main id="main-content" className="app-content mx-auto w-full p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <CommandSearch onClose={() => setSearchOpen(false)} open={searchOpen} />
    </div>
  )
}
