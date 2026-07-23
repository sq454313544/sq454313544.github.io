import type { AgentClient, AgentRunRequest, AgentEvent } from "./types";

export function createAgentClient(): AgentClient {
  return {
    async listAgents() {
      throw new Error("Agent client is not implemented");
    },
    async *runAgent(_request: AgentRunRequest): AsyncIterable<AgentEvent> {
      throw new Error("Agent client is not implemented");
    },
    async cancelRun(_runId: string) {
      throw new Error("Agent client is not implemented");
    },
  };
}
