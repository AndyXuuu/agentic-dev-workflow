import { type KeyboardEvent, type ReactNode, useId, useRef } from 'react'

export type TabItem = {
  content: ReactNode
  disabled?: boolean
  id: string
  label: string
}

type TabsProps = {
  ariaLabel: string
  items: readonly TabItem[]
  onValueChange: (value: string) => void
  value: string
}

export function Tabs({ ariaLabel, items, onValueChange, value }: TabsProps) {
  const generatedId = useId()
  const tabRefs = useRef(new Map<string, HTMLButtonElement>())
  const selected = items.find((item) => item.id === value && !item.disabled) ?? items.find((item) => !item.disabled)

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const enabledItems = items.filter((item) => !item.disabled)
    if (enabledItems.length === 0) return
    const currentIndex = enabledItems.findIndex((item) => item.id === event.currentTarget.dataset.value)
    let nextIndex: number | undefined
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % enabledItems.length
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = enabledItems.length - 1
    if (nextIndex === undefined) return
    event.preventDefault()
    const nextItem = enabledItems[nextIndex]
    if (!nextItem) return
    onValueChange(nextItem.id)
    tabRefs.current.get(nextItem.id)?.focus()
  }

  return (
    <div className="app-tabs">
      <div aria-label={ariaLabel} className="app-tabs__list" role="tablist">
        {items.map((item) => {
          const tabId = `${generatedId}-tab-${item.id}`
          const panelId = `${generatedId}-panel-${item.id}`
          const active = selected?.id === item.id
          return (
            <button
              aria-controls={panelId}
              aria-selected={active}
              className="app-tabs__tab"
              data-value={item.id}
              disabled={item.disabled}
              id={tabId}
              key={item.id}
              onClick={() => onValueChange(item.id)}
              onKeyDown={handleKeyDown}
              ref={(element) => {
                if (element) tabRefs.current.set(item.id, element)
                else tabRefs.current.delete(item.id)
              }}
              role="tab"
              tabIndex={active ? 0 : -1}
              type="button"
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {selected && (
        <div
          aria-labelledby={`${generatedId}-tab-${selected.id}`}
          className="app-tabs__panel"
          id={`${generatedId}-panel-${selected.id}`}
          role="tabpanel"
        >
          {selected.content}
        </div>
      )}
    </div>
  )
}
