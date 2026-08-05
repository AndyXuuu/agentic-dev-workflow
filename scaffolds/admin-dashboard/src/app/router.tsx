import { createContext, type MouseEvent, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { buttonClassName, type ButtonSize, type ButtonVariant } from '../components/ui'

type PathResolver = (pathname: string) => string

type RouterValue = {
  path: string
  navigate: (path: string) => void
}

const RouterContext = createContext<RouterValue | null>(null)

export function RouterProvider({ children, resolvePath }: { children: ReactNode; resolvePath: PathResolver }) {
  const [path, setPath] = useState(() => resolvePath(window.location.pathname))

  useEffect(() => {
    if (window.location.pathname !== path) window.history.replaceState({}, '', path)
  }, [path])

  useEffect(() => {
    const onPopState = () => {
      const nextPath = resolvePath(window.location.pathname)
      if (window.location.pathname !== nextPath) window.history.replaceState({}, '', nextPath)
      setPath(nextPath)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [resolvePath])

  const navigate = useCallback(
    (requestedPath: string) => {
      const nextPath = resolvePath(requestedPath)
      if (nextPath === resolvePath(window.location.pathname) && window.location.pathname === nextPath) return
      window.history.pushState({}, '', nextPath)
      setPath(nextPath)
      window.scrollTo({ top: 0, behavior: 'auto' })
    },
    [resolvePath],
  )

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
  action?: {
    size?: ButtonSize
    variant?: ButtonVariant
  }
  'aria-describedby'?: string
  children: ReactNode
  className?: string
  onNavigate?: () => void
  to: string
  'aria-current'?: 'page'
}

export function Link({ action, children, className, onNavigate, to, 'aria-current': ariaCurrent, 'aria-describedby': ariaDescribedBy }: LinkProps) {
  const { navigate } = useRouter()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(to)
    onNavigate?.()
  }

  return (
    <a
      aria-current={ariaCurrent}
      aria-describedby={ariaDescribedBy}
      className={action ? buttonClassName({ className, ...action }) : className}
      href={to}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
