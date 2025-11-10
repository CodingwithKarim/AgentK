import { useEffect, useRef } from "react";
import ProviderConfigPanel from "./ProviderConfig";
import { useChat } from "../../context/ChatContext";

export default function SettingsPage({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { models, setModels } = useChat();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onBackdrop = (e: React.MouseEvent) => {
    if (e.target === ref.current) onClose();
  };

  return (
    <div
      ref={ref}
      onMouseDown={onBackdrop}
      className="fixed inset-0 z-50 flex items-stretch bg-black/35 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <a
        href="https://linktr.ee/karim373"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Please"
        title="Please"
        className="absolute top-3 right-3 z-50 inline-block rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/60 pointer-events-auto"
      >
        <img
          src="logo.svg"
          alt="AgentK logo"
          className="h-7 w-auto opacity-95"
          draggable={false}
        />
      </a>

      <div className="relative w-full h-full bg-white">
        <ProviderConfigPanel models={models} setModels={setModels} />
        <button
          onClick={onClose}
          className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50"
        >
          ←
        </button>
      </div>
    </div>
  );
}
