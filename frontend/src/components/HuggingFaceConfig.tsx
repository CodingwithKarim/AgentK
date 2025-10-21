import { Plus, Trash2 } from "lucide-react";

interface HFModel {
  modelId: string;
  url: string;
  alias: string;
  enabled?: boolean;
}

interface HuggingFaceConfigProps {
  models: HFModel[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof HFModel, value: string | boolean) => void;
  onDelete: (index: number) => void;
}

export default function HuggingFaceConfig({
  models,
  onAdd,
  onUpdate,
  onDelete,
}: HuggingFaceConfigProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto pr-1.5">
        <div className="flex flex-col gap-3 border border-zinc-200 rounded-xl bg-zinc-50/50 p-4 shadow-inner">
          {models.length === 0 && (
            <div className="text-xs text-zinc-400 text-center py-2">
              No models added yet.
            </div>
          )}

          {models.map((m, i) => (
            <div
              key={i}
              className="rounded-lg border border-zinc-200 bg-white shadow-sm transition-all duration-200 p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex flex-col flex-1">
                  <label className="text-[11px] text-zinc-500 mb-1">Model ID</label>
                  <input
                    value={m.modelId}
                    onChange={(e) => onUpdate(i, "modelId", e.target.value)}
                    placeholder="e.g. mistralai/Mixtral-8x7B-Instruct"
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-zinc-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex flex-col flex-1">
                  <label className="text-[11px] text-zinc-500 mb-1">Hugging Face URL</label>
                  <input
                    value={m.url}
                    onChange={(e) => onUpdate(i, "url", e.target.value)}
                    placeholder="https://huggingface.co/mistralai/Mixtral-8x7B-Instruct"
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-zinc-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex flex-col flex-1">
                  <label className="text-[11px] text-zinc-500 mb-1">Alias</label>
                  <input
                    value={m.alias}
                    onChange={(e) => onUpdate(i, "alias", e.target.value)}
                    placeholder="Mixtral 8x7B"
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-zinc-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <button
                  onClick={() => onDelete(i)}
                  className="text-zinc-400 hover:text-red-500 transition-colors mt-1 sm:mt-5"
                  title="Delete this model"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Model Button */}
          <button
            onClick={onAdd}
            className="flex items-center justify-center gap-1.5 py-2 mt-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-all duration-200 border border-transparent hover:border-blue-200"
          >
            <Plus className="w-4 h-4" /> Add Model
          </button>
        </div>
      </div>
    </div>
  );
}
