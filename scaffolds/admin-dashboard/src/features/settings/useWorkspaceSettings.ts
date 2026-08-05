import { useState } from 'react'

import { defaultWorkspaceSettings, readWorkspaceSettings, saveWorkspaceSettings, type WorkspaceSettings } from './settings.repository'

export type SettingsField = 'supportEmail' | 'workspaceName'
export type SettingsSaveState = 'dirty' | 'error' | 'idle' | 'saved' | 'saving'

export const invalidSettingsMessages: Record<SettingsField, string> = {
  supportEmail: '请输入有效的支持邮箱。',
  workspaceName: '请输入工作区名称。',
}

export function useWorkspaceSettings() {
  const [settings, setSettings] = useState<WorkspaceSettings>(readWorkspaceSettings)
  const [lastSavedSettings, setLastSavedSettings] = useState<WorkspaceSettings>(settings)
  const [saveState, setSaveState] = useState<SettingsSaveState>('idle')
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

  return {
    cancelChanges,
    fieldErrors,
    markInvalid: (field: SettingsField) =>
      setFieldErrors((current) => ({
        ...current,
        [field]: invalidSettingsMessages[field],
      })),
    restoreDefaults,
    saveState,
    settings,
    statusMessage: {
      idle: '当前设置与最近保存版本一致',
      dirty: '有尚未保存的更改',
      saving: '正在保存设置',
      saved: '设置已保存',
      error: errorMessage,
    }[saveState],
    submit,
    update,
  }
}
