import { database as db } from "./index";
import type { Session } from "../utils/types/types";
import { clearSession } from "./messages";

export async function createSession(name: string): Promise<Session> {
  const id = crypto.randomUUID();
  const timestamp = Date.now();

  await db.sessions.put({ id, name, startedAt: timestamp } as Session);

  return {
    id,
    name,
    startedAt: timestamp
  };
}

export async function fetchSessions(): Promise<Session[]> {
  return db.sessions.orderBy("startedAt").reverse().toArray();
}

export function renameSession(id: string, name: string) {
  return db.sessions.update(id, { name });
}

export async function deleteSession(id: string) {
  try {
    await db.transaction("rw", db.sessions, db.messages, async () => {
      await clearSession(id);

      await db.sessions.delete(id);
    });

    return true;
  } catch (err) {
    console.error("Failed to delete session:", err);
    return false;
  }
}

export async function deleteAllSessions() {
  try {
    await db.transaction("rw", db.sessions, db.messages, async () => {
      await db.messages.clear();
      await db.sessions.clear();
    });
    return true;
  } catch (err) {
    console.error("Failed to delete all sessions:", err);
    return false;
  }
}
