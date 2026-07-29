#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT=$(dirname "$SCRIPT_DIR")

mkdir -p "$HOME/.agents/skills"
mkdir -p "$HOME/.codex"

for old_skill in ax_pipeline ax_prd ax_arch ax_dev ax_test ax_review software-engineering-pipeline prd-analyst architect developer tester delivery-reviewer; do
  old_dst="$HOME/.agents/skills/$old_skill"
  if [ -L "$old_dst" ]; then
    rm -f "$old_dst"
    echo "removed old skill link: $old_dst"
  fi
done

for skill in ax-pipeline ax-prd ax-arch ax-dev ax-test ax-review ax-frontend ax-backend ax-project-adapter ax-structure-review tapd-query; do
  src="$ROOT/skills/$skill"
  dst="$HOME/.agents/skills/$skill"
  if [ -L "$dst" ] || [ ! -e "$dst" ]; then
    rm -f "$dst"
    ln -s "$src" "$dst"
    echo "linked skill: $dst -> $src"
  else
    echo "skip existing non-symlink skill: $dst"
  fi
done

for profile in arch dev test review; do
  src="$ROOT/profiles/$profile.config.toml"
  dst="$HOME/.codex/$profile.config.toml"
  if [ -L "$dst" ] || [ ! -e "$dst" ]; then
    rm -f "$dst"
    ln -s "$src" "$dst"
    echo "linked profile: $dst -> $src"
  else
    echo "skip existing non-symlink profile: $dst"
  fi
done

old_agent_dst="$HOME/.codex/AGENTS.engineering.md"
if [ -L "$old_agent_dst" ]; then
  rm -f "$old_agent_dst"
  echo "removed old project AGENTS link: $old_agent_dst"
fi

agent_dst="$HOME/.codex/AGENTS.agentic-dev-workflow.md"
if [ -L "$agent_dst" ] || [ ! -e "$agent_dst" ]; then
  rm -f "$agent_dst"
  ln -s "$ROOT/AGENTS.md" "$agent_dst"
  echo "linked project AGENTS: $agent_dst -> $ROOT/AGENTS.md"
else
  echo "skip existing non-symlink: $agent_dst"
fi

echo
echo "Installed. Restart Codex to reload skills/profiles."
echo "Use: codex -p arch --cd /path/to/project"
echo "Skill prefix: type ax to filter AX engineering skills."
echo "To activate synchronized global rules, run: $ROOT/bin/apply-global-agent.sh"
