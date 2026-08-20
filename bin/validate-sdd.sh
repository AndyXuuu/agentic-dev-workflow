#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT=$(dirname "$SCRIPT_DIR")
TEST_SCRIPT="$ROOT/skills/repository/ax-sdd/scripts/test_sdd.py"

if [ ! -f "$TEST_SCRIPT" ]; then
  echo "missing reconstruction SDD behavior test: $TEST_SCRIPT" >&2
  exit 1
fi

PYTHONDONTWRITEBYTECODE=1 python3 "$TEST_SCRIPT"
echo "Validated experimental reconstruction SDD init, gates, traceability, and deterministic bundle."
