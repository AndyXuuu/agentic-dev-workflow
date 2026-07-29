#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT=$(dirname "$SCRIPT_DIR")
SKILL_CATALOG="$ROOT/skills/catalog.tsv"

if [ ! -f "$SKILL_CATALOG" ]; then
  echo "missing skill catalog: $SKILL_CATALOG" >&2
  exit 1
fi

if ! awk -F '\t' '
  BEGIN { ok=1 }
  /^#/ || NF==0 { next }
  NF!=3 { print "invalid catalog field count at line " NR > "/dev/stderr"; ok=0 }
  seen_name[$1]++ { print "duplicate skill name: " $1 > "/dev/stderr"; ok=0 }
  seen_path[$3]++ { print "duplicate skill path: " $3 > "/dev/stderr"; ok=0 }
  END { exit !ok }
' "$SKILL_CATALOG"; then
  exit 1
fi

catalog_separator=$(printf '\t')
skill_count=0
while IFS="$catalog_separator" read -r skill category relative_path; do
  case "$skill" in
    ''|'#'*) continue ;;
    *[!a-z0-9-]*)
      echo "invalid skill name: $skill" >&2
      exit 1
      ;;
  esac
  case "$category" in
    lifecycle|disciplines|repository|integrations) ;;
    *)
      echo "invalid skill category for $skill: $category" >&2
      exit 1
      ;;
  esac
  case "$relative_path" in
    "$category/$skill") ;;
    *)
      echo "catalog path must match category/name for $skill: $relative_path" >&2
      exit 1
      ;;
  esac

  skill_dir="$ROOT/skills/$relative_path"
  if [ ! -f "$skill_dir/SKILL.md" ]; then
    echo "missing skill entrypoint: $skill_dir/SKILL.md" >&2
    exit 1
  fi
  if [ ! -f "$skill_dir/agents/openai.yaml" ]; then
    echo "missing skill UI metadata: $skill_dir/agents/openai.yaml" >&2
    exit 1
  fi

  actual_name=$(sed -n '2s/^name:[[:space:]]*//p' "$skill_dir/SKILL.md")
  if [ "$actual_name" != "$skill" ]; then
    echo "skill name mismatch: catalog=$skill frontmatter=$actual_name" >&2
    exit 1
  fi
  skill_count=$((skill_count + 1))
done < "$SKILL_CATALOG"

entrypoint_count=$(find "$ROOT/skills" -mindepth 3 -maxdepth 3 -type f -name SKILL.md | wc -l | tr -d ' ')
if [ "$skill_count" -ne "$entrypoint_count" ]; then
  echo "catalog coverage mismatch: catalog=$skill_count entrypoints=$entrypoint_count" >&2
  exit 1
fi

echo "Validated $skill_count registered Skills."
