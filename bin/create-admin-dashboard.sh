#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT=$(dirname "$SCRIPT_DIR")
GENERATOR="$ROOT/scaffolds/admin-dashboard/scripts/create-admin-dashboard.mjs"

usage() {
  echo "Usage: $0 <target-directory>"
  echo "Creates a verified Admin Dashboard Scaffold at the specified path."
}

case "${1:-}" in
  --help|-h)
    usage
    exit 0
    ;;
  '')
    usage >&2
    exit 1
    ;;
esac

if [ "$#" -ne 1 ]; then
  echo "error: expected exactly one target directory" >&2
  usage >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "error: node is not installed or not in PATH" >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "error: npm is not installed or not in PATH" >&2
  exit 1
fi

if [ ! -f "$GENERATOR" ]; then
  echo "error: admin dashboard generator not found: $GENERATOR" >&2
  exit 1
fi

exec node "$GENERATOR" "$1"
