# OpenCode + oh-my-opencode OpenAI-only Setup Snapshot

This document captures the current working setup and is designed so a brand-new computer can reproduce it.

## Goal

- Use **OpenCode** with **oh-my-opencode 3.16.0**
- Use **OpenAI-only** models
- Remove **Pencil**
- Add **Marksman Markdown LSP**
- Add **Playwright MCP** for browser verification
- Add a **frontend replacement workflow** without Pencil:
  - `frontend-builder`
  - `frontend-review`
  - `frontend-polish`

## Files to create or replace on a new machine

- `~/.config/opencode/opencode.json`
- `~/.config/opencode/oh-my-openagent.json`
- `~/.config/opencode/agents/frontend-builder.md`
- `~/.config/opencode/agents/frontend-review.md`
- `~/.config/opencode/agents/frontend-polish.md`

## OpenCode config

See `config/opencode.json`.

## Model orchestration

See `config/oh-my-openagent.json`.

Key routing:

- `hephaestus`: `openai/gpt-5.4 medium`
- `oracle`: `openai/gpt-5.4 high`
- `sisyphus/prometheus/metis`: `openai/gpt-5.4 xhigh`
- `librarian/momus/writing`: `openai/gpt-5.2 medium`
- `explore/atlas/quick/unspecified-low`: `openai/gpt-5.3-codex-spark low`
- `visual-engineering/deep/artistry/unspecified-high`: `openai/gpt-5.4 medium`
- `ultrabrain`: `openai/gpt-5.4 xhigh`

## Frontend replacement chain

- `frontend-builder` → implementation
- `frontend-review` → review
- `frontend-polish` → final-pass refinement

Browser verification is handled by Playwright MCP.

Markdown editing intelligence is handled by `marksman`.

## Reproduction prompt for AI on a new machine

```text
Reproduce my OpenCode + oh-my-opencode setup exactly.

Use these requirements:

1. OpenCode config must be OpenAI-only.
2. Pin plugin version to oh-my-opencode@3.16.0.
3. Remove Pencil entirely.
4. Enable Markdown LSP using:
   ["marksman"]
   for extensions [".md", ".mdx"]
5. Enable Playwright MCP via local MCP config using:
   ["npx", "-y", "@playwright/mcp@latest"]
6. Create ~/.config/opencode/agents/ if it does not exist.
7. Create these files exactly:
   - ~/.config/opencode/opencode.json
   - ~/.config/opencode/oh-my-openagent.json
   - ~/.config/opencode/agents/frontend-builder.md
   - ~/.config/opencode/agents/frontend-review.md
   - ~/.config/opencode/agents/frontend-polish.md
8. Use this model routing:
   - hephaestus: openai/gpt-5.4 medium
   - oracle: openai/gpt-5.4 high
   - sisyphus/prometheus/metis: openai/gpt-5.4 xhigh
   - librarian/momus/writing: openai/gpt-5.2 medium
   - explore/atlas/quick/unspecified-low: openai/gpt-5.3-codex-spark low
   - visual-engineering/deep/artistry/unspecified-high: openai/gpt-5.4 medium
   - ultrabrain: openai/gpt-5.4 xhigh
9. build and plan must allow task delegation to frontend-* agents.
10. frontend-builder must allow task delegation to frontend-review and frontend-polish.
11. The frontend agent prompts must explicitly require browser verification when browser tooling is available, and must say so if only code review was possible.

After creating the files, read them back and verify the final contents are correct.
```

## Security note

This repository intentionally excludes API keys, OAuth tokens, `auth.json`, and runtime caches.

## Extra installation note

Install Marksman on machines that will use this config:

```bash
brew install marksman
```
