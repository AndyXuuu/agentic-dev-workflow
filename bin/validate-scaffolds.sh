#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT=$(dirname "$SCRIPT_DIR")
CATALOG="$ROOT/scaffolds/catalog.tsv"
mode=${1:---catalog}

case "$mode" in
  --catalog) ;;
  --smoke) ;;
  *)
    echo "usage: $0 [--catalog|--smoke]" >&2
    exit 1
    ;;
esac

if [ ! -f "$CATALOG" ]; then
  echo "missing scaffold catalog: $CATALOG" >&2
  exit 1
fi

if ! awk -F '\t' '
  BEGIN { ok=1 }
  /^#/ || NF==0 { next }
  NF!=5 { print "invalid scaffold catalog field count at line " NR > "/dev/stderr"; ok=0 }
  seen_name[$1]++ { print "duplicate scaffold name: " $1 > "/dev/stderr"; ok=0 }
  seen_source[$3]++ { print "duplicate scaffold source: " $3 > "/dev/stderr"; ok=0 }
  seen_generator[$4]++ { print "duplicate scaffold generator: " $4 > "/dev/stderr"; ok=0 }
  END { exit !ok }
' "$CATALOG"; then
  exit 1
fi

separator=$(printf '\t')
count=0
smoke_root=''
if [ "$mode" = "--smoke" ]; then
  smoke_root=$(mktemp -d "${TMPDIR:-/tmp}/agentic-scaffold-smoke.XXXXXX")
  trap 'rm -rf "$smoke_root"' EXIT HUP INT TERM
fi
while IFS="$separator" read -r name kind source generator documentation; do
  case "$name" in
    ''|'#'*) continue ;;
    *[!a-z0-9-]*)
      echo "invalid scaffold name: $name" >&2
      exit 1
      ;;
  esac
  if [ -z "$kind" ]; then
    echo "missing scaffold kind for $name" >&2
    exit 1
  fi
  case "$source" in
    scaffolds/*) ;;
    *)
      echo "scaffold source must stay under scaffolds/: $source" >&2
      exit 1
      ;;
  esac
  case "$generator" in
    bin/*) ;;
    *)
      echo "scaffold generator must stay under bin/: $generator" >&2
      exit 1
      ;;
  esac
  if [ ! -d "$ROOT/$source" ] || [ ! -f "$ROOT/$source/AGENTS.md" ]; then
    echo "invalid scaffold source for $name: $source" >&2
    exit 1
  fi
  if [ ! -f "$ROOT/$generator" ]; then
    echo "missing scaffold generator for $name: $generator" >&2
    exit 1
  fi
  if [ ! -f "$ROOT/$documentation" ]; then
    echo "missing scaffold documentation for $name: $documentation" >&2
    exit 1
  fi
  if [ "$mode" = "--smoke" ]; then
    smoke_target="$smoke_root/$name"
    echo "smoke testing scaffold generator: $name"
    sh "$ROOT/$generator" "$smoke_target"
    if [ ! -d "$smoke_target" ]; then
      echo "scaffold smoke target was not created: $smoke_target" >&2
      exit 1
    fi
  fi
  count=$((count + 1))
done < "$CATALOG"

if [ "$mode" = "--smoke" ]; then
  echo "Smoke tested $count registered scaffold generators."
else
  echo "Validated $count scaffold catalog entries (structure only)."
fi
