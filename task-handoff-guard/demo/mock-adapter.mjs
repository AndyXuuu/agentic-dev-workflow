import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export function createMockAdapter(options = {}) {
  const {
    continuation = {
      hasActiveHookMarker: true,
      markerSources: ["todo"],
      state: "active",
    },
    resumeInfo = {
      hasTaskResumeInfo: true,
      goal: "Older unfinished task",
    },
    onStop = () => {},
  } = options;

  return {
    async readContinuationMarker() {
      return continuation;
    },

    async readResumeInfo() {
      return resumeInfo;
    },

    stopContinuation(sessionID) {
      onStop(sessionID);
    },

    async promptChoice({ title, oldTask }) {
      const rl = createInterface({ input, output });
      try {
        output.write(`\n${title}\n`);
        output.write(`- Goal: ${oldTask.goal}\n`);
        output.write(`- Session: ${oldTask.sessionId}\n`);
        output.write(`- Signals: ${oldTask.resumeSignals.join(", ") || "none"}\n\n`);
        output.write("1) continue-old-task\n");
        output.write("2) stop-old-task-and-start-new\n");
        output.write("3) keep-old-task-and-continue-new-high-risk\n\n");
        const answer = await rl.question("Choose [1/2/3]: ");
        if (answer.trim() === "1") return "continue-old-task";
        if (answer.trim() === "3") return "keep-old-task-and-continue-new-high-risk";
        return "stop-old-task-and-start-new";
      } finally {
        rl.close();
      }
    },

    appendOutputText(commandOutput, text) {
      commandOutput.parts.push({ type: "text", text });
    },
  };
}
