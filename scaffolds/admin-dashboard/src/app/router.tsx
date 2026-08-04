import { createContext, type MouseEvent, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type AppPath = '/dashboard' | '/orders' | '/products' | '/customers' | '/settings' | '/design-system'

const validPaths = new Set<AppPath>(['/dashboard', '/orders', '/products', '/customers', '/settings', '/design-system'])

function readPath(): AppPath {
  return validPaths.has(window.location.pathname as AppPath)
    ? (window.location.pathname as AppPath)
    : '/dashboard'
}

type RouterValue = {
  path: AppPath
  navigate: (path: AppPath) => void
}

const RouterContext = createContext<RouterValue | null>(null)

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<AppPath>(readPath)

  useEffect(() => {
    if (window.location.pathname !== path) window.history.replaceState({}, '', path)
  }, [path])

  useEffect(() => {
    const onPopState = () => {
      const nextPath = readPath()
      if (window.location.pathname !== nextPath) window.history.replaceState({}, '', nextPath)
      setPath(nextPath)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = useCallback((nextPath: AppPath) => {
    if (nextPath === readPath() && window.location.pathname === nextPath) return
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const value = useMemo(() => ({ path, navigate }), [navigate, path])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

function useRouter() {
  const value = useContext(RouterContext)
  if (!value) throw new Error('RouterProvider is required')
  return value
}

export function usePath() {
  return useRouter().path
}

export function useNavigate() {
  return useRouter().navigate
}

type LinkProps = {
  children: ReactNode
  className?: string
  onNavigate?: () => void
  to: AppPath
  'aria-current'?: 'page'
}

export function Link({ children, className, onNavigate, to, 'aria-current': ariaCurrent }: LinkProps) {
  const { navigate } = useRouter()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(to)
    onNavigate?.()
  }

  return <a aria-current={ariaCurrent} className={className} href={to} onClick={handleClick}>{children}</a>
}
