import { fetchChatHistory } from "../db/messages";
import { Provider } from "../utils/types/types";

type ChatAPIMessage = { role: "user" | "assistant"; content: string; ts?: number };

export const sendChatMessage = async (
    sessionID: string,
    modelID: string,
    provider: Provider,
    message: string,
    sharedContext: boolean,
    tokens: number
  ): Promise<string> => {
    const context = await buildContext(sessionID, modelID, sharedContext)

    console.log("Context:", context)

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        modelID,
        provider,
        message,
        context,
        tokens
      }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    const { response } = await res.json();
    return response;
  };

  async function buildContext(
  sessionID: string,
  modelID: string,
  sharedContext: boolean,
): Promise<ChatAPIMessage[]> {
  const rows = await fetchChatHistory(sessionID, modelID, sharedContext);

  return rows.map(r => ({
    role: r.role,
    content: r.text,
  }));
}