import type { ApexOptions } from 'apexcharts'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'

const ReactApexChart = lazy(() => import('react-apexcharts'))

type ApexChartProps = {
  height: number
  options: ApexOptions
  series: ApexOptions['series']
  type: 'area' | 'bar' | 'donut'
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!query) return
    const update = () => setReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}

export function ApexChart({ height, options, series, type }: ApexChartProps) {
  const reducedMotion = useReducedMotion()
  const resolvedOptions = useMemo<ApexOptions>(() => ({
    ...options,
    chart: {
      ...options.chart,
      animations: {
        ...options.chart?.animations,
        enabled: !reducedMotion,
      },
    },
  }), [options, reducedMotion])

  return (
    <Suspense fallback={<div aria-label="正在加载图表渲染器" className="chart-state" role="status"><span aria-hidden className="loading loading-spinner loading-lg text-primary" /></div>}>
      <ReactApexChart height={height} options={resolvedOptions} series={series} type={type} width="100%" />
    </Suspense>
  )
}
