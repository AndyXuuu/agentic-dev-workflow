import { beforeHandoff, applyHandoffChoice } from "./preflight";
import { setActiveTask } from "./state";
import type {
  ContinuationState,
  HandoffChoice,
  ResumeInfo,
  TaskHandoffState,
} from "./types";

/**
 * Hook-ready integration sketch.
 *
 * This file intentionally stays one step below a real oMo plugin implementation.
 * It shows how the current MVP skeleton would be wired into:
 * - command-execute-before interception
 * - stop-continuation semantics
 * - continuation marker inspection
 * - task handoff state persistence
 */

export interface HandoffGuardAdapter {
  readContinuationMarker(sessionID: string): Promise<ContinuationState>;
  readResumeInfo(sessionID: string): Promise<ResumeInfo>;
  stopContinuation(sessionID: string): void;
  promptChoice(args: {
    title: string;
    oldTask: {
      goal: string;
      sessionId: string;
      resumeSignals: string[];
      state: string;
    };
  }): Promise<HandoffChoice>;
  appendOutputText(output: { parts: Array<{ type: string; text?: string }> }, text: string): void;
}

export interface CommandExecuteBeforeInputLike {
  command: string;
  sessionID: string;
  arguments: string;
}

export interface CommandExecuteBeforeOutputLike {
  parts: Array<{ type: string; text?: string; [key: string]: unknown }>;
}

export interface HandoffGuardOptions {
  stateFilePath: string;
}

export function createHandoffGuard(options: HandoffGuardOptions, adapter: HandoffGuardAdapter) {
  return {
    async commandExecuteBefore(
      input: CommandExecuteBeforeInputLike,
      output: CommandExecuteBeforeOutputLike,
    ): Promise<void> {
      if (normalizeCommand(input.command) !== "handoff") {
        return;
      }

      const continuation = await adapter.readContinuationMarker(input.sessionID);
      const resumeInfo = await adapter.readResumeInfo(input.sessionID);

      const preflight = await beforeHandoff(
        {
          sessionId: input.sessionID,
          stateFilePath: options.stateFilePath,
        },
        continuation,
        resumeInfo,
      );

      if (preflight.allowed || !preflight.oldTask || !preflight.choiceRequired) {
        return;
      }

      const choice = await adapter.promptChoice({
        title: "Detected resumable older task",
        oldTask: {
          goal: preflight.oldTask.goal,
          sessionId: preflight.oldTask.sessionId,
          resumeSignals: preflight.oldTask.resumeSignals,
          state: preflight.oldTask.state,
        },
      });

      const decision = await applyHandoffChoice(
        {
          sessionId: input.sessionID,
          stateFilePath: options.stateFilePath,
        },
        choice,
        preflight.oldTask.sessionId,
        async (sessionId) => {
          adapter.stopContinuation(sessionId);
        },
      );

      if (!decision.allowed) {
        adapter.appendOutputText(output, decision.warning ?? "handoff blocked");
        return;
      }

      if (choice === "keep-old-task-and-continue-new-high-risk" && decision.warning) {
        adapter.appendOutputText(output, decision.warning);
      }
    },

    async startNewPrimaryTask(args: {
      sessionID: string;
      goal: string;
      resumeSignals?: string[];
      allowResume?: boolean;
      taskId?: string;
    }): Promise<TaskHandoffState> {
      return setActiveTask(options.stateFilePath, {
        sessionId: args.sessionID,
        taskId: args.taskId,
        goal: args.goal,
        state: "active",
        allowResume: args.allowResume ?? true,
        resumeSignals: args.resumeSignals ?? [],
        supersededBy: null,
        updatedAt: new Date().toISOString(),
      });
    },
  };
}

function normalizeCommand(command: string): string {
  return command.replace(/^\//, "").trim().toLowerCase();
}
