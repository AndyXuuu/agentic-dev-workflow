# 程序猿 AI 开发专用

这是一个面向 **OpenCode + oh-my-opencode + OpenAI-only** 的个人 AI 开发环境与方法仓库。

## 用途

这个仓库主要用于沉淀三类内容：

- OpenCode / oMo 的本地配置基线
- 面向 AI 搜索任务的仓库导航层
- 与任务交接、插件扩展相关的方法与实现草案

## 模块说明

### `config/`

OpenCode 与 oMo 的本地配置快照。

- [查看模块 README](config/README.md)

### `.repo-nav/`

项目本地的 AI-first 仓库导航产物，用于让 AI 在搜索任务里更快、更准、更稳地找到入口。

- 主要入口：
  - `.repo-nav/index.generated.yaml`
  - `.repo-nav/docs.generated.yaml`
  - `.repo-nav/modules.generated.yaml`
  - `.repo-nav/workflows.generated.yaml`

### `repo-nav-tooling/`

`repo-nav` 的工具模块，负责 schema、模板和增量更新命令。

- [查看模块 README](repo-nav-tooling/README.md)
- [查看 schema](repo-nav-tooling/REPO_NAV_SCHEMA.md)

### `task-handoff-guard/`

旧任务恢复冲突与任务交接防护的设计、MVP 骨架、demo 与插件脚手架。

- [查看模块 README](task-handoff-guard/README.md)

### `omo-scaffold/`

新增 plugin / agent / skill / command 时的固定接入入口。

- [查看模块 README](omo-scaffold/README.md)

## 推荐阅读顺序

1. [repo-nav-tooling/README.md](repo-nav-tooling/README.md)
2. [task-handoff-guard/README.md](task-handoff-guard/README.md)
3. [omo-scaffold/README.md](omo-scaffold/README.md)
