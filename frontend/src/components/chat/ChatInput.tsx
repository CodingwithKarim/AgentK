import React, { useState, useRef, useEffect } from "react";
import { SendIcon } from "../icons/icons";
import { Settings } from "lucide-react";
import { useChat } from "../../context/ChatContext";

export default function ChatInput() {
  const {
    inputPrompt,
    setInputPrompt,
    handleSubmit,
    isLoading,
    maxTokens,
    setMaxTokens,
    mode,
    setMode,
  } = useChat();

  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = !isLoading && inputPrompt.trim().length > 0;

  const handleSend = () => handleSubmit();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-grow textarea like ChatGPT
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    const maxHeight = 160; // ~10rem
    const newHeight = Math.min(el.scrollHeight, maxHeight);

    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [inputPrompt]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!popoverRef.current?.contains(e.target as Node)) {
        setShowPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="
        border-t border-zinc-200
        bg-white/95
        backdrop-blur
        supports-[backdrop-filter]:bg-white/80
        fixed bottom-0 left-0 right-0 md:sticky
        z-20
      "
    >
      <div className="mx-auto px-3 py-2 sm:px-4 sm:py-3 max-w-2xl">
        <div className="rounded-2xl border border-zinc-300 bg-white shadow-md backdrop-blur-md">
          <div className="relative flex items-end">
            <textarea
              ref={textareaRef}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message…"
              inputMode="text"
              className="
                w-full resize-none bg-transparent outline-none
                p-2 sm:p-3
                pr-[5.5rem] sm:pr-[7rem]
                min-h-[2.75rem] sm:min-h-[3.5rem]
                max-h-40
                text-[16px] md:text-sm
                scrollbar-thin
          scrollbar-thumb-zinc-400/70
          scrollbar-track-transparent
          hover:scrollbar-thumb-zinc-500
              "
            />

            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <div className="relative" ref={popoverRef}>
                <button
                  type="button"
                  aria-label="Settings"
                  onClick={() => setShowPopover((prev) => !prev)}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-xl text-zinc-500 hover:bg-zinc-100 transition"
                >
                  <Settings className="h-5 w-5" />
                </button>

                {showPopover && (
                  <div
                    style={{ width: "11.5rem" }}
                    className="absolute bottom-12 right-0 rounded-xl border border-zinc-200 
                    bg-white/80 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.08)] 
                    p-2 z-50 animate-fade-in"
                  >
                    <div className="flex flex-col gap-2 text-sm tracking-tight">
                      <div
                        role="tablist"
                        aria-label="Token mode"
                        className="flex overflow-hidden rounded-lg border border-zinc-200"
                      >
                        <button
                          role="tab"
                          aria-selected={mode === "auto"}
                          onClick={() => setMode("auto")}
                          className={`flex-1 px-2 py-1.5 text-xs font-medium transition ${
                            mode === "auto"
                              ? "bg-blue-600 text-white"
                              : "text-zinc-700 hover:bg-zinc-100"
                          }`}
                        >
                          Auto
                        </button>

                        <span
                          className="w-px self-stretch bg-zinc-200"
                          aria-hidden="true"
                        />

                        <button
                          role="tab"
                          aria-selected={mode === "custom"}
                          onClick={() => setMode("custom")}
                          className={`flex-1 px-2 py-1.5 text-xs font-medium transition ${
                            mode === "custom"
                              ? "bg-blue-600 text-white"
                              : "text-zinc-700 hover:bg-zinc-100"
                          }`}
                        >
                          Custom
                        </button>
                      </div>

                      {mode === "custom" && (
                        <div className="flex items-center justify-between gap-2 animate-fade-in">
                          <label
                            htmlFor="maxTokens"
                            className="text-zinc-700 font-medium select-none"
                          >
                            Token Limit:
                          </label>
                          <input
                            id="maxTokens"
                            type="number"
                            value={maxTokens}
                            onChange={(e) =>
                              setMaxTokens(Number(e.target.value))
                            }
                            min={1}
                            max={8192}
                            className="w-20 rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-700 
                              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition 
                              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                aria-label="Send message"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSend();
                }}
                disabled={!canSend}
                className="inline-flex items-center justify-center h-9 w-9 rounded-xl text-blue-600 hover:bg-blue-50 disabled:opacity-50"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
