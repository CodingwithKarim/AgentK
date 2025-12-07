import { useEffect, useMemo, useRef, useState } from "react";
import { Model } from "../../../utils/types/types";
import { preferredOrder } from "../../../utils/constants";
import { ProviderSelect } from "./ProviderSelect";
import { ModelSelect } from "./ModelSelect";

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

  const [provider, setProvider] = useState<string>("");

  const current = useMemo(() => {
    const exact = models.find(
      (m) => m.id === selectedModel && m.provider === provider && m.enabled
    );
    if (exact) return exact;

    const byId = models.find((m) => m.id === selectedModel && m.enabled);
    if (byId) return byId;

    return models.find((m) => m.enabled) ?? null;
  }, [models, selectedModel, provider]);

  const providers = useMemo(() => {
    const enabledProviders = models.filter((m) => m.enabled).map((m) => m.provider);
    const unique = Array.from(new Set(enabledProviders));
    return unique.sort(
      (a, b) =>
        (preferredOrder.indexOf(a) === -1 ? Infinity : preferredOrder.indexOf(a)) -
        (preferredOrder.indexOf(b) === -1 ? Infinity : preferredOrder.indexOf(b))
    );
  }, [models]);

  useEffect(() => {
    if (!provider) {
      setProvider(current?.provider ?? providers[0] ?? "");
    } else if (current?.provider && current.provider !== provider) {
      // only update if current truly differs AND the selected model isn't shared by multiple providers
      const sameIdExists = models.filter((m) => m.id === current.id).length > 1;
      if (!sameIdExists) setProvider(current.provider);
    }
  }, [isMobile, providers, current, provider, models]);

  const [openMenu, setOpenMenu] = useState<"prov" | "model" | null>(null);

  const provBtnRef = useRef<HTMLButtonElement>(null);
  const provPopRef = useRef<HTMLDivElement>(null);
  const modelBtnRef = useRef<HTMLButtonElement>(null);
  const modelPopRef = useRef<HTMLDivElement>(null);
  const lastAutoFixIdRef = useRef<string | null>(null);

  // auto-fix if selected model becomes invalid
  useEffect(() => {
    const stillValid = models.some((m) => m.id === selectedModel && m.enabled);
    if (stillValid) {
      lastAutoFixIdRef.current = null;
      return;
    }
    if (models.length === 0) return;
    const fallback = models.find((m) => m.enabled);
    if (!fallback) return;
    if (lastAutoFixIdRef.current !== fallback.id) {
      lastAutoFixIdRef.current = fallback.id;
      if (fallback.id !== selectedModel) onSelectModel(fallback.id);
    }
  }, [models, selectedModel, onSelectModel]);

  // close menus when clicking outside
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
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const filteredModels = useMemo(() => {
    if (isMobile) return models.filter((m) => m.enabled);
    return models.filter((m) => m.provider === provider && m.enabled);
  }, [models, provider, isMobile]);

  const currentModelLabel = useMemo(
    () => (current ? current.name : "Select a model…"),
    [current]
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {!isMobile && (
        <>
          <ProviderSelect
            provider={provider}
            setProvider={setProvider}
            providers={providers}
            models={models}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            provBtnRef={provBtnRef}
            provPopRef={provPopRef}
            onSelectModel={onSelectModel}
          />

        <a
        href="https://linktr.ee/karim373"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Please"
        title="Please"
      className="hover:opacity-100 transition-opacity"
    >
      <img
        src="/logo.svg"
        alt="AgentK logo"
        className="h-7 w-auto opacity-95"
      />
    </a>
        </>
      )}

      <ModelSelect
        filteredModels={filteredModels}
        current={current}
        currentModelLabel={currentModelLabel}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        modelBtnRef={modelBtnRef}
        modelPopRef={modelPopRef}
        onSelectModel={onSelectModel}
        disabled={!provider && !isMobile}
      />
    </div>
  );
}
