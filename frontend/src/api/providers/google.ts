// src/api/providers/google.ts
import type { ProviderAdapter, GenerateArgs } from "./types";

function toGeminiContents({ context, userText }: GenerateArgs) {
  const contents = context
    .filter(m => m.role === "user" || m.role === "assistant")
    .map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
  contents.push({ role: "user", parts: [{ text: userText }] });
  return contents;
}

const BASE = "https://generativelanguage.googleapis.com/v1beta";

export const googleAdapter: ProviderAdapter = {
  id: "google",
  async generate({ modelId, userText, context, apiKey }) {
    const url = `${BASE}/models/${encodeURIComponent(modelId)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const body = {
      contents: toGeminiContents({ modelId, userText, context }),
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Google ${res.status}: ${text}`);
    }

    const json = await res.json();
    return (
      json?.candidates?.[0]?.content?.parts
        ?.map((p: any) => (typeof p?.text === "string" ? p.text : ""))
        .join("") ?? ""
    );
  },
};
