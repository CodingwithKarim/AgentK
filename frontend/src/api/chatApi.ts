import { ChatMessage } from "../utils/types/types";

export const fetchChatHistory = async (
  sessionID: string,
  modelID: string,
  sharedContext: boolean
): Promise<ChatMessage[]> => {
  try {
    const r = await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionID, modelID, sharedContext }),
    });
    const d = await r.json();
    const msgs: ChatMessage[] = (d.messages || []).map((m: any) => ({
      role: m.role,
      name: m.role === "user" ? "You" : "AgentK",
      time: new Date(m.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: m.content,
    }));
    return msgs;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const sendChatMessage = async (
    sessionID: string,
    modelID: string,
    message: string,
    sharedContext: boolean
  ): Promise<string> => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionID,
        modelID,
        message,
        sharedContext,
      }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    const { response } = await res.json();
    return response;
  };
  
  export const clearChatContext = async (
    sessionID: string,
    modelID: string,
    sharedContext: boolean
  ): Promise<void> => {
    await fetch("/api/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionID,
        modelID,
        sharedContext,
      }),
    });
  };