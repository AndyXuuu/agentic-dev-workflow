# Task Handoff Guard Pseudocode

## State shape

```ts
type TaskState = "active" | "stopped" | "superseded" | "unknown"

interface ActiveTaskSnapshot {
  sessionId: string
  taskId?: string
  goal: string
  state: TaskState
  allowResume: boolean
  resumeSignals: string[]
  updatedAt: string
  supersededBy?: string | null
}

interface TaskHandoffState {
  version: 1
  activeTask?: ActiveTaskSnapshot | null
  supersededTasks: ActiveTaskSnapshot[]
}
```

## Preflight handoff check

```ts
async function beforeHandoff(ctx: Context) {
  const continuation = await readContinuationState(ctx)
  const resumeInfo = await readTaskResumeInfo(ctx)
  const state = await readTaskHandoffState(ctx)

  const oldTask = detectResumableOlderTask(continuation, resumeInfo, state)
  if (!oldTask) return allow()

  const choice = await promptUser({
    title: "Detected resumable older task",
    oldTask,
    options: [
      "continue-old-task",
      "stop-old-task-and-start-new",
      "keep-old-task-and-continue-new-high-risk"
    ]
  })

  if (choice === "continue-old-task") {
    return denyNewHandoffAndResumeOld(oldTask)
  }

  if (choice === "stop-old-task-and-start-new") {
    await stopContinuation(ctx.sessionId)
    await markSuperseded(state, oldTask, ctx.sessionId)
    return allow()
  }

  if (choice === "keep-old-task-and-continue-new-high-risk") {
    await recordConflictChoice(state, oldTask, ctx.sessionId)
    return allowWithWarning()
  }
}
```

## Resume eligibility check

```ts
async function canResumeTask(ctx: Context, taskSessionId: string) {
  const state = await readTaskHandoffState(ctx)
  const task = findTaskSnapshot(state, taskSessionId)

  if (!task) {
    return {
      allowed: false,
      reason: "unknown task state"
    }
  }

  if (task.state === "superseded" || task.state === "stopped") {
    return {
      allowed: false,
      reason: `task is ${task.state}`
    }
  }

  if (!task.allowResume) {
    return {
      allowed: false,
      reason: "resume not allowed"
    }
  }

  return { allowed: true }
}
```

## Conservative fallback

```ts
function detectResumableOlderTask(
  continuation: ContinuationState,
  resumeInfo: ResumeInfo,
  state: TaskHandoffState
) {
  if (!continuation.hasActiveHookMarker && !resumeInfo.hasTaskResumeInfo) {
    return null
  }

  if (!state.activeTask) {
    return {
      goal: resumeInfo.goal ?? "unknown older task",
      state: "unknown",
      resumeSignals: collectSignals(continuation, resumeInfo)
    }
  }

  return state.activeTask
}
```

## MVP implementation note

For v1, the best entrypoint is:

- intercept `/handoff` using a pre-command hook

Not recommended for v1:

- automatic prompt-level task switching detection
- aggressive heuristics about user intent changes
- multi-active-task scheduling
