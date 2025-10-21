import { Model } from "../utils/types/types";
import { database as db } from "../db/index";

export function modelLabel(m: Model): string {
  return m.alias?.trim() || m.modelId;
}

export async function fetchModels(): Promise<Model[]> {
  const models = await db.models.toArray();
  return models.sort((a, b) => {
    const ea = a.enabled ? 1 : 0;
    const eb = b.enabled ? 1 : 0;
    if (ea !== eb) return eb - ea;

    const la = modelLabel(a).toLowerCase();
    const lb = modelLabel(b).toLowerCase();

    if (la !== lb) return la.localeCompare(lb);

    if (a.providerId !== b.providerId) return a.providerId.localeCompare(b.providerId);

    return a.modelId.localeCompare(b.modelId);
  });
}

export async function upsertModel(model: Model) {
  await db.models.put(model);
}

export async function toggleModel(modelId: string, enabled: boolean) {
  await db.models.update(modelId, { enabled });
}
