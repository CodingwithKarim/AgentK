import { database as db } from "../db/index";
import type { Model } from "../utils/types/types";
import { preferredOrder } from "../utils/constants";

export async function fetchModels(): Promise<Model[]> {
  const cached = await db.models.toArray();
  if (cached.length > 0) return sortModels(cached);
  return await refreshModels();
}

export async function refreshModels(): Promise<Model[]> {
  try {
    const r = await fetch("/api/models");
    if (!r.ok) throw new Error(String(r.status));
    const payload = await r.json();

    const raw: unknown = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as any)?.models)
      ? (payload as any).models
      : [];

    const byKey = new Map<string, Model>();
    for (const x of raw as any[]) {
      const m = normalizeModel(x);
      if (!m) continue;
      const k = `${m.provider}:${m.id}`;
      if (!byKey.has(k)) byKey.set(k, m);
    }

    const sorted = sortModels(Array.from(byKey.values()));

    await db.transaction("rw", db.models, async () => {
      await db.models.clear();
      await db.models.bulkPut(sorted);
    });

    return sorted;
  } catch {
    return [];
  }
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

   const counts: Record<string, number> = {};
  for (const m of models) {
    counts[m.provider] = (counts[m.provider] || 0) + 1;
  }

  // Optional: print results to console
  for (const [provider, count] of Object.entries(counts)) {
    console.log(`📦 ${provider}: ${count} models`);
  }

  return typeof (models as any).toSorted === "function"
    ? (models as any).toSorted(sorter)
    : [...models].sort(sorter);
}
