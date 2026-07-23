export interface AgentSummary {
  id: string;
  name: string;
  description: string;
  status: "coming_soon" | "available" | "offline";
}

export interface AgentRunRequest {
  agentId: string;
  message: string;
  sessionId?: string;
}

export type AgentEvent =
  | { type: "run_started"; runId: string }
  | { type: "status"; message: string }
  | { type: "token"; content: string }
  | { type: "usage"; inputTokens: number; outputTokens: number }
  | { type: "limit_reached"; message: string }
  | { type: "error"; message: string }
  | { type: "run_completed"; runId: string };

export interface AgentClient {
  listAgents(): Promise<AgentSummary[]>;
  runAgent(request: AgentRunRequest): AsyncIterable<AgentEvent>;
  cancelRun(runId: string): Promise<void>;
}
