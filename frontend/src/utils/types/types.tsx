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
  content: MessageContent;
  model_name?: string;
  pending?: boolean
};

export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

export type MessageContent = string | ContentBlock[];


 export type MessageRow = {
  id?: number;                   
  sessionId: string;             
  modelId: string;               
  modelName: string;             
  role: "user" | "assistant";
  content: MessageContent;              
  ts: number;                    
};

export type Provider = "OpenAI" | "Anthropic" | "Google" |  "Groq" | "Perplexity" | "Cohere" | "HuggingFace" | "xAI" | "OpenRouter" | "DeepInfra" | ""

export type Role = "user" | "assistant";

export type ImageAttachment =
  | { type: "url"; url: string }
  | { type: "file"; name: string; mime: string; data: string };
