import { database as db } from "./index";
import type { Provider } from "../utils/types/types";

export function saveProviderKey(id: string, apiKey: string, name?: string) {
  return db.providers.put({ id, name: name ?? id, apiKey, updated: Date.now() } as Provider);
}

export async function getProviderKey(id: string) {
  return (await db.providers.get(id))?.apiKey ?? null;
}

export function removeProviderKey(id: string) {
  return db.providers.update(id, { apiKey: undefined, updated: Date.now() });
}

export function listProviders() {
  return db.providers.toArray();
}
