#!/bin/sh
set -eu

if ! command -v codex >/dev/null 2>&1; then
  echo "error: codex CLI is not installed or not in PATH" >&2
  exit 1
fi

if ! command -v uvx >/dev/null 2>&1; then
  echo "error: uvx is not installed; run: brew install uv" >&2
  exit 1
fi

token=${TAPD_ACCESS_TOKEN:-}
tapd_key_available=false
restore_echo=false

restore_terminal() {
  if [ "$restore_echo" = true ]; then
    stty echo
  fi
}

trap restore_terminal EXIT HUP INT TERM

if /bin/zsh -lc 'test -n "${TAPD_KEY:-}"'; then
  tapd_key_available=true
fi

if [ "$tapd_key_available" = false ] && [ -z "$token" ]; then
  if [ ! -t 0 ]; then
    echo "error: set TAPD_ACCESS_TOKEN or run this script from an interactive terminal" >&2
    exit 1
  fi

  printf 'TAPD personal access token: '
  stty -echo
  restore_echo=true
  IFS= read -r token
  stty echo
  restore_echo=false
  printf '\n'
fi

if [ "$tapd_key_available" = false ] && [ -z "$token" ]; then
  echo "error: TAPD access token cannot be empty" >&2
  exit 1
fi

if codex mcp get tapd >/dev/null 2>&1; then
  echo "error: MCP server 'tapd' already exists; inspect it with: codex mcp get tapd" >&2
  exit 1
fi

uvx_path=$(command -v uvx)

if [ "$tapd_key_available" = true ]; then
  login_command="TAPD_ACCESS_TOKEN=\"\$TAPD_KEY\" TAPD_API_BASE_URL=\"https://api.tapd.cn\" TAPD_BASE_URL=\"https://www.tapd.cn\" exec \"$uvx_path\" mcp-server-tapd"
  codex mcp add tapd -- /bin/zsh -lc "$login_command"
  echo "Configured TAPD MCP to load TAPD_KEY from ~/.zprofile at startup."
else
  codex mcp add tapd \
    --env "TAPD_ACCESS_TOKEN=$token" \
    --env "TAPD_API_BASE_URL=https://api.tapd.cn" \
    --env "TAPD_BASE_URL=https://www.tapd.cn" \
    -- "$uvx_path" mcp-server-tapd
fi

unset token

echo "TAPD MCP installed. Restart Codex / ChatGPT, then run: codex mcp list"
