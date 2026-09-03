# 后端项目接入

迁入新项目后先完成本页盘点，不假设语言、框架、目录或部署方式。

## 权威来源

| 主题 | 要找的来源 | 需要确认 |
| --- | --- | --- |
| 工程规则 | `AGENTS.md`、贡献指南、CI | 门禁、禁止事项、验证和交付格式 |
| 行为 | PRD、业务 Test Flow、domain specs | 当前行为与计划是否区分 |
| 契约 | OpenAPI、GraphQL、protobuf、event schema | 源文件、生成物和兼容策略 |
| 数据 | DDL、migration、schema registry | 写 Owner、事务、回填与回滚 |
| 架构 | 模块文档、dependency rules | API/domain/persistence/integration 边界 |
| 运行 | config、deploy、runbook、SLO | 环境、超时、可观测与恢复 |

若同一主题有多份说明，找出 canonical owner 并报告冲突；不要新增第三份说明绕开冲突。

## Owner 与依赖

使用 `rg --files`、`rg` 和实际调用关系定位：

- routes/handlers/controllers/resolvers
- application/domain/services/use cases
- repository/model/query/migration
- RPC/event producers and consumers
- cache、queue、scheduler、outbox、worker
- authn/authz、tenant、billing、validation、errors
- third-party clients and adapters
- config、secrets、logging、metrics、tracing
- 业务 Test Flow、contract、migration、smoke 与项目既有验证入口

不要按常见目录名猜测 Owner。记录允许的依赖方向、跨模块调用方式和禁止访问边界。

## 契约链路

为每种公开或跨模块契约记录：

1. 源定义
2. 生成/发布命令
3. 后端投影或 server stub
4. 消费者副本/client
5. 兼容性与业务验收证据

若消费者仓库只保存副本，明确它不是源契约 Owner。

## 数据与运行边界

- 确认每张表/集合/流的写 Owner。
- 确认事务、锁、隔离级别、幂等与重复消费策略。
- 确认缓存真相源、失效、穿透和降级行为。
- 确认外部调用 timeout、retry、rate limit、circuit breaker 和审计要求。
- 确认部署顺序、迁移窗口、回滚限制和生产操作审批。

## 验证命令

从项目脚本、构建配置、CI 和文档分别确认：本地最小业务验收与 scoped 静态检查；跨 Owner/模块/契约/迁移的整体门禁及触发条件；CI/发布持有的覆盖率、审计、E2E、构建、打包、部署和环境验证。不要把三层命令合并成每次本地改动都执行的固定清单；缺失时记录为缺口，不自行发明替代命令。
