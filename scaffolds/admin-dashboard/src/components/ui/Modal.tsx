import { X } from 'lucide-react'
import { type ReactNode, useEffect, useId, useRef } from 'react'

type ModalProps = {
  children: ReactNode
  description?: string
  footer?: ReactNode
  open: boolean
  title: string
  onClose: () => void
}

export function Modal({ children, description, footer, open, title, onClose }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
      document.body.dataset.overlayOpen = 'true'
      queueMicrotask(() => {
        const target = dialog.querySelector<HTMLElement>('[data-autofocus="primary"]')
          ?? dialog.querySelector<HTMLElement>('[data-autofocus]')
        target?.focus()
      })
    } else if (!open && dialog.open) {
      dialog.close()
    }

    return () => {
      delete document.body.dataset.overlayOpen
    }
  }, [open])

  const handleClosed = () => {
    delete document.body.dataset.overlayOpen
    restoreFocusRef.current?.focus()
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape 已由原生 dialog 的 cancel 事件处理；点击事件只补充鼠标背景关闭。
    <dialog
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      className="app-dialog"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onClose={handleClosed}
      ref={dialogRef}
    >
      <div className="app-dialog-panel">
        <header className="flex items-start gap-4 border-b border-base-300/70 p-5">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold" id={titleId}>{title}</h2>
            {description && <p className="mt-1 text-sm leading-6 text-base-content/58" id={descriptionId}>{description}</p>}
          </div>
          <button aria-label="关闭" className="btn btn-ghost btn-square btn-sm" data-autofocus type="button" onClick={onClose}>
            <X aria-hidden size={18} />
          </button>
        </header>
        <div className="p-5">{children}</div>
        {footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-base-300/70 p-4">{footer}</footer>}
      </div>
    </dialog>
  )
}
