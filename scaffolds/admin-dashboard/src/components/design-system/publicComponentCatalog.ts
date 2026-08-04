export const publicComponentCatalog = [
  { component: 'AreaChart', owner: 'components/charts', status: '稳定', tone: 'success' },
  { component: 'BarChart', owner: 'components/charts', status: '稳定', tone: 'success' },
  { component: 'DataTable', owner: 'components/ui', status: '稳定', tone: 'success' },
  { component: 'DesignTokenCatalog', owner: 'components/design-system', status: '稳定', tone: 'success' },
  { component: 'DonutChart', owner: 'components/charts', status: '稳定', tone: 'success' },
  { component: 'ListToolbar', owner: 'components/ui', status: '稳定', tone: 'success' },
  { component: 'Modal', owner: 'components/ui', status: '稳定', tone: 'success' },
  { component: 'PageHeader', owner: 'components/ui', status: '稳定', tone: 'success' },
  { component: 'PageState', owner: 'components/ui', status: '稳定', tone: 'success' },
  { component: 'Panel', owner: 'components/ui', status: '稳定', tone: 'success' },
  { component: 'ProgressBar', owner: 'components/ui', status: '稳定', tone: 'success' },
  { component: 'StatusBadge', owner: 'components/ui', status: '稳定', tone: 'success' },
] as const

export type PublicComponentCatalogRow = (typeof publicComponentCatalog)[number]
