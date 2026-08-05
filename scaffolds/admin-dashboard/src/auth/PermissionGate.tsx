import type { ReactNode } from 'react'

import { evaluateAccess } from './accessPolicy'
import { useSession } from './SessionProvider'
import type { Permission } from './session.types'

export function PermissionGate({
  children,
  fallback = null,
  permissions,
}: {
  children: ReactNode
  fallback?: ReactNode
  permissions: readonly Permission[]
}) {
  const { state } = useSession()
  const session = state.status === 'authenticated' ? state.session : null
  return evaluateAccess(session, { authentication: 'required', permissions }) === 'allowed' ? children : fallback
}
