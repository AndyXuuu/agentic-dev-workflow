---
name: git-workflow
description: 安全执行本地 Git 提交与远程同步。用于用户要求 git commit、本地提交、保存进度、git sync、fetch、pull、push、merge、rebase、发布当前分支或检查本地与远程是否同步时；覆盖变更范围确认、敏感信息检查、验证证据、提交消息、分叉判断、非破坏性集成、冲突停机和发布范围复查。
---

# Git Workflow

## 核心边界

1. 先读取适用的 `AGENTS.md` 和仓库 Git 文档；项目规则决定允许的分支、合并方向、提交格式和验证命令。
2. 把现有工作树改动视为用户资产。不要覆盖、丢弃、隐藏或顺带提交不属于当前任务的改动。
3. 把提交与同步视为不同授权：请求本地提交不代表允许 push；请求同步不代表允许自动提交脏工作树。
4. 未经明确批准，不创建分支，不改写共享历史，不 force-push，不删除分支或工作树内容。
5. 只报告实际运行的检查和验证，不把计划执行或推测结果写进提交消息。

## 开始检查

在提交或同步前执行：

```bash
git status --porcelain=v1 -b
git branch --show-current
git rev-parse --show-toplevel
git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}'
```

如果没有 upstream，记录该状态。只有当前分支与远程目标映射明确时才设置 upstream；否则先询问用户。

检查是否存在 merge、rebase、cherry-pick 或 revert 中间状态。除非用户正在继续该操作，否则不要创建普通提交或开始新的同步流程。

## 本地提交

### 1. 确认提交范围

检查实际改动：

```bash
git diff --stat
git diff
git diff --cached --stat
git diff --cached
git status --short
```

- 根据 diff 确认提交范围，不只依赖用户给出的简短标题。
- 区分当前任务、用户已有改动和生成文件。
- 如果不同改动可以安全拆分，只提交目标范围；如果无法安全分离，停止并说明。
- 不使用 `git add .` 或 `git add -A`，除非已确认所有变化都属于同一提交。

### 2. 验证和敏感信息检查

- 运行适用于改动范围的最小有效验证。
- 检查配置、环境文件、URL、Token、密码、私钥、证书、数据库连接串和个人绝对路径。
- 对疑似敏感信息只报告位置和类型，不回显完整值。
- 发现真实凭据或无法判断的高风险内容时停止，不要暂存或提交。

### 3. 暂存并复核

使用明确路径暂存：

```bash
git add -- <path>...
git diff --cached --check
git diff --cached --stat
git diff --cached
```

确认暂存区只包含目标改动，并且没有意外删除、生成产物或敏感数据。

### 4. 编写提交消息

先匹配仓库现有语言和格式；仓库未规定时使用清晰、具体的主题，并为非平凡改动添加正文：

```text
背景：
说明为什么需要修改。

本次改动：
- 说明关键行为、边界或清理内容

影响与验证：
- 说明实际影响
- 列出实际执行的验证
```

小改动也至少用一段简短正文说明意图和效果。不要声称未执行的测试、兼容性或发布结果。

使用非交互命令提交：

```bash
git commit -m "<subject>" -m "<body>"
```

提交后报告 commit SHA、主题、包含范围和实际验证结果。

## 远程同步

### 1. 保留现场

同步前检查工作树、暂存区和未跟踪文件。存在可能被集成操作影响的脏改动时停止，让用户选择先提交、仅暂存已跟踪文件，或取消同步。不要自动运行 `stash -u`。

### 2. 获取并判断分叉

```bash
git fetch --prune
git status -sb
git rev-list --left-right --count HEAD...'@{upstream}'
git log --oneline --left-right --graph HEAD...'@{upstream}'
```

按状态处理：

| 本地/远程状态 | 默认动作 |
| --- | --- |
| 完全一致 | 不创建提交，不执行无意义合并；报告已同步 |
| 本地仅落后 | `git merge --ff-only '@{upstream}'` |
| 本地仅领先 | 复查待发布提交和 diff，再 `git push` |
| 双方分叉 | 遵循项目策略；没有项目规则且用户只要求通用同步时使用 merge |

分叉时先展示双方提交。只有用户明确要求线性历史或项目规则指定时才 rebase；不要自行用 rebase、cherry-pick 或 reset 制造对齐状态。

### 3. 复查发布范围

Push 前执行：

```bash
git log --oneline '@{upstream}'..HEAD
git diff --stat '@{upstream}'...HEAD
```

确认当前分支、upstream 和待发布提交符合用户意图，再推送当前分支。Push 被拒绝说明远程已变化；重新 fetch 并回到分叉判断，不要立即 force-push。

## 冲突和破坏性操作

出现冲突时立即停止，并用 `git status --porcelain=v1` 报告冲突文件。保留冲突现场，不自动选择 ours/theirs，不删除文件，不猜测解决方向。

不要为完成普通提交或同步自动执行以下操作：

- `git reset --hard`
- `git clean`
- `git checkout -- <path>` 或 `git restore <path>`
- `git stash -u`
- `git push --force`

只有用户明确要求改写指定分支历史时才考虑 force-push。执行前确认精确远程和分支、获取远程当前 SHA、说明协作影响并优先使用绑定预期 SHA 的 `--force-with-lease`。

## 完成报告

报告：

- 当前分支和 HEAD SHA
- 创建的提交及其范围，或同步采用的策略
- 本地与远程的 ahead/behind 状态
- 实际运行的验证
- 是否 push、是否发生冲突
- 剩余风险和需要用户处理的协作事项
