# Adding a Command

## When this applies

Use this when behavior should be invoked through a deliberate command boundary such as `/handoff`, `/stop-continuation`, or a custom command.

## Good command use cases

- explicit mode switch
- explicit task handoff
- explicit cleanup / stop behavior
- explicit initialization / generation
- explicit navigation artifact management (example: `/rnt -r`)

## Questions to answer

- Why should this be a command instead of a normal prompt?
- Should it be interceptable before execution?
- Is it a user-facing control surface or an internal helper?

## Implementation guidance

- prefer integrating with an existing built-in command if semantics already exist
- intercept before execution when safety matters
- avoid adding commands that duplicate an existing one with a different name

## Do not

- add commands for passive concepts
- bypass existing stop/cleanup commands if they already exist
