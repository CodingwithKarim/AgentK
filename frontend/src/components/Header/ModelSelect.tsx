import { useEffect, useMemo, useRef, useState } from "react";
import { Model } from "../../utils/types/types";

const preferredOrder = [
  "OpenAI",
  "Anthropic",
  "Google",
  "Groq",
  "HuggingFace",
  "Cohere",
  "Perplexity",
];

// --- Hook: mobile detection ---
function useIsMobile(threshold = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < threshold : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < threshold);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [threshold]);

  return isMobile;
}

interface ModelSelectorProps {
  selectedModel: string;
  models: Model[];
  onSelectModel: (id: string) => void;
}

export default function ModelSelectByProvider({
  selectedModel,
  models,
  onSelectModel,
}: ModelSelectorProps) {
  const isMobile = useIsMobile();

  // --- Derived: current model ---
  const current = useMemo(
    () => models.find((m) => m.id === selectedModel && m.enabled) ?? models[0],
    [models, selectedModel]
  );

  // --- Derived: providers list (sorted, unique) ---
  const providers = useMemo(() => {
    const enabledProviders = models.filter((m) => m.enabled).map((m) => m.provider);
    const unique = Array.from(new Set(enabledProviders));
    return unique.sort(
      (a, b) =>
        (preferredOrder.indexOf(a) === -1 ? Infinity : preferredOrder.indexOf(a)) -
        (preferredOrder.indexOf(b) === -1 ? Infinity : preferredOrder.indexOf(b))
    );
  }, [models]);

  // --- Local state ---
  const [provider, setProvider] = useState<string>(
    current?.provider ?? providers[0] ?? ""
  );

  const [openMenu, setOpenMenu] = useState<"prov" | "model" | null>(null);

  const provBtnRef = useRef<HTMLButtonElement>(null);
  const provPopRef = useRef<HTMLDivElement>(null);
  const modelBtnRef = useRef<HTMLButtonElement>(null);
  const modelPopRef = useRef<HTMLDivElement>(null);

  // --- Combined effect: sync provider + adjust mobile default ---
  useEffect(() => {
    if (isMobile && providers.length > 0) {
      setProvider((prev) => prev || providers[0]);
    } else if (current?.provider && current.provider !== provider) {
      setProvider(current.provider);
    }
  }, [isMobile, providers, current]);

  // --- Effect: keep selection valid when models change ---
  useEffect(() => {
    const stillValid = models.some((m) => m.id === selectedModel && m.enabled);
    if (!stillValid && models.length > 0) {
      const fallback = models.find((m) => m.enabled);
      if (fallback) onSelectModel(fallback.id);
    }
  }, [models, selectedModel, onSelectModel]);

  // --- Effect: handle document clicks & escape ---
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        !provPopRef.current?.contains(t) &&
        !provBtnRef.current?.contains(t) &&
        !modelPopRef.current?.contains(t) &&
        !modelBtnRef.current?.contains(t)
      ) {
        setOpenMenu(null);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // --- Derived: filtered models per provider ---
  const filteredModels = useMemo(() => {
    if (isMobile) return models.filter((m) => m.enabled);
    return models.filter((m) => m.provider === provider && m.enabled);
  }, [models, provider, isMobile]);

  const currentModelLabel = current ? current.name : "Select a model…";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!isMobile && (
        <div className="relative inline-block">
          <button
            ref={provBtnRef}
            onClick={() => setOpenMenu((v) => (v === "prov" ? null : "prov"))}
            className={[baseBtn, "min-w-[160px] max-w-[240px]", "justify-between"].join(" ")}
            aria-haspopup="listbox"
            aria-expanded={openMenu === "prov"}
          >
            <div className="flex items-center gap-2 min-w-0">
              <BadgeDot />
              <span className="truncate font-semibold text-zinc-900">
                {provider || "Provider"}
              </span>
            </div>
            <ChevronDown
              className={`ml-1 text-zinc-500 transition-transform ${
                openMenu === "prov" ? "rotate-180" : ""
              }`}
              width={14}
              height={14}
            />
          </button>

          {openMenu === "prov" && (
            <div ref={provPopRef} className={popover} role="listbox" aria-label="Providers">
              <div className="max-h-64 overflow-y-auto py-1">
                {providers.map((p) => {
                  const active = p === provider;
                  const countEnabled = models.filter(
                    (m) => m.provider === p && m.enabled
                  ).length;

                  return (
                    <div
                      key={p}
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        setProvider(p);
                        setOpenMenu(null);
                        const first = models.find((m) => m.provider === p && m.enabled);
                        if (first) onSelectModel(first.id);
                      }}
                      className={[row, active ? "bg-zinc-50" : "", "justify-between"].join(" ")}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {active ? <CheckIcon className="text-blue-600" /> : <Dot className="text-zinc-300" />}
                        <span className="truncate font-medium text-zinc-900">{p}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">{countEnabled} models</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="relative inline-block">
        <button
          ref={modelBtnRef}
          onClick={() => setOpenMenu((v) => (v === "model" ? null : "model"))}
          className={[baseBtn, "min-w-[200px] max-w-[280px]", "justify-between"].join(" ")}
          aria-haspopup="listbox"
          aria-expanded={openMenu === "model"}
          disabled={!provider && !isMobile}
        >
          <div className="flex items-center gap-2 min-w-0">
            <ModelGlyph className="text-blue-600" />
            <span
              className={[
                "truncate font-semibold",
                current ? "text-zinc-900" : "text-zinc-400",
              ].join(" ")}
            >
              {currentModelLabel}
            </span>
          </div>
          <ChevronDown
            className={`ml-1 text-zinc-500 transition-transform ${
              openMenu === "model" ? "rotate-180" : ""
            }`}
            width={14}
            height={14}
          />
        </button>

        {openMenu === "model" && (
          <div ref={modelPopRef} className={popover} role="listbox" aria-label="Models">
            <div className="max-h-64 overflow-y-auto py-1">
              {filteredModels.length === 0 && (
                <div className="px-3 py-2 text-xs text-zinc-500">
                  No models for this provider.
                </div>
              )}

              {filteredModels.map((m) => {
                const active = m.id === current?.id;
                return (
                  <div
                    key={m.id}
                    role="option"
                    aria-selected={active ?? false}
                    onClick={() => {
                      onSelectModel(m.id);
                      setOpenMenu(null);
                    }}
                    className={[row, active ? "bg-zinc-50" : ""].join(" ")}
                  >
                    {active ? <CheckIcon className="text-blue-600" /> : <Dot className="text-zinc-300" />}
                    <span className="truncate font-medium text-zinc-900">{m.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- UI bits ---
const baseBtn = [
  "inline-flex items-center gap-1.5",
  "rounded-xl border border-zinc-300/80 bg-white/70 backdrop-blur",
  "px-2.5 py-1.5 shadow-sm hover:shadow-md",
  "transition-all duration-150",
  "focus:outline-none focus:ring-2 focus:ring-blue-500/60",
  "text-xs",
].join(" ");

const popover = [
  "absolute z-50 mt-1",
  "min-w-[180px] max-w-[320px]",
  "overflow-hidden rounded-xl border border-zinc-200 bg-white/95 backdrop-blur",
  "shadow-xl",
].join(" ");

const row = [
  "cursor-pointer px-3 py-2 flex items-center gap-2",
  "hover:bg-zinc-50",
  "text-xs",
].join(" ");

function ChevronDown(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function CheckIcon(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function Dot(props: any) {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function BadgeDot(props: any) {
  return (
    <svg viewBox="0 0 24 24" width="8" height="8" {...props}>
      <circle cx="12" cy="12" r="4" className="fill-blue-600" />
    </svg>
  );
}
function ModelGlyph(props: any) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3l7 4v10l-7 4-7-4V7l7-4z" />
      <path d="M12 7l7 4M12 7L5 11M12 17V7" />
    </svg>
  );
}
