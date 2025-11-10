import { useMemo, useState, useEffect, useCallback } from "react";
import { Plus, Save, CheckCircle2, ToggleLeft, ToggleRight } from "lucide-react";
import { deleteModel, saveAllModels } from "../../db/models";
import { Model, Provider } from "../../utils/types/types";
import ModelList, { ModelRow } from "./ModelList";

interface CustomProviderProps {
  provider: Provider;
  models: Model[];
  setModels: React.Dispatch<React.SetStateAction<Model[]>>;
}

export default function CustomModelsConfig({
  provider,
  models,
  setModels,
}: CustomProviderProps) {
  const rowsForProvider = useMemo<ModelRow[]>(
    () =>
      models
        .filter((m) => m.provider === provider)
        .map((m) => ({
          id: m.id,
          alias: m.name ?? "",
          enabled: m.enabled !== false,
        })),
    [models, provider]
  );

  const [draftRows, setDraftRows] = useState<ModelRow[]>(rowsForProvider);
  const [newModelId, setNewModelId] = useState("");
  const [newAlias, setNewAlias] = useState("");
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => setDraftRows(rowsForProvider), [rowsForProvider]);

  const handleAdd = useCallback(() => {
    if (!newModelId.trim()) return;
    const id = newModelId.trim();
    const alias = (newAlias || newModelId).trim();
    setDraftRows((prev) => [...prev, { id, alias, enabled: true }]);
    setNewModelId("");
    setNewAlias("");
  }, [newModelId, newAlias]);

  const handleAliasChange = useCallback((id: string, value: string) => {
    setDraftRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, alias: value } : r))
    );
  }, []);

  const handleToggle = useCallback((id: string) => {
    setDraftRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      setDraftRows((prev) => prev.filter((r) => r.id !== id));
      const newList = models.filter(
        (m) => !(m.provider === provider && m.id === id)
      );
      setModels(newList);
      console.log(`Deleting model ${provider}::${id} from IndexedDB`);
      await deleteModel(provider, id);
    },
    [models, provider, setModels]
  );

  const handleSaveAll = useCallback(async () => {
    const updated = [
      ...models.filter((m) => m.provider !== provider),
      ...draftRows.map((r) => ({
        id: r.id,
        name: r.alias,
        provider,
        enabled: r.enabled,
      })),
    ];
    setModels(updated);
    await saveAllModels(updated);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1000);
  }, [draftRows, models, provider, setModels]);

 const anyEnabled = draftRows.some((r) => r.enabled);
  const handleToggleAll = useCallback(() => {
    setDraftRows((prev) => prev.map((r) => ({ ...r, enabled: !anyEnabled })));
  }, [anyEnabled]);

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          value={newModelId}
          onChange={(e) => setNewModelId(e.target.value)}
          placeholder="Model ID (e.g. gpt-4o-mini, claude-3.5-sonnet, llama-3.1-70b)"
          className="w-full sm:w-auto flex-1 px-2.5 py-1.5 text-xs rounded-md border border-zinc-300 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          value={newAlias}
          onChange={(e) => setNewAlias(e.target.value)}
          placeholder="Alias (optional)"
          className="w-full sm:w-auto flex-1 px-2.5 py-1.5 text-xs rounded-md border border-zinc-300 focus:ring-2 focus:ring-blue-500 outline-none"
        />
 <button
  type="button"
  onClick={handleAdd}
  className="self-center sm:self-auto mx-auto flex items-center justify-center gap-1 py-1 px-3 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md border hover:border-blue-200 transition-all duration-200"
>
  <Plus className="w-4 h-4" /> Add Model
</button>
      </div>

      {/* ✅ Enable/Disable All toggle bar */}
      <div className="flex items-center justify-between mb-1">
       
        <button
          onClick={handleToggleAll}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition"
        >
          {anyEnabled ? (
            <>
              <ToggleRight className="w-4 h-4" /> Disable All
            </>
          ) : (
            <>
              <ToggleLeft className="w-4 h-4" /> Enable All
            </>
          )}
        </button>
      </div>

      <ModelList
        rows={draftRows}
        onAliasChange={handleAliasChange}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-3 border-t border-zinc-200">
        {justSaved && (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            Saved
          </span>
        )}
        <button
          type="button"
          onClick={handleSaveAll}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            justSaved
              ? "bg-zinc-300 text-zinc-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
          }`}
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>
    </div>
  );
}
