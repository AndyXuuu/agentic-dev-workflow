---
name: tapd-query
description: 通过 TAPD MCP 只读查询项目空间的需求和 Bug 列表。用于用户要求列出、筛选、统计或汇总指定 TAPD 工作区、迭代、负责人、状态、关键词的需求/工作项与缺陷，或者在不知道 workspace_id 时先查找用户参与的 TAPD 项目。
---

# TAPD Query

仅执行读操作。不要调用创建、更新、删除、评论、状态流转或消息发送工具。

## Workflow

1. 解析用户指定的对象和筛选条件：工作区、迭代、人员、状态、标题关键词、优先级或自定义字段。
2. 确定 `workspace_id`：
   - 用户已给出时直接使用。
   - 只给项目名或未给工作区时，调用 `get_user_participant_projects`，过滤 `category=organization`，按名称匹配。
   - 匹配到多个工作区时，列出 ID 和名称请用户选择；不要猜测。
3. 查询需求：调用 `get_stories_or_tasks`，传入 `workspace_id` 和 `options.entity_type="stories"`。
4. 查询 Bug：调用 `get_bug`，使用与需求相同的工作区和能对应的筛选条件。
5. 使用 `custom_field_*` 前，先调用 `get_entity_custom_fields`获取对应实体的字段配置。
6. 默认每类请求 `limit=50, page=1`。用户要求全部数据时，根据返回的 `count` 继续分页；数量很大时先报告总数并说明分页进度。
7. 不得将某个实体不支持的筛选字段直接复制到另一个实体。无法对应时说明差异。

详细工具参数见 [references/tools.md](references/tools.md)。

## Output

先输出工作区名称/ID、实际筛选条件和查询时间，再分为“需求”和“Bug”两部分。

每条优先展示：

- ID 和可点击 TAPD 链接
- 标题
- 状态
- 负责人/处理人
- 优先级；Bug 额外展示严重程度
- 迭代（返回中存在时）
- 最后更新时间

每部分说明总数、已返回数和剩余数。结果为空时明确说明，不要将权限错误解释为“没有数据”。

## Errors and Safety

- MCP 不可用时，先检查 `tapd` 服务状态，再报告缺失的环境变量或启动错误。
- 401/403 时报告认证或工作区权限问题，不要重试写操作。
- 不输出、记录或要求用户在对话中粘贴 TAPD 令牌。
- 用户请求修改 TAPD 对象时，说明此 Skill 仅支持只读查询，不要自动扩展权限。
