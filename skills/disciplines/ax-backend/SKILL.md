---
name: ax-backend
description: 项目无关的通用后端实现与审查流程。用于非平凡的 API、RPC、服务、领域规则、权限、数据库、事务、缓存、队列、事件、外部集成、迁移或后端 Bug 改动；覆盖契约、数据所有权、一致性、并发、幂等、安全和验证。不用于仅需按 AGENTS.md Fast Path 处理的明确、局部、低风险小改动。
---

# Backend Engineering

把本 Skill 当作“如何实施后端”，把目标项目规则、源契约和源码当作“做成什么样”。不要用通用流程覆盖项目自己的架构与生成边界。

## 0. 先判定执行路径

在读取项目接入资料或质量检查表前，先读取适用的 `AGENTS.md`，检查工作树、目标文件、附近现有 Owner 与最小验证入口。

若满足 Fast Path，停止加载其余内容和引用资料，直接局部修改和最小验证。只在确认触及契约、数据、事务、并发、权限、安全、依赖、生成、外部集成或部署风险时进入标准流程。其余未知只有在不影响行为或风险、无害、可逆且有检查点时才可作为临时工作假说继续；material assumption 必须先证实、转为用户明确决策，或退出并清理依赖。

本 Skill 的契约、数据、并发、安全和验证清单均按本次改动的实际影响选择，不得自动扩展为全量审计。

安全相关工作先执行 `AGENTS.md` 的 Security Goal and Complexity Budget，由它确定本次威胁
模型、保证等级和 material 增量；本 Skill 的安全清单不得扩大该范围。

## 与主流程的边界

- `ax-pipeline`/`ax-dev` 是生命周期 Owner；本 Skill 只补充契约、数据、事务、并发、外部调用、安全和运行边界，不重复需求、设计、业务验收或交付门禁。
- 已有明确需求和设计时可直接补充上述后端决策。跨端契约同时使用 `ax-frontend`，并以源契约 Owner 为准。
- 纯前端视觉任务不使用本 Skill。

## 1. 接入目标项目

若目标仓库存在适用的 `AGENTS.md`，先完整读取；不存在则记录为治理缺口。随后读取相关架构/模块文档和 [references/backend-project-adoption.md](references/backend-project-adoption.md)，定位：

- HTTP/RPC/event/schema 源契约与生成命令
- API、domain/service、persistence、queue、cache 和外部集成 Owner
- 权限、身份、计费、错误、日志、指标和追踪 Owner
- 事务边界、数据所有权、迁移目录和回滚方式
- 业务验收入口、运行时 smoke/contract 边界和项目既有验证命令
- Lint、静态分析、构建与部署前验证命令

若文档、源契约、生成物和源码冲突，先指出冲突并确认 authoritative source。不要手工修补生成文件绕过冲突。


## 2. 设计最小后端改动

- 从源契约开始：OpenAPI/GraphQL/protobuf/event schema/DDL 是源时，先改源再生成。
- 入口层负责协议、身份、输入校验和响应映射；业务规则留在 domain/service；持久化由 repository/model Owner 管理。
- 每份数据只有一个写 Owner；跨模块访问使用现有接口，事务只覆盖同一一致性边界。
- 写操作定义重复提交、并发、幂等键、事务隔离、锁、部分失败、补偿和恢复。
- 外部调用使用项目 timeout；重试有界、退避、可观测，并只对安全/幂等操作执行。
- 异步任务定义投递与消费语义、去重、顺序、重试、死信和可重放行为。
- Schema 变化提供向前/向后兼容、迁移顺序、回填、验证和回滚/缓解方案。
- 只实现已确认的最小方案；兼容层、新依赖和跨 Owner 重构需要用户批准。

### 后端规模解释

- 继承全局代码规模审核口径；适用于类、Go 文件、函数式模块及其他非 OOP 实现，行数只触发审核。
- 默认审核手写 handler/controller、use case/service、domain 或 repository/adapter 实现超过 300 行的职责边界；路由和依赖装配超过 400 行时检查是否仍为单纯声明。项目规则可按语言和架构收紧或覆盖。
- 超阈值时检查协议映射、业务规则、事务、持久化、权限和外部 I/O 是否混合，以及修改一个用例需要加载多少无关上下文；只按真实 Owner、事务、业务验收或恢复边界拆分。
- 生成契约、迁移、Schema 和静态映射先分类再判断。历史巨型文件采用业务验收证据、禁止无关增长和逐边界提取，不用机械分层或无意义单实现接口换取行数下降。

仅当本次改动触及相应契约、数据、并发、安全或运行边界时，按需读取 [references/backend-quality-checklist.md](references/backend-quality-checklist.md)。

## 3. 维护跨端契约

- 明确源契约、生成投影、客户端副本和生成代码的单向链路。
- 后端契约变化先更新源定义与后端验证，再生成 Swagger/schema/client 等派生物。
- 前端或其他消费者不得成为后端契约 Owner，也不得手工修补派生类型。
- 兼容性按项目版本策略验证字段新增/删除、枚举、默认值、nullability、错误码和分页语义。
- 契约变化同步消费者的业务验收证据和 canonical document；未授权的消费者行为变化先确认。

## 4. 验证后端风险

Bug 修复先保留修复前失败证据，再实现最小修复并重复同一条业务验收证据。不要因为实现
了一个内部函数、校验器或适配器就创建实现级验证任务。

Feature 从下列类别中只选择被改动实际影响的业务场景，不按清单机械补齐：

- Happy path、Invalid input、Edge case
- Authentication、authorization 和 tenant/state boundary
- Duplicate/concurrent request、transaction rollback 和 partial failure
- Timeout、retry、dependency failure 和 recovery
- Contract、migration 和 nearby regression risk

本地先运行能证明业务结果和邻近风险的最小 smoke、contract、静态检查或类型检查。跨服务/
模块 Owner、公开契约、迁移、事务或高风险改动再升级到对应项目门禁；项目全量门禁若由 CI/
发布持有，按其 Owner 执行，不机械重复到每次本地实现循环。只报告真实结果；远程环境、生产
数据或付费调用需要额外授权。

运行聚合命令前检查包含关系；同一交付输入上若完整门禁已包含目标检查，不再单独重复执行。


## 5. 返回主流程

只把后端 Owner、契约/数据/事务决策、实际业务验收证据和剩余风险返回 primary workflow；不
生成第二份需求、设计、业务验收或交付报告。行为、契约、Schema、权限或部署变化时更新项目
既有 canonical document，不创建重复说明。
