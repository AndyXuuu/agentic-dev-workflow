import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { type AppPath, useNavigate } from '../app/router'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { TextInput } from '../components/ui/TextInput'

const destinations: Array<{ path: AppPath; label: string; description: string }> = [
  { path: '/dashboard', label: '经营概览', description: '销售、订单和库存指标' },
  { path: '/orders', label: '订单管理', description: '履约、支付和客户信息' },
  { path: '/products', label: '商品管理', description: '目录、价格和库存状态' },
  { path: '/customers', label: '客户管理', description: '客户状态和消费贡献' },
  { path: '/settings', label: '工作区设置', description: '基本信息和通知偏好' },
  { path: '/design-system', label: '设计系统', description: 'Token、组件和表格契约' },
]

type CommandSearchProps = {
  open: boolean
  onClose: () => void
}

export function CommandSearch({ open, onClose }: CommandSearchProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('zh-CN')
    if (!normalized) return destinations
    return destinations.filter((item) => `${item.label}${item.description}`.toLocaleLowerCase('zh-CN').includes(normalized))
  }, [query])

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
