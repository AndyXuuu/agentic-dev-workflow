#!/usr/bin/env python3
"""Behavior tests for the experimental reconstruction SDD tool."""

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

    def test_draft_passes_structure_but_not_reconstruction(self) -> None:
        sdd.validate(self.sdd_root, "structure")
        with self.assertRaisesRegex(sdd.SddError, "unresolved placeholder"):
            sdd.validate(self.sdd_root, "reconstruction")

    def test_current_sdd_validates_and_bundles_deterministically(self) -> None:
        self.make_current()
        validated = sdd.validate(self.sdd_root, "reconstruction")
        self.assertEqual(set(validated.artifacts), {"SPEC-SYSTEM", "ARCH-SYSTEM", "ACCEPTANCE-SYSTEM", "TRACEABILITY"})

        first, first_digest = sdd.bundle_sdd(self.sdd_root, self.test_root / "first.zip")
        second, second_digest = sdd.bundle_sdd(self.sdd_root, self.test_root / "second.zip")
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
                    "sdd/manifest.json",
                    "sdd/specs/system.md",
                ],
            )

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
