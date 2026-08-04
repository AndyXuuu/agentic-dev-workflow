import { RotateCcw, Search } from 'lucide-react'

export type ListToolbarOption = {
  label: string
  value: string
}

type ListToolbarProps = {
  ariaLabel: string
  controlsId: string
  filterLabel: string
  filterOptions: ListToolbarOption[]
  filterValue: string
  onFilterChange: (value: string) => void
  onReset: () => void
  onSearchChange: (value: string) => void
  resultSummary: string
  searchLabel: string
  searchValue: string
}

export function ListToolbar({
  ariaLabel,
  controlsId,
  filterLabel,
  filterOptions,
  filterValue,
  onFilterChange,
  onReset,
  onSearchChange,
  resultSummary,
  searchLabel,
  searchValue,
}: ListToolbarProps) {
  const hasActiveFilters = searchValue.trim().length > 0 || filterValue !== filterOptions[0]?.value

  return (
    <section aria-label={ariaLabel} className="list-toolbar">
      <div className="list-toolbar-controls">
        <label className="input input-bordered flex min-h-11 min-w-0 items-center gap-2 bg-base-100">
          <Search aria-hidden size={18} />
          <span className="sr-only">{searchLabel}</span>
          <input
            aria-controls={controlsId}
            aria-label={searchLabel}
            className="min-w-0 grow"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchLabel}
            type="search"
            value={searchValue}
          />
        </label>
        <select
          aria-controls={controlsId}
          aria-label={filterLabel}
          className="select select-bordered min-h-11 w-full bg-base-100"
          onChange={(event) => onFilterChange(event.target.value)}
          value={filterValue}
        >
          {filterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <button
          aria-controls={controlsId}
          className="btn btn-ghost min-h-11 w-full sm:w-auto"
          disabled={!hasActiveFilters}
          onClick={onReset}
          type="button"
        >
          <RotateCcw aria-hidden size={17} />重置筛选
        </button>
      </div>
      <p aria-live="polite" className="text-xs text-base-content/52">{resultSummary}</p>
    </section>
  )
}
