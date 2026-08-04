import type { ApexOptions } from 'apexcharts'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'

type ChartType = 'area' | 'bar' | 'donut'

async function loadChartRenderer(type: ChartType) {
  const chartType = type === 'area'
    ? import('apexcharts/area')
    : type === 'bar'
      ? import('apexcharts/bar')
      : import('apexcharts/donut')

  await Promise.all([
    chartType,
    import('apexcharts/features/keyboard'),
    import('apexcharts/features/legend'),
  ])

  return import('react-apexcharts/core')
}

const chartRenderers = {
  area: lazy(() => loadChartRenderer('area')),
  bar: lazy(() => loadChartRenderer('bar')),
  donut: lazy(() => loadChartRenderer('donut')),
}

type ApexChartProps = {
  height: number
  options: ApexOptions
  series: ApexOptions['series']
  type: ChartType
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
  const ReactApexChart = chartRenderers[type]
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
