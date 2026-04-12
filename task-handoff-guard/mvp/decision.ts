import type { ActiveTaskSnapshot, ContinuationState, ResumeInfo, TaskHandoffState } from "./types";

export function collectSignals(continuation: ContinuationState, resumeInfo: ResumeInfo): string[] {
  const signals = new Set<string>();
  for (const source of continuation.markerSources) signals.add(source);
  if (resumeInfo.hasTaskResumeInfo) signals.add("task-resume-info");
  return [...signals];
}

export function detectResumableOlderTask(
  continuation: ContinuationState,
  resumeInfo: ResumeInfo,
  state: TaskHandoffState,
): ActiveTaskSnapshot | null {
  if (!continuation.hasActiveHookMarker && !resumeInfo.hasTaskResumeInfo) {
    return null;
  }

  if (state.activeTask) {
    return state.activeTask;
  }

  return {
    sessionId: "unknown-session",
    goal: resumeInfo.goal ?? "unknown older task",
    state: "unknown",
    allowResume: false,
    resumeSignals: collectSignals(continuation, resumeInfo),
    updatedAt: new Date().toISOString(),
  };
}
