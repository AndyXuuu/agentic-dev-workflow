#!/usr/bin/env python3
"""Initialize, navigate, validate, and bundle an experimental current-system SDD."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import sys
import zipfile
from dataclasses import dataclass
from pathlib import Path, PurePosixPath
from typing import Any, Iterable, Optional, Union


PROFILE = "current-system-sdd/experimental-v2"
SUPPORTED_PROFILES = {PROFILE, "reconstruction-sdd/experimental-v1"}
MANIFEST_NAME = "manifest.json"
REQUIRED_COVERAGE = {
    "product": {"specification"},
    "domain": {"specification"},
    "contracts": {"contract"},
    "data": {"data"},
    "architecture": {"architecture"},
    "ui": {"ui"},
    "operations": {"operation"},
    "quality": {"quality"},
    "acceptance": {"acceptance", "traceability"},
    "assets": {"asset"},
}
ALLOWED_KINDS = set().union(*REQUIRED_COVERAGE.values()) | {"context"}
EXTERNAL_INPUT_KINDS = {"asset", "dataset", "dependency", "platform", "service", "toolchain"}
PROHIBITED_PATH_PARTS = {
    "archive",
    "archives",
    "change",
    "changes",
    "history",
    "plan",
    "plans",
    "proposal",
    "proposals",
    "source",
    "source-code",
    "src",
    "task",
    "tasks",
}
ID_PATTERN = re.compile(r"^[A-Z][A-Z0-9-]*$")
SYSTEM_ID_PATTERN = re.compile(r"^[a-z][a-z0-9-]*$")
REQUIREMENT_ID_PATTERN = re.compile(r"^REQ-[A-Z0-9]+(?:-[A-Z0-9]+)+$")
REQUIREMENT_SCAN_PATTERN = re.compile(rb"\bREQ-[A-Z0-9]+(?:-[A-Z0-9]+)+\b")
ORACLE_ID_PATTERN = re.compile(r"^ORACLE-[A-Z0-9]+(?:-[A-Z0-9]+)+$")
ORACLE_SCAN_PATTERN = re.compile(rb"\bORACLE-[A-Z0-9]+(?:-[A-Z0-9]+)+\b")
SHA256_PATTERN = re.compile(r"^[a-f0-9]{64}$")
PLACEHOLDER_PATTERNS = (
    re.compile(r"\b(?:TODO|TBD|FIXME)\b", re.IGNORECASE),
    re.compile(r"\{\{[^}]+\}\}"),
    re.compile(r"待定|待补充?|待确认|未确认"),
)
ASSUMPTION_PATTERNS = (
    re.compile(
        r"\b(?:we|i|the system|the builder|the evaluator|the agent|this specification)\s+"
        r"(?:currently\s+|temporarily\s+)?assum(?:e|es|ed)\b",
        re.IGNORECASE,
    ),
    re.compile(r"\b(?:assumption|assumptions)\s*[:：]", re.IGNORECASE),
    re.compile(r"\b(?:is|are|was|were)\s+(?:currently\s+|temporarily\s+)?assumed\b", re.IGNORECASE),
    re.compile(r"(?:我们|我方|本文)\s*(?:当前|暂时|先)?(?:假设|假定|推定)"),
    re.compile(
        r"(?:^|[\n：:；;。])\s*(?:[-*]\s*)?(?:当前|暂时|先)?(?:假设|假定|推定)"
        r"(?:\s|[：:，,]|为|是|该|此|系统|用户|输入)"
    ),
)
HIDDEN_DEPENDENCY_PATTERNS = (
    re.compile(r"参考(?:原|现有)?(?:源码|实现|代码|proposal|提案)", re.IGNORECASE),
    re.compile(r"(?:沿用|保持|同)(?:原有|现有|当前)(?:逻辑|行为|实现|代码|方案)", re.IGNORECASE),
    re.compile(r"(?:以|按)(?:原|现有|当前)?(?:源码|实现|proposal|提案)为准", re.IGNORECASE),
    re.compile(r"\b(?:as implemented|existing behavior|current implementation|see (?:the )?source)\b", re.IGNORECASE),
)
PROCESS_CONTENT_PATTERNS = (
    re.compile(r"\b(?:rejected alternatives?|agent reasoning)\b", re.IGNORECASE),
    re.compile(r"被否决方案|开发过程|推理过程|会议记录"),
)


class SddError(Exception):
    """User-actionable SDD validation or command error."""


@dataclass(frozen=True)
class Artifact:
    artifact_id: str
    kind: str
    relative_path: str
    status: str
    owner: str
    path: Path
    sha256: Optional[str] = None
    source: Optional[str] = None
    license: Optional[str] = None


@dataclass(frozen=True)
class ValidatedSdd:
    root: Path
    manifest_path: Path
    manifest: dict[str, Any]
    artifacts: dict[str, Artifact]
    context: Optional[dict[str, Any]]


@dataclass(frozen=True)
class TraceabilityIndex:
    requirements: dict[str, tuple[set[str], set[str]]]
    oracles: dict[str, str]


def read_json(path: Path, label: str) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise SddError(f"missing {label}: {path}") from exc
    except UnicodeDecodeError as exc:
        raise SddError(f"{label} must be UTF-8 JSON: {path}") from exc
    except json.JSONDecodeError as exc:
        raise SddError(f"invalid {label} JSON at {path}:{exc.lineno}:{exc.colno}: {exc.msg}") from exc


def require_mapping(value: Any, label: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise SddError(f"{label} must be an object")
    return value


def require_list(value: Any, label: str, *, nonempty: bool = False) -> list[Any]:
    if not isinstance(value, list):
        raise SddError(f"{label} must be an array")
    if nonempty and not value:
        raise SddError(f"{label} must not be empty")
    return value


def require_string(value: Any, label: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise SddError(f"{label} must be a non-empty string")
    return value.strip()


def reject_extra_keys(value: dict[str, Any], allowed: set[str], label: str) -> None:
    extra = sorted(set(value) - allowed)
    if extra:
        raise SddError(f"{label} contains unsupported fields: {extra}")


def find_pattern(text: str, patterns: Iterable[re.Pattern[str]]) -> Optional[str]:
    for pattern in patterns:
        match = pattern.search(text)
        if match:
            return match.group(0)
    return None


def walk_strings(value: Any, label: str = "manifest") -> Iterable[tuple[str, str]]:
    if isinstance(value, str):
        yield label, value
    elif isinstance(value, dict):
        for key, item in value.items():
            yield from walk_strings(item, f"{label}.{key}")
    elif isinstance(value, list):
        for index, item in enumerate(value):
            yield from walk_strings(item, f"{label}[{index}]")


def safe_relative_path(root: Path, raw_path: Any, label: str) -> tuple[str, Path]:
    relative_path = require_string(raw_path, label)
    if "\\" in relative_path:
        raise SddError(f"{label} must use POSIX separators: {relative_path}")
    pure_path = PurePosixPath(relative_path)
    if pure_path.is_absolute() or not pure_path.parts or any(part in {"", ".", ".."} for part in pure_path.parts):
        raise SddError(f"{label} must be a normalized relative path: {relative_path}")
    lowered_parts = {part.lower() for part in pure_path.parts}
    prohibited = sorted(lowered_parts & PROHIBITED_PATH_PARTS)
    if prohibited:
        raise SddError(f"{label} uses process/history path segment {prohibited[0]!r}: {relative_path}")
    candidate = root.joinpath(*pure_path.parts)
    if candidate.is_symlink():
        raise SddError(f"{label} must not reference a symlink: {relative_path}")
    try:
        candidate.resolve(strict=True).relative_to(root)
    except FileNotFoundError as exc:
        raise SddError(f"{label} does not exist: {relative_path}") from exc
    except ValueError as exc:
        raise SddError(f"{label} escapes the SDD root: {relative_path}") from exc
    if not candidate.is_file():
        raise SddError(f"{label} must reference a regular file: {relative_path}")
    return pure_path.as_posix(), candidate


def check_tree(root: Path) -> set[str]:
    files: set[str] = set()
    for path in sorted(root.rglob("*")):
        relative = path.relative_to(root).as_posix()
        if path.is_symlink():
            raise SddError(f"SDD tree must not contain symlinks: {relative}")
        if path.is_file():
            files.add(relative)
    return files


def parse_artifacts(root: Path, manifest: dict[str, Any]) -> dict[str, Artifact]:
    raw_artifacts = require_list(manifest.get("artifacts"), "manifest.artifacts", nonempty=True)
    artifacts: dict[str, Artifact] = {}
    artifact_paths: set[str] = set()
    for index, raw_artifact in enumerate(raw_artifacts):
        artifact = require_mapping(raw_artifact, f"manifest.artifacts[{index}]")
        reject_extra_keys(
            artifact,
            {"id", "kind", "path", "status", "owner", "sha256", "source", "license"},
            f"manifest.artifacts[{index}]",
        )
        artifact_id = require_string(artifact.get("id"), f"manifest.artifacts[{index}].id")
        if not ID_PATTERN.fullmatch(artifact_id):
            raise SddError(f"invalid artifact id: {artifact_id}")
        if artifact_id in artifacts:
            raise SddError(f"duplicate artifact id: {artifact_id}")
        kind = require_string(artifact.get("kind"), f"artifact {artifact_id}.kind")
        if kind not in ALLOWED_KINDS:
            raise SddError(f"invalid artifact kind for {artifact_id}: {kind}")
        relative_path, path = safe_relative_path(root, artifact.get("path"), f"artifact {artifact_id}.path")
        if relative_path == MANIFEST_NAME:
            raise SddError(f"manifest cannot register itself as artifact {artifact_id}")
        if relative_path in artifact_paths:
            raise SddError(f"duplicate artifact path: {relative_path}")
        status = require_string(artifact.get("status"), f"artifact {artifact_id}.status")
        if status not in {"draft", "current"}:
            raise SddError(f"invalid artifact status for {artifact_id}: {status}")
        owner = require_string(artifact.get("owner"), f"artifact {artifact_id}.owner")
        sha256: Optional[str] = None
        source: Optional[str] = None
        license_name: Optional[str] = None
        if kind == "asset":
            sha256 = require_string(artifact.get("sha256"), f"artifact {artifact_id}.sha256").lower()
            if not SHA256_PATTERN.fullmatch(sha256):
                raise SddError(f"artifact {artifact_id}.sha256 must be 64 lowercase hexadecimal characters")
            actual_sha256 = hashlib.sha256(path.read_bytes()).hexdigest()
            if actual_sha256 != sha256:
                raise SddError(
                    f"asset checksum mismatch for {artifact_id}: manifest={sha256}, actual={actual_sha256}"
                )
            source = require_string(artifact.get("source"), f"artifact {artifact_id}.source")
            license_name = require_string(artifact.get("license"), f"artifact {artifact_id}.license")
        elif any(field in artifact for field in ("sha256", "source", "license")):
            raise SddError(f"non-asset artifact {artifact_id} cannot define sha256, source, or license")
        artifacts[artifact_id] = Artifact(
            artifact_id,
            kind,
            relative_path,
            status,
            owner,
            path,
            sha256,
            source,
            license_name,
        )
        artifact_paths.add(relative_path)
    return artifacts


def validate_coverage(manifest: dict[str, Any], artifacts: dict[str, Artifact], level: str) -> None:
    coverage = require_mapping(manifest.get("coverage"), "manifest.coverage")
    actual_keys = set(coverage)
    if actual_keys != set(REQUIRED_COVERAGE):
        missing = sorted(set(REQUIRED_COVERAGE) - actual_keys)
        extra = sorted(actual_keys - set(REQUIRED_COVERAGE))
        raise SddError(f"coverage keys mismatch; missing={missing}, extra={extra}")
    covered_artifact_ids: set[str] = set()
    for area, allowed_kinds in REQUIRED_COVERAGE.items():
        entry = require_mapping(coverage[area], f"coverage.{area}")
        reject_extra_keys(entry, {"status", "artifacts", "rationale"}, f"coverage.{area}")
        status = require_string(entry.get("status"), f"coverage.{area}.status")
        if status == "specified":
            if "rationale" in entry:
                raise SddError(f"coverage.{area} cannot define rationale when status is specified")
            artifact_ids = require_list(entry.get("artifacts"), f"coverage.{area}.artifacts", nonempty=True)
            referenced: list[Artifact] = []
            area_ids: set[str] = set()
            for artifact_id_value in artifact_ids:
                artifact_id = require_string(artifact_id_value, f"coverage.{area}.artifacts[]")
                if artifact_id not in artifacts:
                    raise SddError(f"coverage.{area} references unknown artifact: {artifact_id}")
                if artifact_id in area_ids:
                    raise SddError(f"coverage.{area} contains duplicate artifact: {artifact_id}")
                area_ids.add(artifact_id)
                referenced.append(artifacts[artifact_id])
                covered_artifact_ids.add(artifact_id)
            invalid_kinds = sorted(
                f"{artifact.artifact_id}:{artifact.kind}"
                for artifact in referenced
                if artifact.kind not in allowed_kinds
            )
            if invalid_kinds:
                raise SddError(
                    f"coverage.{area} contains artifacts outside kinds {sorted(allowed_kinds)}: {invalid_kinds}"
                )
        elif status == "not-applicable":
            if entry.get("artifacts"):
                raise SddError(f"coverage.{area} cannot list artifacts when status is not-applicable")
            rationale = require_string(entry.get("rationale"), f"coverage.{area}.rationale")
            if level == "reconstruction":
                placeholder = find_pattern(rationale, PLACEHOLDER_PATTERNS)
                if placeholder:
                    raise SddError(f"coverage.{area}.rationale contains unresolved placeholder: {placeholder}")
        else:
            raise SddError(f"coverage.{area}.status must be specified or not-applicable")
    uncovered = sorted(
        artifact_id
        for artifact_id, artifact in artifacts.items()
        if artifact.kind != "context" and artifact_id not in covered_artifact_ids
    )
    if uncovered:
        raise SddError(f"artifacts are not assigned to a coverage area: {uncovered}")


def validate_external_inputs(manifest: dict[str, Any], level: str) -> None:
    raw_inputs = require_list(manifest.get("external_inputs"), "manifest.external_inputs")
    seen_ids: set[str] = set()
    for index, raw_input in enumerate(raw_inputs):
        external_input = require_mapping(raw_input, f"manifest.external_inputs[{index}]")
        reject_extra_keys(
            external_input,
            {"id", "kind", "version_or_protocol", "source", "rationale"},
            f"manifest.external_inputs[{index}]",
        )
        input_id = require_string(external_input.get("id"), f"external_inputs[{index}].id")
        if not ID_PATTERN.fullmatch(input_id):
            raise SddError(f"invalid external input id: {input_id}")
        if input_id in seen_ids:
            raise SddError(f"duplicate external input id: {input_id}")
        seen_ids.add(input_id)
        kind = require_string(external_input.get("kind"), f"external input {input_id}.kind")
        if kind not in EXTERNAL_INPUT_KINDS:
            raise SddError(f"invalid external input kind for {input_id}: {kind}")
        for field in ("version_or_protocol", "source", "rationale"):
            require_string(external_input.get(field), f"external input {input_id}.{field}")
    if level == "reconstruction":
        for label, text in walk_strings(raw_inputs, "manifest.external_inputs"):
            placeholder = find_pattern(text, PLACEHOLDER_PATTERNS)
            if placeholder:
                raise SddError(f"{label} contains unresolved placeholder: {placeholder}")


def validate_traceability(manifest: dict[str, Any], artifacts: dict[str, Artifact]) -> TraceabilityIndex:
    traceability_id = require_string(manifest.get("traceability_artifact"), "manifest.traceability_artifact")
    traceability_artifact = artifacts.get(traceability_id)
    if traceability_artifact is None:
        raise SddError(f"traceability artifact is not registered: {traceability_id}")
    if traceability_artifact.kind != "traceability":
        raise SddError(f"traceability artifact must have kind traceability: {traceability_id}")

    traceability = require_mapping(read_json(traceability_artifact.path, "traceability artifact"), "traceability")
    reject_extra_keys(traceability, {"schema_version", "requirements", "oracles"}, "traceability")
    if traceability.get("schema_version") != 1:
        raise SddError("traceability.schema_version must be 1")
    raw_requirements = require_list(traceability.get("requirements"), "traceability.requirements", nonempty=True)
    raw_oracles = require_list(traceability.get("oracles"), "traceability.oracles", nonempty=True)

    oracles: dict[str, Artifact] = {}
    for index, raw_oracle in enumerate(raw_oracles):
        oracle = require_mapping(raw_oracle, f"traceability.oracles[{index}]")
        reject_extra_keys(oracle, {"id", "artifact"}, f"traceability.oracles[{index}]")
        oracle_id = require_string(oracle.get("id"), f"traceability.oracles[{index}].id")
        if not ORACLE_ID_PATTERN.fullmatch(oracle_id):
            raise SddError(f"invalid oracle id: {oracle_id}")
        if oracle_id in oracles:
            raise SddError(f"duplicate oracle id: {oracle_id}")
        artifact_id = require_string(oracle.get("artifact"), f"oracle {oracle_id}.artifact")
        artifact = artifacts.get(artifact_id)
        if artifact is None:
            raise SddError(f"oracle {oracle_id} references unknown artifact: {artifact_id}")
        if artifact.kind != "acceptance":
            raise SddError(f"oracle {oracle_id} must reference an acceptance artifact: {artifact_id}")
        if oracle_id.encode("ascii") not in artifact.path.read_bytes():
            raise SddError(f"oracle id {oracle_id} is absent from artifact {artifact_id}")
        oracles[oracle_id] = artifact

    requirements: dict[str, tuple[set[str], set[str]]] = {}
    referenced_oracles: set[str] = set()
    for index, raw_requirement in enumerate(raw_requirements):
        requirement = require_mapping(raw_requirement, f"traceability.requirements[{index}]")
        reject_extra_keys(
            requirement,
            {"id", "artifacts", "oracles"},
            f"traceability.requirements[{index}]",
        )
        requirement_id = require_string(requirement.get("id"), f"traceability.requirements[{index}].id")
        if not REQUIREMENT_ID_PATTERN.fullmatch(requirement_id):
            raise SddError(f"invalid requirement id: {requirement_id}")
        if requirement_id in requirements:
            raise SddError(f"duplicate requirement id: {requirement_id}")
        artifact_ids = require_list(requirement.get("artifacts"), f"requirement {requirement_id}.artifacts", nonempty=True)
        requirement_artifacts: set[str] = set()
        for artifact_id_value in artifact_ids:
            artifact_id = require_string(artifact_id_value, f"requirement {requirement_id}.artifacts[]")
            artifact = artifacts.get(artifact_id)
            if artifact is None:
                raise SddError(f"requirement {requirement_id} references unknown artifact: {artifact_id}")
            if artifact.kind in {"acceptance", "traceability", "asset", "context"}:
                raise SddError(f"requirement {requirement_id} must reference a specification artifact: {artifact_id}")
            if requirement_id.encode("ascii") not in artifact.path.read_bytes():
                raise SddError(f"requirement id {requirement_id} is absent from artifact {artifact_id}")
            requirement_artifacts.add(artifact_id)
        oracle_ids = require_list(requirement.get("oracles"), f"requirement {requirement_id}.oracles", nonempty=True)
        requirement_oracles: set[str] = set()
        for oracle_id_value in oracle_ids:
            oracle_id = require_string(oracle_id_value, f"requirement {requirement_id}.oracles[]")
            if oracle_id not in oracles:
                raise SddError(f"requirement {requirement_id} references unknown oracle: {oracle_id}")
            referenced_oracles.add(oracle_id)
            requirement_oracles.add(oracle_id)
        requirements[requirement_id] = (requirement_artifacts, requirement_oracles)

    discovered_requirements: set[str] = set()
    for artifact in artifacts.values():
        if artifact.kind not in {"acceptance", "traceability", "asset", "context"}:
            discovered_requirements.update(
                match.decode("ascii") for match in REQUIREMENT_SCAN_PATTERN.findall(artifact.path.read_bytes())
            )
    untraced = sorted(discovered_requirements - set(requirements))
    if untraced:
        raise SddError(f"requirements appear in artifacts but not traceability: {untraced}")
    discovered_oracles: set[str] = set()
    for artifact in artifacts.values():
        if artifact.kind == "acceptance":
            discovered_oracles.update(
                match.decode("ascii") for match in ORACLE_SCAN_PATTERN.findall(artifact.path.read_bytes())
            )
    untraced_oracles = sorted(discovered_oracles - set(oracles))
    if untraced_oracles:
        raise SddError(f"oracles appear in acceptance artifacts but not traceability: {untraced_oracles}")
    orphaned_oracles = sorted(set(oracles) - referenced_oracles)
    if orphaned_oracles:
        raise SddError(f"oracles do not protect any requirement: {orphaned_oracles}")
    return TraceabilityIndex(
        requirements=requirements,
        oracles={oracle_id: artifact.artifact_id for oracle_id, artifact in oracles.items()},
    )


def require_unique_strings(value: Any, label: str, *, nonempty: bool = False) -> list[str]:
    raw_values = require_list(value, label, nonempty=nonempty)
    values: list[str] = []
    seen: set[str] = set()
    for index, raw_value in enumerate(raw_values):
        item = require_string(raw_value, f"{label}[{index}]")
        if item in seen:
            raise SddError(f"{label} contains duplicate value: {item}")
        seen.add(item)
        values.append(item)
    return values


def keyword_matches(query: str, keyword: str) -> bool:
    normalized_keyword = keyword.casefold()
    if normalized_keyword.isascii():
        return bool(
            re.search(
                rf"(?<![a-z0-9]){re.escape(normalized_keyword)}(?![a-z0-9])",
                query,
            )
        )
    return normalized_keyword in query


def validate_context(
    manifest: dict[str, Any],
    artifacts: dict[str, Artifact],
    traceability: TraceabilityIndex,
) -> Optional[dict[str, Any]]:
    context_id_value = manifest.get("context_artifact")
    if context_id_value is None:
        if manifest.get("profile") == PROFILE:
            raise SddError("manifest.context_artifact is required for the current-system SDD profile")
        return None
    context_id = require_string(context_id_value, "manifest.context_artifact")
    context_artifact = artifacts.get(context_id)
    if context_artifact is None:
        raise SddError(f"context artifact is not registered: {context_id}")
    if context_artifact.kind != "context":
        raise SddError(f"context artifact must have kind context: {context_id}")

    context = require_mapping(read_json(context_artifact.path, "context artifact"), "context")
    reject_extra_keys(
        context,
        {"schema_version", "role", "system_summary", "default_route", "glossary", "owners", "routes"},
        "context",
    )
    if context.get("schema_version") != 1:
        raise SddError("context.schema_version must be 1")
    if context.get("role") != "non-normative-navigation":
        raise SddError("context.role must be non-normative-navigation")
    require_string(context.get("system_summary"), "context.system_summary")

    raw_glossary = require_list(context.get("glossary"), "context.glossary")
    glossary_terms: set[str] = set()
    for index, raw_entry in enumerate(raw_glossary):
        entry = require_mapping(raw_entry, f"context.glossary[{index}]")
        reject_extra_keys(entry, {"term", "definition", "artifacts"}, f"context.glossary[{index}]")
        term = require_string(entry.get("term"), f"context.glossary[{index}].term")
        normalized_term = term.casefold()
        if normalized_term in glossary_terms:
            raise SddError(f"duplicate context glossary term: {term}")
        glossary_terms.add(normalized_term)
        require_string(entry.get("definition"), f"context.glossary[{index}].definition")
        for artifact_id in require_unique_strings(
            entry.get("artifacts"), f"context.glossary[{index}].artifacts", nonempty=True
        ):
            if artifact_id not in artifacts or artifact_id == context_id:
                raise SddError(f"context glossary term {term} references invalid canonical artifact: {artifact_id}")

    raw_owners = require_list(context.get("owners"), "context.owners", nonempty=True)
    owners: set[str] = set()
    for index, raw_owner in enumerate(raw_owners):
        owner = require_mapping(raw_owner, f"context.owners[{index}]")
        reject_extra_keys(owner, {"id", "responsibility", "entrypoints"}, f"context.owners[{index}]")
        owner_id = require_string(owner.get("id"), f"context.owners[{index}].id")
        if owner_id in owners:
            raise SddError(f"duplicate context owner: {owner_id}")
        owners.add(owner_id)
        require_string(owner.get("responsibility"), f"context owner {owner_id}.responsibility")
        for artifact_id in require_unique_strings(
            owner.get("entrypoints"), f"context owner {owner_id}.entrypoints", nonempty=True
        ):
            artifact = artifacts.get(artifact_id)
            if artifact is None or artifact_id == context_id:
                raise SddError(f"context owner {owner_id} references invalid canonical artifact: {artifact_id}")
            if artifact.owner != owner_id:
                raise SddError(
                    f"context owner {owner_id} cannot claim {artifact_id}, whose manifest owner is {artifact.owner}"
                )
    manifest_owners = {artifact.owner for artifact in artifacts.values() if artifact.kind != "context"}
    missing_owners = sorted(manifest_owners - owners)
    if missing_owners:
        raise SddError(f"context omits manifest artifact owners: {missing_owners}")

    raw_routes = require_list(context.get("routes"), "context.routes", nonempty=True)
    route_ids: set[str] = set()
    routed_artifacts: set[str] = set()
    routed_requirements: set[str] = set()
    routed_oracles: set[str] = set()
    for index, raw_route in enumerate(raw_routes):
        route = require_mapping(raw_route, f"context.routes[{index}]")
        reject_extra_keys(
            route,
            {"id", "keywords", "glossary", "read", "owners", "requirements", "oracles", "verification"},
            f"context.routes[{index}]",
        )
        route_id = require_string(route.get("id"), f"context.routes[{index}].id")
        if not SYSTEM_ID_PATTERN.fullmatch(route_id):
            raise SddError(f"invalid context route id: {route_id}")
        if route_id in route_ids:
            raise SddError(f"duplicate context route id: {route_id}")
        route_ids.add(route_id)
        require_unique_strings(route.get("keywords"), f"context route {route_id}.keywords", nonempty=True)
        route_glossary = require_unique_strings(
            route.get("glossary", []), f"context route {route_id}.glossary"
        )
        unknown_glossary = sorted(term for term in route_glossary if term.casefold() not in glossary_terms)
        if unknown_glossary:
            raise SddError(f"context route {route_id} references unknown glossary terms: {unknown_glossary}")
        read_ids = set(require_unique_strings(route.get("read"), f"context route {route_id}.read", nonempty=True))
        routed_artifacts.update(read_ids)
        for artifact_id in read_ids:
            if artifact_id not in artifacts or artifact_id == context_id:
                raise SddError(f"context route {route_id} reads invalid canonical artifact: {artifact_id}")
        route_owners = set(
            require_unique_strings(route.get("owners"), f"context route {route_id}.owners", nonempty=True)
        )
        unknown_owners = sorted(route_owners - owners)
        if unknown_owners:
            raise SddError(f"context route {route_id} references unknown owners: {unknown_owners}")
        read_owners = {artifacts[artifact_id].owner for artifact_id in read_ids}
        if not route_owners <= read_owners:
            raise SddError(
                f"context route {route_id} owners are not represented by its read artifacts: "
                f"{sorted(route_owners - read_owners)}"
            )
        primary_read_owners = {
            artifacts[artifact_id].owner
            for artifact_id in read_ids
            if artifacts[artifact_id].kind not in {"acceptance", "traceability"}
        }
        if not primary_read_owners <= route_owners:
            raise SddError(
                f"context route {route_id} omits owners for selected current artifacts: "
                f"{sorted(primary_read_owners - route_owners)}"
            )
        requirement_ids = set(
            require_unique_strings(
                route.get("requirements"), f"context route {route_id}.requirements", nonempty=True
            )
        )
        unknown_requirements = sorted(requirement_ids - set(traceability.requirements))
        if unknown_requirements:
            raise SddError(f"context route {route_id} references unknown requirements: {unknown_requirements}")
        routed_requirements.update(requirement_ids)
        oracle_ids = set(
            require_unique_strings(route.get("oracles"), f"context route {route_id}.oracles", nonempty=True)
        )
        unknown_oracles = sorted(oracle_ids - set(traceability.oracles))
        if unknown_oracles:
            raise SddError(f"context route {route_id} references unknown oracles: {unknown_oracles}")
        routed_oracles.update(oracle_ids)
        required_reads: set[str] = set()
        allowed_oracles: set[str] = set()
        for requirement_id in requirement_ids:
            requirement_artifacts, requirement_oracles = traceability.requirements[requirement_id]
            required_reads.update(requirement_artifacts)
            allowed_oracles.update(requirement_oracles)
        required_reads.update(traceability.oracles[oracle_id] for oracle_id in oracle_ids)
        missing_reads = sorted(required_reads - read_ids)
        if missing_reads:
            raise SddError(f"context route {route_id} omits artifacts required by its traceability: {missing_reads}")
        unrelated_oracles = sorted(oracle_ids - allowed_oracles)
        if unrelated_oracles:
            raise SddError(
                f"context route {route_id} oracles do not protect its declared requirements: {unrelated_oracles}"
            )
        missing_oracles = sorted(allowed_oracles - oracle_ids)
        if missing_oracles:
            raise SddError(
                f"context route {route_id} omits oracles for its declared requirements: {missing_oracles}"
            )
        require_unique_strings(
            route.get("verification"), f"context route {route_id}.verification", nonempty=True
        )

    default_route = require_string(context.get("default_route"), "context.default_route")
    if default_route not in route_ids:
        raise SddError(f"context.default_route references unknown route: {default_route}")
    unrouted_requirements = sorted(set(traceability.requirements) - routed_requirements)
    if unrouted_requirements:
        raise SddError(f"context does not route current requirements: {unrouted_requirements}")
    unrouted_oracles = sorted(set(traceability.oracles) - routed_oracles)
    if unrouted_oracles:
        raise SddError(f"context does not route current oracles: {unrouted_oracles}")
    unrouted_artifacts = sorted(
        artifact_id
        for artifact_id, artifact in artifacts.items()
        if artifact.kind not in {"context", "traceability"} and artifact_id not in routed_artifacts
    )
    if unrouted_artifacts:
        raise SddError(f"context does not route current artifacts: {unrouted_artifacts}")
    return context


def validate_content(manifest: dict[str, Any], artifacts: dict[str, Artifact]) -> None:
    system = require_mapping(manifest.get("system"), "manifest.system")
    if system.get("status") != "current":
        raise SddError("manifest.system.status must be current for reconstruction validation")
    for artifact in artifacts.values():
        if artifact.status != "current":
            raise SddError(f"artifact must be current for reconstruction validation: {artifact.artifact_id}")

    for label, text in walk_strings(manifest):
        placeholder = find_pattern(text, PLACEHOLDER_PATTERNS)
        if placeholder:
            raise SddError(f"{label} contains unresolved placeholder: {placeholder}")
        assumption = find_pattern(text, ASSUMPTION_PATTERNS)
        if assumption:
            raise SddError(
                f"{label} contains an assumption marker that must become a verified fact, "
                f"explicit requirement/constraint, or be removed: {assumption}"
            )
        hidden_dependency = find_pattern(text, HIDDEN_DEPENDENCY_PATTERNS)
        if hidden_dependency:
            raise SddError(f"{label} contains hidden implementation/history dependency: {hidden_dependency}")
        process_content = find_pattern(text, PROCESS_CONTENT_PATTERNS)
        if process_content:
            raise SddError(f"{label} contains process/history material: {process_content}")

    for artifact in artifacts.values():
        if artifact.kind == "asset":
            continue
        try:
            text = artifact.path.read_text(encoding="utf-8")
        except UnicodeDecodeError as exc:
            raise SddError(f"non-asset artifact must be UTF-8 text: {artifact.relative_path}") from exc
        if not text.strip():
            raise SddError(f"non-asset artifact must not be empty: {artifact.relative_path}")
        placeholder = find_pattern(text, PLACEHOLDER_PATTERNS)
        if placeholder:
            raise SddError(f"artifact {artifact.artifact_id} contains unresolved placeholder: {placeholder}")
        assumption = find_pattern(text, ASSUMPTION_PATTERNS)
        if assumption:
            raise SddError(
                f"artifact {artifact.artifact_id} contains an assumption marker that must become a verified fact, "
                f"explicit requirement/constraint, or be removed: {assumption}"
            )
        hidden_dependency = find_pattern(text, HIDDEN_DEPENDENCY_PATTERNS)
        if hidden_dependency:
            raise SddError(
                f"artifact {artifact.artifact_id} contains hidden implementation/history dependency: {hidden_dependency}"
            )
        process_content = find_pattern(text, PROCESS_CONTENT_PATTERNS)
        if process_content:
            raise SddError(f"artifact {artifact.artifact_id} contains process/history material: {process_content}")


def validate(root_value: Union[str, Path], level: str = "reconstruction") -> ValidatedSdd:
    root_input = Path(root_value).expanduser()
    try:
        root = root_input.resolve(strict=True)
    except FileNotFoundError as exc:
        raise SddError(f"SDD root does not exist: {root_input}") from exc
    if not root.is_dir():
        raise SddError(f"SDD root must be a directory: {root}")
    if level not in {"structure", "reconstruction"}:
        raise SddError(f"invalid validation level: {level}")

    files = check_tree(root)
    manifest_path = root / MANIFEST_NAME
    manifest = require_mapping(read_json(manifest_path, "SDD manifest"), "manifest")
    reject_extra_keys(
        manifest,
        {
            "schema_version",
            "profile",
            "system",
            "artifacts",
            "coverage",
            "context_artifact",
            "traceability_artifact",
            "external_inputs",
        },
        "manifest",
    )
    manifest_profile = manifest.get("profile")
    if manifest_profile not in SUPPORTED_PROFILES:
        raise SddError(f"manifest.profile must be one of {sorted(SUPPORTED_PROFILES)}")
    expected_schema_version = 2 if manifest_profile == PROFILE else 1
    if manifest.get("schema_version") != expected_schema_version:
        raise SddError(
            f"manifest.schema_version must be {expected_schema_version} for profile {manifest_profile}"
        )
    system = require_mapping(manifest.get("system"), "manifest.system")
    reject_extra_keys(system, {"id", "name", "version", "status"}, "manifest.system")
    system_id = require_string(system.get("id"), "manifest.system.id")
    if not SYSTEM_ID_PATTERN.fullmatch(system_id):
        raise SddError(f"invalid system id: {system_id}")
    require_string(system.get("name"), "manifest.system.name")
    require_string(system.get("version"), "manifest.system.version")
    system_status = require_string(system.get("status"), "manifest.system.status")
    if system_status not in {"draft", "current"}:
        raise SddError("manifest.system.status must be draft or current")

    artifacts = parse_artifacts(root, manifest)
    registered_files = {artifact.relative_path for artifact in artifacts.values()} | {MANIFEST_NAME}
    unregistered_files = sorted(files - registered_files)
    if unregistered_files:
        raise SddError(f"SDD contains files not registered in manifest: {unregistered_files}")
    missing_files = sorted(registered_files - files)
    if missing_files:
        raise SddError(f"manifest references missing files: {missing_files}")

    validate_coverage(manifest, artifacts, level)
    validate_external_inputs(manifest, level)
    traceability = validate_traceability(manifest, artifacts)
    context = validate_context(manifest, artifacts, traceability)
    if level == "reconstruction":
        validate_content(manifest, artifacts)
    return ValidatedSdd(root, manifest_path, manifest, artifacts, context)


def context_view(root_value: Union[str, Path], query: Optional[str] = None) -> dict[str, Any]:
    validated = validate(root_value, "reconstruction")
    if validated.context is None:
        raise SddError("this legacy SDD has no context artifact; migrate it before using context navigation")
    context_id = require_string(validated.manifest.get("context_artifact"), "manifest.context_artifact")
    context_artifact = validated.artifacts[context_id]
    if validated.manifest["system"]["status"] != "current" or context_artifact.status != "current":
        raise SddError("context navigation requires current system and context artifact status")

    context = validated.context
    routes = require_list(context["routes"], "context.routes", nonempty=True)
    normalized_query = (query or "").strip().casefold()
    selection = "default"
    selected_routes: list[dict[str, Any]]
    if normalized_query:
        scored: list[tuple[int, dict[str, Any]]] = []
        for route in routes:
            score = sum(1 for keyword in route["keywords"] if keyword_matches(normalized_query, keyword))
            if score:
                scored.append((score, route))
        if scored:
            selected_routes = [route for _, route in sorted(scored, key=lambda item: item[0], reverse=True)]
            selection = "matched"
        else:
            selected_routes = [route for route in routes if route["id"] == context["default_route"]]
    else:
        selected_routes = [route for route in routes if route["id"] == context["default_route"]]

    for route in selected_routes:
        for artifact_id in route["read"]:
            if validated.artifacts[artifact_id].status != "current":
                raise SddError(f"context route {route['id']} references non-current artifact: {artifact_id}")

    owners = {owner["id"]: owner for owner in context["owners"]}
    selected_artifacts = {artifact_id for route in selected_routes for artifact_id in route["read"]}
    selected_glossary = {
        term.casefold()
        for route in selected_routes
        for term in route.get("glossary", [])
    }
    rendered_routes: list[dict[str, Any]] = []
    for route in selected_routes:
        rendered_routes.append(
            {
                "id": route["id"],
                "owners": route["owners"],
                "owner_details": [
                    {"id": owner_id, "responsibility": owners[owner_id]["responsibility"]}
                    for owner_id in route["owners"]
                ],
                "read": [
                    {
                        "id": artifact_id,
                        "kind": validated.artifacts[artifact_id].kind,
                        "path": validated.artifacts[artifact_id].relative_path,
                    }
                    for artifact_id in route["read"]
                ],
                "requirements": route["requirements"],
                "oracles": route["oracles"],
                "verification": route["verification"],
            }
        )
    return {
        "system": {
            "id": validated.manifest["system"]["id"],
            "name": validated.manifest["system"]["name"],
            "version": validated.manifest["system"]["version"],
            "summary": context["system_summary"],
        },
        "query": query,
        "selection": selection,
        "glossary": [
            {
                "term": entry["term"],
                "definition": entry["definition"],
                "artifacts": entry["artifacts"],
            }
            for entry in context["glossary"]
            if entry["term"].casefold() in selected_glossary
            or (
                normalized_query
                and keyword_matches(normalized_query, entry["term"])
                and set(entry["artifacts"]) & selected_artifacts
            )
        ],
        "routes": rendered_routes,
        "available_routes": (
            []
            if normalized_query and selection == "matched"
            else [{"id": route["id"], "keywords": route["keywords"]} for route in routes]
        ),
    }


def print_context(view: dict[str, Any]) -> None:
    system = view["system"]
    print(f"{system['name']} ({system['id']} {system['version']}): {system['summary']}")
    if view["query"]:
        print(f"Query: {view['query']} [{view['selection']}]")
    if view["glossary"]:
        print("Glossary:")
        for entry in view["glossary"]:
            print(f"  - {entry['term']}: {entry['definition']}")
    for route in view["routes"]:
        print(f"\nRoute: {route['id']}")
        print("Owners:")
        for owner in route["owner_details"]:
            print(f"  - {owner['id']}: {owner['responsibility']}")
        print("Read:")
        for artifact in route["read"]:
            print(f"  - {artifact['id']} [{artifact['kind']}]: {artifact['path']}")
        print(f"Requirements: {', '.join(route['requirements'])}")
        print(f"Oracles: {', '.join(route['oracles'])}")
        print("Verification:")
        for entry in route["verification"]:
            print(f"  - {entry}")
    if view["available_routes"]:
        print("\nAvailable routes:")
        for route in view["available_routes"]:
            print(f"  - {route['id']}: {', '.join(route['keywords'])}")


def template_root() -> Path:
    return Path(__file__).resolve().parent.parent / "assets" / "current-system-sdd"


def init_sdd(target_value: Union[str, Path], system_id: str, name: str) -> Path:
    if not SYSTEM_ID_PATTERN.fullmatch(system_id):
        raise SddError("--system-id must start with a lowercase letter and contain only lowercase letters, digits, or hyphens")
    if not name.strip():
        raise SddError("--name must not be empty")
    target = Path(target_value).expanduser()
    if target.exists() or target.is_symlink():
        raise SddError(f"init target already exists: {target}")
    try:
        target = target.parent.resolve(strict=True) / target.name
    except FileNotFoundError as exc:
        raise SddError(f"init target parent does not exist: {target.parent}") from exc
    source = template_root()
    if not source.is_dir():
        raise SddError(f"missing SDD template: {source}")
    try:
        shutil.copytree(source, target)
        replacements = {
            b"{{system-id}}": system_id.encode("utf-8"),
            b"{{system-name}}": name.strip().encode("utf-8"),
        }
        for path in target.rglob("*"):
            if not path.is_file():
                continue
            content = path.read_bytes()
            for old, new in replacements.items():
                content = content.replace(old, new)
            path.write_bytes(content)
        validate(target, "structure")
    except Exception:
        if target.exists():
            shutil.rmtree(target)
        raise
    return target.resolve()


def zip_info(name: str) -> zipfile.ZipInfo:
    info = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
    info.compress_type = zipfile.ZIP_DEFLATED
    info.external_attr = 0o100644 << 16
    info.create_system = 3
    return info


def bundle_sdd(root_value: Union[str, Path], output_value: Union[str, Path]) -> tuple[Path, str]:
    validated = validate(root_value, "reconstruction")
    output = Path(output_value).expanduser()
    if output.exists() or output.is_symlink():
        raise SddError(f"bundle output already exists: {output}")
    if output.suffix.lower() != ".zip":
        raise SddError("bundle output must use a .zip extension")
    try:
        parent = output.parent.resolve(strict=True)
    except FileNotFoundError as exc:
        raise SddError(f"bundle output parent does not exist: {output.parent}") from exc
    output_resolved = parent / output.name
    system_id = validated.manifest["system"]["id"]
    system_version = validated.manifest["system"]["version"]
    expected_name = f"{system_id}-sdd-{system_version}.zip"
    if output.name != expected_name:
        raise SddError(
            "bundle output filename must match the manifest system id and version: "
            f"expected {expected_name}, got {output.name}"
        )
    sibling_bundles = sorted(
        path.name
        for path in parent.glob(f"{system_id}-sdd-*.zip")
        if path != output_resolved
    )
    if sibling_bundles:
        raise SddError(
            "bundle output directory already contains superseded or competing bundles for "
            f"{system_id}: {sibling_bundles}; archive or remove them before creating the single current bundle"
        )
    try:
        output_resolved.relative_to(validated.root)
    except ValueError:
        pass
    else:
        raise SddError("bundle output must be outside the SDD root")

    entries: dict[str, bytes] = {f"sdd/{MANIFEST_NAME}": validated.manifest_path.read_bytes()}
    for artifact in validated.artifacts.values():
        entries[f"sdd/{artifact.relative_path}"] = artifact.path.read_bytes()
    checksums = "".join(
        f"{hashlib.sha256(content).hexdigest()}  {name}\n" for name, content in sorted(entries.items())
    ).encode("utf-8")
    entries["BUNDLE-SHA256SUMS"] = checksums

    try:
        with zipfile.ZipFile(output_resolved, "x", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
            for name, content in sorted(entries.items()):
                bundle.writestr(zip_info(name), content, compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    except Exception:
        if output_resolved.exists():
            output_resolved.unlink()
        raise
    digest = hashlib.sha256(output_resolved.read_bytes()).hexdigest()
    return output_resolved, digest


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)

    init_parser = subparsers.add_parser("init", help="create a draft SDD at a non-existing target")
    init_parser.add_argument("target")
    init_parser.add_argument("--system-id", required=True)
    init_parser.add_argument("--name", required=True)

    validate_parser = subparsers.add_parser("validate", help="validate an SDD")
    validate_parser.add_argument("root")
    validate_parser.add_argument("--level", choices=("structure", "reconstruction"), default="reconstruction")

    context_parser = subparsers.add_parser("context", help="select the minimum current SDD slice for a task")
    context_parser.add_argument("root")
    context_parser.add_argument("--query")
    context_parser.add_argument("--json", action="store_true", dest="json_output")

    bundle_parser = subparsers.add_parser("bundle", help="validate and create an isolated deterministic ZIP")
    bundle_parser.add_argument("root")
    bundle_parser.add_argument("output")
    return parser


def main(argv: Optional[list[str]] = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        if args.command == "init":
            target = init_sdd(args.target, args.system_id, args.name)
            print(f"Initialized draft current-system SDD: {target}")
            print("Structure validation passed; reconstruction validation is expected to fail until TODOs are resolved.")
        elif args.command == "validate":
            validated = validate(args.root, args.level)
            print(
                f"Validated {len(validated.artifacts)} artifacts at {args.level} level for "
                f"{validated.manifest['system']['id']}."
            )
        elif args.command == "context":
            view = context_view(args.root, args.query)
            if args.json_output:
                print(json.dumps(view, indent=2, ensure_ascii=False))
            else:
                print_context(view)
        elif args.command == "bundle":
            output, digest = bundle_sdd(args.root, args.output)
            print(f"Created current-system SDD bundle: {output}")
            print(f"SHA-256: {digest}")
        else:
            raise AssertionError(f"unhandled command: {args.command}")
    except SddError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    except OSError as exc:
        print(f"ERROR: filesystem operation failed: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
