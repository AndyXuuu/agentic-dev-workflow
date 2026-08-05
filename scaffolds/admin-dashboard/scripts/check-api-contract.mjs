import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const contractPath = join(projectRoot, 'contracts', 'admin-api.openapi.json')
const failures = []
let contract

try {
  contract = JSON.parse(readFileSync(contractPath, 'utf8'))
} catch (error) {
  console.error(`contracts/admin-api.openapi.json: 无法读取有效 JSON（${error.message}）`)
  process.exit(1)
}

function requireValue(condition, message) {
  if (!condition) failures.push(`contracts/admin-api.openapi.json: ${message}`)
}

requireValue(/^3\.1\./.test(contract.openapi ?? ''), '必须使用 OpenAPI 3.1')
requireValue(contract.jsonSchemaDialect?.includes('2020-12'), '必须声明 JSON Schema 2020-12 dialect')

const requiredOperations = {
  'DELETE /v1/auth/session': 'deleteSession',
  'GET /v1/auth/session': 'getSession',
  'POST /v1/auth/session': 'createSession',
  'POST /v1/auth/session/refresh': 'refreshSession',
}
const operationIds = []
for (const [label, expectedOperationId] of Object.entries(requiredOperations)) {
  const [method, path] = label.split(' ')
  const operation = contract.paths?.[path]?.[method.toLowerCase()]
  requireValue(operation, `缺少 ${label}`)
  requireValue(operation?.operationId === expectedOperationId, `${label} 必须使用 operationId ${expectedOperationId}`)
  requireValue(operation?.responses?.default?.$ref === '#/components/responses/UnexpectedFailure', `${label} 必须声明统一意外失败响应`)
}
for (const path of Object.values(contract.paths ?? {})) {
  for (const method of ['delete', 'get', 'patch', 'post', 'put']) {
    const operationId = path?.[method]?.operationId
    if (operationId) operationIds.push(operationId)
  }
}
requireValue(new Set(operationIds).size === operationIds.length, 'operationId 必须唯一')

for (const schema of ['Actor', 'Permission', 'Session', 'SessionCredentials', 'ProblemDetails', 'ValidationProblem']) {
  requireValue(contract.components?.schemas?.[schema], `缺少 ${schema} schema`)
}
const problem = contract.components?.schemas?.ProblemDetails
for (const property of ['type', 'title', 'status', 'requestId']) {
  requireValue(problem?.required?.includes(property), `ProblemDetails 必须要求 ${property}`)
}
requireValue(problem?.description?.includes('RFC 9457'), 'ProblemDetails 必须声明 RFC 9457 语义')

const cookieScheme = contract.components?.securitySchemes?.cookieSession
requireValue(cookieScheme?.type === 'apiKey' && cookieScheme?.in === 'cookie', 'Session 安全方案必须使用 Cookie')
requireValue(cookieScheme?.name === '__Host-admin_session', 'Session Cookie 必须使用 __Host- 前缀')
const cookieDescription = contract.components?.headers?.SessionCookie?.description ?? ''
for (const attribute of ['Secure', 'HttpOnly', 'SameSite=Lax', 'Path=/', 'Domain must be omitted']) {
  requireValue(cookieDescription.includes(attribute), `Session Cookie 必须声明 ${attribute}`)
}

const csrf = contract.components?.parameters?.CsrfToken
requireValue(csrf?.name === 'X-CSRF-Token' && csrf?.in === 'header' && csrf?.required === true, '写请求必须声明必需的 X-CSRF-Token Header')
requireValue(contract.info?.description?.includes('trusted-Origin'), '契约必须声明写请求 Origin 校验')
requireValue(contract.components?.headers?.RequestId, '必须声明 X-Request-ID 响应头')
requireValue(contract.components?.parameters?.IdempotencyKey, '必须提供可复用 Idempotency-Key 参数')
requireValue(contract.components?.responses?.UnexpectedFailure, '必须声明统一的意外失败 Problem Details')

for (const [method, path] of [['delete', '/v1/auth/session'], ['post', '/v1/auth/session/refresh']]) {
  const references = contract.paths?.[path]?.[method]?.parameters ?? []
  requireValue(references.some((parameter) => parameter.$ref === '#/components/parameters/CsrfToken'), `${method.toUpperCase()} ${path} 必须引用 CSRF 参数`)
}

const serialized = JSON.stringify(contract)
requireValue(!/accessToken|refreshToken/i.test(serialized), '浏览器契约不得暴露 Access Token 或 Refresh Token 字段')

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('API contract passed')
}
