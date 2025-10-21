import { nanoid } from "nanoid";
import { Session } from "../utils/types/types";
import { database as db } from "../db/index";

export async function fetchSessions(): Promise<Session[]> {
  return db.sessions.orderBy("startedAt").reverse().toArray();
}

export async function createSession(name: string): Promise<Session> {
  const id = nanoid();
  const session: Session = { id, name: name.trim() || "Untitled", startedAt: Date.now() };
  await db.sessions.put(session);
  return session;
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  await db.transaction("readwrite", db.sessions, db.messages, async () => {
    await db.messages.where("sessionId").equals(sessionId).delete();
    await db.sessions.delete(sessionId);
  });
  return true;
}

export async function renameSession(session: Session): Promise<void> {
  await db.sessions.update(session.id, { name: session.name.trim() || "Untitled" });
}
