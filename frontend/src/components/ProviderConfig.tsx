import { useMemo, useState, useCallback, useEffect } from "react";
import { Save, Key, CheckCircle2 } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { saveAllModels } from "../db/models";

export type Provider =
  | "OpenAI"
  | "Anthropic"
  | "Google"
  | "Groq"
  | "Perplexity"
  | "Cohere";

type RowDraft = {
  id: string;
  alias: string;
  enabled: boolean;
};

export default function ProviderConfigPanel() {
  const { models, setModels } = useChat();
  const [justSaved, setJustSaved] = useState(false);
  const [selected, setSelected] = useState<Provider>("OpenAI");

  const providers: Provider[] = [
    "OpenAI",
    "Anthropic",
    "Google",
    "Groq",
    "Perplexity",
    "Cohere",
  ];

  const rowsFromModels = useMemo<RowDraft[]>(() => {
    return models
      .filter((m) => m.provider === selected)
      .map((m) => ({
        id: m.id,
        alias: m.name ?? "",
        enabled: m.enabled !== false,
      }));
  }, [models, selected]);

  const [draftRows, setDraftRows] = useState<RowDraft[]>(rowsFromModels);

  useEffect(() => {
    setDraftRows(rowsFromModels);
  }, [rowsFromModels]);

  const handleToggleDraft = useCallback((modelId: string) => {
    setDraftRows((prev) =>
      prev.map((row) =>
        row.id === modelId ? { ...row, enabled: !row.enabled } : row
      )
    );
  }, []);

  const handleAliasChangeDraft = useCallback((modelId: string, value: string) => {
    setDraftRows((prev) =>
      prev.map((row) =>
        row.id === modelId ? { ...row, alias: value } : row
      )
    );
  }, []);

  const handleSaveAll = useCallback(async () => {
    const merged = models.map((m) => {
      if (m.provider !== selected) return m;

      const match = draftRows.find((r) => r.id === m.id);
      if (!match) return m;

      return {
        ...m,
        name: match.alias,
        enabled: match.enabled,
      };
    });

    setModels(merged);
    await saveAllModels(merged);

    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1000);
  }, [models, draftRows, selected, setModels]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 via-white to-zinc-200">
      <div className="w-full max-w-3xl h-screen sm:h-[92vh] flex flex-col p-3 sm:p-8 rounded-none sm:rounded-3xl bg-white border border-zinc-200 shadow-none sm:shadow-lg overflow-hidden">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          Settings
        </h1>

        {/* Provider Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {providers.map((id) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${selected === id
                ? "bg-blue-600 text-white border-blue-600 shadow-md scale-[1.03]"
                : "bg-white text-zinc-700 border-zinc-200 hover:bg-blue-50 hover:text-blue-600"
                }`}
            >
              {id === "Google" ? "Google (Gemini)" : id}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col border border-zinc-200 rounded-2xl bg-white p-5 overflow-hidden">
          {/* API Key placeholder */}
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

          {/* Models section */}
          <div className="mt-4 flex-1 flex flex-col min-h-0">
            <div className="text-xs font-medium text-zinc-500 mb-2">Models</div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-zinc-400/70 hover:scrollbar-thumb-zinc-500">
              {draftRows.map((r) => (
                <div
                  key={r.id}
                  className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg border transition-all duration-200 shadow-sm ${r.enabled
                    ? "bg-blue-50/70 border-blue-300"
                    : "bg-white border-zinc-200 hover:bg-blue-50/40"
                    }`}
                >
                  <div className="font-medium text-sm truncate">{r.id}</div>

                  <div className="flex items-center gap-2">
                    <input
                      value={r.alias}
                      onChange={(e) =>
                        handleAliasChangeDraft(r.id, e.target.value)
                      }
                      readOnly={!r.enabled}
                      placeholder="alias"
                      className={`w-24 sm:w-32 px-2 py-1 text-xs rounded-md border outline-none ${r.enabled
                        ? "focus:ring-2 focus:ring-blue-400 bg-white"
                        : "opacity-60 cursor-not-allowed bg-zinc-100"
                        }`}
                    />
                    <button
                      onClick={() => handleToggleDraft(r.id)}
                      className={`w-11 h-6 rounded-full relative transition-all duration-300 ${r.enabled ? "bg-blue-500" : "bg-zinc-300"
                        }`}
                    >
                      <span
                        className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${r.enabled ? "translate-x-5" : ""
                          }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${justSaved
                    ? "bg-zinc-300 text-zinc-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"}
                `}
              >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
