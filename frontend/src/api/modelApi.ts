import { database as db } from "../db/index";
import type { Model } from "../utils/types/types";
import { preferredOrder } from "../utils/constants";

export async function fetchModels(): Promise<Model[]> {
  const cached = await db.models.toArray();

  if (cached.length > 0) {
    console.log("✅ Loaded models from IndexedDB");
    return sortModels(cached);
  }

  return await refreshModels();
}

async function refreshModels(): Promise<Model[]> {
  try {
    const r = await fetch("/api/models");
    const d = await r.json();
    const modelList: Model[] = Array.isArray(d)
      ? d
      : Array.isArray(d.models)
      ? d.models
      : [];

    const ready = modelList.map(m => ({ ...m, enabled: true }));

    await db.models.clear();
    await db.models.bulkAdd(ready);

    console.log("✅ Models refreshed from server");
    return sortModels(ready);
  } catch (err) {
    console.error("❌ Failed to fetch models:", err);
    return [];
  }
}

function sortModels(models: Model[]): Model[] {
  return models.sort((a, b) => {
    const ia = preferredOrder.indexOf(a.provider);
    const ib = preferredOrder.indexOf(b.provider);
    if (ia !== ib) {
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    }
    return a.name.localeCompare(b.name);
  });
}
