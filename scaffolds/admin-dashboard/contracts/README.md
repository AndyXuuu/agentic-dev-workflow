# API Contract Ownership

`admin-api.openapi.json` 是浏览器与同源 BFF 之间的唯一 API 源契约。它采用 OpenAPI 3.1 和 JSON Schema 2020-12，当前只定义已确认的 Session 边界；不得把手写 TypeScript DTO、Go/Java 结构体或实现代码反向当作契约来源。

## 派生与实现

1. 先评审并更新本契约，再修改消费者或 Provider。
2. 前端生成 Client、后端生成接口/模型以及 API 文档都是可重建的 projection；生成方式接入具体项目时由该项目拥有。
3. Provider 必须通过契约测试证明状态码、响应头、Cookie、错误格式和字段约束兼容；Consumer 必须只依赖契约公开字段。
4. 向后兼容的新增字段必须保持消费者可忽略；删除、重命名、收紧约束或改变状态语义属于破坏性变更，需要版本迁移方案。

## 安全边界

- 浏览器只持有同源 `Secure; HttpOnly; SameSite=Lax; Path=/` Session Cookie，不得读取或持久化 Access Token、Refresh Token。
- 所有状态写请求必须验证可信 `Origin`；已有身份的写请求还必须验证 Session 绑定的 `X-CSRF-Token`。Session 建立请求没有既有 Session Token，应由 Provider 执行登录 CSRF 防护、限流和不可枚举的公共错误；前端隐藏操作不替代 Provider 授权。
- Session 更新必须旋转服务端标识，退出必须幂等。公共错误遵循 RFC 9457，不得泄露凭据、密钥、堆栈或内部实现。
- 密码策略、OAuth/OIDC、数据库、真实角色权限、审计与部署拓扑由接入项目决定，不在本脚手架中虚构实现。
