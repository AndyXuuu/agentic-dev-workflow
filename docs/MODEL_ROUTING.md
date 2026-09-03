# Agent 模型能力分配

本文是当前 OMP/Codex 本机配置的速查表，用于避免重复检查多个配置文件。本文不替代配置文件；若内容冲突，以实际配置文件和命令输出为准。

- 分析、规划和交付前审查使用 `gpt-5.6-sol:xhigh`。
- 执行、设计和安全审查使用 `gpt-5.6-terra:high`。
- 搜索、总结、测试及轻量后台任务使用 `gpt-5.6-luna:max`；提交信息生成也使用 Luna max。
- Chamoji 下三个 GPT-5.6 模型的 OMP 上下文窗口统一限制为 `272000`，以避免进入更高输入计费区间。
- Codex 主配置独立于 OMP，当前默认模型为 `gpt-5.6-sol`，推理等级为 `medium`。

## OMP 全局角色

配置源：`~/.omp/agent/config.yml` 的 `modelRoles`。

| 角色 | 当前模型选择器 | 用途 |
| --- | --- | --- |
| `default` | `chamoji/gpt-5.6-terra:high` | 普通 OMP 会话默认模型 |
| `task` | `chamoji/gpt-5.6-terra:high` | 通用任务 Agent |
| `designer` | `chamoji/gpt-5.6-terra:high` | UI/UX 设计 Agent |
| `slow` | `chamoji/gpt-5.6-sol:xhigh` | 深度分析与高风险判断 |
| `plan` | `chamoji/gpt-5.6-sol:xhigh` | 架构规划 |
| `review` | `chamoji/gpt-5.6-sol:xhigh` | 交付前代码审查 |
| `security` | `chamoji/gpt-5.6-terra:high` | 安全审查 |
| `smol` | `chamoji/gpt-5.6-luna:max` | 搜索、资料查询、测试和轻量任务 |
| `tiny` | `chamoji/gpt-5.6-luna:max` | 标题、记忆、自动思考分类和异常停止检测等后台任务 |
| `commit` | `chamoji/gpt-5.6-luna:max` | 提交信息与变更摘要生成 |

### Agent 类型映射

配置源：`~/.omp/agent/config.yml` 的 `task.agentModelOverrides`。

| Agent 类型 | 角色 |
| --- | --- |
| `task` | `@task` |
| `scout` | `@smol` |
| `librarian` | `@smol` |
| `sonic` | `@smol` |
| `designer` | `@designer` |
| `reviewer` | `@slow` |
| `security-reviewer` | `@security` |

`task` 工具的模型优先级为：`task.agentModelOverrides` > Agent frontmatter 的 `model` > 父会话模型。角色别名通过 `modelRoles` 展开。

## 上下文窗口限制

配置源：`~/.omp/agent/models.yml` 的 `providers.chamoji.modelOverrides`。

| `chamoji` | `gpt-5.6-luna` | `272000` |
| `chamoji` | `gpt-5.6-terra` | `272000` |
| `chamoji` | `gpt-5.6-sol` | `272000` |

该设置是 OMP 模型注册表使用的本地上下文上限，会让 compaction 更早触发；它不是服务端硬限制，也不影响其他 Provider 的同名模型。

## Codex 与 OMP 的边界

### Codex 主配置

配置源：`~/.codex/config.toml`。

```toml
model = "gpt-5.6-sol"
model_reasoning_effort = "medium"
```

这只控制 Codex 主配置，不会自动修改 OMP 的 `modelRoles`。

### 仓库内 Codex Profiles

配置源：`profiles/*.config.toml`，由安装脚本链接到 `~/.codex/`。

| Profile | 模型 | 推理等级 |
| --- | --- | --- |
| `arch` | `gpt-5.6-sol` | `high` |
| `dev` | `gpt-5.6-terra` | `medium` |
| `test` | `gpt-5.6-luna` | `max` |
| `review` | `gpt-5.6-sol` | `high` |

Profiles 与 OMP 全局角色是两套独立配置；修改一套不会同步改写另一套。

## 快速核对命令

```bash
# OMP 配置目录
omp config path

# OMP 角色与 Agent 映射
omp config get modelRoles --json
omp config get task.agentModelOverrides --json
omp config get defaultThinkingLevel --json

# 核对 Chamoji GPT-5.6 的实际上下文窗口
omp models find gpt-5.6 --json \
  | jq '[.models[] | select(.provider == "chamoji") | {id, contextWindow, maxTokens}]'

# Codex 主配置
sed -n '1,6p' ~/.codex/config.toml
```

## 修改规则

- 修改 OMP 角色时使用完整 `modelRoles` JSON 记录：

  ```bash
  omp config set modelRoles '{"default":"chamoji/gpt-5.6-terra:high", ...}'
  ```

  `omp config set modelRoles.default ...` 不是有效写法；`modelRoles` 是一个整体 record。

- 修改上下文窗口时，在 `~/.omp/agent/models.yml` 的 `chamoji.modelOverrides` 下按模型 ID 设置 `contextWindow`，然后执行 `omp models refresh`。
- 修改后使用上面的核对命令，并重启 OMP/Codex 以确保已运行会话重新加载配置。
- 不要把 API Key、Token 或其他敏感值写入本文件或仓库。
