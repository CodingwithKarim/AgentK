import React, { useState, useRef, useEffect } from "react";
import { SendIcon } from "../icons/icons";
import Swal from "sweetalert2";
import { Settings } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import { ImageAttachment } from "../../utils/types/types";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(reader.result!.toString().split(",")[1]);
    reader.readAsDataURL(file);
  });
}

export default function ChatInput() {
  const {
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachRef = useRef<HTMLDivElement>(null);

  const [inputPrompt, setInputPrompt] = useState("");
  const [showAttach, setShowAttach] = useState(false);
  const [images, setImages] = useState<ImageAttachment[]>([]);

  const canSend =
    !isLoading &&
    (inputPrompt.trim().length > 0 || images.length > 0);

  const handleSend = () => {
    handleSubmit(inputPrompt, images);
    setInputPrompt("");
    setImages([]);
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();

        const file = item.getAsFile();
        if (!file) return;

        const base64 = await fileToBase64(file);

        setImages((prev) => [
          ...prev,
          {
            type: "file",
            name: file.name || "pasted-image",
            mime: file.type,
            data: base64,
          },
        ]);

        return;
      }
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    const maxHeight = 160;
    const newHeight = Math.min(el.scrollHeight, maxHeight);

    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [inputPrompt]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (!popoverRef.current?.contains(target)) {
        setShowPopover(false);
      }

      if (!attachRef.current?.contains(target)) {
        setShowAttach(false);
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
          <div className="relative flex flex-col">

            {images.length > 0 && (
              <div className="flex gap-2 p-2 overflow-x-auto border-b">
                {images.map((img, i) => (
                  <div key={i} className="relative shrink-0">
                    <img
                      src={
                        img.type === "url"
                          ? img.url
                          : `data:${img.mime};base64,${img.data}`
                      }
                      className="h-16 w-16 rounded-lg object-cover border"
                    />
                    <button
                      onClick={() =>
                        setImages(images.filter((_, idx) => idx !== i))
                      }
                      className="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const base64 = await fileToBase64(file);

                setImages((prev) => [
                  ...prev,
                  {
                    type: "file",
                    name: file.name,
                    mime: file.type,
                    data: base64,
                  },
                ]);

                e.target.value = "";
              }}
            />

            <div className="relative flex items-end">
              <textarea
                ref={textareaRef}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Send a message…"
                onPaste={handlePaste}
                inputMode="text"
                className="
                  w-full resize-none bg-transparent outline-none
                  p-2 sm:p-3
                  pr-[8.5rem] sm:pr-[10rem]
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
                <div className="relative" ref={attachRef}>
                  <button
                    type="button"
                    aria-label="Add image"
                    onClick={() => setShowAttach((v) => !v)}
                    className="inline-flex items-center justify-center h-9 w-9 rounded-xl text-zinc-500 hover:bg-zinc-100 transition"
                  >
                    📎
                  </button>

                  {showAttach && (
                    <div
                      className="
        absolute bottom-12 right-0
        w-44
        rounded-xl
        border border-zinc-200
        bg-white/80 backdrop-blur-md
        shadow-[0_8px_20px_rgba(0,0,0,0.08)]
        p-1
        z-50
        animate-fade-in
      "
                    >
                      <button
                        onClick={() => {
                          setShowAttach(false);
                          fileInputRef.current?.click();
                        }}
                        className="
          flex items-center gap-2
          w-full
          px-3 py-2
          rounded-lg
          text-sm
          text-zinc-800
          hover:bg-zinc-100
          transition
        "
                      >
                        <span className="text-base">🖼️</span>
                        Upload image
                      </button>

                      <button
                        onClick={() => {
                          setShowAttach(false);
                          Swal.fire({
                            title: "Add image URL",
                            input: "url",
                            inputPlaceholder: "https://example.com/image.png",
                            showCancelButton: true,
                            confirmButtonText: "Add",
                            cancelButtonText: "Cancel",
                            inputValidator: (value) => {
                              if (!value) return "Please enter an image URL";
                              if (!value.match(/^https?:\/\/.+\.(png|jpg|jpeg|gif|webp)$/i)) {
                                return "Please enter a valid image URL";
                              }
                              return null;
                            },
                          }).then((result) => {
                            if (!result.isConfirmed) return;
                            setImages((prev) => [...prev, { type: "url", url: result.value }]);
                          });

                        }}
                        className="
          flex items-center gap-2
          w-full
          px-3 py-2
          rounded-lg
          text-sm
          text-zinc-800
          hover:bg-zinc-100
          transition
        "
                      >
                        <span className="text-base">🌐</span>
                        Image URL
                      </button>
                    </div>
                  )}
                </div>

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
                            className={`flex-1 px-2 py-1.5 text-xs font-medium transition ${mode === "auto"
                              ? "bg-blue-600 text-white"
                              : "text-zinc-700 hover:bg-zinc-100"
                              }`}
                          >
                            Auto
                          </button>

                          <span className="w-px self-stretch bg-zinc-200" />

                          <button
                            role="tab"
                            aria-selected={mode === "custom"}
                            onClick={() => setMode("custom")}
                            className={`flex-1 px-2 py-1.5 text-xs font-medium transition ${mode === "custom"
                              ? "bg-blue-600 text-white"
                              : "text-zinc-700 hover:bg-zinc-100"
                              }`}
                          >
                            Custom
                          </button>
                        </div>

                        {mode === "custom" && (
                          <div className="flex items-center justify-between gap-2 animate-fade-in">
                            <label className="text-zinc-700 font-medium select-none">
                              Token Limit:
                            </label>
                            <input
                              type="number"
                              value={maxTokens}
                              onChange={(e) =>
                                setMaxTokens(Number(e.target.value))
                              }
                              min={1}
                              max={8192}
                              className="w-20 rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm"
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
    </div>
  );
}
