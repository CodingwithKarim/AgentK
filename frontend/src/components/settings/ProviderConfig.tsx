import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";

import {
  Save,
  CheckCircle2,
  Plus,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
} from "lucide-react";

import Swal from "sweetalert2";

import { saveAllModels } from "../../db/models";
import ModelList from "./ModelList";
import { Provider, Model } from "../../utils/types/types";
import { PROVIDERS } from "../../utils/constants";

interface ProviderConfigPanelProps {
  models: Model[];
  setModels: React.Dispatch<React.SetStateAction<Model[]>>;
  handleRefreshProviderModels: (provider: string) => Promise<Model[]>;
}

interface RowDraft {
  id: string;
  alias: string;
  enabled: boolean;
}

const ProviderConfigPanel: React.FC<ProviderConfigPanelProps> = ({
  models,
  setModels,
  handleRefreshProviderModels,
}) => {
  const [justSaved, setJustSaved] = useState(false);
  const [selected, setSelected] = useState<Provider>("OpenAI");
  const [search, setSearch] = useState("");

  const rowsFromModels = useMemo<RowDraft[]>(
    () =>
      models
        .filter((m) => m.provider === selected)
        .map((m) => ({
          id: m.id,
          alias: m.name ?? "",
          enabled: m.enabled !== false,
        })),
    [models, selected]
  );

  const [draftRows, setDraftRows] = useState<RowDraft[]>(() =>
    sortRows(rowsFromModels)
  );

  useEffect(() => {
    setDraftRows(sortRows(rowsFromModels));
  }, [rowsFromModels]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return draftRows;

    const term = search.toLowerCase();

    return draftRows.filter(
      (r) =>
        r.id.toLowerCase().includes(term) ||
        r.alias.toLowerCase().includes(term)
    );
  }, [draftRows, search]);

  const handleToggleAll = useCallback(() => {
    const anyEnabled = draftRows.some((r) => r.enabled);
    setDraftRows((prev) => prev.map((r) => ({ ...r, enabled: !anyEnabled })));
  }, [draftRows]);

  const handleToggleDraft = useCallback((id: string) => {
    setDraftRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  const handleAliasChangeDraft = useCallback((id: string, value: string) => {
    setDraftRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, alias: value } : r))
    );
  }, []);

  const handleAddModel = useCallback(async () => {
    const { value: modelId } = await Swal.fire({
      title: "Add Model",
      input: "text",
      inputLabel: "Enter model ID (e.g. claude-3.5-sonnet)",
      confirmButtonText: "Add",
      showCancelButton: true,
    });

    if (!modelId || !modelId.trim()) return;

    const id = modelId.trim();
    setDraftRows((prev) => [...prev, { id, alias: id, enabled: true }]);
  }, []);

  const handleReloadModels = useCallback(async () => {
    const models = await handleRefreshProviderModels(selected);
    setDraftRows(models.map((m) => ({
      id: m.id,
      alias: m.name ?? "",
      enabled: m.enabled !== false,
    })));
  }, [selected, handleRefreshProviderModels]);

  const handleSaveAll = useCallback(async () => {
    const sortedDraft = sortRows(draftRows);

    const updated = models.map((m) => {
      if (m.provider !== selected) return m;
      const match = sortedDraft.find((r) => r.id === m.id);
      return match ? { ...m, name: match.alias, enabled: match.enabled } : m;
    });

    sortedDraft.forEach((r) => {
      if (!models.some((m) => m.id === r.id && m.provider === selected)) {
        updated.push({
          id: r.id,
          name: r.alias,
          provider: selected,
          enabled: r.enabled,
        });
      }
    });

    setModels(updated);
    await saveAllModels(updated);

    setDraftRows(sortedDraft);

    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1000);
  }, [models, draftRows, selected, setModels]);

  return (
    <div className="min-h-[100svh] flex flex-col items-center bg-gradient-to-br from-zinc-100 via-white to-zinc-200 overflow-y-auto">
      <div
        className="
          w-full max-w-3xl
          h-screen sm:h-[100vh]
          flex flex-col
          p-3 sm:p-8
          rounded-none sm:rounded-3xl
          bg-white border border-zinc-200
          shadow-none sm:shadow-lg
          overflow-y-auto
          settings-panel
        "
      >
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          Settings
        </h1>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {PROVIDERS.map((id) => {
            const isActive = selected === id;
            const label = id === "Google" ? "Google (Gemini)" : id;
            return (
              <button
                key={id}
                onClick={() => {
                  setSelected(id);
                  setSearch("");
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-md scale-[1.03]"
                  : "bg-white text-zinc-700 border-zinc-200 hover:bg-blue-50 hover:text-blue-600"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 flex flex-col border border-zinc-200 rounded-2xl bg-white px-5 py-1.5 overflow-hidden ">

          <div
            className="
              sticky top-0 z-10 flex items-center justify-between
              px-2 py-2 mb-3 bg-zinc-50/80 border-b border-zinc-200
              rounded-t-xl backdrop-blur-sm
            "
          >
            <span className="text-xs font-semibold text-zinc-700 tracking-wide">
              <input
                type="text"
                placeholder={`Search ${selected} models...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  text-xs px-3 py-1.5 rounded-md border border-zinc-300
                  bg-white focus:outline-none focus:ring-2 focus:ring-blue-500
                  w-48 sm:w-64"
              />
            </span>

            <div className="flex items-center gap-2 text-xs px-2 py-1">
              <button
                onClick={handleAddModel}
                className="flex items-center gap-1 px-2 py-1 rounded-md border text-blue-600 
                           hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition"
              >
                <Plus className="w-4 h-4 opacity-70" /> Add Model
              </button>

              <button
                onClick={handleReloadModels}
                className="flex items-center gap-1 px-2 py-1 rounded-md border text-zinc-600 
                           hover:text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50 transition"
              >
                <RefreshCw className="w-4 h-4 opacity-70" /> Reload Models
              </button>

              <button
                onClick={handleToggleAll}
                className="flex items-center gap-1 px-2 py-1 rounded-md border text-zinc-600 
                           hover:text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50 transition"
              >
                {draftRows.some((r) => r.enabled) ? (
                  <>
                    <ToggleRight className="w-4 h-4 opacity-70" /> Disable All
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 opacity-70" /> Enable All
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 pr-1 scrollbar-thin scrollbar-thumb-zinc-400/70 hover:scrollbar-thumb-zinc-500">
            <ModelList
              rows={filteredRows}
              onAliasChange={handleAliasChangeDraft}
              onToggle={handleToggleDraft}
            />
          </div>

          <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3">
            {justSaved && (
              <span className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle2 className="w-4 h-4" /> Saved
              </span>
            )}

            <button
              onClick={handleSaveAll}
              disabled={justSaved}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${justSaved
                ? "bg-zinc-300 text-zinc-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                }`}
            >
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function sortRows(rows: RowDraft[]) {
  return [...rows].sort((a, b) => {
    if (a.enabled !== b.enabled) {
      return a.enabled ? -1 : 1;
    }
    return a.id.localeCompare(b.id);
  });
}

export default React.memo(ProviderConfigPanel);
