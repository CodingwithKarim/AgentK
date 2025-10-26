import Dexie from "dexie";
import { database as db } from "./index";
import type { MessageRow, Role, ChatMessage } from "../utils/types/types"; 

export async function fetchChatHistory(
  sessionID: string,
  modelID: string,
  sharedContext: boolean
): Promise<ChatMessage[]> {
  try {
    const rows = sharedContext
      ? await getMessagesForSession(sessionID)
      : await getMessagesForSessionModel(sessionID, modelID)

    return rows.map(rowToChat);
  } catch (err) {
    console.error("fetchChatHistory failed:", err);
    return [];
  }
}

export function addMessage(args: {
  sessionId: string;
  role: Role;
  content: string;
  modelId: string;
  modelName?: string;
  ts?: number;
}) {
  const row: MessageRow = {
    sessionId: args.sessionId,
    role: args.role,
    content: args.content,
    modelId: args.modelId,
    modelName: args.modelName ?? "",
    ts: args.ts ?? Date.now(),
  };
  return db.messages.add(row);
}

export function getMessagesForSession(sessionId: string) {
  return db.messages
    .where("[sessionId+ts]")
    .between([sessionId, Dexie.minKey], [sessionId, Dexie.maxKey])
    .toArray();
}

export function getMessagesForSessionModel(sessionId: string, modelId: string) {
  return db.messages
    .where("[sessionId+modelId+ts]")
    .between([sessionId, modelId, Dexie.minKey], [sessionId, modelId, Dexie.maxKey])
    .toArray();
}

export function clearChatContext( sessionID: string, modelID: string, sharedContext: boolean){
  return sharedContext ? clearSession(sessionID) : clearSessionForModel(sessionID, modelID)
}

export function clearSession(sessionId: string) {
  return db.messages.where("sessionId").equals(sessionId).delete();
}

export async function clearSessionForModel(sessionId: string, modelId: string) {
  const pks = await db.messages
    .where("[sessionId+modelId+ts]")
    .between([sessionId, modelId, Dexie.minKey], [sessionId, modelId, Dexie.maxKey])
    .primaryKeys();
  return db.messages.bulkDelete(pks);
}


function rowToChat(m: MessageRow): ChatMessage {
  return {
    id: String(m.id ?? crypto.randomUUID()),
    role: m.role,
    text: m.content,
    model_name: m.modelName,
  };
}
