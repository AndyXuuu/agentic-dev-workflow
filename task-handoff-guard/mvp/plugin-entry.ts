import { createHandoffGuard, type CommandExecuteBeforeInputLike, type CommandExecuteBeforeOutputLike, type HandoffGuardAdapter } from "./integration";

export interface PluginEntryOptions {
  stateFilePath: string;
  adapter: HandoffGuardAdapter;
}

/**
 * Narrow entrypoint shaped like a future oMo command-execute-before hook.
 *
 * This keeps the integration one step away from the real plugin object while
 * making the intended wiring explicit.
 */
export function createCommandExecuteBeforeHandoffGuard(options: PluginEntryOptions) {
  const guard = createHandoffGuard({ stateFilePath: options.stateFilePath }, options.adapter);

  return async function onCommandExecuteBefore(
    input: CommandExecuteBeforeInputLike,
    output: CommandExecuteBeforeOutputLike,
  ): Promise<void> {
    await guard.commandExecuteBefore(input, output);
  };
}
