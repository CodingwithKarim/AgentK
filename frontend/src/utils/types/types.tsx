export type Session = {
    id: string;
    name: string;
    startedAt?: number;
  };

export type SessionSelectorProps = {
    sessions: Session[];
    selectedSession: string;
    onSelectSession: (sessionId: string) => void;
}

export type Model = {
  id: string;
  name: string;
  provider: Provider;
  enabled?: boolean;
};

export type ChatMessage = {
  id: string;
  role: Role;
  time?: string;
  text: string;
  model_name?: string;
};

 export type MessageRow = {
  id?: number;                   // auto
  sessionId: string;             // FK -> sessions.id (logical)
  modelId: string;               // e.g. "gpt-4o"
  modelName: string;             // display label
  role: "user" | "assistant";
  content: string;               // message text
  ts: number;                    // epoch ms
};

export type Provider = "OpenAI" | "Anthropic" | "Google" |  "Groq" | "Perplexity" | "Cohere" | "HuggingFace" | ""

export type Role = "user" | "assistant";