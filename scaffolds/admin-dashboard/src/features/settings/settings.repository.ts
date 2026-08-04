export type WorkspaceSettings = {
  workspaceName: string
  supportEmail: string
  timezone: string
  inventoryAlerts: boolean
}

export type SaveResult =
  | { ok: true }
  | { ok: false; message: string }

const storageKey = 'admin-dashboard-settings'

export const defaultWorkspaceSettings: WorkspaceSettings = {
  workspaceName: 'Demo Commerce',
  supportEmail: 'support@example.com',
  timezone: 'Asia/Singapore',
  inventoryAlerts: true,
}

export function readWorkspaceSettings(): WorkspaceSettings {
  try {
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) return defaultWorkspaceSettings
    const parsed = JSON.parse(stored) as Partial<WorkspaceSettings>
    return {
      workspaceName: typeof parsed.workspaceName === 'string' ? parsed.workspaceName : defaultWorkspaceSettings.workspaceName,
      supportEmail: typeof parsed.supportEmail === 'string' ? parsed.supportEmail : defaultWorkspaceSettings.supportEmail,
      timezone: typeof parsed.timezone === 'string' ? parsed.timezone : defaultWorkspaceSettings.timezone,
      inventoryAlerts: typeof parsed.inventoryAlerts === 'boolean' ? parsed.inventoryAlerts : defaultWorkspaceSettings.inventoryAlerts,
    }
  } catch {
    return defaultWorkspaceSettings
  }
}

export async function saveWorkspaceSettings(settings: WorkspaceSettings): Promise<SaveResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 120))
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(settings))
    return { ok: true }
  } catch {
    return { ok: false, message: '浏览器未允许保存本地设置，请检查存储权限后重试。' }
  }
}
