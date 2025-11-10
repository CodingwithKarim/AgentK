import React, { useCallback, useId, useMemo } from "react";
import { baseBtn, popover, row, BadgeDot, CheckIcon, ChevronDown, Dot } from "./styles";
import { Model } from "../../../utils/types/types";

interface Props {
  provider: string;
  setProvider: (p: string) => void;
  providers: string[];
  models: Model[];
  openMenu: "prov" | "model" | null;
  setOpenMenu: (v: "prov" | "model" | null) => void;
  provBtnRef: React.RefObject<HTMLButtonElement | null>;
  provPopRef: React.RefObject<HTMLDivElement | null>;
  onSelectModel: (id: string) => void;
}

const ProviderRow = React.memo(function ProviderRow({
  name,
  active,
  countEnabled,
  onClick,
}: {
  name: string;
  active: boolean;
  countEnabled: number;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const countLabel = countEnabled > 99 ? "99+ mo…" : `${countEnabled} models`;
  return (
    <div
      role="option"
      aria-selected={active}
      data-provider={name}
      onClick={onClick}
      className={[
        row,
        "justify-between",
        "px-3 py-2.5 transition-colors duration-100",
        active ? "bg-blue-50/60 text-blue-700" : "hover:bg-zinc-50 text-zinc-700",
      ].join(" ")}
    >
      <div className="flex items-center gap-2 min-w-0">
        {active ? <CheckIcon className="text-blue-600" /> : <Dot className="text-zinc-300" />}
        <span className="truncate font-medium">{name}</span>
      </div>
      <span className="text-[11px] text-zinc-400 font-medium tabular-nums shrink-0 ml-2 w-[58px] text-right">
        {countLabel}
      </span>
    </div>
  );
});

export function ProviderSelect({
  provider,
  setProvider,
  providers,
  models,
  openMenu,
  setOpenMenu,
  provBtnRef,
  provPopRef,
  onSelectModel,
}: Props) {
  const isOpen = openMenu === "prov";
  const listboxId = useId();

  const { enabledCountByProvider, firstEnabledModelIdByProvider } = useMemo(() => {
    const count = new Map<string, number>();
    const first = new Map<string, string>();
    for (const m of models) {
      if (!m.enabled) continue;
      const p = m.provider;
      count.set(p, (count.get(p) ?? 0) + 1);
      if (!first.has(p)) first.set(p, m.id);
    }
    return { enabledCountByProvider: count, firstEnabledModelIdByProvider: first };
  }, [models]);

  const onOptionClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget as HTMLDivElement;
      const p = el.getAttribute("data-provider") || "";
      if (!p) return;
      setProvider(p);
      setOpenMenu(null);
      const firstId = firstEnabledModelIdByProvider.get(p);
      if (firstId) onSelectModel(firstId);
    },
    [setProvider, setOpenMenu, onSelectModel, firstEnabledModelIdByProvider]
  );

  return (
    <div className="relative inline-block">
      <button
        ref={provBtnRef}
        onClick={() => setOpenMenu(isOpen ? null : "prov")}
        className={[
          baseBtn,
          "group",
          "min-w-[200px] max-w-[260px]",
          "justify-between px-3 py-1.5",
          "bg-gradient-to-br from-white/80 to-zinc-50/40",
          "border border-zinc-200/70 shadow-sm",
          "hover:shadow-md hover:border-zinc-300/70",
          "transition-all duration-200 ease-out",
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
      >
        <div className="flex items-center gap-2 min-w-0">
          <BadgeDot />
          <span className="truncate font-medium text-zinc-800 group-hover:text-zinc-900">
            {provider || "Select Provider"}
          </span>
        </div>
        <ChevronDown
          className={`ml-1 text-zinc-400 group-hover:text-zinc-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          width={14}
          height={14}
        />
      </button>

      {isOpen && (
        <div
          ref={provPopRef}
          id={listboxId}
          className={[
            popover,
            "backdrop-blur-md border border-zinc-200/60 bg-white/90 shadow-xl",
            "rounded-2xl overflow-hidden mt-1.5",
            "animate-in fade-in slide-in-from-top-1 duration-150",
          ].join(" ")}
          role="listbox"
          aria-label="Providers"
        >
          <div className="max-h-72 overflow-y-auto py-1.5 scrollbar-thin">
            {providers.map((p) => (
              <ProviderRow
                key={p}
                name={p}
                active={p === provider}
                countEnabled={enabledCountByProvider.get(p) ?? 0}
                onClick={onOptionClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
