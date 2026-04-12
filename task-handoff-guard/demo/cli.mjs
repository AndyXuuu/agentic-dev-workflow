import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { createMockAdapter } from "./mock-adapter.mjs";

const stateFilePath = resolve(process.cwd(), ".tmp", "task-handoff-state.json");

function collectSignals(continuation, resumeInfo) {
  const signals = new Set(continuation.markerSources || []);
  if (resumeInfo.hasTaskResumeInfo) signals.add("task-resume-info");
  return [...signals];
}

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
  if (!continuation.hasActiveHookMarker && !resumeInfo.hasTaskResumeInfo) {
    return null;
  }
  if (state.activeTask) return state.activeTask;
  return {
    sessionId: "old-session",
    goal: resumeInfo.goal ?? "unknown older task",
    state: "unknown",
    allowResume: false,
    resumeSignals: collectSignals(continuation, resumeInfo),
    updatedAt: new Date().toISOString(),
  };
}

async function main() {
  const sessionID = process.argv[2] || "new-session";
  const newGoal = process.argv[3] || "New task goal";

  const output = { parts: [] };
  const adapter = createMockAdapter({
    onStop(stoppedSessionID) {
      output.parts.push({
        type: "text",
        text: `stopContinuation called for ${stoppedSessionID}`,
      });
    },
  });

  const continuation = await adapter.readContinuationMarker(sessionID);
  const resumeInfo = await adapter.readResumeInfo(sessionID);
  const state = await readState(stateFilePath);
  const oldTask = detectResumableOlderTask(continuation, resumeInfo, state);

  if (!oldTask) {
    const nextState = {
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
    };
    await writeState(stateFilePath, nextState);
    output.parts.push({ type: "text", text: "No older task detected. New task started." });
  } else {
    const choice = await adapter.promptChoice({
      title: "Detected resumable older task",
      oldTask: {
        goal: oldTask.goal,
        sessionId: oldTask.sessionId,
        resumeSignals: oldTask.resumeSignals,
        state: oldTask.state,
      },
    });

    if (choice === "continue-old-task") {
      output.parts.push({ type: "text", text: "Aborted new task. Continue old task." });
    } else if (choice === "stop-old-task-and-start-new") {
      adapter.stopContinuation(oldTask.sessionId);
      const nextState = {
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
      };
      await writeState(stateFilePath, nextState);
      output.parts.push({ type: "text", text: "Old task superseded. New task started." });
    } else {
      const nextState = {
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
      };
      await writeState(stateFilePath, nextState);
      output.parts.push({
        type: "text",
        text: "High-risk mode: old resumable task preserved while new task started.",
      });
    }
  }

  output.parts.forEach((part) => {
    if (part.text) console.log(part.text);
  });

  console.log(`\nState file: ${stateFilePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
