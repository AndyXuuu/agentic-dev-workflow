# 项目适配发现清单

## 仓库与运行方式

- 仓库是单体、前后端分离、Monorepo、移动端还是多服务集合。
- 将适配模式标记为 frontend、backend、fullstack/monorepo 或 multi-repo。
- 契约或运行时是否依赖父目录、兄弟仓库、子模块或外部服务。
- 语言、框架、运行时、包管理器和 workspace 边界。
- 本地最小业务验收、整体/集成门禁、构建、预览、部署和 CI/发布门禁的真实命令、Owner 与触发条件。
- 应用是否允许 Docker 构建或只允许原生命令。

## 权威来源

| 主题 | 需要定位 |
| --- | --- |
| 工程规则 | 根目录和子目录 `AGENTS.md`、贡献指南 |
| 产品行为 | PRD、页面/路由文档、业务 Test Flow |
| 架构 | 架构文档、模块说明、依赖约束 |
| API 契约 | OpenAPI、GraphQL schema、protobuf、生成客户端 |
| UI 标准 | Design page、Storybook、Token、主题、组件库 |
| 交付 | CI、部署脚本、发布与回滚文档 |

同一主题存在多个来源时，确认 canonical owner；不要把冲突内容写入新适配层。

对跨端契约分别标出源定义、生成投影、消费者副本和生成代码，禁止把消费者副本误写为 source of truth。

## Owner 与边界

- 路由、页面、Controller 或 handler
- 业务/domain/service
- persistence/repository/migration
- API client、adapter、middleware
- UI primitives、feature components、layout
- server/global/local/URL state
- validation、permission、billing、analytics、error handling
- assets、fonts、i18n、logging、configuration
- 业务验收资料、运行时 setup

以 import、调用和配置关系为证据，不按常见目录名猜测。

## 受保护区域

- 自动生成文件和对应生成命令
- vendor、build output、cache 和外部同步目录
- 密钥、证书、生产配置和个人数据
- 共享组件、公共契约和多项目共享资源的影响范围
- 绕过统一 Owner 的已验证例外及其当前持有者

## 适配层质量门槛

- 每条规则都是项目特有事实或必要导航。
- 没有复制全局门禁、通用验收理论或框架教程。
- 已有 `AGENTS.md` 只做缺口级增量合并；保留原章节、语言、格式、项目规则和未提交改动，不用模板整文件替换。
- 项目 `AGENTS.md` 在没有个人全局规则和 `ax-*` Skill 时，仍提供需求范围、Owner/复用、行为验证和交付报告的最小闭环。
- `SKILL.md` 保持短小，详细地图按需加载。
- 删除所有未填写占位符和不适用章节。
- 缺失 canonical owner、业务验收、CI 或部署资料时记录为缺口，不生成替代规则。
- 在项目架构、命令或 canonical owner 变化时同步更新。
- 隔离检查不读取个人全局工程目录；项目适配 Skill 的所有必需链接都落在仓库内。
