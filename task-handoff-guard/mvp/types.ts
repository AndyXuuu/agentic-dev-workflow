export type TaskState = "active" | "stopped" | "superseded" | "unknown";

export type HandoffChoice =
  | "continue-old-task"
  | "stop-old-task-and-start-new"
  | "keep-old-task-and-continue-new-high-risk";

export interface ActiveTaskSnapshot {
  sessionId: string;
  taskId?: string;
  goal: string;
  state: TaskState;
  allowResume: boolean;
  resumeSignals: string[];
  updatedAt: string;
  supersededBy?: string | null;
}

export interface TaskHandoffState {
  version: 1;
  activeTask?: ActiveTaskSnapshot | null;
  supersededTasks: ActiveTaskSnapshot[];
}

export interface ContinuationState {
  hasActiveHookMarker: boolean;
  markerSources: string[];
  state?: "none" | "idle" | "active" | "stopped";
}

export interface ResumeInfo {
  hasTaskResumeInfo: boolean;
  goal?: string;
}

export interface PreflightContext {
  sessionId: string;
  stateFilePath: string;
}

export interface PreflightResult {
  allowed: boolean;
  reason?: string;
  oldTask?: ActiveTaskSnapshot;
  choiceRequired?: boolean;
}

export interface ResumeCheckResult {
  allowed: boolean;
  reason?: string;
}
