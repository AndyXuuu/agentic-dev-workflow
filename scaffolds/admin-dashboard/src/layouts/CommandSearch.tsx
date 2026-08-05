import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useNavigate } from '../app/router'
import { getAccessibleAppRoutes, type AppPath } from '../app/routes'
import { useSession } from '../auth'
import { Button, Modal, TextInput } from '../components/ui'

type CommandSearchProps = {
  open: boolean
  onClose: () => void
}

export function CommandSearch({ open, onClose }: CommandSearchProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { state } = useSession()
  const routes = useMemo(
    () => state.status === 'authenticated' ? getAccessibleAppRoutes(state.session) : [],
    [state],
  )
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('zh-CN')
    if (!normalized) return routes
    return routes.filter((item) => `${item.label}${item.description}`.toLocaleLowerCase('zh-CN').includes(normalized))
  }, [query, routes])

  const select = (path: AppPath) => {
    navigate(path)
    setQuery('')
    onClose()
  }

  return (
    <Modal description="搜索并打开脚手架中的页面。" onClose={onClose} open={open} title="快速导航">
      <TextInput
        data-autofocus="primary"
        label="搜索页面"
        labelHidden
        onChange={(event) => setQuery(event.target.value)}
        placeholder="输入页面名称"
        startIcon={<Search aria-hidden className="app-icon-sm" />}
        type="search"
        value={query}
      />
      {results.length > 0 ? (
        <ul className="mt-4 space-y-1">
          {results.map((item) => (
            <li key={item.path}>
              <Button className="h-auto min-h-0 w-full justify-start px-3 py-2 text-left" onClick={() => select(item.path)} variant="ghost">
                <span><span className="block font-semibold">{item.label}</span><span className="app-caption app-text-muted mt-1 block font-normal">{item.description}</span></span>
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="app-body app-text-secondary mt-6 text-center">没有匹配页面</p>
      )}
    </Modal>
  )
}
