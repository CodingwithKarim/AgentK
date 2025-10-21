import { useState, useCallback, useMemo } from "react";
import { Key, Save } from "lucide-react";
import HuggingFaceConfig from "./HuggingFaceConfig";

type ProviderID =
  | "openai"
  | "anthropic"
  | "google"
  | "groq"
  | "cohere"
  | "perplexity"
  | "huggingface";

interface HFModel {
  modelId: string;
  url: string;
  alias: string;
  enabled?: boolean;
}

type ModelEntry = { modelId: string; modelName: string; enabled?: boolean };

type ProviderConfig = {
  id: ProviderID;
  name: string;
  apiKey: string;
  models: ModelEntry[] | HFModel[];
};

const PROVIDERS: ProviderConfig[] = [
  { id: "openai", name: "OpenAI", apiKey: "", models: [] },
  { id: "anthropic", name: "Anthropic", apiKey: "", models: [] },
  { id: "google", name: "Google (Gemini)", apiKey: "", models: [] },
  { id: "groq", name: "Groq", apiKey: "", models: [] },
  { id: "cohere", name: "Cohere", apiKey: "", models: [] },
  { id: "perplexity", name: "Perplexity", apiKey: "", models: [] },
  { id: "huggingface", name: "Hugging Face", apiKey: "", models: [] },
];

const CATALOG: Record<Exclude<ProviderID, "huggingface">, string[]> = {
  openai: [
    "gpt-4o",
    "gpt-4o-mini",
    "gpt-4.5-turbo",
    "gpt-4-turbo",
    "gpt-4",
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-16k",
    "gpt-3.5-turbo-instruct",
    "text-davinci-003",
    "text-curie-001",
    "text-babbage-001",
    "text-ada-001",
    "embedding-3-large",
    "embedding-3-small",
    "tts-1",
    "tts-1-hd",
    "whisper-1",
    "gpt-4o-vision",
    "gpt-4o-code",
    "gpt-4o-mini-research",
  ],
  anthropic: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
  google: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-ultra"],
  groq: ["llama3-70b", "mixtral-8x7b", "mistral-7b"],
  cohere: ["command-r-plus", "command-r", "command-light"],
  perplexity: ["sonar", "sonar-pro", "sonar-lite"],
};

export default function ProviderConfig() {
  const [configs, setConfigs] = useState<Record<ProviderID, ProviderConfig>>(
    Object.fromEntries(PROVIDERS.map((p) => [p.id, p])) as Record<
      ProviderID,
      ProviderConfig
    >
  );
  const [selected, setSelected] = useState<ProviderID>("openai");
  const [saving, setSaving] = useState(false);
  const current = configs[selected];

  const updateProvider = useCallback(
    (id: ProviderID, patch: Partial<ProviderConfig>) => {
      setConfigs((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
    },
    []
  );

  const toggleModel = useCallback((prov: ProviderID, modelId: string) => {
    setConfigs((prev) => {
      const existing = prev[prov].models as ModelEntry[];
      const exists = existing.some((m) => m.modelId === modelId);
      const models = exists
        ? existing.map((m) =>
            m.modelId === modelId ? { ...m, enabled: !m.enabled } : m
          )
        : [...existing, { modelId, modelName: modelId, enabled: true }];
      return { ...prev, [prov]: { ...prev[prov], models } };
    });
  }, []);

  const setAlias = useCallback(
    (prov: ProviderID, modelId: string, name: string) => {
      setConfigs((prev) => ({
        ...prev,
        [prov]: {
          ...prev[prov],
          models: (prev[prov].models as ModelEntry[]).map((m) =>
            m.modelId === modelId ? { ...m, modelName: name } : m
          ),
        },
      }));
    },
    []
  );

  // --- Hugging Face only ---
  const addHFModel = useCallback(() => {
    setConfigs((prev) => {
      const hfModels = prev.huggingface.models as HFModel[];
      const newModel: HFModel = {
        modelId: "",
        url: "",
        alias: "",
        enabled: true,
      };
      return {
        ...prev,
        huggingface: {
          ...prev.huggingface,
          models: [...hfModels, newModel],
        },
      };
    });
  }, []);

  const updateHFModel = useCallback(
    (index: number, field: keyof HFModel, value: string | boolean) => {
      setConfigs((prev) => {
        const hfModels = [...(prev.huggingface.models as HFModel[])];
        hfModels[index] = { ...hfModels[index], [field]: value };
        return {
          ...prev,
          huggingface: { ...prev.huggingface, models: hfModels },
        };
      });
    },
    []
  );

  const deleteHFModel = useCallback((index: number) => {
    setConfigs((prev) => {
      const hfModels = [...(prev.huggingface.models as HFModel[])];
      hfModels.splice(index, 1);
      return {
        ...prev,
        huggingface: { ...prev.huggingface, models: hfModels },
      };
    });
  }, []);
  // ---------------------------

  const rows = useMemo(() => {
    if (selected === "huggingface") return [];
    const active = configs[selected].models as ModelEntry[];
    return (CATALOG[selected] ?? []).map((id) => {
      const found = active.find((m) => m.modelId === id);
      return {
        id,
        alias: found?.modelName ?? id,
        enabled: !!found?.enabled,
      };
    });
  }, [configs, selected]);

  const handleSaveAll = useCallback(() => {
    setSaving(true);
    setTimeout(() => {
      console.log("Saved config:", configs);
      setSaving(false);
    }, 800);
  }, [configs]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 via-white to-zinc-200">
      <div className="w-full max-w-3xl h-screen sm:h-[92vh] flex flex-col p-3 sm:p-8 rounded-none sm:rounded-3xl bg-white border border-zinc-200 shadow-none sm:shadow-lg overflow-hidden">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          Settings
        </h1>

        {/* Provider Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {Object.keys(configs).map((id) => (
            <button
              key={id}
              onClick={() => setSelected(id as ProviderID)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                selected === id
                  ? "bg-blue-600 text-white border-blue-600 shadow-md scale-[1.03]"
                  : "bg-white text-zinc-700 border-zinc-200 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {configs[id as ProviderID].name}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col border border-zinc-200 rounded-2xl bg-white p-5 overflow-hidden">
          {/* API Key */}
          <div>
            <label className="flex items-center gap-1 text-xs text-zinc-500 mb-1">
              <Key className="w-3 h-3" /> API Key
            </label>
            <input
              type="password"
              value={current.apiKey}
              onChange={(e) =>
                updateProvider(current.id, { apiKey: e.target.value })
              }
              placeholder="sk-..."
              className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Models Section */}
          <div className="mt-4 flex-1 flex flex-col min-h-0">
            <div className="text-xs font-medium text-zinc-500 mb-2">Models</div>

            {selected === "huggingface" ? (
              <HuggingFaceConfig
                models={current.models as HFModel[]}
                onAdd={addHFModel}
                onUpdate={updateHFModel}
                onDelete={deleteHFModel}
              />
            ) : (
              <div
                className="flex-1 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-zinc-400/70 hover:scrollbar-thumb-zinc-500"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#a1a1aa transparent",
                }}
              >
                {rows.map((r) => (
                  <div
                    key={r.id}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg border transition-all duration-200 shadow-sm ${
                      r.enabled
                        ? "bg-blue-50/70 border-blue-300"
                        : "bg-white border-zinc-200 hover:bg-blue-50/40"
                    }`}
                  >
                    <div className="font-medium text-sm truncate">{r.id}</div>
                    <div className="flex items-center gap-2">
                      <input
                        value={r.alias}
                        onChange={(e) =>
                          setAlias(selected, r.id, e.target.value)
                        }
                        readOnly={!r.enabled}
                        placeholder="alias"
                        className={`w-24 sm:w-32 px-2 py-1 text-xs rounded-md border outline-none ${
                          r.enabled
                            ? "focus:ring-2 focus:ring-blue-400 bg-white"
                            : "opacity-60 cursor-not-allowed bg-zinc-100"
                        }`}
                      />
                      <button
                        onClick={() => toggleModel(selected, r.id)}
                        className={`w-11 h-6 rounded-full relative transition-all duration-300 ${
                          r.enabled ? "bg-blue-500" : "bg-zinc-300"
                        }`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                            r.enabled ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save */}
          <div className="pt-4 border-t border-zinc-200 flex justify-end">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                saving
                  ? "bg-blue-400/70 cursor-wait text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
              }`}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save All"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
