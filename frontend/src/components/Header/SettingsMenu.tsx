import React, { useEffect, useRef, useCallback } from "react";
import { ResetIcon } from "../icons/icons";

interface MenuProps {
  id?: string; // for aria-controls link from trigger
  onReset: () => void;
  sharedContext: boolean;
  setSharedContext: (checked: boolean) => void;
  onOpenSettings?: () => void;
  onClose?: () => void;
}

export const Menu = React.memo(function Menu({
  id,
  onReset,
  sharedContext,
  setSharedContext,
  onOpenSettings,
  onClose,
}: MenuProps) {
  const popRef = useRef<HTMLDivElement>(null);

  // Stable handlers
  const handleDocClick = useCallback(
    (e: MouseEvent) => {
      if (!onClose) return;
      if (!popRef.current?.contains(e.target as Node)) onClose();
    },
    [onClose]
  );
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!onClose) return;
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!onClose) return;
    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose, handleDocClick, handleKey]);

  const toggleShared = useCallback(() => {
    setSharedContext(!sharedContext);
  }, [setSharedContext, sharedContext]);

  const handleOpenSettings = useCallback(() => {
    onOpenSettings?.();
    onClose?.();
  }, [onOpenSettings, onClose]);

  return (
    <>
      <div className="absolute right-4 top-10 h-2.5 w-2.5 rotate-45 bg-white border border-zinc-200 border-b-0 border-r-0 shadow-sm" />
      <div
        id={id}
        ref={popRef}
        role="menu"
        className="absolute right-2 top-11 z-20 w-52 rounded-xl border border-zinc-200 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden"
      >
        <button
          type="button"
          role="menuitem"
          onClick={handleOpenSettings}
          className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-zinc-800 hover:bg-zinc-50 select-none focus:outline-none"
        >
          ⚙️ <span>Settings</span>
        </button>

        <div className="border-t border-zinc-200" />

        <button
          type="button"
          role="menuitemcheckbox"
          aria-checked={sharedContext}
          onClick={toggleShared}
          className="flex w-full items-center justify-between px-3 py-2 text-[13px] text-zinc-800 hover:bg-zinc-50"
        >
          <span>{sharedContext ? "Multi Model Context" : "Single Model Context"}</span>
          <span
            className={`relative inline-flex h-[18px] w-8 items-center rounded-full ${
              sharedContext ? "bg-blue-600" : "bg-zinc-300"
            }`}
            aria-hidden="true"
          >
            <span
              className={`inline-block h-[14px] w-[14px] rounded-full bg-white shadow transition-transform ${
                sharedContext ? "translate-x-4" : "translate-x-1"
              }`}
            />
          </span>
        </button>

        <div className="border-t border-zinc-200" />

        <button
          type="button"
          role="menuitem"
          onClick={onReset}
          className="flex w-full items-center gap-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50"
        >
          <ResetIcon />
          <span>{sharedContext ? "Clear Shared Context" : "Clear Model Context"}</span>
        </button>
      </div>
    </>
  );
});