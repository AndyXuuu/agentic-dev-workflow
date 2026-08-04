import { createContext, createElement, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type Theme = 'corporate' | 'business'

const storageKey = 'admin-dashboard-theme'

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readInitialTheme(): Theme {
  const documentTheme = document.documentElement.dataset.theme
  return documentTheme === 'business' ? 'business' : 'corporate'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem(storageKey, theme)
    } catch {
      // The active theme still works for this session when browser storage is unavailable.
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'corporate' ? 'business' : 'corporate'
    document.documentElement.dataset.theme = nextTheme
    setTheme(nextTheme)
  }, [theme])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return createElement(ThemeContext.Provider, { value }, children)
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('ThemeProvider is required')
  return value
}
