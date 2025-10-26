import { database as db } from "./index";
import type { Model } from "../utils/types/types";

export function listModels(provider?: string): Promise<Model[]> {
  return provider
    ? db.models.where("provider").equals(provider).toArray()
    : db.models.toArray();
}

export async function saveAllModels(models: Model[]) {
  return db.models.bulkPut(models);
}

export function toggleModel(id: string, enabled: boolean) {
  return db.models.update(id, { enabled });
}

export function upsertModel(m: Model) {
  return db.models.put(m);
}


