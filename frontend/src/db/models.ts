import { database as db } from "./index";
import type { Model } from "../utils/types/types";

export function upsertModel(m: Model) {
  return db.models.put(m);
}

export function listModels(providerId?: string) {
  return providerId
    ? db.models.where("providerId").equals(providerId).toArray()
    : db.models.toArray();
}

export function toggleModel(modelId: string, enabled: boolean) {
  return db.models.update(modelId, { enabled });
}

export function removeModel(modelId: string) {
  return db.models.delete(modelId);
}
