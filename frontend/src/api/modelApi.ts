import { database as db } from "../db/index";
import type { Model } from "../utils/types/types";
import { preferredOrder } from "../utils/constants";

export async function fetchModels(): Promise<Model[]> {
  const cached = await db.models.toArray();
  if (cached.length > 0) return sortModels(cached);
  return refreshModels();
}

export const refreshModels = () =>
  refreshModelsBase("/api/models");

export const refreshModelsForProvider = (provider: string) =>
  refreshModelsBase(
    `/api/models?provider=${encodeURIComponent(provider)}`,
    provider
  );

async function refreshModelsBase(
  url: string,
  deleteProvider?: string
): Promise<Model[]> {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(String(r.status));

    const payload = await r.json();
    const raw = extractRawModels(payload);

    const byKey = new Map<string, Model>();
    for (const x of raw) {
      const m = normalizeModel(x);
      if (!m) continue;
      byKey.set(`${m.provider}:${m.id}`, m);
    }

    const sorted = sortModels([...byKey.values()]);

    await db.transaction("rw", db.models, async () => {
      if (deleteProvider) {
        const keys = await db.models
          .where("provider")
          .equals(deleteProvider)
          .primaryKeys();

        await db.models.bulkDelete(keys);
      }
      await db.models.bulkPut(sorted);
    });

    return sorted;
  } catch (e) {
    console.warn("Model refresh failed:", e);
    return [];
  }
}

function extractRawModels(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.models)) return payload.models;
  return [];
}

function normalizeModel(x: any): Model | null {
  if (!x || typeof x !== "object") return null;
  const provider = String(x.provider ?? "").trim();
  const id = String(x.id ?? "").trim();
  if (!provider || !id) return null;
  const name = typeof x.name === "string" && x.name.trim() ? x.name : id;
  const enabled = typeof x.enabled === "boolean" ? x.enabled : true;
  return { ...x, provider, id, name, enabled } as Model;
}

function sortModels(models: Model[]): Model[] {
  const sorter = (a: Model, b: Model) => {
    const ia = preferredOrder.indexOf(a.provider);
    const ib = preferredOrder.indexOf(b.provider);
    if (ia !== ib) {
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    }
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  };

  return typeof (models as any).toSorted === "function"
    ? (models as any).toSorted(sorter)
    : [...models].sort(sorter);
}
