import type { SessionGateway } from './session.gateway'
import type { Session } from './session.types'

export const defaultDemoSession: Session = {
  actor: {
    displayName: 'Demo Admin',
    id: 'demo-admin',
    roleLabel: 'Administrator',
  },
  csrfToken: 'not-a-secret-demo-value',
  expiresAt: '2099-12-31T23:59:59Z',
  permissions: [
    'dashboard:read',
    'orders:read',
    'products:read',
    'customers:read',
    'workspace:manage',
    'design-system:read',
  ],
}

export const demoSessionGateway: SessionGateway = {
  readSession: async () => defaultDemoSession,
  refreshSession: async () => defaultDemoSession,
  signOut: async () => undefined,
}
