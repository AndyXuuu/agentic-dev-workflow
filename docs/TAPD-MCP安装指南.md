# TAPD MCP 安装指南

本文说明如何把腾讯云社区提供的 `mcp-server-tapd` 接入 Codex、Claude Desktop、Cursor 等支持 MCP 的客户端。

> 核对日期：2026-08-25。当前固定使用 Python 3.13 和 `mcp-server-tapd 8.0.81`；升级前应通过 [TAPD MCP 官方 README](https://github.com/TencentCloudCommunity/mcp-server/tree/main/src/mcp-server-tapd) 核对参数并完成启动验证。

---

## 1. 推荐方案

个人开发环境推荐使用本地 stdio 模式：MCP 客户端通过 `uvx` 自动下载并启动 `mcp-server-tapd`，无需克隆源码或常驻运行服务。

```text
MCP 客户端 -> uvx mcp-server-tapd -> TAPD API
```

认证方式二选一：

| 方式 | 配置项 | 建议 |
|------|--------|------|
| 个人访问令牌 | `TAPD_ACCESS_TOKEN` | 推荐，配置简单，使用个人身份访问 |
| API 账号和密钥 | `TAPD_API_USER`、`TAPD_API_PASSWORD` | 兼容方式，适合已有 API 账号的团队 |

不要同时配置两套凭据，也不要把真实凭据提交到 Git。

---

## 2. 准备工作

### 2.1 安装 uv

macOS：

```bash
brew install uv
```

macOS / Linux 也可以使用 uv 官方安装脚本：

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

安装后检查：

```bash
uv --version
uvx --python 3.13 --from mcp-server-tapd==8.0.81 mcp-server-tapd --help
```

第二条命令能打印 `mcp-server-tapd` 的参数帮助，即表示运行环境正常。

### 2.2 获取 TAPD 凭据

推荐使用个人访问令牌：

1. 登录 TAPD。
2. 打开“我的设置 -> 个人访问令牌”。
3. 创建个人访问令牌，并立即保存；令牌只显示一次。

也可以在“公司管理 -> API 账号管理”中获取 API 账号和 API 密钥。入口是否可见取决于企业权限，无法查看时联系 TAPD 管理员。

---

## 3. 接入 Codex

Codex CLI、Codex IDE 扩展和 Codex 桌面端共享 MCP 配置。推荐把个人配置放在 `~/.codex/config.toml`；不要把包含凭据的配置写入仓库。

### 3.1 CLI 一次性添加

使用个人令牌：

```bash
codex mcp add tapd \
  --env TAPD_ACCESS_TOKEN="<TAPD_PERSONAL_TOKEN>" \
  --env TAPD_API_BASE_URL="https://api.tapd.cn" \
  --env TAPD_BASE_URL="https://www.tapd.cn" \
  -- uvx --python 3.13 --from mcp-server-tapd==8.0.81 mcp-server-tapd
```

`<TAPD_PERSONAL_TOKEN>` 必须替换为真实令牌。此方式会把令牌保存到 Codex 的用户配置中；不要把命令粘贴到会被共享的日志、工单或聊天中。

如果使用 API 账号和密钥：

```bash
codex mcp add tapd \
  --env TAPD_API_USER="<TAPD_API_USER>" \
  --env TAPD_API_PASSWORD="<TAPD_API_PASSWORD>" \
  --env TAPD_API_BASE_URL="https://api.tapd.cn" \
  --env TAPD_BASE_URL="https://www.tapd.cn" \
  -- uvx --python 3.13 --from mcp-server-tapd==8.0.81 mcp-server-tapd
```

### 3.2 手工配置

编辑 `~/.codex/config.toml`：

```toml
[mcp_servers.tapd]
command = "uvx"
args = ["--python", "3.13", "--from", "mcp-server-tapd==8.0.81", "mcp-server-tapd"]

[mcp_servers.tapd.env]
TAPD_ACCESS_TOKEN = "<TAPD_PERSONAL_TOKEN>"
TAPD_API_BASE_URL = "https://api.tapd.cn"
TAPD_BASE_URL = "https://www.tapd.cn"
```

如果令牌已经由终端或密码管理工具注入环境变量，可避免在 TOML 中写入令牌：

```toml
[mcp_servers.tapd]
command = "uvx"
args = ["--python", "3.13", "--from", "mcp-server-tapd==8.0.81", "mcp-server-tapd"]
env_vars = ["TAPD_ACCESS_TOKEN"]

[mcp_servers.tapd.env]
TAPD_API_BASE_URL = "https://api.tapd.cn"
TAPD_BASE_URL = "https://www.tapd.cn"
```

启动 Codex 前确保当前环境存在该变量：

```bash
export TAPD_ACCESS_TOKEN="<TAPD_PERSONAL_TOKEN>"
```

Codex 的 MCP 配置格式和管理命令以 [OpenAI Codex MCP 官方文档](https://developers.openai.com/codex/mcp) 为准。

---

## 4. 接入 Claude Desktop 或 Cursor

在客户端的 MCP JSON 配置中加入：

```json
{
  "mcpServers": {
    "tapd": {
      "command": "uvx",
      "args": ["--python", "3.13", "--from", "mcp-server-tapd==8.0.81", "mcp-server-tapd"],
      "env": {
        "TAPD_ACCESS_TOKEN": "<TAPD_PERSONAL_TOKEN>",
        "TAPD_API_BASE_URL": "https://api.tapd.cn",
        "TAPD_BASE_URL": "https://www.tapd.cn"
      }
    }
  }
}
```

使用 API 账号时，删除 `TAPD_ACCESS_TOKEN`，改为：

```json
"TAPD_API_USER": "<TAPD_API_USER>",
"TAPD_API_PASSWORD": "<TAPD_API_PASSWORD>"
```

保存后完整退出并重启客户端。不同版本的配置入口可能变化，应以客户端当前的 MCP 设置页面为准。

---

## 5. 验证安装

Codex 执行：

```bash
codex mcp list
```

确认 `tapd` 的状态为 `enabled`。重启 Codex 后，也可以使用 `/mcp` 查看已连接的服务。然后让 Agent 执行一个只读操作，例如：

```text
使用 TAPD MCP 列出我有权限访问的项目空间。
```

首次验证建议只做查询，不要直接创建或更新需求、任务、缺陷。

---

## 6. 可选配置

如果需要向企业微信群发送消息，可在 `env` 中增加企业微信机器人 Webhook：

```text
BOT_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=...
```

不使用该功能时不要配置 `BOT_URL`。

团队需要集中部署时，`mcp-server-tapd` 也支持 Streamable HTTP 模式；该模式涉及服务监听地址、凭据托管、网络访问控制和持续运维，不建议作为个人开发环境的默认方案。具体启动参数见 TAPD MCP 官方 README。

---

## 7. 常见问题

### 找不到 `uvx`

确认 `uv` 已安装，并重启终端或 MCP 客户端使 `PATH` 生效：

```bash
command -v uvx
uv --version
```

图形界面客户端可能拿不到终端中的自定义 `PATH`。遇到这种情况，可在配置的 `command` 中填写 `uvx` 的绝对路径；使用 `command -v uvx` 获取路径。

### MCP 启动超时

首次运行需要下载 Python 包，耗时可能较长。先在终端执行一次：

```bash
uvx --python 3.13 --from mcp-server-tapd==8.0.81 mcp-server-tapd --help
```

下载完成后重启客户端再试。

### 返回 401、403 或无权访问项目

依次检查：

1. 令牌是否完整、是否过期或已被撤销。
2. 是否误把个人令牌配置成 API 密钥，或同时配置了两套凭据。
3. 当前 TAPD 用户是否拥有目标项目空间权限。
4. 企业是否限制了 API 或个人访问令牌能力。

### 修改配置后没有生效

完整退出并重启 MCP 客户端；仅关闭一个对话窗口通常不够。Codex 可再次运行 `codex mcp list` 检查实际加载的配置。

---

## 8. 安全要求

- 只申请完成工作所需的最小权限。
- 个人令牌只放在本机用户配置、环境变量或密码管理工具中。
- 不要把令牌写入仓库内的 `.codex/config.toml`、示例文件、截图、日志或聊天记录。
- 共享配置时必须使用 `<TAPD_PERSONAL_TOKEN>` 等占位符。
- 怀疑令牌泄露时，立即在 TAPD 中撤销并重新创建。
- 执行创建、修改、删除类 TAPD 操作前，先确认目标项目和对象编号。

---

## 9. 参考资料

- [腾讯云社区 TAPD MCP Server](https://github.com/TencentCloudCommunity/mcp-server/tree/main/src/mcp-server-tapd)
- [腾讯云社区 MCP Server 总览](https://github.com/TencentCloudCommunity/mcp-server)
- [uv 官方安装文档](https://docs.astral.sh/uv/getting-started/installation/)
- [OpenAI Codex MCP 配置](https://developers.openai.com/codex/mcp)
