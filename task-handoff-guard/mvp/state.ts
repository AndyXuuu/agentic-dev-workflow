import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { ActiveTaskSnapshot, TaskHandoffState } from "./types";

export const EMPTY_STATE: TaskHandoffState = {
  version: 1,
  activeTask: null,
  supersededTasks: [],
};

export async function readTaskHandoffState(filePath: string): Promise<TaskHandoffState> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as TaskHandoffState;
    return {
      version: 1,
      activeTask: parsed.activeTask ?? null,
      supersededTasks: parsed.supersededTasks ?? [],
    };
  } catch {
    return EMPTY_STATE;
  }
}

export async function writeTaskHandoffState(filePath: string, state: TaskHandoffState): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(state, null, 2) + "\n", "utf8");
}

export async function setActiveTask(filePath: string, task: ActiveTaskSnapshot): Promise<TaskHandoffState> {
  const state = await readTaskHandoffState(filePath);
  const next: TaskHandoffState = {
    ...state,
    activeTask: task,
  };
  await writeTaskHandoffState(filePath, next);
  return next;
}

export async function markSuperseded(
  filePath: string,
  oldTask: ActiveTaskSnapshot,
  supersededBy: string,
): Promise<TaskHandoffState> {
  const state = await readTaskHandoffState(filePath);
  const superseded: ActiveTaskSnapshot = {
    ...oldTask,
    state: "superseded",
    allowResume: false,
    supersededBy,
    updatedAt: new Date().toISOString(),
  };

  const next: TaskHandoffState = {
    ...state,
    activeTask:
      state.activeTask?.sessionId === oldTask.sessionId
        ? null
        : state.activeTask ?? null,
    supersededTasks: [...state.supersededTasks, superseded],
  };
  await writeTaskHandoffState(filePath, next);
  return next;
}

export function findTaskSnapshot(state: TaskHandoffState, sessionId: string): ActiveTaskSnapshot | null {
  if (state.activeTask?.sessionId === sessionId) return state.activeTask;
  return state.supersededTasks.find((task) => task.sessionId === sessionId) ?? null;
}
