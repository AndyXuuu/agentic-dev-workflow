import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const stateFilePath = resolve(process.cwd(), ".tmp", "task-handoff-hook-demo-state.json");

async function readState(filePath) {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      version: 1,
      activeTask: parsed.activeTask ?? null,
      supersededTasks: parsed.supersededTasks ?? [],
    };
  } catch {
    return { version: 1, activeTask: null, supersededTasks: [] };
  }
}

async function writeState(filePath, state) {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(state, null, 2) + "\n", "utf8");
}

function detectResumableOlderTask(continuation, resumeInfo, state) {
  if (!continuation.hasActiveHookMarker && !resumeInfo.hasTaskResumeInfo) return null;
  if (state.activeTask) return state.activeTask;
  return {
    sessionId: "old-session",
    goal: resumeInfo.goal ?? "unknown older task",
    state: "unknown",
    allowResume: false,
    resumeSignals: [...new Set([...(continuation.markerSources || []), ...(resumeInfo.hasTaskResumeInfo ? ["task-resume-info"] : [])])],
    updatedAt: new Date().toISOString(),
  };
}

function createAdapter() {
  return {
    async readContinuationMarker(sessionID) {
      return {
        hasActiveHookMarker: true,
        markerSources: ["todo"],
        state: "active",
        sessionID,
      };
    },
    async readResumeInfo() {
      return {
        hasTaskResumeInfo: true,
        goal: "Older unfinished task",
      };
    },
    stopContinuation(sessionID) {
      console.log(`[guard] stopContinuation(${sessionID})`);
    },
    async promptChoice({ oldTask }) {
      const rl = createInterface({ input, output });
      try {
        console.log("Detected resumable older task before /handoff");
        console.log(`- Goal: ${oldTask.goal}`);
        console.log(`- Session: ${oldTask.sessionId}`);
        console.log(`- Signals: ${oldTask.resumeSignals.join(", ") || "none"}`);
        console.log("\n1) continue-old-task");
        console.log("2) stop-old-task-and-start-new");
        console.log("3) keep-old-task-and-continue-new-high-risk\n");
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

async function main() {
  const command = process.argv[2] || "/handoff";
  const sessionID = process.argv[3] || "new-session";
  const newGoal = process.argv[4] || "New handoff target";

  const adapter = createAdapter();
  const commandInput = { command, sessionID, arguments: newGoal };
  const commandOutput = { parts: [] };

  if (!command.replace(/^\//, "").trim().toLowerCase().includes("handoff")) {
    console.log("Non-handoff command: no guard action taken.");
    return;
  }

  const continuation = await adapter.readContinuationMarker(sessionID);
  const resumeInfo = await adapter.readResumeInfo(sessionID);
  const state = await readState(stateFilePath);
  const oldTask = detectResumableOlderTask(continuation, resumeInfo, state);

  if (!oldTask) {
    await writeState(stateFilePath, {
      version: 1,
      activeTask: {
        sessionId: sessionID,
        goal: newGoal,
        state: "active",
        allowResume: true,
        resumeSignals: [],
        updatedAt: new Date().toISOString(),
      },
      supersededTasks: state.supersededTasks,
    });
    console.log("No resumable older task detected.");
    console.log(`State file: ${stateFilePath}`);
    return;
  }

  const choice = await adapter.promptChoice({ oldTask });

  if (choice === "continue-old-task") {
    adapter.appendOutputText(commandOutput, "handoff blocked; continue old task");
  } else if (choice === "stop-old-task-and-start-new") {
    adapter.stopContinuation(oldTask.sessionId);
    await writeState(stateFilePath, {
      version: 1,
      activeTask: {
        sessionId: sessionID,
        goal: newGoal,
        state: "active",
        allowResume: true,
        resumeSignals: [],
        updatedAt: new Date().toISOString(),
      },
      supersededTasks: [
        ...state.supersededTasks,
        {
          ...oldTask,
          state: "superseded",
          allowResume: false,
          supersededBy: sessionID,
          updatedAt: new Date().toISOString(),
        },
      ],
    });
    adapter.appendOutputText(commandOutput, "old task superseded; handoff may continue");
  } else {
    await writeState(stateFilePath, {
      version: 1,
      activeTask: {
        sessionId: sessionID,
        goal: newGoal,
        state: "active",
        allowResume: true,
        resumeSignals: ["high-risk-parallel"],
        updatedAt: new Date().toISOString(),
      },
      supersededTasks: state.supersededTasks,
    });
    adapter.appendOutputText(commandOutput, "high-risk parallel mode accepted");
  }

  for (const part of commandOutput.parts) {
    if (part.text) console.log(part.text);
  }
  console.log(`State file: ${stateFilePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
