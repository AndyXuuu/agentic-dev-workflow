import type { ContinuationState, ResumeInfo } from "./types";

export interface OmoAdapter {
  readContinuationState(sessionId: string): Promise<ContinuationState>;
  readTaskResumeInfo(sessionId: string): Promise<ResumeInfo>;
  stopContinuation(sessionId: string): Promise<void>;
}

/**
 * Placeholder adapter shape for future integration.
 *
 * The MVP intentionally leaves actual oMo/OpenCode hook wiring outside this
 * skeleton. This keeps the repository design-first while giving a concrete
 * implementation target.
 */
