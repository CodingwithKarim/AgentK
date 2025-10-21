import Dexie from "dexie";
import { database as db } from "./index";
import type { Message, Role } from "../utils/types/types";

export function addMessage(args: {
  sessionId: string;
  role: Role;
  content: string;
  modelId: string;
  modelName: string;
  providerId?: string;
  ts?: number;
}) {
  return db.messages.add({ ts: Date.now(), ...args });
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

export function clearSession(sessionId: string) {
  return db.messages.where("sessionId").equals(sessionId).delete();
}

export async function clearSessionForModel(sessionId: string, modelId: string) {
  const rows = await db.messages
    .where("[sessionId+modelId+ts]")
    .between([sessionId, modelId, Dexie.minKey], [sessionId, modelId, Dexie.maxKey])
    .primaryKeys();
  return db.messages.bulkDelete(rows);
}
