export type Permission = string

export type Actor = {
  displayName: string
  id: string
  roleLabel: string
}

export type Session = {
  actor: Actor
  csrfToken: string
  expiresAt: string
  permissions: readonly Permission[]
}

export type SessionState =
  | { status: 'loading' }
  | { status: 'authenticated'; session: Session }
  | { status: 'anonymous' }
  | { status: 'error'; error: Error }
