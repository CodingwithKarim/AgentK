import { Model } from "../utils/types/types";
import { preferredOrder } from "../utils/constants";

export const fetchModels = async (): Promise<Model[]> => {
  try {
    const r = await fetch("/api/models");
    const d = await r.json();
    const modelList: Model[] = Array.isArray(d)
      ? d
      : Array.isArray(d.models)
        ? d.models
        : [];

    modelList.sort((a, b) => {
      const indexA = preferredOrder.indexOf(a.provider);
      const indexB = preferredOrder.indexOf(b.provider);
      if (indexA !== indexB) {
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      }
      return a.name.localeCompare(b.name);
    });

    return modelList;
  } catch (error) {
    console.error(error);
    return [];
  }
};