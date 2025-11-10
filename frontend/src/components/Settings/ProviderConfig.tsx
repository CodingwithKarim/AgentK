import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Save, Key, CheckCircle2, ToggleLeft, ToggleRight } from "lucide-react";
import { saveAllModels } from "../../db/models";
import ModelList from "./ModelList";
import CustomProvider from "./CustomProvider";
import { Provider, Model } from "../../utils/types/types";
import { PROVIDERS } from "../../utils/constants";

interface ProviderConfigPanelProps {
  models: Model[];
  setModels: React.Dispatch<React.SetStateAction<Model[]>>;
}

interface RowDraft {
  id: string;
  alias: string;
  enabled: boolean;
}

const ProviderConfigPanel: React.FC<ProviderConfigPanelProps> = ({
  models,
  setModels,
}) => {
  const [justSaved, setJustSaved] = useState(false);
  const [selected, setSelected] = useState<Provider>("OpenAI");

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

  const [draftRows, setDraftRows] = useState<RowDraft[]>(rowsFromModels);
  useEffect(() => setDraftRows(rowsFromModels), [rowsFromModels]);

  const handleToggleDraft = useCallback((modelId: string) => {
    setDraftRows((prev) =>
      prev.map((r) => (r.id === modelId ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  const handleAliasChangeDraft = useCallback((modelId: string, value: string) => {
    setDraftRows((prev) =>
      prev.map((r) => (r.id === modelId ? { ...r, alias: value } : r))
    );
  }, []);

  const handleSaveAll = useCallback(async () => {
    const updatedModels = models.map((m) => {
      if (m.provider !== selected) return m;
      const match = draftRows.find((r) => r.id === m.id);
      return match ? { ...m, name: match.alias, enabled: match.enabled } : m;
    });

    setModels(updatedModels);
    await saveAllModels(updatedModels);

    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1000);
  }, [models, draftRows, selected, setModels]);

  const anyEnabled = draftRows.some((r) => r.enabled);
  const handleToggleAll = useCallback(() => {
    setDraftRows((prev) => prev.map((r) => ({ ...r, enabled: !anyEnabled })));
  }, [anyEnabled]);

  return (
    <div className="min-h-[100svh] flex flex-col items-center bg-gradient-to-br from-zinc-100 via-white to-zinc-200 overflow-y-auto">
      <div
        className="w-full max-w-3xl h-screen sm:h-[100vh] flex flex-col p-3 sm:p-8 rounded-none sm:rounded-3xl bg-white border border-zinc-200 shadow-none sm:shadow-lg overflow-y-auto settings-panel"
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
                onClick={() => setSelected(id)}
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
        <div className="flex-1 flex flex-col border border-zinc-200 rounded-2xl bg-white p-5 overflow-hidden">
          <div>
            <label className="flex items-center gap-1 text-xs text-zinc-500 mb-1">
              <Key className="w-3 h-3" /> API Key
            </label>
            <input
              type="text"
              disabled
              aria-disabled="true"
              placeholder="BYO key support coming soon"
              className="w-full px-3 py-2 border rounded-md text-sm bg-zinc-100 text-zinc-500 cursor-not-allowed"
            />
          </div>
          <div className="mt-4 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-1">
              {
                selected !== "HuggingFace" && selected !== "DeepInfra" && selected !== "OpenRouter" ? (
                  <span className="text-xs font-medium text-zinc-500">Models</span>
                ) : (
                  <span className="text-xs font-medium text-zinc-500">Add Model</span>
                )
              }
              {
                selected !== "HuggingFace" && selected !== "DeepInfra" && selected !== "OpenRouter" && (
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
                )
              }

            </div>

            {selected === "HuggingFace" || selected === "DeepInfra" || selected === "OpenRouter" ? (
              <CustomProvider
                provider={selected}
                models={models}
                setModels={setModels}
              />
            ) : (
              <>
                <div
                  className="
                flex-1 overflow-y-auto min-h-0 pr-1 scroll-smooth
                scrollbar-thin
                scrollbar-thumb-zinc-400/70
                scrollbar-track-transparent
                hover:scrollbar-thumb-zinc-500
                transition-colors"
                >
                  <ModelList
                    rows={draftRows}
                    onAliasChange={handleAliasChangeDraft}
                    onToggle={handleToggleDraft}
                  />
                </div>

                <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3">
                  {justSaved && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      Saved
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
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProviderConfigPanel);
