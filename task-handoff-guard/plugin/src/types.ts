export interface TaskHandoffPluginOptions {
  stateFilePath?: string;
}

export interface CommandExecuteBeforeInput {
  command: string;
  sessionID: string;
  arguments: string;
}

export interface CommandExecuteBeforeOutput {
  parts: Array<{
    type: string;
    text?: string;
    [key: string]: unknown;
  }>;
}

export interface StopContinuationGuardLike {
  stop(sessionID: string): void;
  isStopped(sessionID: string): boolean;
  clear(sessionID: string): void;
}

export interface HandoffPromptResult {
  choice:
    | "continue-old-task"
    | "stop-old-task-and-start-new"
    | "keep-old-task-and-continue-new-high-risk";
}
