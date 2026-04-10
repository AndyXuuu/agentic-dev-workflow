# 程序猿AI开发专用

这是一个面向 **OpenCode + oh-my-opencode + OpenAI-only** 的个人开发环境配置快照仓库。

目标：

- 固定 `oh-my-opencode@3.16.0`
- 只使用 OpenAI 模型
- 移除 Pencil
- 接入 Playwright MCP 作为 browser verification
- 提供一套前端替代链：
  - `frontend-builder`
  - `frontend-review`
  - `frontend-polish`

## 仓库内容

- `docs/OPENCODE_OMO_OPENAI_SETUP.md`
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
- Spark 只用于轻量任务，避免主链路不稳
- 前端任务有实现、审查、精修三层分工
- Playwright 用于真实页面验证，而不是只看代码猜 UI
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

详细步骤见：

- `docs/OPENCODE_OMO_OPENAI_SETUP.md`
