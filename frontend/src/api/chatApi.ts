import { fetchChatHistory } from "../db/messages";

type ChatAPIMessage = { role: "user" | "assistant"; content: string; ts?: number };

export const sendChatMessage = async (
    sessionID: string,
    modelID: string,
    message: string,
    sharedContext: boolean,
  ): Promise<string> => {
    const context = await buildContext(sessionID, modelID, sharedContext)

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionID,
        modelID,
        message,
        sharedContext,
        context
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