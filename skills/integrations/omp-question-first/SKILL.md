---
name: omp-question-first
description: 为支持 conversation.questionFirst 的 OMP 安装可逆启动适配器，使提问、质疑和分析轮暂停写工具、自动 Todo 与后台继续；用于检查兼容性、安装或卸载 omp-question-first 启动器，以及以独立配置覆盖启动 OMP。
---

# OMP Question-First Adapter

只适配 OMP runtime；不得把 OMP 专属暂停语义复制到通用 `AGENTS.md`、生命周期 Skill 或受控项目规则。

## Runtime contract

兼容的 OMP 必须提供 `conversation.questionFirst` 设置，并在启用时满足：

- 当前用户消息被判定为提问、质疑、纠错或分析请求后，进入 `paused_for_user` 语义；
- 当前轮只允许 OMP 明确标记为只读且在暂停 allowlist 内的调查工具，以及 `todo view`；
- 禁止文件写入、命令/eval、委派、Todo 变更及其他有副作用工具；
- 禁止 Todo reminder、mid-run Todo nudge、eager Todo/Task、`session_stop` 和无用户消息的自动继续；
- 后续明确执行请求或 `.` / `c` 继续快捷键恢复执行；
- 设置默认关闭，未接入用户保持原行为。

不要用提示词或扩展模拟缺失的 core 能力。适配器必须通过设置能力探测；不支持时失败并要求升级/构建兼容 OMP。

## Commands

入口：

```sh
skills/integrations/omp-question-first/scripts/omp-question-first <command>
```

- `source-status --source DIR`：检查 OMP `18.0.11` 源码树处于 `not-applied`、`applied` 或 `drifted`。
- `source-apply --source DIR`：仅在补丁可干净应用时安装 Skill 内的版本锁定 core 补丁。
- `source-revert --source DIR`：仅在反向补丁可干净应用时回滚 core 补丁。
- `status [--json] [--bin-dir DIR]`：检查 OMP 版本、设置能力和指定目录的启动器安装状态。
- `run [OMP_ARGS...]`：使用 Skill 内的只读配置覆盖启动兼容 OMP，不修改用户全局配置。
- `install [--bin-dir DIR]`：把 `omp-question-first` 绝对符号链接安装到 `DIR`；默认 `~/.local/bin`。
- `uninstall [--bin-dir DIR]`：只删除由本 Skill 创建且仍指向本入口的链接；其他文件拒绝删除。

可用 `OMP_QUESTION_FIRST_OMP=/absolute/path/to/omp` 指定 OMP 可执行文件。值必须是单个可执行路径，不接受带参数的 shell 命令。

## Safe sequence

1. 对 OMP `18.0.11` 源码运行 `source-status`；若为 `not-applied`，运行 `source-apply`。`drifted` 必须停止并人工迁移，不做模糊补丁。
2. 构建/安装该 OMP 后运行 `status`。若 runtime capability 不存在，停止；不要写全局 Agent 规则作为 fallback。
3. 运行 `install`，或直接用 `run`。
4. 用真实 OMP 会话验证：提问轮尝试写工具应被拒绝，回答后不自动推进 Todo。
5. 输入 `继续执行` 或使用 `.` / `c`，确认同一会话恢复写工具。
6. 不再需要时运行 `uninstall`；需要撤回源码改动时运行 `source-revert`。配置覆盖随启动器退出自然失效。
