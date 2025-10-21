import { database as db } from "./index";
import type { Session } from "../utils/types/types";

export async function createSession(id: string, name: string) {
  await db.sessions.put({ id, name, startedAt: Date.now() } as Session);
  return id;
}

export function listSessionsNewestFirst() {
  return db.sessions.orderBy("startedAt").reverse().toArray();
}

export function renameSession(id: string, name: string) {
  return db.sessions.update(id, { name });
}

export async function deleteSession(id: string) {
  return db.transaction("readwrite", db.sessions, db.messages, async () => {
    await db.messages.where("sessionId").equals(id).delete();
    await db.sessions.delete(id);
  });
}
