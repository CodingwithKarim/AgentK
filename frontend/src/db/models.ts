import { database as db } from "./index";
import type { Model } from "../utils/types/types";

export function listModels(provider?: string): Promise<Model[]> {
  return provider
    ? db.models.where("provider").equals(provider).toArray()
    : db.models.toArray();
}

export async function saveAllModels(models: Model[]) {
  await db.models.clear()
  return db.models.bulkPut(models);
}

export function deleteModel(provider: string, id: string) {
  return db.models.where('[provider+id]').equals([provider, id]).delete();
}