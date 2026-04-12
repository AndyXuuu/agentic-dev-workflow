#!/usr/bin/env python3

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[2]
REPO_NAV_DIR = ROOT / ".repo-nav"
AUTO_DIR = REPO_NAV_DIR / "auto"
STATE_FILE = AUTO_DIR / "state.json"
DOCS_FILE = AUTO_DIR / "docs.auto.yaml"
MODULES_FILE = AUTO_DIR / "modules.auto.yaml"
SUMMARY_FILE = AUTO_DIR / "summary.json"

EXCLUDED_DIRS = {
    ".git",
    ".tmp",
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
    AUTO_DIR.mkdir(parents=True, exist_ok=True)

    previous = load_state()
    current_docs = collect_docs()
    current_modules = collect_modules()

    summary = diff_summary(previous, current_docs, current_modules)
    state = {
        "version": 1,
        "updated_at": now_iso(),
        "docs": {doc.path: doc.__dict__ for doc in current_docs},
        "modules": current_modules,
    }

    write_json(STATE_FILE, state)
    write_yaml_docs(DOCS_FILE, current_docs)
    write_yaml_modules(MODULES_FILE, current_modules)
    write_json(SUMMARY_FILE, summary)

    print(f"Updated repo-nav auto index at {AUTO_DIR}")
    print(json.dumps(summary, indent=2, ensure_ascii=False))


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
        if child.name == "knowledge" and not entries:
            continue
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
        if any(part.startswith(".") and part not in {".github"} for part in parts):
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


def quote_yaml(value: str) -> str:
    escaped = value.replace('"', '\\"')
    return f'"{escaped}"'


if __name__ == "__main__":
    main()
