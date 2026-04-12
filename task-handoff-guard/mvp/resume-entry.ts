import { canResumeTask } from "./resume";

export interface ResumeEntryOptions {
  stateFilePath: string;
}

export interface ResumeAttemptInput {
  sessionID: string;
}

export interface ResumeAttemptOutput {
  allowed: boolean;
  reason?: string;
}

/**
 * Hook-ready resume guard sketch.
 *
 * This is a narrow adapter around canResumeTask() so a future oMo integration
 * can block stale continuation before old work resumes.
 */
export function createResumeGuard(options: ResumeEntryOptions) {
  return async function onResumeAttempt(input: ResumeAttemptInput): Promise<ResumeAttemptOutput> {
    const result = await canResumeTask(options.stateFilePath, input.sessionID);
    if (!result.allowed) {
      return {
        allowed: false,
        reason: result.reason ?? "resume denied",
      };
    }

    return { allowed: true };
  };
}
