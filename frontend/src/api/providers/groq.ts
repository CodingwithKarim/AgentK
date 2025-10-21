import type { ProviderAdapter, GenerateArgs } from "./types";

function toMessages({ context, userText }: GenerateArgs) {
  const msgs = context.map(m => ({ role: m.role, content: m.content }));
  msgs.push({ role: "user", content: userText });
  return msgs;
}

const DEFAULT_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export const groqAdapter: ProviderAdapter = {
  id: "groq",
  async generate({ modelId, userText, context, apiKey }) {
    const body = {
      model: modelId,                         
      messages: toMessages({ modelId, userText, context }),
      temperature: 0.7,                       
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
      throw new Error(`Groq ${res.status}: ${text}`);
    }

    const json = await res.json();
    return json?.choices?.[0]?.message?.content ?? "";
  },
};
