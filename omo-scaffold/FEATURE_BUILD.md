# Building an oMo Feature

This document captures the generic build pattern for implementing new oMo/OpenCode features.

It is intentionally framework-oriented.
It is not the place for project-specific problem modules.

## Boundary rule

### Keep in project-specific module

If the content is about a specific problem in this repository, keep it in that feature module.

Examples:

- incident notes
- problem statement
- feature-specific flow
- feature-specific summary

### Keep in `omo-scaffold/`

If the content is about how to build oMo/OpenCode functionality in general, put it here.

Examples:

- how to start a feature module
- how to design an MVP skeleton
- how to design a hook-ready sketch
- how to decide between demo, skeleton, and plugin scaffold
- how to structure plugin/agent/skill/command additions

## Recommended build progression

### 1. Problem definition

Create a feature module only when the problem is specific to the project.

Typical files:

- `README.md`
- `INCIDENT.md`
- `SUMMARY.md`
- `PLAN.md`

### 2. Flow and decision boundary

Add only the minimum design files needed to make the feature understandable.

Examples:

- `FLOW.md`
- `STATE_MACHINE.md`
- `PSEUDOCODE.md`

Do not add all of these by default unless they provide distinct value.

### 3. MVP skeleton

Add an `mvp/` skeleton only when there is clear benefit in testing structure before real integration.

The skeleton should answer:

- what state exists
- what decision points exist
- what integration surfaces exist

### 4. Demo validation

Add a `demo/` only when interaction or behavior needs to be validated before real integration.

Good use cases:

- command confirmation flow
- state transition validation
- resume denial behavior

Avoid adding multiple demos if one demo can validate the key behavior.

### 5. Plugin scaffold

Add a `plugin/` scaffold only when there is a concrete future integration path.

It should be explicit whether the plugin is:

- scaffold only
- hook-ready sketch
- real implementation

## Design pressure rule

Always prefer:

- planning
- summarization
- clear structure
- bounded implementation

over:

- early full implementation
- duplicate parallel logic
- speculative APIs
- excess demo proliferation

## Decision checklist

Before adding a new file, ask:

1. Is this file project-specific or framework-generic?
2. Does it reduce ambiguity, or just increase surface area?
3. Is it replacing missing understanding, or merely expanding code volume?
4. Would a lighter document or summary be sufficient?

If the answer is weak, do not add the file yet.
