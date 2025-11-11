import React from "react";

export type ModelRow = {
  id: string;
  alias: string;
  enabled: boolean;
};

interface ModelListProps {
  rows: ModelRow[];
  onAliasChange: (id: string, value: string) => void | Promise<void>;
  onToggle: (id: string) => void | Promise<void>;
  onDelete?: (id: string) => void | Promise<void>;
}

function ModelList({
  rows,
  onAliasChange,
  onToggle,
  onDelete,
}: ModelListProps) {
  return (
    <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 scrollbar-thin scrollbar-thumb-zinc-400/70 hover:scrollbar-thumb-zinc-500">
      {rows.length === 0 ? (
        <div className="text-xs text-zinc-400 text-center py-3">
          No models yet.
        </div>
      ) : (
        rows.map((r) => (
          <div
            key={r.id}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 shadow-sm overflow-hidden
    ${r.enabled
                ? "bg-blue-50/70 border-blue-300"
                : "bg-white border-zinc-200"
              }`}
          >

            <div className="flex-[2] min-w-0 text-[13px] font-medium text-zinc-800 leading-snug truncate">
              {r.id}
            </div>

            <input
              value={r.alias}
              onChange={(e) => onAliasChange(r.id, e.target.value)}
              readOnly={!r.enabled}
              placeholder="alias"
              className={`flex-[2] min-w-[6rem] max-w-[8rem] px-2 py-1 text-[11px] leading-none rounded-md border outline-none
      ${r.enabled
                  ? "bg-white text-zinc-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  : "bg-zinc-100 text-zinc-500 opacity-60 cursor-not-allowed"
                }`}
            />
            <div className="flex flex-[0_0_auto] items-center gap-2 pl-1">
              <button
                onClick={() => onToggle(r.id)}
                className={`relative w-11 h-6 rounded-full transition-all duration-300 ${r.enabled ? "bg-blue-500" : "bg-zinc-300"
                  }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${r.enabled ? "translate-x-5" : ""
                    }`}
                />
              </button>

              {onDelete && (
                <button
                  onClick={() => onDelete(r.id)}
                  className="text-zinc-400 hover:text-red-500 transition-colors"
                  title="Delete this model"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              )}
            </div>
          </div>

        ))
      )}
    </div>
  );
}

export default React.memo(ModelList);