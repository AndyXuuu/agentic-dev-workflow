#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT=$(dirname "$SCRIPT_DIR")
SKILL_CATALOG="$ROOT/skills/catalog.tsv"
QUICK_VALIDATOR="${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py"

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
quick_validated_count=0
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
  if ! grep -F "\$$skill" "$skill_dir/agents/openai.yaml" >/dev/null 2>&1; then
    echo "Skill UI default prompt must mention \$$skill: $skill_dir/agents/openai.yaml" >&2
    exit 1
  fi

  if [ -f "$QUICK_VALIDATOR" ] && command -v python3 >/dev/null 2>&1; then
    if ! quick_validation_output=$(python3 "$QUICK_VALIDATOR" "$skill_dir" 2>&1); then
      echo "standard Skill validation failed for $skill" >&2
      echo "$quick_validation_output" >&2
      exit 1
    fi
    if ! python3 -c 'import pathlib, sys, yaml; data = yaml.safe_load(pathlib.Path(sys.argv[1]).read_text()); assert isinstance(data, dict)' "$skill_dir/agents/openai.yaml"; then
      echo "invalid Skill UI metadata YAML for $skill" >&2
      exit 1
    fi
    quick_validated_count=$((quick_validated_count + 1))
  else
    if [ "$(sed -n '1p' "$skill_dir/SKILL.md")" != "---" ] ||
       [ -z "$(sed -n '/^description:[[:space:]]*[^[:space:]]/p' "$skill_dir/SKILL.md")" ]; then
      echo "invalid or missing Skill frontmatter for $skill" >&2
      exit 1
    fi
  fi

  actual_name=$(sed -n '2s/^name:[[:space:]]*//p' "$skill_dir/SKILL.md")
  if [ "$actual_name" != "$skill" ]; then
    echo "skill name mismatch: catalog=$skill frontmatter=$actual_name" >&2
    exit 1
  fi
  sed -n 's/.*](\([^)]*\)).*/\1/p' "$skill_dir/SKILL.md" | while IFS= read -r link; do
    case "$link" in
      ''|'#'*|http://*|https://*|skill://*) continue ;;
    esac
    link_path=${link%%#*}
    if [ ! -e "$skill_dir/$link_path" ]; then
      echo "broken relative link in $skill: $link" >&2
      exit 1
    fi
  done
  skill_count=$((skill_count + 1))
done < "$SKILL_CATALOG"

entrypoint_count=$(find "$ROOT/skills" -mindepth 3 -maxdepth 3 -type f -name SKILL.md | wc -l | tr -d ' ')
if [ "$skill_count" -ne "$entrypoint_count" ]; then
  echo "catalog coverage mismatch: catalog=$skill_count entrypoints=$entrypoint_count" >&2
  exit 1
fi

if [ "$quick_validated_count" -eq "$skill_count" ]; then
  echo "Validated $skill_count registered Skills with catalog and standard frontmatter checks."
else
  echo "Validated $skill_count registered Skills with catalog and fallback frontmatter checks."
  echo "Standard quick validator unavailable at: $QUICK_VALIDATOR"
fi
