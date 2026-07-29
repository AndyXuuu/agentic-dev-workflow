# TAPD MCP Query Tools

当前核对版本：`mcp-server-tapd 8.0.79`。工作区在 TAPD API 中即项目空间，主键为 `workspace_id`。

## Project discovery

`get_user_participant_projects(nick="")`

- 获取用户参与的项目。
- 无参调用时服务器会尝试使用当前令牌用户或 `CURRENT_USER_NICK`。
- 返回结果中过滤 `category=organization`。

## Stories

`get_stories_or_tasks(workspace_id, options)`

必备基础参数：

```json
{
  "entity_type": "stories",
  "limit": 50,
  "page": 1
}
```

常用可选字段：

- `id`: 单个或逗号分隔的多个 ID
- `name`: 标题模糊匹配，例如 `%支付%`
- `v_status` / `status`: 状态
- `owner`, `developer`, `creator`, `cc`: 人员
- `iteration_id`, `iteration_name`: 迭代
- `category_id`, `category_name`: 需求分类
- `priority_label`: 优先级标签
- `workitem_type_id`, `workitem_type_name`: 需求类别
- `parent_id`, `ancestor_id`, `children_id`: 层级关系
- `fields`: 返回字段；需求详情必须包含 `description`
- `custom_field_*`: 先调用 `get_entity_custom_fields`

返回包含 `url_template`、`data` 和 `count`。

## Bugs

`get_bug(workspace_id, options)`

常用可选字段：

- `id`: Bug ID
- `title`: 标题
- `status`: 状态
- `priority_label`: 优先级
- `severity`: `fatal`, `serious`, `normal`, `prompt`, `advice`
- `fields`: 返回字段
- `limit`, `page`: 分页
- `custom_field_*`: 先调用 `get_entity_custom_fields(workspace_id, {"entity_type":"bugs"})`

返回包含 `base_url`、`data` 和 `count`。Bug 链接格式：

```text
{base_url}/{workspace_id}/bugtrace/bugs/view/{id}
```

## Counts and custom fields

- `get_story_or_task_count(workspace_id, options)`
- `get_bug_count(workspace_id, options)`
- `get_entity_custom_fields(workspace_id, options)`

列表工具已同时返回数量时，不必重复调用 count 工具。

## Filter mapping

| User intent | Stories option | Bugs option |
|---|---|---|
| 标题关键词 | `name: "%...%"` | `title` |
| 状态 | `v_status` 或 `status` | `status` |
| 优先级 | `priority_label` | `priority_label` |
| 迭代 | `iteration_id` / `iteration_name` | 仅在服务器返回并支持对应字段时使用 |
| 负责人 | `owner` | 根据 Bug 字段配置确认，不要猜测 |

不要将 Stories 的特有字段无条件传给 Bugs。
