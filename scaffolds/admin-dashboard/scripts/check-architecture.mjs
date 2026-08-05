import { readFileSync, readdirSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const sourceRoot = join(projectRoot, 'src')
const failures = []

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return ['.ts', '.tsx'].includes(extname(entry.name)) ? [path] : []
  })
}

for (const file of sourceFiles(sourceRoot)) {
  const name = relative(projectRoot, file)
  const content = readFileSync(file, 'utf8')
  const isTest = name.startsWith('src/test/') || /\.test\.tsx?$/.test(name)
  const isAuthOwner = name.startsWith('src/auth/')
  const isUiOwner = name.startsWith('src/components/ui/')
  const isHttpOwner = name === 'src/api/httpClient.ts'
  const isWebStorageOwner = ['src/features/settings/settings.repository.ts', 'src/hooks/useTheme.ts'].includes(name)

  if (!isUiOwner && /from\s+['"][^'"]*components\/ui\//.test(content)) {
    failures.push(`${name}: 共享 UI 必须从 components/ui 公共入口导入`)
  }
  if (!isUiOwner && /from\s+['"][^'"]*\/ui\//.test(content)) {
    failures.push(`${name}: 共享 UI 必须从 ui 公共入口导入`)
  }
  if (!isAuthOwner && /from\s+['"][^'"]*\/auth\//.test(content)) {
    failures.push(`${name}: 认证能力必须从 src/auth 公共入口导入`)
  }
  if (!isTest && !isHttpOwner && /\bfetch\s*\(/.test(content)) {
    failures.push(`${name}: 网络请求必须通过 src/api/httpClient.ts 的可注入边界`)
  }
  if (!isTest && !isWebStorageOwner && /\b(?:localStorage|sessionStorage)\b/.test(content)) {
    failures.push(`${name}: Web Storage 只能由已登记的非敏感偏好 Owner 使用`)
  }
}

const routes = readFileSync(join(sourceRoot, 'app', 'routes.tsx'), 'utf8')
const routePaths = [...routes.matchAll(/\bpath:\s*['"]([^'"]+)['"]/g)].map((match) => match[1])
const routeAccessRequirements = [...routes.matchAll(/\baccess:\s*\{\s*authentication:/g)]
if (routePaths.length === 0) failures.push('src/app/routes.tsx: 应用路由注册表为空')
if (routeAccessRequirements.length !== routePaths.length) {
  failures.push('src/app/routes.tsx: 每个页面路由必须声明唯一 access 要求')
}
for (const path of new Set(routePaths)) {
  if (routePaths.filter((candidate) => candidate === path).length > 1) {
    failures.push(`src/app/routes.tsx: 路由路径重复注册 ${path}`)
  }
}

for (const consumer of ['src/layouts/Sidebar.tsx', 'src/layouts/CommandSearch.tsx']) {
  const content = readFileSync(join(projectRoot, consumer), 'utf8')
  if (!content.includes('getAccessibleAppRoutes')) failures.push(`${consumer}: 必须消费统一过滤后的应用路由注册表`)
  if (/\b(?:navigation|destinations)\s*=\s*\[/.test(content)) {
    failures.push(`${consumer}: 不得维护平行路由元数据`)
  }
}

const app = readFileSync(join(sourceRoot, 'app', 'App.tsx'), 'utf8')
if (!app.includes('SessionProvider')) failures.push('src/app/App.tsx: 必须接入唯一 Session Provider')
if (!app.includes('RouteAccessBoundary')) failures.push('src/app/App.tsx: 当前页面必须经过路由访问边界')

const authIndex = readFileSync(join(sourceRoot, 'auth', 'index.ts'), 'utf8')
for (const publicAuthCapability of ['PermissionGate', 'RouteAccessBoundary', 'SessionProvider', 'HttpSessionGateway']) {
  if (!authIndex.includes(publicAuthCapability)) failures.push(`src/auth/index.ts: 缺少公开认证能力 ${publicAuthCapability}`)
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('Architecture contract passed')
}
