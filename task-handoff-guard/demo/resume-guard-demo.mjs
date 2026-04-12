import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const stateFilePath = resolve(process.cwd(), ".tmp", "task-handoff-resume-demo-state.json");

async function writeState(filePath, state) {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(state, null, 2) + "\n", "utf8");
}

async function readState(filePath) {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return { version: 1, activeTask: null, supersededTasks: [] };
  }
}

async function canResumeTask(taskSessionId) {
  const state = await readState(stateFilePath);
  const active = state.activeTask?.sessionId === taskSessionId ? state.activeTask : null;
  const old = (state.supersededTasks || []).find((task) => task.sessionId === taskSessionId) ?? null;
  const task = active ?? old;

  if (!task) {
    return { allowed: false, reason: "unknown task state" };
  }
  if (task.state === "superseded" || task.state === "stopped") {
    return { allowed: false, reason: `task is ${task.state}` };
  }
  if (!task.allowResume) {
    return { allowed: false, reason: "resume not allowed" };
  }
  return { allowed: true };
}

async function main() {
  const mode = process.argv[2] || "superseded";
  const taskSessionId = process.argv[3] || "old-session";

  if (mode === "seed-active") {
    await writeState(stateFilePath, {
      version: 1,
      activeTask: {
        sessionId: taskSessionId,
        goal: "Current active task",
        state: "active",
        allowResume: true,
        resumeSignals: ["todo"],
        updatedAt: new Date().toISOString(),
      },
      supersededTasks: [],
    });
    console.log(`Seeded active task for ${taskSessionId}`);
    console.log(`State file: ${stateFilePath}`);
    return;
  }

  if (mode === "seed-superseded") {
    await writeState(stateFilePath, {
      version: 1,
      activeTask: null,
      supersededTasks: [
        {
          sessionId: taskSessionId,
          goal: "Older superseded task",
          state: "superseded",
          allowResume: false,
          resumeSignals: ["todo", "task-resume-info"],
          updatedAt: new Date().toISOString(),
        },
      ],
    });
    console.log(`Seeded superseded task for ${taskSessionId}`);
    console.log(`State file: ${stateFilePath}`);
    return;
  }

  const result = await canResumeTask(taskSessionId);
  console.log(JSON.stringify(result, null, 2));
  console.log(`State file: ${stateFilePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
