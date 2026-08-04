export type ChartState = 'loading' | 'data' | 'empty' | 'error'

export type ChartSeries = {
  name: string
  data: number[]
}

export type ChartStateProps = {
  state?: ChartState
  errorDescription?: string
  onRetry?: () => void
}
