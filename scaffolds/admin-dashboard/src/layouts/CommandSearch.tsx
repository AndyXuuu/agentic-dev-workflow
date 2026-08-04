import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { type AppPath, useNavigate } from '../app/router'
import { Modal } from '../components/ui/Modal'

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
      <label className="input input-bordered flex min-h-11 items-center gap-2 bg-base-100">
        <Search aria-hidden size={18} />
        <span className="sr-only">搜索页面</span>
        <input aria-label="搜索页面" data-autofocus="primary" className="grow" onChange={(event) => setQuery(event.target.value)} placeholder="输入页面名称" type="search" value={query} />
      </label>
      {results.length > 0 ? (
        <ul className="mt-4 space-y-1">
          {results.map((item) => (
            <li key={item.path}>
              <button className="btn btn-ghost h-auto w-full justify-start px-3 py-3 text-left" onClick={() => select(item.path)} type="button">
                <span><span className="block font-semibold">{item.label}</span><span className="mt-1 block text-xs font-normal text-base-content/55">{item.description}</span></span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-center text-sm text-base-content/58">没有匹配页面</p>
      )}
    </Modal>
  )
}
