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

global_agent_dst="$HOME/.codex/AGENTS.md"
global_agent_source="$ROOT/AGENTS.md"
if [ -L "$global_agent_dst" ]; then
  if [ "$(readlink "$global_agent_dst")" = "$global_agent_source" ]; then
    rm -f "$global_agent_dst"
    echo "removed active global AGENTS link: $global_agent_dst"
    echo "preserved any existing AGENTS.md.backup.* files for manual restoration"
  else
    echo "preserved unrelated global AGENTS link: $global_agent_dst -> $(readlink "$global_agent_dst")"
  fi
fi

echo "Uninstalled symlinks. Restart Codex to refresh."
