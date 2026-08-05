import type { ApexOptions } from 'apexcharts'

import type { ChartTheme } from './chart.theme'
import type { ChartSeries } from './chart.types'

type AreaOptionsInput = {
  categories: string[]
  chartTheme: ChartTheme
  series: ChartSeries[]
  valueSuffix: string
}

type CartesianOptionsInput = {
  categories: string[]
  chartTheme: ChartTheme
  series: ChartSeries[]
  valueSuffix: string
}

export function buildBarChartOptions({ categories, chartTheme, series, valueSuffix }: CartesianOptionsInput): ApexOptions {
  return {
    chart: {
      background: 'transparent',
      fontFamily: 'inherit',
      foreColor: chartTheme.label,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: series.map((_, index) => chartTheme.palette[index % chartTheme.palette.length]),
    dataLabels: { enabled: false },
    fill: { opacity: 0.92 },
    grid: {
      borderColor: chartTheme.grid,
      padding: { left: 8, right: 8 },
      strokeDashArray: 5,
    },
    legend: {
      fontSize: '12px',
      horizontalAlign: 'left',
      itemMargin: { horizontal: 12, vertical: 4 },
      position: 'top',
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        borderRadiusApplication: 'end',
        columnWidth: '54%',
      },
    },
    states: {
      active: { filter: { type: 'none' } },
      hover: { filter: { type: 'lighten', value: 0.06 } },
    },
    stroke: { colors: [chartTheme.surface], width: 2 },
    theme: { mode: chartTheme.mode },
    tooltip: {
      theme: chartTheme.mode,
      y: { formatter: (value) => `${value.toLocaleString('zh-CN')}${valueSuffix}` },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      categories,
      labels: { style: { colors: chartTheme.label, fontSize: '11px' } },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${Math.round(value)}${valueSuffix}`,
        style: { colors: [chartTheme.label], fontSize: '11px' },
      },
    },
  }
}

export function buildAreaChartOptions({ categories, chartTheme, series, valueSuffix }: AreaOptionsInput): ApexOptions {
  return {
    chart: {
      background: 'transparent',
      fontFamily: 'inherit',
      foreColor: chartTheme.label,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: series.map((_, index) => chartTheme.palette[index % chartTheme.palette.length]),
    dataLabels: { enabled: false },
    fill: {
      type: 'gradient',
      gradient: { opacityFrom: 0.38, opacityTo: 0.03, shadeIntensity: 0.25, stops: [0, 92, 100] },
    },
    grid: {
      borderColor: chartTheme.grid,
      padding: { left: 8, right: 8 },
      strokeDashArray: 5,
    },
    legend: {
      fontSize: '12px',
      horizontalAlign: 'left',
      itemMargin: { horizontal: 12, vertical: 4 },
      position: 'top',
    },
    markers: { hover: { sizeOffset: 3 }, size: 0, strokeWidth: 0 },
    stroke: { curve: 'smooth', lineCap: 'round', width: 3 },
    theme: { mode: chartTheme.mode },
    tooltip: {
      theme: chartTheme.mode,
      y: { formatter: (value) => `${value.toLocaleString('zh-CN')}${valueSuffix}` },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      categories,
      labels: { style: { colors: chartTheme.label, fontSize: '11px' } },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${Math.round(value)}${valueSuffix}`,
        style: { colors: [chartTheme.label], fontSize: '11px' },
      },
    },
  }
}

type DonutOptionsInput = {
  chartTheme: ChartTheme
  labels: string[]
  series: number[]
  total: number
  totalLabel: string
}

export function buildDonutChartOptions({ chartTheme, labels, series, total, totalLabel }: DonutOptionsInput): ApexOptions {
  return {
    chart: { background: 'transparent', fontFamily: 'inherit', foreColor: chartTheme.label },
    colors: labels.map((_, index) => chartTheme.palette[index % chartTheme.palette.length]),
    dataLabels: { enabled: false },
    labels,
    legend: {
      fontSize: '12px',
      formatter: (name, options) => {
        const value = options ? series[options.seriesIndex] : undefined
        return value === undefined ? name : `${name} · ${Math.round((value / total) * 100)}%`
      },
      itemMargin: { horizontal: 8, vertical: 5 },
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            name: { color: chartTheme.label, fontSize: '12px', show: true },
            show: true,
            total: {
              color: chartTheme.label,
              formatter: () => total.toLocaleString('zh-CN'),
              fontSize: '22px',
              fontWeight: 700,
              label: totalLabel,
              show: true,
            },
            value: { color: chartTheme.label, fontSize: '18px', formatter: (value) => Number(value).toLocaleString('zh-CN'), show: true },
          },
          size: '72%',
        },
        expandOnClick: false,
      },
    },
    states: {
      active: { filter: { type: 'none' } },
      hover: { filter: { type: 'lighten', value: 0.08 } },
    },
    stroke: { colors: ['transparent'], width: 3 },
    theme: { mode: chartTheme.mode },
    tooltip: { theme: chartTheme.mode, y: { formatter: (value) => value.toLocaleString('zh-CN') } },
  }
}
