import type { Permission, Session } from './session.types'

export type AccessRequirement =
  | { authentication: 'public' }
  | { authentication: 'required'; permissions?: readonly Permission[] }

export type AccessDecision = 'allowed' | 'anonymous' | 'forbidden'

export function evaluateAccess(session: Session | null, requirement: AccessRequirement): AccessDecision {
  if (requirement.authentication === 'public') return 'allowed'
  if (!session) return 'anonymous'
  const permissions = new Set(session.permissions)
  return requirement.permissions?.every((permission) => permissions.has(permission)) === false
    ? 'forbidden'
    : 'allowed'
}
