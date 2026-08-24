#!/usr/bin/env python3
"""Behavior tests for the experimental current-system SDD tool."""

from __future__ import annotations

import hashlib
import json
import tempfile
import unittest
import zipfile
from pathlib import Path

import sdd


class SddToolTest(unittest.TestCase):
    def setUp(self) -> None:
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary_directory.cleanup)
        self.test_root = Path(self.temporary_directory.name)
        self.sdd_root = self.test_root / "sdd"
        sdd.init_sdd(self.sdd_root, "demo-system", "Demo System")

    def make_current(self) -> None:
        manifest_path = self.sdd_root / "manifest.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        manifest["system"]["status"] = "current"
        for artifact in manifest["artifacts"]:
            artifact["status"] = "current"
        rationales = {
            "domain": "The experiment exposes one stateless transformation and defines no domain entities.",
            "contracts": "The experiment has no network, event, command-line, or library consumer contract.",
            "data": "The experiment accepts one input and retains no durable or process state.",
            "ui": "The experiment has no human interface or visual output.",
            "operations": "The evaluator invokes the transformation directly and owns no deployed runtime.",
            "quality": "The bounded fixture has no additional measurable quality threshold beyond exact output.",
            "assets": "The transformation uses UTF-8 text only and needs no fixed external asset.",
        }
        for area, rationale in rationales.items():
            manifest["coverage"][area]["rationale"] = rationale
        manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

        (self.sdd_root / "specs/system.md").write_text(
            "# Demo System Specification\n\n"
            "Status: `current`\n\n"
            "## REQ-SYSTEM-001 — Uppercase transformation\n\n"
            "Given one UTF-8 string, the system returns its Unicode uppercase mapping without retaining state.\n",
            encoding="utf-8",
        )
        (self.sdd_root / "architecture/system.md").write_text(
            "# Demo System Architecture Contract\n\n"
            "Status: `current`\n\n"
            "The system owns one pure transformation boundary and has no external side effect.\n",
            encoding="utf-8",
        )
        (self.sdd_root / "acceptance/system.md").write_text(
            "# ORACLE-SYSTEM-001 — Uppercase acceptance\n\n"
            "Status: `current`\n\n"
            "Protects: `REQ-SYSTEM-001`\n\n"
            "Input `hello` passes only when the exact output is `HELLO` and a repeated call has no retained state.\n",
            encoding="utf-8",
        )
        (self.sdd_root / "context/navigation.json").write_text(
            json.dumps(
                {
                    "schema_version": 1,
                    "role": "non-normative-navigation",
                    "system_summary": "A stateless boundary converts one UTF-8 input to its uppercase output.",
                    "default_route": "system-overview",
                    "glossary": [
                        {
                            "term": "transformation",
                            "definition": "The one stateless input-to-output capability.",
                            "artifacts": ["SPEC-SYSTEM"],
                        }
                    ],
                    "owners": [
                        {
                            "id": "system",
                            "responsibility": "Owns the behavior, architecture, and acceptance boundary.",
                            "entrypoints": [
                                "SPEC-SYSTEM",
                                "ARCH-SYSTEM",
                                "ACCEPTANCE-SYSTEM",
                                "TRACEABILITY",
                            ],
                        }
                    ],
                    "routes": [
                        {
                            "id": "system-overview",
                            "keywords": ["system", "output", "change", "系统", "输出"],
                            "glossary": ["transformation"],
                            "read": ["SPEC-SYSTEM", "ACCEPTANCE-SYSTEM"],
                            "owners": ["system"],
                            "requirements": ["REQ-SYSTEM-001"],
                            "oracles": ["ORACLE-SYSTEM-001"],
                            "verification": ["Invoke the public transformation with a requirement-derived case."],
                        },
                        {
                            "id": "architecture-overview",
                            "keywords": ["architecture", "module", "dependency"],
                            "glossary": ["transformation"],
                            "read": ["SPEC-SYSTEM", "ARCH-SYSTEM", "ACCEPTANCE-SYSTEM"],
                            "owners": ["system"],
                            "requirements": ["REQ-SYSTEM-001"],
                            "oracles": ["ORACLE-SYSTEM-001"],
                            "verification": ["Inspect the pure transformation boundary."],
                        }
                    ],
                },
                indent=2,
                ensure_ascii=False,
            )
            + "\n",
            encoding="utf-8",
        )

    def test_draft_passes_structure_but_not_reconstruction(self) -> None:
        sdd.validate(self.sdd_root, "structure")
        with self.assertRaisesRegex(sdd.SddError, "unresolved placeholder"):
            sdd.validate(self.sdd_root, "reconstruction")

    def test_current_sdd_validates_and_bundles_deterministically(self) -> None:
        self.make_current()
        validated = sdd.validate(self.sdd_root, "reconstruction")
        self.assertEqual(
            set(validated.artifacts),
            {"CONTEXT-SYSTEM", "SPEC-SYSTEM", "ARCH-SYSTEM", "ACCEPTANCE-SYSTEM", "TRACEABILITY"},
        )

        first_directory = self.test_root / "first"
        second_directory = self.test_root / "second"
        first_directory.mkdir()
        second_directory.mkdir()
        first, first_digest = sdd.bundle_sdd(
            self.sdd_root, first_directory / "demo-system-sdd-0.1.0.zip"
        )
        second, second_digest = sdd.bundle_sdd(
            self.sdd_root, second_directory / "demo-system-sdd-0.1.0.zip"
        )
        self.assertEqual(first_digest, second_digest)
        self.assertEqual(first.read_bytes(), second.read_bytes())
        with zipfile.ZipFile(first) as bundle:
            self.assertEqual(
                bundle.namelist(),
                [
                    "BUNDLE-SHA256SUMS",
                    "sdd/acceptance/system.md",
                    "sdd/acceptance/traceability.json",
                    "sdd/architecture/system.md",
                    "sdd/context/navigation.json",
                    "sdd/manifest.json",
                    "sdd/specs/system.md",
                ],
            )

    def test_bundle_rejects_competing_system_versions_in_output_directory(self) -> None:
        self.make_current()
        (self.test_root / "demo-system-sdd-0.0.9.zip").write_bytes(b"superseded")
        with self.assertRaisesRegex(sdd.SddError, "competing bundles"):
            sdd.bundle_sdd(self.sdd_root, self.test_root / "demo-system-sdd-0.1.0.zip")

    def test_bundle_requires_manifest_bound_filename(self) -> None:
        self.make_current()
        with self.assertRaisesRegex(sdd.SddError, "must match the manifest system id and version"):
            sdd.bundle_sdd(self.sdd_root, self.test_root / "demo-system-sdd.zip")

    def test_context_query_returns_minimum_traceable_slice(self) -> None:
        self.make_current()
        view = sdd.context_view(self.sdd_root, "system output behavior")
        self.assertEqual(view["selection"], "matched")
        self.assertEqual([route["id"] for route in view["routes"]], ["system-overview"])
        self.assertEqual(
            [artifact["id"] for artifact in view["routes"][0]["read"]],
            ["SPEC-SYSTEM", "ACCEPTANCE-SYSTEM"],
        )
        self.assertEqual(view["routes"][0]["requirements"], ["REQ-SYSTEM-001"])
        self.assertEqual(view["available_routes"], [])
        self.assertEqual(view["glossary"][0]["term"], "transformation")
        self.assertEqual(
            view["routes"][0]["owner_details"],
            [{"id": "system", "responsibility": "Owns the behavior, architecture, and acceptance boundary."}],
        )

    def test_draft_cannot_be_used_as_current_context(self) -> None:
        with self.assertRaisesRegex(sdd.SddError, "unresolved placeholder"):
            sdd.context_view(self.sdd_root, "system overview")

    def test_context_query_keeps_every_explicitly_matched_boundary(self) -> None:
        self.make_current()
        context_path = self.sdd_root / "context/navigation.json"
        context = json.loads(context_path.read_text(encoding="utf-8"))
        context["routes"].append(
            {
                "id": "output-detail",
                "keywords": ["output"],
                "read": ["SPEC-SYSTEM", "ACCEPTANCE-SYSTEM"],
                "owners": ["system"],
                "requirements": ["REQ-SYSTEM-001"],
                "oracles": ["ORACLE-SYSTEM-001"],
                "verification": ["Invoke the public transformation with an output-focused case."],
            }
        )
        context_path.write_text(json.dumps(context, indent=2) + "\n", encoding="utf-8")
        view = sdd.context_view(self.sdd_root, "system output")
        self.assertEqual(
            [route["id"] for route in view["routes"]],
            ["system-overview", "output-detail"],
        )

    def test_ascii_keywords_require_word_boundaries(self) -> None:
        self.make_current()
        context_path = self.sdd_root / "context/navigation.json"
        context = json.loads(context_path.read_text(encoding="utf-8"))
        context["routes"].append(
            {
                "id": "ui-detail",
                "keywords": ["ui"],
                "read": ["SPEC-SYSTEM", "ACCEPTANCE-SYSTEM"],
                "owners": ["system"],
                "requirements": ["REQ-SYSTEM-001"],
                "oracles": ["ORACLE-SYSTEM-001"],
                "verification": ["Invoke the public transformation from a UI."],
            }
        )
        context_path.write_text(json.dumps(context, indent=2) + "\n", encoding="utf-8")
        view = sdd.context_view(self.sdd_root, "build system output")
        self.assertEqual([route["id"] for route in view["routes"]], ["system-overview"])

    def test_context_route_must_include_traceability_artifacts(self) -> None:
        self.make_current()
        context_path = self.sdd_root / "context/navigation.json"
        context = json.loads(context_path.read_text(encoding="utf-8"))
        context["routes"][0]["read"] = ["SPEC-SYSTEM"]
        context_path.write_text(json.dumps(context, indent=2) + "\n", encoding="utf-8")
        with self.assertRaisesRegex(sdd.SddError, "omits artifacts required by its traceability"):
            sdd.validate(self.sdd_root, "structure")

    def test_legacy_v1_still_validates_but_has_no_context_navigation(self) -> None:
        self.make_current()
        manifest_path = self.sdd_root / "manifest.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        manifest["schema_version"] = 1
        manifest["profile"] = "reconstruction-sdd/experimental-v1"
        manifest.pop("context_artifact")
        manifest["artifacts"] = [
            artifact for artifact in manifest["artifacts"] if artifact["id"] != "CONTEXT-SYSTEM"
        ]
        manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
        (self.sdd_root / "context/navigation.json").unlink()
        sdd.validate(self.sdd_root, "reconstruction")
        with self.assertRaisesRegex(sdd.SddError, "legacy SDD has no context artifact"):
            sdd.context_view(self.sdd_root)

    def test_unregistered_file_is_rejected(self) -> None:
        self.make_current()
        (self.sdd_root / "proposal.md").write_text("old idea\n", encoding="utf-8")
        with self.assertRaisesRegex(sdd.SddError, "not registered"):
            sdd.validate(self.sdd_root, "structure")

    def test_untraced_requirement_is_rejected(self) -> None:
        self.make_current()
        spec_path = self.sdd_root / "specs/system.md"
        spec_path.write_text(
            spec_path.read_text(encoding="utf-8") + "\n## REQ-SYSTEM-002 — Missing oracle\n\nThe system emits a second output.\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(sdd.SddError, "not traceability"):
            sdd.validate(self.sdd_root, "structure")

    def test_hidden_source_dependency_is_rejected(self) -> None:
        self.make_current()
        spec_path = self.sdd_root / "specs/system.md"
        spec_path.write_text(
            spec_path.read_text(encoding="utf-8") + "\nThe remaining edge cases 参考原实现。\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(sdd.SddError, "hidden implementation/history dependency"):
            sdd.validate(self.sdd_root, "reconstruction")

    def test_explicit_assumption_marker_is_rejected(self) -> None:
        self.make_current()
        spec_path = self.sdd_root / "specs/system.md"
        spec_path.write_text(
            spec_path.read_text(encoding="utf-8") + "\nWe assume the input is ASCII.\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(sdd.SddError, "assumption marker"):
            sdd.validate(self.sdd_root, "reconstruction")

    def test_normative_assumption_prohibition_is_allowed(self) -> None:
        self.make_current()
        spec_path = self.sdd_root / "specs/system.md"
        spec_path.write_text(
            spec_path.read_text(encoding="utf-8")
            + "\nThe implementation must not assume that the input is ASCII.\n"
            + "实现不得假设输入为 ASCII。\n",
            encoding="utf-8",
        )
        sdd.validate(self.sdd_root, "reconstruction")

    def test_untraced_oracle_is_rejected(self) -> None:
        self.make_current()
        acceptance_path = self.sdd_root / "acceptance/system.md"
        acceptance_path.write_text(
            acceptance_path.read_text(encoding="utf-8")
            + "\n# ORACLE-SYSTEM-002 — Undeclared evaluator\n\nAn extra pass rule.\n",
            encoding="utf-8",
        )
        with self.assertRaisesRegex(sdd.SddError, "not traceability"):
            sdd.validate(self.sdd_root, "structure")

    def test_unknown_manifest_field_is_rejected(self) -> None:
        manifest_path = self.sdd_root / "manifest.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        manifest["historical_notes"] = "Old implementation details"
        manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
        with self.assertRaisesRegex(sdd.SddError, "unsupported fields"):
            sdd.validate(self.sdd_root, "structure")

    def test_asset_checksum_and_provenance_are_required(self) -> None:
        self.make_current()
        asset_path = self.sdd_root / "assets/fixture.bin"
        asset_path.parent.mkdir()
        asset_path.write_bytes(b"reconstruction fixture")
        manifest_path = self.sdd_root / "manifest.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        manifest["artifacts"].append(
            {
                "id": "ASSET-FIXTURE",
                "kind": "asset",
                "path": "assets/fixture.bin",
                "status": "current",
                "owner": "system",
                "sha256": hashlib.sha256(asset_path.read_bytes()).hexdigest(),
                "source": "Generated deterministic evaluator fixture",
                "license": "CC0-1.0",
            }
        )
        manifest["coverage"]["assets"] = {
            "status": "specified",
            "artifacts": ["ASSET-FIXTURE"],
        }
        manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
        context_path = self.sdd_root / "context/navigation.json"
        context = json.loads(context_path.read_text(encoding="utf-8"))
        context["routes"][1]["read"].append("ASSET-FIXTURE")
        context_path.write_text(json.dumps(context, indent=2) + "\n", encoding="utf-8")
        sdd.validate(self.sdd_root, "reconstruction")
        asset_path.write_bytes(b"tampered")
        with self.assertRaisesRegex(sdd.SddError, "checksum mismatch"):
            sdd.validate(self.sdd_root, "structure")

    def test_symlink_cannot_import_content_from_outside_root(self) -> None:
        outside = self.test_root / "outside.md"
        outside.write_text("historical source material\n", encoding="utf-8")
        (self.sdd_root / "specs/outside.md").symlink_to(outside)
        with self.assertRaisesRegex(sdd.SddError, "must not contain symlinks"):
            sdd.validate(self.sdd_root, "structure")

    def test_init_refuses_existing_target(self) -> None:
        with self.assertRaisesRegex(sdd.SddError, "already exists"):
            sdd.init_sdd(self.sdd_root, "another-system", "Another System")


if __name__ == "__main__":
    unittest.main()
