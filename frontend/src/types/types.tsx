export type Session = {
    id: string;
    name: string;
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
};

export type ChatMessage = {
  role: "user" | "assistant";
  name: string;
  time: string;
  text: string;
};

export type Provider = "OpenAI" | "Anthropic" | "Google" |  "Groq" | "Perplexity" | "Cohere" | "HuggingFace" | ""