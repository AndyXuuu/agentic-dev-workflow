import { detectResumableOlderTask } from "./decision";
import { markSuperseded, readTaskHandoffState } from "./state";
import type {
  ContinuationState,
  HandoffChoice,
  PreflightContext,
  PreflightResult,
  ResumeInfo,
} from "./types";

export async function beforeHandoff(
  ctx: PreflightContext,
  continuation: ContinuationState,
  resumeInfo: ResumeInfo,
): Promise<PreflightResult> {
  const state = await readTaskHandoffState(ctx.stateFilePath);
  const oldTask = detectResumableOlderTask(continuation, resumeInfo, state);

  if (!oldTask) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: "resumable older task detected",
    oldTask,
    choiceRequired: true,
  };
}

export async function applyHandoffChoice(
  ctx: PreflightContext,
  choice: HandoffChoice,
  oldTaskSessionId: string,
  stopContinuation: (sessionId: string) => Promise<void>,
): Promise<{ allowed: boolean; warning?: string }> {
  const state = await readTaskHandoffState(ctx.stateFilePath);
  const oldTask = state.activeTask?.sessionId === oldTaskSessionId ? state.activeTask : null;

  if (choice === "continue-old-task") {
    return {
      allowed: false,
      warning: "new handoff aborted; continue old task",
    };
  }

  if (choice === "stop-old-task-and-start-new") {
    if (oldTask) {
      await stopContinuation(oldTask.sessionId);
      await markSuperseded(ctx.stateFilePath, oldTask, ctx.sessionId);
    }
    return { allowed: true };
  }

  return {
    allowed: true,
    warning: "continuing with new task while older resumable task remains active",
  };
}
