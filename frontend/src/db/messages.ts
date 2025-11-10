import Dexie from "dexie";
import { database as db } from "./index";
import type { MessageRow, Role, ChatMessage } from "../utils/types/types"; 
import { nanoid } from "nanoid";

export async function getMessageById(id: string | number): Promise<MessageRow | undefined> {
  const pk = typeof id === "number" ? id : Number(id);
  if (!Number.isFinite(pk)) return undefined;
  return db.messages.get(pk);
}

export async function getContextUpToMessage(params: {
  sessionId: string;
  clickedId: string | number;
  sharedContext: boolean;
  modelId: string;
}): Promise<{ context: ChatMessage[]; clicked?: MessageRow }> {
  const clicked = await getMessageById(params.clickedId);
  if (!clicked || clicked.sessionId !== params.sessionId) {
    return { context: [] };
  }

  const cutoffTs = clicked.ts ?? 0;

  const rows = params.sharedContext
    ? await db.messages
        .where("[sessionId+ts]")
        .between([params.sessionId, Dexie.minKey], [params.sessionId, cutoffTs], true, true)
        .toArray()
    : await db.messages
        .where("[sessionId+modelId+ts]")
        .between([params.sessionId, params.modelId, Dexie.minKey], [
          params.sessionId,
          params.modelId,
          cutoffTs,
        ], true, true)
        .toArray();

  return { context: rows.map(rowToChat), clicked };
}

export async function trimAfterMessage(params: {
  sessionId: string;
  clickedId: string | number;
  sharedContext: boolean;
  modelId: string;
}): Promise<number> {
  const clicked = await getMessageById(params.clickedId);
  if (!clicked || clicked.sessionId !== params.sessionId) return 0;

  const cutoffTs = clicked.ts ?? 0;

  // Build a collection for "after" items
  const afterCollection = params.sharedContext
    ? db.messages
        .where("[sessionId+ts]")
        .between([params.sessionId, cutoffTs], [params.sessionId, Dexie.maxKey])
        .and((m) => (m.ts ?? 0) > cutoffTs)
    : db.messages
        .where("[sessionId+modelId+ts]")
        .between([params.sessionId, params.modelId, cutoffTs], [
          params.sessionId,
          params.modelId,
          Dexie.maxKey,
        ])
        .and((m) => (m.ts ?? 0) > cutoffTs);

  const pks = await afterCollection.primaryKeys();
  if (pks.length === 0) return 0;

  await db.messages.bulkDelete(pks);
  return pks.length;
}

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

export async function deleteMessage(id: string){
  await db.messages.delete(Number(id));
}

function rowToChat(m: MessageRow): ChatMessage {
  return {
    id: String(m.id),
    role: m.role,
    text: m.content,
    model_name: m.modelName,
  };
}
