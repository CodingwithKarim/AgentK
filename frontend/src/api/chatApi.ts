// src/api/chatApi.ts
import Dexie from "dexie";
import { Message } from "../utils/types/types";
import { database as db } from "../db/index";

async function getHistory(
  sessionID: string,
  modelID: string,
  sharedContext: boolean
): Promise<Message[]> {
  if (sharedContext) {
    return db.messages
      .where("[sessionId+ts]")
      .between([sessionID, Dexie.minKey], [sessionID, Dexie.maxKey])
      .toArray();
  }
  return db.messages
    .where("[sessionId+modelId+ts]")
    .between([sessionID, modelID, Dexie.minKey], [sessionID, modelID, Dexie.maxKey])
    .toArray();
}

// Fetch messages for UI
export async function fetchChatHistory(
  sessionID: string,
  modelID: string,
  sharedContext: boolean
): Promise<Message[]> {
  if (!sharedContext && !modelID) {
    throw new Error("modelID is required when sharedContext is false.");
  }
  return getHistory(sessionID, modelID, sharedContext);
}

// Store user -> build context -> call provider -> store assistant
export async function sendChatMessage(
  sessionID: string,
  modelID: string,
  modelName: string,
  userText: string,
  sharedContext: boolean
): Promise<Message> {
  if (!sharedContext && !modelID) {
    throw new Error("modelID is required when sharedContext is false.");
  }

  // 1) persist the user message
  await db.messages.add({
    sessionId: sessionID,
    role: "user",
    content: userText,
    ts: Date.now(),
    modelId: modelID,
    modelName
  });

  // 2) reuse the same history logic (read-avoidance version can pass state instead)
  const context: Message[] = await getHistory(sessionID, modelID, sharedContext);

  // 3) call provider (stub)
  const assistantText = await callModel(modelID, modelName, userText, context);

  // 4) persist assistant and return it
  const assistant: Message = {
    sessionId: sessionID,
    role: "assistant",
    content: assistantText,
    ts: Date.now(),
    modelId: modelID,
    modelName
  };
  const assistantId = await db.messages.add(assistant);
  return { ...assistant, id: assistantId };
}

// Clear context (session-wide or per-model)
export async function clearChatContext(
  sessionID: string,
  modelID: string,
  sharedContext: boolean
): Promise<void> {
  if (sharedContext) {
    // use compound index for efficient range delete
    const keys = await db.messages
      .where("[sessionId+ts]")
      .between([sessionID, Dexie.minKey], [sessionID, Dexie.maxKey])
      .primaryKeys();
    await db.messages.bulkDelete(keys as number[]);
  } else {
    const keys = await db.messages
      .where("[sessionId+modelId+ts]")
      .between([sessionID, modelID, Dexie.minKey], [sessionID, modelID, Dexie.maxKey])
      .primaryKeys();
    await db.messages.bulkDelete(keys as number[]);
  }
}

// ----- Replace with your actual browser-side provider call -----
async function callModel(
  modelId: string,
  modelName: string,
  userText: string,
  contextRows: Message[]
): Promise<string> {
  // read provider key from IndexedDB if needed, then fetch() to OpenAI/Anthropic/etc.
  return "(stub) implement provider call here";
}
