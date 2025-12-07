import React, { useCallback, useId, memo } from "react";
import {
  baseBtn,
  popover,
  row,
  CheckIcon,
  ChevronDown,
  Dot,
  ModelGlyph,
} from "./styles";
import { Model } from "../../../utils/types/types";

interface Props {
  filteredModels: Model[];
  current: Model | null;
  currentModelLabel: string;
  openMenu: "prov" | "model" | null;
  setOpenMenu: (v: "prov" | "model" | null) => void;
  modelBtnRef: React.RefObject<HTMLButtonElement | null>;
  modelPopRef: React.RefObject<HTMLDivElement | null>;
  onSelectModel: (id: string) => void;
  disabled?: boolean;
}

const ModelOption = memo(function ModelOption({
  id,
  name,
  active,
  onSelect,
}: {
  id: string;
  name: string;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      key={id}
      role="option"
      aria-selected={active}
      onClick={() => onSelect(id)}
      className={[
        row,
        "px-3 py-2.5",
        active ? "bg-blue-50/60 text-blue-700" : "hover:bg-zinc-50 text-zinc-700",
        "transition-colors duration-100",
      ].join(" ")}
    >
      {active ? <CheckIcon className="text-blue-600" /> : <Dot className="text-zinc-300" />}
      <span className="truncate font-medium">{name}</span>
    </div>
  );
});

function ModelSelectInner({
  filteredModels,
  current,
  currentModelLabel,
  openMenu,
  setOpenMenu,
  modelBtnRef,
  modelPopRef,
  onSelectModel,
  disabled,
}: Props) {
  const isOpen = openMenu === "model";
  const listboxId = useId();

  const handleSelect = useCallback(
    (id: string) => {
      onSelectModel(id);
      setOpenMenu(null);
    },
    [onSelectModel, setOpenMenu]
  );

  return (
    // Width is controlled here. Both button and dropdown use w-full → no resize jump.
    <div className="relative inline-block w-[60vw] sm=:w-auto sm:min-w-[220px] sm:max-w-[300px]">
      {/* Button */}
      <button
        ref={modelBtnRef}
        onClick={() => setOpenMenu(isOpen ? null : "model")}
        className={[
          baseBtn,
          "group justify-between",
          "w-full", // match container width
          "bg-gradient-to-br from-white/80 to-zinc-50/50 border border-zinc-200/70",
          "hover:shadow-md hover:border-zinc-300/70",
          "transition-all duration-200 ease-out",
        ].join(" ")}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        disabled={disabled}
      >
        <div className="flex items-center gap-2 min-w-0">
          <ModelGlyph className="text-blue-600" />
          <span
            className={[
              "truncate font-medium",
              current ? "text-zinc-900" : "text-zinc-400",
            ].join(" ")}
          >
            {currentModelLabel}
          </span>
        </div>
        <ChevronDown
          className={`ml-1 text-zinc-500 group-hover:text-zinc-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          width={14}
          height={14}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={modelPopRef}
          id={listboxId}
          className={[
            popover,
            "absolute left-0 w-full", // width matches container immediately
            "max-h-72 overflow-y-auto py-1.5 scrollbar-thin",
            "backdrop-blur-md border border-zinc-200/60 bg-white/95",
            "rounded-2xl shadow-xl mt-1.5",
            "animate-in fade-in slide-in-from-top-1 duration-150",
          ].join(" ")}
          role="listbox"
          aria-label="Models"
        >
          {filteredModels.length === 0 && (
            <div className="px-3 py-2 text-xs text-zinc-500">No models for this provider.</div>
          )}

          {filteredModels.map((m) => (
            <ModelOption
              key={`${m.provider}:${m.id}`}
              id={m.id}
              name={m.name}
              active={m.id === current?.id && m.provider === current?.provider}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const ModelSelect = memo(ModelSelectInner);
