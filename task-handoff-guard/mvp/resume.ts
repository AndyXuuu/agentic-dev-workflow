import { findTaskSnapshot, readTaskHandoffState } from "./state";
import type { ResumeCheckResult } from "./types";

export async function canResumeTask(
  stateFilePath: string,
  taskSessionId: string,
): Promise<ResumeCheckResult> {
  const state = await readTaskHandoffState(stateFilePath);
  const task = findTaskSnapshot(state, taskSessionId);

  if (!task) {
    return {
      allowed: false,
      reason: "unknown task state",
    };
  }

  if (task.state === "superseded" || task.state === "stopped") {
    return {
      allowed: false,
      reason: `task is ${task.state}`,
    };
  }

  if (!task.allowResume) {
    return {
      allowed: false,
      reason: "resume not allowed",
    };
  }

  return { allowed: true };
}
