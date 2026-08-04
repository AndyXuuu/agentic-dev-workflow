import { readFileSync, readdirSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const sourceRoot = join(projectRoot, 'src')
const tokensPath = join(sourceRoot, 'styles', 'tokens.css')
const resourceListPath = join(sourceRoot, 'pages', 'ResourceListPage.tsx')
const catalogPath = join(sourceRoot, 'pages', 'DesignSystemPage.tsx')
const requiredTokens = [
  '--app-shell-sidebar-width',
  '--app-shell-header-height',
  '--app-content-max-width',
  '--app-radius-surface',
  '--app-border-subtle',
  '--app-table-header',
  '--app-table-toolbar',
  '--app-motion-fast',
  '--app-chart-series-1',
  '--app-chart-grid',
  '--app-chart-label',
]

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return ['.ts', '.tsx', '.css'].includes(extname(entry.name)) ? [path] : []
  })
}

const failures = []
const tokens = readFileSync(tokensPath, 'utf8')
for (const token of requiredTokens) {
  if (!tokens.includes(`${token}:`)) failures.push(`缺少设计 Token: ${token}`)
}

const resourceList = readFileSync(resourceListPath, 'utf8')
if (!resourceList.includes("from '../components/ui/ListToolbar'")) {
  failures.push('ResourceListPage 必须通过共享 ListToolbar 渲染搜索与筛选')
}

const catalog = readFileSync(catalogPath, 'utf8')
for (const component of ['BarChart', 'ListToolbar']) {
  if (!catalog.includes(`<${component}`)) failures.push(`Design System Catalog 缺少真实 ${component} 示例`)
}

for (const file of sourceFiles(sourceRoot)) {
  const content = readFileSync(file, 'utf8')
  const name = relative(projectRoot, file)
  if (/\/Users\/[^/\s'"]+/.test(content)) failures.push(`${name}: 包含个人用户目录路径`)
  if (/\b(?:w|pl|max-w)-\[(?:17|100)rem\]/.test(content)) failures.push(`${name}: 壳层尺寸必须使用项目 Token`)
  if (/#[0-9a-fA-F]{3,8}\b/.test(content)) failures.push(`${name}: 不允许在组件中硬编码十六进制颜色`)
  if (/<table\b/.test(content) && !name.endsWith('components/ui/DataTable.tsx')) failures.push(`${name}: 表格必须通过共享 DataTable 渲染`)
  if (/from ['"]react-apexcharts['"]/.test(content) && !name.endsWith('components/charts/ApexChart.tsx')) {
    failures.push(`${name}: react-apexcharts 只能由共享 ApexChart 适配层导入`)
  }
  if (/from ['"]apexcharts['"]/.test(content)
    && !name.endsWith('components/charts/ApexChart.tsx')
    && !name.endsWith('components/charts/apex.options.ts')) {
    failures.push(`${name}: ApexCharts 类型与配置只能存在于内部适配层`)
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('Design system contract passed')
}
