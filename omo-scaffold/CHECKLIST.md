# Scaffold Checklist

Use this before adding a new plugin, agent, skill, or command.

## 1. Scope

- Is this a plugin?
- Is this an agent?
- Is this a skill?
- Is this a command?

If more than one applies, decide the primary boundary first.

## 2. Existing integration points

- Which current hook/command/tool already exists?
- What state can be reused instead of duplicated?
- What user behavior already exists that this should align with?

## 3. Delivery stage

- design doc only
- MVP skeleton
- hook-ready sketch
- runnable demo
- real implementation

Write the current stage explicitly.

## 4. Unknowns

- What is still unproven?
- What evidence is missing?
- What must not be guessed?

## 5. Repository placement

- Does it need its own module directory?
- Should it be indexed from `.repo-nav/`?
- Should README link to it?

## 6. Safety

- Does it affect continuation/resume behavior?
- Does it need stop/cleanup handling?
- Does it need explicit user confirmation?
