import { createHandoffGuard } from "../../mvp/integration.js";
import type {
  CommandExecuteBeforeInput,
  CommandExecuteBeforeOutput,
  HandoffPromptResult,
  StopContinuationGuardLike,
  TaskHandoffPluginOptions,
} from "./types.js";

/**
 * Plugin scaffold only.
 *
 * This does not claim to be installable as-is.
 * It is a structured bridge between the design docs, MVP skeleton, and a future
 * real oMo plugin implementation.
 */
export function createTaskHandoffGuardPlugin(args: {
  stopContinuationGuard: StopContinuationGuardLike;
  adapter: {
    readContinuationMarker(sessionID: string): Promise<{
      hasActiveHookMarker: boolean;
      markerSources: string[];
      state?: "none" | "idle" | "active" | "stopped";
    }>;
    readResumeInfo(sessionID: string): Promise<{
      hasTaskResumeInfo: boolean;
      goal?: string;
    }>;
    promptChoice(args: {
      title: string;
      oldTask: {
        goal: string;
        sessionId: string;
        resumeSignals: string[];
        state: string;
      };
    }): Promise<HandoffPromptResult["choice"]>;
  };
  options?: TaskHandoffPluginOptions;
}) {
  const stateFilePath = args.options?.stateFilePath ?? ".sisyphus/task-handoff-state.json";
  const handoffGuard = createHandoffGuard(
    { stateFilePath },
    {
      readContinuationMarker: args.adapter.readContinuationMarker,
      readResumeInfo: args.adapter.readResumeInfo,
      stopContinuation(sessionID: string) {
        args.stopContinuationGuard.stop(sessionID);
      },
      promptChoice: args.adapter.promptChoice,
      appendOutputText(output, text) {
        output.parts.push({ type: "text", text });
      },
    },
  );

  return {
    name: "task-handoff-guard",

    async commandExecuteBefore(
      input: CommandExecuteBeforeInput,
      output: CommandExecuteBeforeOutput,
    ): Promise<void> {
      await handoffGuard.commandExecuteBefore(input, output);
    },

    api: {
      stateFilePath,
      startNewPrimaryTask: handoffGuard.startNewPrimaryTask,
      stop(sessionID: string) {
        args.stopContinuationGuard.stop(sessionID);
      },
      isStopped(sessionID: string) {
        return args.stopContinuationGuard.isStopped(sessionID);
      },
      clear(sessionID: string) {
        args.stopContinuationGuard.clear(sessionID);
      },
    },
  };
}
