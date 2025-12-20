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
  const context = await buildContext(sessionID, modelID, sharedContext);

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      modelID,
      provider,
      message,
      context,
      tokens,
    }),
  });

  if (!res.ok) {
    const err = await res.json();

    const errMsg =
      err.message ||
      err.error ||
      "An unexpected error occurred.";

    console.error(errMsg);

    throw new Error(errMsg);
  }

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