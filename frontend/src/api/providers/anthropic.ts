import type { ProviderAdapter, GenerateArgs } from "./types";

const MAX_TOKENS = 1024;
const TEMPERATURE = 0.7;
const DEFAULT_ENDPOINT = "https://api.anthropic.com/v1/messages";

function toAnthropicMessages({ context, userText }: GenerateArgs) {
    const msgs: Array<{ role: "user" | "assistant"; content: string }> = [];
    for (const m of context) {
        if (m.role === "user" || m.role === "assistant") {
            msgs.push({ role: m.role, content: m.content });
        }
    }
    msgs.push({ role: "user", content: userText });
    return msgs;
}

export const anthropicAdapter: ProviderAdapter = {
    id: "anthropic",
    async generate({ modelId, userText, context, apiKey }: GenerateArgs & { apiKey: string }) {
        const body = {
            model: modelId,
            messages: toAnthropicMessages({ modelId, userText, context }),
            max_tokens: MAX_TOKENS,
            temperature: TEMPERATURE,
        };

        const res = await fetch(DEFAULT_ENDPOINT, {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Anthropic ${res.status}: ${text}`);
        }

        const json = await res.json();
        return json.content?.find((b: any) => b?.type === "text")?.text ?? "";
    },
};
