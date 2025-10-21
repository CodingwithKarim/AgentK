import type { ProviderAdapter, GenerateArgs } from "./types";

function toOpenAIChat({ context, userText }: GenerateArgs) {
  const messages = context.map(m => ({ role: m.role, content: m.content }));
  messages.push({ role: "user", content: userText });
  return messages;
}

export const openaiAdapter: ProviderAdapter = {
  id: "openai",
  async generate({ modelId, userText, context, apiKey }) {
    const body = {
      model: modelId,
      messages: toOpenAIChat({ modelId, userText, context }),
      temperature: 0.7,
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenAI ${res.status}: ${text}`);
    }
    const json = await res.json();

    return json?.choices?.[0]?.message?.content ?? "";
  },
};

