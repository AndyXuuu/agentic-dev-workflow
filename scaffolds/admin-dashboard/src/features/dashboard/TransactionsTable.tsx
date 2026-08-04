import { FileText } from 'lucide-react'
import { useMemo, useState } from 'react'

import { DataTable, type DataTableColumn } from '../../components/ui/DataTable'
import { Modal } from '../../components/ui/Modal'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { transactions, type Transaction } from './dashboard.data'

export function TransactionsTable() {
  const [selected, setSelected] = useState<Transaction | null>(null)
  const columns = useMemo<DataTableColumn<Transaction>[]>(() => [
    { id: 'id', header: '订单', cell: (row) => <span className="font-semibold">{row.id}</span> },
    {
      id: 'customer',
      header: '客户',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-base-200 text-xs font-bold text-base-content/65">{row.initials}</span>
          <span><span className="block font-medium">{row.customer}</span><span className="block text-xs text-base-content/45">{row.email}</span></span>
        </div>
      ),
    },
    { id: 'date', header: '日期', cell: (row) => row.date, className: 'text-base-content/62' },
    { id: 'payment', header: '支付方式', cell: (row) => row.payment, className: 'text-base-content/62' },
    { id: 'amount', header: '金额', cell: (row) => <span className="font-semibold tabular-nums">{row.amount}</span> },
    { id: 'status', header: '状态', cell: (row) => <StatusBadge label={row.status} tone={row.tone} /> },
    {
      id: 'actions',
      header: <span className="sr-only">操作</span>,
      align: 'right',
      cell: (row) => (
        <button aria-label={`查看 ${row.id} 发票`} className="btn btn-ghost btn-square btn-sm" onClick={() => setSelected(row)} type="button">
          <FileText aria-hidden size={17} />
        </button>
      ),
    },
  ], [])

  return (
    <>
      <DataTable ariaLabel="最近交易" columns={columns} minimumWidth="wide" rowKey={(row) => row.id} rows={transactions} />
      <Modal onClose={() => setSelected(null)} open={selected !== null} title={selected ? `${selected.id} 发票摘要` : '发票摘要'}>
        {selected && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
            <dt className="text-base-content/55">客户</dt><dd className="font-medium">{selected.customer}</dd>
            <dt className="text-base-content/55">日期</dt><dd>{selected.date}</dd>
            <dt className="text-base-content/55">支付</dt><dd>{selected.payment}</dd>
            <dt className="text-base-content/55">金额</dt><dd className="font-semibold">{selected.amount}</dd>
            <dt className="text-base-content/55">状态</dt><dd><StatusBadge label={selected.status} tone={selected.tone} /></dd>
          </dl>
        )}
      </Modal>
    </>
  )
}
