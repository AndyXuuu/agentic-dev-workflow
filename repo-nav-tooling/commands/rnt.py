#!/usr/bin/env python3

from __future__ import annotations

import argparse
import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_DIR = ROOT / ".repo-nav"
STATE_FILE = ARTIFACT_DIR / "state.json"
SUMMARY_FILE = ARTIFACT_DIR / "summary.json"
INDEX_FILE = ARTIFACT_DIR / "index.generated.yaml"
DOCS_FILE = ARTIFACT_DIR / "docs.generated.yaml"
MODULES_FILE = ARTIFACT_DIR / "modules.generated.yaml"
WORKFLOWS_FILE = ARTIFACT_DIR / "workflows.generated.yaml"

EXCLUDED_DIRS = {
    ".git",
    ".tmp",
    ".repo-nav",
    "node_modules",
    "dist",
    "build",
    ".sisyphus",
    "__pycache__",
}


@dataclass
class DocEntry:
    path: str
    title: str
    sha1: str
    mtime: float
    size: int


def main() -> None:
    parser = argparse.ArgumentParser(description="Repo nav tooling command")
    parser.add_argument("-r", "--rebuild", action="store_true", help="Rebuild repo-nav generated files")
    parser.add_argument("-u", "--update", action="store_true", help="Update repo-nav generated files")
    parser.add_argument("-c", "--correct", action="store_true", help="Correct repo-nav generated files by rescanning")
    parser.add_argument("-d", "--delete", nargs="?", const="generated", help="Delete generated files or a specific target path/id")
    args = parser.parse_args()

    actions = [args.rebuild, args.update, args.correct, args.delete is not None]
    if sum(bool(x) for x in actions) != 1:
        parser.error("choose exactly one of -r, -u, -c, -d")

    if args.rebuild:
        rebuild_artifact(mode="rebuild")
        return

    if args.update:
        rebuild_artifact(mode="update")
        return

    if args.correct:
        correct_artifact()
        return

    if args.delete is not None:
        delete_target(args.delete)
        return


def rebuild_artifact(mode: str) -> None:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

    previous = load_state()
    current_docs = collect_docs()
    current_modules = collect_modules()

    summary = diff_summary(previous, current_docs, current_modules)
    summary["mode"] = mode

    state = {
        "version": 1,
        "updated_at": now_iso(),
        "docs": {doc.path: doc.__dict__ for doc in current_docs},
        "modules": current_modules,
    }

    write_json(STATE_FILE, state)
    write_yaml_index(INDEX_FILE)
    write_yaml_docs(DOCS_FILE, current_docs)
    write_yaml_modules(MODULES_FILE, current_modules)
    write_yaml_workflows(WORKFLOWS_FILE)
    write_json(SUMMARY_FILE, summary)

    print(f"Updated repo-nav artifact at {ARTIFACT_DIR}")
    print(json.dumps(summary, indent=2, ensure_ascii=False))


def correct_artifact() -> None:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

    previous = load_state()
    prev_docs: dict = previous.get("docs", {})
    prev_modules: list[dict] = previous.get("modules", [])

    current_docs = {doc.path: doc for doc in collect_docs()}
    current_modules = collect_modules()

    corrected_docs: dict = {}
    corrected_modules: list[dict] = []

    removed_docs: list[str] = []
    corrected_doc_paths: list[str] = []
    unchanged_docs: list[str] = []

    for path, old_entry in prev_docs.items():
        if path not in current_docs:
            removed_docs.append(path)
            continue
        doc = current_docs[path]
        corrected = {
            "path": doc.path,
            "title": doc.title,
            "sha1": doc.sha1,
            "mtime": doc.mtime,
            "size": doc.size,
        }
        corrected_docs[path] = corrected
        if (
            old_entry.get("sha1") != doc.sha1
            or old_entry.get("title") != doc.title
            or old_entry.get("size") != doc.size
        ):
            corrected_doc_paths.append(path)
        else:
            unchanged_docs.append(path)

    prev_module_map = {m.get("id"): m for m in prev_modules}
    current_module_map = {m.get("id"): m for m in current_modules}

    removed_modules: list[str] = []
    corrected_module_ids: list[str] = []
    unchanged_modules: list[str] = []

    for module_id, old_module in prev_module_map.items():
        if module_id not in current_module_map:
            removed_modules.append(module_id)
            continue
        current_module = current_module_map[module_id]
        corrected_modules.append(current_module)
        if old_module != current_module:
            corrected_module_ids.append(module_id)
        else:
            unchanged_modules.append(module_id)

    next_state = {
        "version": 1,
        "updated_at": now_iso(),
        "docs": corrected_docs,
        "modules": corrected_modules,
    }

    write_json(STATE_FILE, next_state)
    docs_list = [DocEntry(**entry) for entry in corrected_docs.values()]
    docs_list.sort(key=lambda x: x.path)
    write_yaml_docs(DOCS_FILE, docs_list)
    write_yaml_modules(MODULES_FILE, corrected_modules)

    summary = {
        "version": 1,
        "updated_at": now_iso(),
        "mode": "correct",
        "corrected_docs": sorted(corrected_doc_paths),
        "removed_docs": sorted(removed_docs),
        "unchanged_docs": len(unchanged_docs),
        "corrected_modules": sorted(corrected_module_ids),
        "removed_modules": sorted(removed_modules),
        "unchanged_modules": len(unchanged_modules),
        "doc_count": len(corrected_docs),
        "module_count": len(corrected_modules),
    }
    write_json(SUMMARY_FILE, summary)

    print(f"Corrected repo-nav artifact at {ARTIFACT_DIR}")
    print(json.dumps(summary, indent=2, ensure_ascii=False))


def delete_target(target: str) -> None:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    if target == "generated":
        for file in (STATE_FILE, SUMMARY_FILE, INDEX_FILE, DOCS_FILE, MODULES_FILE, WORKFLOWS_FILE):
            if file.exists():
                file.unlink()
        print("Deleted generated repo-nav artifact files.")
        return

    protected_prefixes = {".repo-nav/"}
    protected_names = {
        "README.md",
        "index.yaml",
        "docs.yaml",
        "modules.yaml",
        "workflows.yaml",
        "opencode-omo-openai-setup.md",
    }
    if target in protected_names or any(target.startswith(prefix) for prefix in protected_prefixes):
        raise SystemExit("Refusing to delete non-generated repo-nav content.")

    state = load_state()
    docs = state.get("docs", {})
    modules = state.get("modules", [])

    removed_doc = docs.pop(target, None)
    filtered_modules = [m for m in modules if m.get("path") != target and m.get("id") != target]

    next_state = {
        "version": 1,
        "updated_at": now_iso(),
        "docs": docs,
        "modules": filtered_modules,
    }
    write_json(STATE_FILE, next_state)

    current_docs = [DocEntry(**entry) for entry in docs.values()]
    current_docs.sort(key=lambda x: x.path)
    write_yaml_index(INDEX_FILE)
    write_yaml_docs(DOCS_FILE, current_docs)
    write_yaml_modules(MODULES_FILE, filtered_modules)
    write_yaml_workflows(WORKFLOWS_FILE)
    write_json(
        SUMMARY_FILE,
        {
            "version": 1,
            "updated_at": now_iso(),
            "mode": "delete",
            "removed_target": target,
            "removed_doc": bool(removed_doc),
            "removed_module": len(filtered_modules) != len(modules),
        },
    )
    print(f"Deleted repo-nav entry target: {target}")


def load_state() -> dict:
    if not STATE_FILE.exists():
        return {"version": 1, "docs": {}, "modules": []}
    return json.loads(STATE_FILE.read_text(encoding="utf-8"))


def collect_docs() -> list[DocEntry]:
    results: list[DocEntry] = []
    for path in iter_files(ROOT, suffixes={".md"}):
        rel = path.relative_to(ROOT).as_posix()
        text = path.read_text(encoding="utf-8", errors="replace")
        stat = path.stat()
        results.append(
            DocEntry(
                path=rel,
                title=extract_title(rel, text),
                sha1=hashlib.sha1(text.encode("utf-8", errors="ignore")).hexdigest(),
                mtime=stat.st_mtime,
                size=stat.st_size,
            )
        )
    results.sort(key=lambda x: x.path)
    return results


def collect_modules() -> list[dict]:
    modules: list[dict] = []
    for child in sorted(ROOT.iterdir(), key=lambda p: p.name):
        if not child.is_dir():
            continue
        if child.name in EXCLUDED_DIRS or child.name.startswith("."):
            continue
        entries: list[str] = []
        readme = child / "README.md"
        if readme.exists():
            entries.append(readme.relative_to(ROOT).as_posix())
        for candidate in sorted(child.glob("*.md"))[:3]:
            rel = candidate.relative_to(ROOT).as_posix()
            if rel not in entries:
                entries.append(rel)
        modules.append(
            {
                "id": normalize_id(child.name),
                "path": child.relative_to(ROOT).as_posix() + "/",
                "entrypoints": entries,
            }
        )
    return modules


def diff_summary(previous: dict, current_docs: list[DocEntry], current_modules: list[dict]) -> dict:
    old_docs: dict = previous.get("docs", {})
    current_map = {doc.path: doc for doc in current_docs}

    added = sorted(path for path in current_map if path not in old_docs)
    removed = sorted(path for path in old_docs if path not in current_map)
    changed = sorted(
        path
        for path, doc in current_map.items()
        if path in old_docs and old_docs[path].get("sha1") != doc.sha1
    )

    return {
        "version": 1,
        "updated_at": now_iso(),
        "added_docs": added,
        "changed_docs": changed,
        "removed_docs": removed,
        "doc_count": len(current_docs),
        "module_count": len(current_modules),
    }


def iter_files(root: Path, suffixes: set[str]) -> Iterable[Path]:
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix not in suffixes:
            continue
        parts = path.relative_to(root).parts
        if any(part in EXCLUDED_DIRS for part in parts):
            continue
        if any(part.startswith(".") and part not in {".github", ".repo-nav"} for part in parts):
            continue
        yield path


def extract_title(rel: str, text: str) -> str:
    for line in text.splitlines():
        line = line.strip()
        if line.startswith("# "):
            return line[2:].strip()
    return rel.rsplit("/", 1)[-1].rsplit(".", 1)[0].replace("-", " ").replace("_", " ").strip().title()


def normalize_id(name: str) -> str:
    return name.strip().lower().replace("_", "-")


def normalize_doc_id(path: str) -> str:
    return normalize_id(path.rsplit(".", 1)[0].replace("/", "-"))


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def write_json(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write_yaml_docs(path: Path, docs: list[DocEntry]) -> None:
    lines = ["version: 1", "documents:"]
    for doc in docs:
        lines.extend(
            [
                f"  - id: {normalize_doc_id(doc.path)}",
                f"    title: {quote_yaml(doc.title)}",
                f"    path: {doc.path}",
                f"    sha1: {doc.sha1}",
                f"    size: {doc.size}",
            ]
        )
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_yaml_index(path: Path) -> None:
    lines = [
        "version: 1",
        "artifact: .repo-nav",
        "purpose: generated AI-first repository navigation artifact",
        "entrypoints:",
        "  docs: .repo-nav/docs.generated.yaml",
        "  modules: .repo-nav/modules.generated.yaml",
        "  workflows: .repo-nav/workflows.generated.yaml",
        "  summary: .repo-nav/summary.json",
        "  state: .repo-nav/state.json",
    ]
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_yaml_modules(path: Path, modules: list[dict]) -> None:
    lines = ["version: 1", "modules:"]
    for module in modules:
        lines.extend(
            [
                f"  - id: {module['id']}",
                f"    path: {module['path']}",
                "    entrypoints:",
            ]
        )
        if module["entrypoints"]:
            for entry in module["entrypoints"]:
                lines.append(f"      - {entry}")
        else:
            lines.append("      - <none-detected>")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_yaml_workflows(path: Path) -> None:
    lines = [
        "version: 1",
        "workflows:",
        "  - id: bootstrap-navigation",
        "    goal: find the first useful repository entrypoints for AI search",
        "    start_with:",
        "      - .repo-nav/index.generated.yaml",
        "    inspect:",
        "      - .repo-nav/docs.generated.yaml",
        "      - .repo-nav/modules.generated.yaml",
        "    verify:",
        "      - generated files exist",
        "      - summary.json exists",
    ]
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def quote_yaml(value: str) -> str:
    escaped = value.replace('"', '\\"')
    return f'"{escaped}"'


if __name__ == "__main__":
    main()
