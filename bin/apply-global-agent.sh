#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT=$(dirname "$SCRIPT_DIR")
SOURCE="$ROOT/AGENTS.md"
TARGET_DIR="$HOME/.codex"
TARGET="$TARGET_DIR/AGENTS.md"

if [ ! -f "$SOURCE" ]; then
  echo "error: source AGENTS file not found: $SOURCE" >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"

if [ -L "$TARGET" ] && [ "$(readlink "$TARGET")" = "$SOURCE" ]; then
  echo "global AGENTS already linked: $TARGET -> $SOURCE"
  exit 0
fi

if [ -d "$TARGET" ]; then
  echo "error: global AGENTS target is a directory: $TARGET" >&2
  exit 1
fi

if [ -e "$TARGET" ] || [ -L "$TARGET" ]; then
  if [ -f "$TARGET" ] && [ ! -s "$TARGET" ] && [ ! -L "$TARGET" ]; then
    rm -f "$TARGET"
    echo "removed empty global AGENTS file: $TARGET"
  else
    timestamp=$(date '+%Y%m%d-%H%M%S')
    backup="$TARGET.backup.$timestamp"
    sequence=0

    while [ -e "$backup" ] || [ -L "$backup" ]; do
      sequence=$((sequence + 1))
      backup="$TARGET.backup.$timestamp.$sequence"
    done

    mv "$TARGET" "$backup"
    echo "backed up existing global AGENTS: $backup"
  fi
fi

ln -s "$SOURCE" "$TARGET"
echo "linked global AGENTS: $TARGET -> $SOURCE"
echo "Edit $SOURCE to update the global rules. Restart Codex / ChatGPT to reload them."
