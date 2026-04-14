# Summary

## Main conclusion

The underlying problem is broader than `/handoff`.

The real issue is unsafe continuation switching:

- older resumable work stays alive
- newer intent starts
- boundaries between the two are not explicit enough
- older work may resume later and conflict with current work

## What this module should do

This module should preserve the problem definition and boundary expectations for this specific issue.

## What this module should not do

It should not continue expanding into a generic implementation playground.

That generic build knowledge belongs in `omo-scaffold/`.

## Practical rule

Keep this module small and problem-focused.

Only retain content that helps answer:

- what the continuation switching problem is
- why it matters
- what future implementation must avoid
