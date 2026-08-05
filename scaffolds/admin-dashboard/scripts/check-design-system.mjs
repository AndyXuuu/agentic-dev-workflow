import { readFileSync, readdirSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const sourceRoot = join(projectRoot, 'src')
const tokensPath = join(sourceRoot, 'styles', 'tokens.css')
const resourceListPath = join(sourceRoot, 'pages', 'ResourceListPage.tsx')
const catalogPath = join(sourceRoot, 'pages', 'DesignSystemPage.tsx')
const tokenCatalogPath = join(sourceRoot, 'components', 'design-system', 'DesignTokenCatalog.tsx')
const componentCatalogPath = join(sourceRoot, 'components', 'design-system', 'publicComponentCatalog.ts')
const designDocPath = join(projectRoot, 'DESIGN.md')
const indexPath = join(projectRoot, 'index.html')
const requiredTokens = [
  '--app-shell-sidebar-width',
  '--app-shell-sidebar-collapsed-width',
  '--app-shell-header-height',
  '--app-content-max-width',
  '--app-font-size-page-title',
  '--app-font-size-body',
  '--app-line-height-body',
  '--app-space-page-gap',
  '--app-space-panel',
  '--app-control-height',
  '--app-control-height-sm',
  '--app-icon-size-sm',
  '--app-icon-size-md',
  '--app-icon-size-lg',
  '--app-icon-size-xl',
  '--app-focus-ring',
  '--app-focus-control-shadow',
  '--app-radius-surface',
  '--app-border-subtle',
  '--app-table-header',
  '--app-table-toolbar',
  '--app-motion-fast',
  '--app-chart-series-1',
  '--app-chart-height',
  '--app-chart-surface',
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
const tokenCatalog = readFileSync(tokenCatalogPath, 'utf8')
const componentCatalog = readFileSync(componentCatalogPath, 'utf8')
const designDoc = readFileSync(designDocPath, 'utf8')
const indexHtml = readFileSync(indexPath, 'utf8')
for (const token of requiredTokens) {
  if (!tokens.includes(`${token}:`)) failures.push(`缺少设计 Token: ${token}`)
}

const definedProjectTokens = [...new Set([...tokens.matchAll(/^\s*(--app-[\w-]+):/gm)].map((match) => match[1]))]
const registeredProjectTokenNames = [...tokenCatalog.matchAll(/name:\s*['"](--app-[\w-]+)['"]/g)].map((match) => match[1])
const registeredProjectTokens = new Set(registeredProjectTokenNames)
for (const token of definedProjectTokens) {
  if (!registeredProjectTokens.has(token)) failures.push(`Token Catalog 缺少项目 Token: ${token}`)
}
for (const token of registeredProjectTokens) {
  if (!definedProjectTokens.includes(token)) failures.push(`Token Catalog 包含未定义项目 Token: ${token}`)
}
for (const token of registeredProjectTokens) {
  if (registeredProjectTokenNames.filter((name) => name === token).length > 1) failures.push(`Token Catalog 重复注册: ${token}`)
}
for (const token of ['--color-base-100', '--color-base-content', '--color-primary', '--color-success', '--color-warning', '--color-error', '--color-info']) {
  if (!tokenCatalog.includes(`name: '${token}'`)) failures.push(`Token Catalog 缺少主题语义 Token: ${token}`)
}
if (!indexHtml.includes("savedTheme === 'business' || savedTheme === 'corporate'")) {
  failures.push('主题启动边界必须拒绝 localStorage 中的未知主题值')
}

const resourceList = readFileSync(resourceListPath, 'utf8')
if (!resourceList.includes("from '../components/ui/ListToolbar'")) {
  failures.push('ResourceListPage 必须通过共享 ListToolbar 渲染搜索与筛选')
}
if (!resourceList.includes("from '../components/ui/TablePagination'")) {
  failures.push('ResourceListPage 必须通过共享 TablePagination 渲染分页')
}
if (!resourceList.includes("from '../components/ui/Skeleton'")) {
  failures.push('ResourceListPage 必须通过共享 Skeleton 渲染加载占位')
}
if (!resourceList.includes('selection={{') || !resourceList.includes('sort: {')) {
  failures.push('ResourceListPage 必须通过 DataTable 的受控契约实现排序与当前页选择')
}

const catalog = readFileSync(catalogPath, 'utf8')
if (!catalog.includes('aria-label="设计系统分类"')) failures.push('Design System Catalog 缺少顶部分类导航')
if (!tokenCatalog.includes('id="foundation-tokens"')) failures.push('Design Token Catalog 缺少基础分类锚点')
for (const sectionId of ['foundation-tokens', 'controls', 'components', 'safety', 'list-patterns', 'charts', 'states']) {
  if (!catalog.includes(`href: '#${sectionId}'`)) failures.push(`Design System Catalog 分类导航缺少 #${sectionId}`)
  if (!catalog.includes(`id="${sectionId}"`) && sectionId !== 'foundation-tokens') failures.push(`Design System Catalog 缺少分类锚点 #${sectionId}`)
}
const publicComponentNames = [...componentCatalog.matchAll(/component:\s*['"]([A-Z][\w]+)['"]/g)].map((match) => match[1])
for (const component of new Set(publicComponentNames)) {
  if (!catalog.includes(`<${component}`)) failures.push(`Design System Catalog 缺少真实 ${component} 示例`)
  if (!designDoc.includes(`| \`${component}\` |`)) failures.push(`DESIGN.md 缺少公开组件契约: ${component}`)
}
for (const component of new Set(publicComponentNames)) {
  if (publicComponentNames.filter((name) => name === component).length > 1) failures.push(`公开组件清单重复注册: ${component}`)
}
if (!catalog.includes('<DesignTokenCatalog')) failures.push('Design System Catalog 缺少完整 Token Catalog')
for (const control of ['Button', 'Checkbox', 'RadioGroup', 'Select', 'Switch', 'TextInput', 'Textarea']) {
  if (!catalog.includes(`<${control}`)) failures.push(`Design System Catalog 缺少真实 ${control} 控件示例`)
}

const nativeControlOwners = new Set([
  'src/components/ui/Button.tsx',
  'src/components/ui/Checkbox.tsx',
  'src/components/ui/RadioGroup.tsx',
  'src/components/ui/Select.tsx',
  'src/components/ui/Switch.tsx',
  'src/components/ui/Tabs.tsx',
  'src/components/ui/TextInput.tsx',
  'src/components/ui/Textarea.tsx',
])

for (const file of sourceFiles(sourceRoot)) {
  const content = readFileSync(file, 'utf8')
  const name = relative(projectRoot, file)
  if (/\/Users\/[^/\s'"]+/.test(content)) failures.push(`${name}: 包含个人用户目录路径`)
  if (/\b(?:w|pl|max-w)-\[(?:17|100)rem\]/.test(content)) failures.push(`${name}: 壳层尺寸必须使用项目 Token`)
  if (/#[0-9a-fA-F]{3,8}\b/.test(content)) failures.push(`${name}: 不允许在组件中硬编码十六进制颜色`)
  if (/text-base-content\/\d+/.test(content)) failures.push(`${name}: 有意义文本必须使用已验证的 app-text-* 语义角色`)
  const lucideImports = [...content.matchAll(/import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"]/g)]
    .flatMap((match) => match[1].split(','))
    .map((entry) => entry.trim().split(/\s+as\s+/).at(-1))
    .filter(Boolean)
  for (const icon of lucideImports) {
    if (new RegExp(`<${icon}\\b[^>]*\\bsize=\\{\\d+\\}`, 's').test(content)) {
      failures.push(`${name}: Lucide 图标 ${icon} 的尺寸必须使用 app-icon-* 语义类`)
    }
  }
  if (/\bbadge-soft\b|\bbadge-(?:success|warning|error|info|neutral)\b/.test(content)) {
    failures.push(`${name}: 语义状态必须通过共享 StatusBadge 渲染`)
  }
  if (/<table\b/.test(content) && !name.endsWith('components/ui/DataTable.tsx')) failures.push(`${name}: 表格必须通过共享 DataTable 渲染`)
  if (!name.endsWith('.test.tsx') && /<(?:button|input|select|textarea)\b/.test(content) && !nativeControlOwners.has(name)) {
    failures.push(`${name}: 生产消费者必须通过共享基础组件渲染 Button、Input、Select 与选择控件`)
  }
  if (/(?:from\s+|import\s*\()['"]react-apexcharts(?:\/core)?['"]/.test(content)
    && !name.endsWith('components/charts/ApexChart.tsx')) {
    failures.push(`${name}: react-apexcharts 只能由共享 ApexChart 适配层导入`)
  }
  if (/(?:from\s+|import\s*\()['"]apexcharts(?:\/[^'"]+)?['"]/.test(content)
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
