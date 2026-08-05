import { RotateCcw, Save } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../components/ui/Button'
import { DestructiveActionDialog } from '../components/ui/DestructiveActionDialog'
import { DangerZone, type DangerZoneAction } from '../components/ui/DangerZone'
import { PageHeader } from '../components/ui/PageHeader'
import { Panel } from '../components/ui/Panel'
import { Select } from '../components/ui/Select'
import { Switch } from '../components/ui/Switch'
import { TextInput } from '../components/ui/TextInput'
import { runWorkspaceDangerAction, workspaceDangerActions } from '../features/settings/settings.danger-actions'
import { defaultWorkspaceSettings, readWorkspaceSettings, saveWorkspaceSettings, type WorkspaceSettings } from '../features/settings/settings.repository'

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'
type SettingsField = 'supportEmail' | 'workspaceName'

const invalidMessages: Record<SettingsField, string> = {
  supportEmail: '请输入有效的支持邮箱。',
  workspaceName: '请输入工作区名称。',
}

export function SettingsPage() {
  const [settings, setSettings] = useState<WorkspaceSettings>(readWorkspaceSettings)
  const [lastSavedSettings, setLastSavedSettings] = useState<WorkspaceSettings>(settings)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<SettingsField, string>>>({})
  const [activeDangerAction, setActiveDangerAction] = useState<DangerZoneAction | null>(null)
  const [dangerAnnouncement, setDangerAnnouncement] = useState('')

  const clearFieldError = (field: SettingsField) => {
    setFieldErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const update = <Key extends keyof WorkspaceSettings>(key: Key, value: WorkspaceSettings[Key]) => {
    setSettings((current) => ({ ...current, [key]: value }))
    setSaveState('dirty')
    setErrorMessage('')
    if (key === 'workspaceName' || key === 'supportEmail') clearFieldError(key)
  }

  const cancelChanges = () => {
    setSettings(lastSavedSettings)
    setSaveState('idle')
    setErrorMessage('')
    setFieldErrors({})
  }

  const restoreDefaults = () => {
    setSettings(defaultWorkspaceSettings)
    setSaveState('dirty')
    setErrorMessage('')
    setFieldErrors({})
  }

  const submit = async () => {
    if (saveState === 'saving') return
    setSaveState('saving')
    const result = await saveWorkspaceSettings(settings)
    if (result.ok) {
      setLastSavedSettings(settings)
      setSaveState('saved')
      return
    }
    setSaveState('error')
    setErrorMessage(result.message)
  }

  const statusMessage = {
    idle: '当前设置与最近保存版本一致',
    dirty: '有尚未保存的更改',
    saving: '正在保存设置',
    saved: '设置已保存',
    error: errorMessage,
  }[saveState]

  return (
    <div className="app-page-stack">
      <PageHeader description="按任务分区管理工作区偏好；写操作通过可替换 repository 演示，真实项目必须由服务端校验权限。" eyebrow="Configuration" title="工作区设置" />

      <form
        className="grid max-w-4xl gap-5"
        onSubmit={(event) => { event.preventDefault(); void submit() }}
      >
        <fieldset className="contents" disabled={saveState === 'saving'}>
          <legend className="sr-only">工作区设置</legend>

          <Panel description="用于后台标题、系统通知和支持渠道展示。" title="工作区资料">
            <div className="app-surface-body grid gap-4 md:grid-cols-2">
              <TextInput
                error={fieldErrors.workspaceName}
                label="工作区名称"
                maxLength={60}
                name="workspaceName"
                onChange={(event) => update('workspaceName', event.target.value)}
                onInvalid={(event) => {
                  event.preventDefault()
                  setFieldErrors((current) => ({ ...current, workspaceName: invalidMessages.workspaceName }))
                }}
                pattern={'\\s*\\S.*'}
                required
                value={settings.workspaceName}
              />
              <TextInput
                autoComplete="email"
                error={fieldErrors.supportEmail}
                label="支持邮箱"
                name="supportEmail"
                onChange={(event) => update('supportEmail', event.target.value)}
                onInvalid={(event) => {
                  event.preventDefault()
                  setFieldErrors((current) => ({ ...current, supportEmail: invalidMessages.supportEmail }))
                }}
                required
                type="email"
                value={settings.supportEmail}
              />
            </div>
          </Panel>

          <Panel description="保持时间展示和运营提醒的一致默认值。" title="区域与通知">
            <div className="app-surface-body grid gap-4 md:grid-cols-2">
              <Select label="默认时区" name="timezone" onChange={(event) => update('timezone', event.target.value)} value={settings.timezone}>
                  <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
                  <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
                  <option value="UTC">UTC</option>
              </Select>
              <Switch
                checked={settings.inventoryAlerts}
                description="商品低于安全库存时通知运营人员。"
                label="库存告警"
                name="inventoryAlerts"
                onChange={(event) => update('inventoryAlerts', event.target.checked)}
              />
            </div>
          </Panel>
        </fieldset>

        <section aria-label="保存设置" className="surface-card app-settings-action-bar">
          <p aria-live="polite" className={saveState === 'error' ? 'app-body app-text-error' : 'app-body app-text-secondary'}>{statusMessage}</p>
          <div className="app-control-gap flex flex-wrap">
            <Button disabled={saveState === 'saving'} onClick={restoreDefaults} size="small" startIcon={<RotateCcw aria-hidden className="app-icon-sm" />} variant="ghost">恢复默认</Button>
            <Button disabled={saveState !== 'dirty' && saveState !== 'error'} onClick={cancelChanges} size="small" variant="outline">取消更改</Button>
            <Button disabled={saveState === 'idle' || saveState === 'saved'} loading={saveState === 'saving'} size="small" startIcon={<Save aria-hidden className="app-icon-sm" />} type="submit" variant="primary">
              {saveState === 'saving' ? '保存中' : '保存设置'}
            </Button>
          </div>
        </section>
      </form>

      <div className="max-w-4xl">
        <DangerZone
          actions={workspaceDangerActions}
          onSelect={(action) => {
            setDangerAnnouncement('')
            setActiveDangerAction(action)
          }}
        />
        <p aria-live="polite" className={dangerAnnouncement ? 'app-body app-text-secondary mt-3' : 'sr-only'}>{dangerAnnouncement}</p>
      </div>

      <DestructiveActionDialog
        action={activeDangerAction}
        onClose={() => setActiveDangerAction(null)}
        onConfirm={runWorkspaceDangerAction}
        onSuccess={setDangerAnnouncement}
        open={Boolean(activeDangerAction)}
      />
    </div>
  )
}
