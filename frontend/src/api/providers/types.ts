import type { Message } from "../../utils/types/types";

export interface GenerateArgs {
  modelId: string;      // e.g., "gpt-4o-mini"
  userText: string;     // current input
  context: Message[];   // prior DB messages
}

export interface ProviderAdapter {
  id: string; // "openai", "anthropic", ...
  generate(args: GenerateArgs & { apiKey: string }): Promise<string>;
}
