import { AdminShell } from '../layouts/AdminShell'
import { ThemeProvider } from '../hooks/useTheme'
import {
  defaultDemoSession,
  demoSessionGateway,
  RouteAccessBoundary,
  type Session,
  type SessionGateway,
  SessionProvider,
} from '../auth'
import { RouterProvider, usePath } from './router'
import { getAppRoute, resolveAppPath } from './routes'

function CurrentPage() {
  const path = usePath()
  const route = getAppRoute(path)
  return <RouteAccessBoundary requirement={route.access}>{route.render()}</RouteAccessBoundary>
}

type AppProps = {
  initialSession?: Session
  sessionGateway?: SessionGateway
}

export function App({ initialSession, sessionGateway = demoSessionGateway }: AppProps = {}) {
  const bootstrapSession = initialSession ?? (sessionGateway === demoSessionGateway ? defaultDemoSession : undefined)
  return (
    <ThemeProvider>
      <SessionProvider gateway={sessionGateway} initialSession={bootstrapSession}>
        <RouterProvider resolvePath={resolveAppPath}>
          <AdminShell><CurrentPage /></AdminShell>
        </RouterProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
