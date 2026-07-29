#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT=$(dirname "$SCRIPT_DIR")
SKILL_CATALOG="$ROOT/skills/catalog.tsv"

if [ ! -f "$SKILL_CATALOG" ]; then
  echo "missing skill catalog: $SKILL_CATALOG" >&2
  exit 1
fi

catalog_separator=$(printf '\t')
while IFS="$catalog_separator" read -r skill category relative_path; do
  case "$skill" in
    ''|'#'*) continue ;;
  esac
  dst="$HOME/.agents/skills/$skill"
  if [ -L "$dst" ]; then
    rm -f "$dst"
    echo "removed skill link: $dst"
  fi
done < "$SKILL_CATALOG"

for skill in ax_pipeline ax_prd ax_arch ax_dev ax_test ax_review software-engineering-pipeline prd-analyst architect developer tester delivery-reviewer; do
  dst="$HOME/.agents/skills/$skill"
  if [ -L "$dst" ]; then
    rm -f "$dst"
    echo "removed legacy skill link: $dst"
  fi
done

for profile in arch dev test review; do
  dst="$HOME/.codex/$profile.config.toml"
  if [ -L "$dst" ]; then
    rm -f "$dst"
    echo "removed profile link: $dst"
  fi
done

for agent_dst in "$HOME/.codex/AGENTS.agentic-dev-workflow.md" "$HOME/.codex/AGENTS.engineering.md"; do
  if [ -L "$agent_dst" ]; then
    rm -f "$agent_dst"
    echo "removed project AGENTS link: $agent_dst"
  fi
done

echo "Uninstalled symlinks. Restart Codex to refresh."
