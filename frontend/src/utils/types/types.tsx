export type Role = "user" | "assistant" | "system";

export type Session = {
    id: string;
    name: string;
    startedAt: number;
  };

export type SessionSelectorProps = {
    sessions: Session[];
    selectedSession: string;
    onSelectSession: (sessionId: string) => void;
};

export interface Message {
  id?: number;       // auto-increment
  sessionId: string; // FK-like
  role: Role;
  content: string;
  ts: number;        // Date.now()

  // multi-model per session:
  providerId?: string;    // "openai" | "anthropic" | "google" | "groq" | ...
  modelId: string;        // e.g. "gpt-4o-mini"
  modelName: string;      // display/alias at time of generation
}

export interface Provider {
  id: string;
  name: string;
  apiKey?: string;
  updated: number;
}

export interface Model {
  modelId: string;
  providerId: string;
  alias?: string;
  enabled?: boolean;
  meta?: any;
}

export type ProviderName = "OpenAI" | "Anthropic" | "Google" |  "Groq" | "Perplexity" | "Cohere" | "HuggingFace";