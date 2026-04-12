# Adding an Agent

## When this applies

Use this for custom agents placed under OpenCode agent directories or for repo-level agent design.

## Preferred shape

For Markdown-configured agents:

```text
<target>/agents/
  my-agent.md
```

## Minimum fields

- `description`
- `mode`
- `model`
- permissions
- concise role instructions

## Design guidance

- give each agent one narrow job
- separate implementation agents from review agents
- separate review agents from polish/refinement agents
- keep prompts operational, not essay-style

## Good patterns

- builder / review / polish
- explore / summarize
- implement / validate

## Do not

- merge unrelated jobs into one agent
- bury critical constraints in long prose
- rely on implicit model routing when explicit model choice matters
