import { Save } from 'lucide-react'
import { useState } from 'react'

import { defaultWorkspaceSettings, readWorkspaceSettings, saveWorkspaceSettings, type WorkspaceSettings } from '../features/settings/settings.repository'
import { PageHeader } from '../components/ui/PageHeader'

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'
type SettingsField = 'supportEmail' | 'workspaceName'

const invalidMessages: Record<SettingsField, string> = {
  supportEmail: '请输入有效的支持邮箱。',
  workspaceName: '请输入工作区名称。',
}

export function SettingsPage() {
  const [settings, setSettings] = useState<WorkspaceSettings>(readWorkspaceSettings)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<SettingsField, string>>>({})

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

  const submit = async () => {
    if (saveState === 'saving') return
    setSaveState('saving')
    const result = await saveWorkspaceSettings(settings)
    if (result.ok) {
      setSaveState('saved')
      return
    }
    setSaveState('error')
    setErrorMessage(result.message)
  }

  const statusMessage = {
    idle: '',
    dirty: '有尚未保存的更改',
    saving: '正在保存设置',
    saved: '设置已保存',
    error: errorMessage,
  }[saveState]

  return (
    <div className="app-page-stack">
      <PageHeader description="演示表单状态、边界校验与可替换的本地 repository；真实项目应通过服务端权限保护设置写入。" eyebrow="Configuration" title="工作区设置" />
      <form
        className="surface-card max-w-3xl"
        onReset={() => { setSettings(defaultWorkspaceSettings); setSaveState('dirty'); setErrorMessage(''); setFieldErrors({}) }}
        onSubmit={(event) => { event.preventDefault(); void submit() }}
      >
        <div className="app-surface-body space-y-5">
          <fieldset className="space-y-4" disabled={saveState === 'saving'}>
            <legend className="app-section-title">基本信息</legend>
            <label className="form-control block">
              <span className="label-text mb-2 block font-medium">工作区名称</span>
              <input
                aria-describedby={fieldErrors.workspaceName ? 'workspace-name-error' : undefined}
                aria-invalid={fieldErrors.workspaceName ? 'true' : undefined}
                className="input input-bordered w-full"
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
              {fieldErrors.workspaceName && <span className="app-caption app-text-error mt-1" id="workspace-name-error">{fieldErrors.workspaceName}</span>}
            </label>
            <label className="form-control block">
              <span className="label-text mb-2 block font-medium">支持邮箱</span>
              <input
                aria-describedby={fieldErrors.supportEmail ? 'support-email-error' : undefined}
                aria-invalid={fieldErrors.supportEmail ? 'true' : undefined}
                autoComplete="email"
                className="input input-bordered w-full"
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
              {fieldErrors.supportEmail && <span className="app-caption app-text-error mt-1" id="support-email-error">{fieldErrors.supportEmail}</span>}
            </label>
            <label className="form-control block">
              <span className="label-text mb-2 block font-medium">默认时区</span>
              <select className="select select-bordered w-full" name="timezone" onChange={(event) => update('timezone', event.target.value)} value={settings.timezone}>
                <option value="Asia/Singapore">Asia/Singapore (UTC+8)</option>
                <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
                <option value="UTC">UTC</option>
              </select>
            </label>
          </fieldset>

          <fieldset className="space-y-4 border-t border-base-300 pt-5" disabled={saveState === 'saving'}>
            <legend className="app-section-title">通知偏好</legend>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-base-200 p-4">
              <input checked={settings.inventoryAlerts} className="toggle toggle-primary mt-0.5" name="inventoryAlerts" onChange={(event) => update('inventoryAlerts', event.target.checked)} type="checkbox" />
              <span><span className="app-body block font-semibold">库存告警</span><span className="app-caption app-text-muted mt-1 block">商品低于安全库存时通知运营人员。</span></span>
            </label>
          </fieldset>
        </div>
        <div className="app-surface-footer flex flex-wrap items-center justify-between gap-3 border-t border-base-300/70">
          <p aria-live="polite" className={saveState === 'error' ? 'app-body app-text-error' : 'app-body app-text-secondary'}>{statusMessage}</p>
          <div className="app-control-gap flex">
            <button className="btn btn-ghost btn-sm" disabled={saveState === 'saving'} type="reset">恢复默认</button>
            <button className="btn btn-primary btn-sm" disabled={saveState === 'saving' || saveState === 'idle' || saveState === 'saved'} type="submit">
              <Save aria-hidden size={17} />{saveState === 'saving' ? '保存中' : '保存设置'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
