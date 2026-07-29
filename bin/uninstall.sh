#!/bin/sh
set -eu

for skill in ax-pipeline ax-prd ax-arch ax-dev ax-test ax-review ax-frontend ax-backend ax-project-adapter ax-structure-review tapd-query ax_pipeline ax_prd ax_arch ax_dev ax_test ax_review software-engineering-pipeline prd-analyst architect developer tester delivery-reviewer; do
  dst="$HOME/.agents/skills/$skill"
  if [ -L "$dst" ]; then
    rm -f "$dst"
    echo "removed skill link: $dst"
  fi
done

for profile in arch dev test review; do
  dst="$HOME/.codex/$profile.config.toml"
  if [ -L "$dst" ]; then
    rm -f "$dst"
    echo "removed profile link: $dst"
  fi
done

agent_dst="$HOME/.codex/AGENTS.engineering.md"
if [ -L "$agent_dst" ]; then
  rm -f "$agent_dst"
  echo "removed engineering AGENTS link: $agent_dst"
fi

echo "Uninstalled symlinks. Restart Codex to refresh."
