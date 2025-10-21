import React from "react";
import IconButton from "../icons/IconButton";
import { SendIcon, StopIcon } from "../icons/icons";
import { useChat } from "../../context/ChatContext";

export default function ChatInput() {
  const {
    inputPrompt,
    setInputPrompt,
    handleSubmit,
    isLoading
  } = useChat();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = !isLoading && inputPrompt?.trim().length > 0;

  return (
    <div className={`border-t border-zinc-200`}>
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="rounded-2xl border border-zinc-300 bg-white shadow-md">
          <div className="relative flex items-end">
            <textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message…"
              className="w-full resize-none bg-transparent outline-none p-3 pr-12 h-16"
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              {isLoading && (
                <IconButton
                  title="Stop generating"
                  className="text-blue-600"
                >
                  <StopIcon />
                </IconButton>
              )}
              <button
                type="button"
                aria-label="Send message"
                onClick={handleSubmit}
                disabled={!canSend}
                className="inline-flex items-center justify-center h-9 w-9 rounded-2xl text-blue-600 hover:bg-blue-50 disabled:opacity-50"
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
