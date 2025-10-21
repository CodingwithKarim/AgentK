import type { ProviderAdapter, GenerateArgs } from "./types";

function toCoherePayload({ context, userText }: GenerateArgs) {
  const chat_history = context
    .filter(m => m.role === "user" || m.role === "assistant")
    .map(m => ({
      role: m.role,          
      message: m.content,
    }));

  return { chat_history, message: userText };
}

const DEFAULT_ENDPOINT = "https://api.cohere.com/v2/chat";
const TEMPERATURE = 0.7;

export const cohereAdapter: ProviderAdapter = {
  id: "cohere",
  async generate({ modelId, userText, context, apiKey }) {
    const { chat_history, message } = toCoherePayload({ modelId, userText, context });

    const body: Record<string, unknown> = {
      model: modelId,      
      message,                
      chat_history,           
      temperature: TEMPERATURE,
    };

    const res = await fetch(DEFAULT_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Cohere ${res.status}: ${text}`);
    }

    const json = await res.json();

    // v1-style: { text: "..." }
    if (typeof json?.text === "string") return json.text;

    // v2-style: { message: { content: [{type:"text", text:"..."}...] } }
    const parts = json?.message?.content;
    if (Array.isArray(parts)) {
      return parts.map((p: any) => (typeof p?.text === "string" ? p.text : "")).join("");
    }

    return "";
  },
};
