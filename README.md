# 程序猿AI开发专用

这是一个面向 **OpenCode + oh-my-opencode + OpenAI-only** 的个人开发环境配置快照仓库。

目标：

- 固定 `oh-my-opencode@3.16.0`
- 只使用 OpenAI 模型
- 移除 Pencil
- 启用 Marksman Markdown LSP
- 启用 YAML LSP
- 接入 Playwright MCP 作为 browser verification
- 提供一套前端替代链：
  - `frontend-builder`
  - `frontend-review`
  - `frontend-polish`

## 仓库内容

- `knowledge/`
  - 独立的知识索引模块
- `knowledge/index.yaml`
  - 知识入口，总导航层
- `knowledge/docs.yaml`
  - 文档索引
- `knowledge/modules.yaml`
  - 模块索引
- `knowledge/workflows.yaml`
  - 工作流索引
- `knowledge/KNOWLEDGE_SCHEMA.md`
  - 通用 knowledge-first schema 规范
- `knowledge/templates/`
  - 可复用模板（index/docs/modules/workflows/AGENTS）
- `knowledge/opencode-omo-openai-setup.md`
  - 完整安装与复现文档
- `config/opencode.json`
  - OpenCode 全局配置
- `config/oh-my-openagent.json`
  - oMo / oh-my-openagent 模型编排
- `config/agents/frontend-builder.md`
- `config/agents/frontend-review.md`
- `config/agents/frontend-polish.md`

## 特点

- OpenAI-only 模型路由
- 增加 Marksman，提升 Markdown/MDX 编辑体验
- 增加 YAML LSP，提升配置文件编辑体验
- Spark 只用于轻量任务，避免主链路不稳
- 前端任务有实现、审查、精修三层分工
- Playwright 用于真实页面验证，而不是只看代码猜 UI
- 知识文档集中在 `knowledge/` 模块内，便于 agent 先导航再搜索
- 不包含 API Key、OAuth token、auth.json 等敏感文件

## 适合谁

- 想把 OpenCode + oMo 调成更稳的程序员
- 想保留多 agent 工作流，但尽量减少“玄学配置”的人
- 不想依赖 Pencil，又想提高前端实现质量的人

## 注意

这个仓库是 **脱敏后的配置快照**，不是完整用户目录备份。

你仍然需要在新机器上：

- 安装 OpenCode
- 登录 OpenAI
- 确保 `gh` / `npx` / Node.js 可用
- 安装 `marksman`

详细步骤见：

- `knowledge/opencode-omo-openai-setup.md`

## 如何使用 knowledge schema

如果你要在一个新项目里接入这套 knowledge-first 方案，建议顺序如下：

1. 复制 `knowledge/templates/` 下的模板到目标项目的 `knowledge/` 目录
2. 先填最小信息：
   - `index.yaml`
   - `docs.yaml`
   - `modules.yaml`
   - `workflows.yaml`
3. 在项目根目录加入 `AGENTS.md`，可直接参考：
   - `knowledge/templates/AGENTS.md.template`
4. 让 AI 先读 `knowledge/index.yaml`，再按需扩展到 `read / grep / glob / LSP`
5. 如果证据不足：
   - 显式列 `unknowns`
   - 显式列 `missing_evidence`
   - 不要猜

核心原则：

- `knowledge/` 是导航层，不是代码真相
- 代码现状永远优先于索引描述
- 先做最小可用索引，不要一开始做成重系统
