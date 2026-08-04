import { AdminShell } from '../layouts/AdminShell'
import { DashboardPage } from '../pages/DashboardPage'
import { DesignSystemPage } from '../pages/DesignSystemPage'
import { ResourceListPage } from '../pages/ResourceListPage'
import { SettingsPage } from '../pages/SettingsPage'
import { ThemeProvider } from '../hooks/useTheme'
import { RouterProvider, usePath } from './router'

function CurrentPage() {
  const path = usePath()

  if (path === '/orders') return <ResourceListPage key="orders" resource="orders" />
  if (path === '/products') return <ResourceListPage key="products" resource="products" />
  if (path === '/customers') return <ResourceListPage key="customers" resource="customers" />
  if (path === '/settings') return <SettingsPage />
  if (path === '/design-system') return <DesignSystemPage />
  return <DashboardPage />
}

export function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <AdminShell><CurrentPage /></AdminShell>
      </RouterProvider>
    </ThemeProvider>
  )
}
