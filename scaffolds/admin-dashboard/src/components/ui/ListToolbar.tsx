import { RotateCcw, Search } from 'lucide-react'

import { Button } from './Button'
import { Select } from './Select'
import { TextInput } from './TextInput'

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
        <TextInput
          aria-controls={controlsId}
          containerClassName="min-w-0"
          label={searchLabel}
          labelHidden
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchLabel}
          startIcon={<Search aria-hidden className="app-icon-sm" />}
          type="search"
          value={searchValue}
        />
        <Select
          aria-controls={controlsId}
          label={filterLabel}
          labelHidden
          onChange={(event) => onFilterChange(event.target.value)}
          value={filterValue}
        >
          {filterOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
        <Button
          aria-controls={controlsId}
          className="w-full sm:w-auto"
          disabled={!hasActiveFilters}
          onClick={onReset}
          startIcon={<RotateCcw aria-hidden className="app-icon-sm" />}
          variant="ghost"
        >
          重置筛选
        </Button>
      </div>
      <p aria-live="polite" className="app-caption app-text-muted">{resultSummary}</p>
    </section>
  )
}
