import type { Theme } from '../../hooks/useTheme'

export type ChartTheme = {
  mode: 'light' | 'dark'
  palette: string[]
  grid: string
  label: string
}

function readToken(styles: CSSStyleDeclaration, name: string, fallback: string) {
  return styles.getPropertyValue(name).trim() || fallback
}

export function readChartTheme(theme: Theme): ChartTheme {
  const styles = getComputedStyle(document.documentElement)
  return {
    mode: theme === 'business' ? 'dark' : 'light',
    palette: [1, 2, 3, 4, 5].map((index) => readToken(styles, `--app-chart-series-${index}`, 'currentColor')),
    grid: readToken(styles, '--app-chart-grid', 'transparent'),
    label: readToken(styles, '--app-chart-label', 'currentColor'),
  }
}
