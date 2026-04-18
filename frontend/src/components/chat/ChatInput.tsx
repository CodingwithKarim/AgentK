import React, { useState, useRef, useEffect } from "react";
import { SendIcon } from "../icons/icons";
import Swal from "sweetalert2";
import { Settings } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import { ImageAttachment } from "../../utils/types/types";
import {
  Image as ImageIcon,
  Globe,
} from "lucide-react";

export default function ChatInput() {
  const {
    handleSubmit,
    isLoading,
    maxTokens,
    setMaxTokens,
    mode,
    setMode,
    systemPrompt,
    setSystemPrompt,
  } = useChat();

  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachRef = useRef<HTMLDivElement>(null);

  const [inputPrompt, setInputPrompt] = useState("");
  const [showAttach, setShowAttach] = useState(false);
  const [images, setImages] = useState<ImageAttachment[]>([]);
  const [promptOpen, setPromptOpen] = useState(false);

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
    <>
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
                          absolute bottom-11 right-0 w-40
                          rounded-xl
                          bg-white
                          border border-zinc-200
                          shadow-[0_16px_40px_rgba(0,0,0,0.14)]
                          p-1
                          z-50
                          origin-bottom-right
                          animate-in fade-in zoom-in-95
                          "
                      >
                        <div
                          className="
                            absolute -bottom-2 right-4
                            h-3 w-3 rotate-45
                            bg-white
                            border-r border-b border-zinc-200
                            "
                        />
                        <button
                          onClick={() => {
                            setShowAttach(false);
                            fileInputRef.current?.click();
                          }}
                          className="
                            flex items-center gap-2 w-full
                            px-2.5 py-2
                            rounded-lg
                            text-[12px] font-medium text-zinc-800
                            hover:bg-zinc-100
                            active:bg-zinc-200/60
                            transition
                          "
                        >
                          <span className="grid place-items-center h-7 w-7 rounded-md bg-zinc-100">
                            <ImageIcon className="h-4 w-4 text-zinc-700" />
                          </span>
                          Upload image
                        </button>

                        <button
                          onClick={() => {
                            setShowAttach(false);
                            Swal.fire({
                              title: "Add Image URL",
                              input: "url",
                              inputPlaceholder: "https://example.com/image.png",
                              showCancelButton: true,
                              confirmButtonText: "Add",
                              cancelButtonText: "Cancel",
                              inputValidator: (value) => {
                                if (!value) return "Please enter an image URL";

                                if (value.startsWith("data:image/")) {
                                  if (!value.includes(";base64,")) return "Please enter a valid base64 data URI";
                                  return null;
                                }

                                if (!value.match(/^https?:\/\/.+\.(png|jpg|jpeg|gif|webp)$/i)) {
                                  return "Please enter a valid image URL or base64 data URI";
                                }

                                return null;
                              },
                            }).then((result) => {
                              if (!result.isConfirmed) return;
                              setImages((prev) => [...prev, { type: "url", url: result.value }]);
                            });
                          }}
                          className="
                            flex items-center gap-2 w-full
                            px-2.5 py-2
                            rounded-lg
                            text-[12px] font-medium text-zinc-800
                            hover:bg-zinc-100
                            active:bg-zinc-200/60
                            transition
                          "
                        >
                          <span className="grid place-items-center h-7 w-7 rounded-md bg-zinc-100">
                            <Globe className="h-4 w-4 text-zinc-700" />
                          </span>
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
                        className="
                          absolute bottom-11 right-0 w-48
                          rounded-xl
                          bg-white
                          border border-zinc-200
                          shadow-[0_14px_40px_rgba(0,0,0,0.12)]
                          p-3
                          z-50
                          origin-bottom-right
                          animate-in fade-in zoom-in-95
                        "
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => {
                                setShowPopover(false);
                                setPromptOpen(true);
                              }}
                              className="flex w-full items-center justify-between text-[13px] text-zinc-700 hover:text-zinc-900 transition">
                              <span className="font-medium">System Prompt</span>
                              {systemPrompt?.trim() && (
                                <span className="relative ml-2 flex h-2 w-2">
                                  <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60 blur-[2px]" />
                                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                                </span>
                              )}
                            </button>
                          </div>
                          <div className="border-t border-zinc-200" />
                          <div className="flex flex-col gap-2">
                            <div className="flex rounded-lg bg-zinc-100 p-0.5">
                              <button
                                onClick={() => setMode("auto")}
                                className={`flex-1 rounded-md py-1 text-[12px] font-medium transition ${mode === "auto"
                                  ? "bg-blue-600 text-white shadow-sm"
                                  : "text-zinc-500 hover:text-zinc-800"
                                  }`}
                              >
                                Auto
                              </button>

                              <button
                                onClick={() => setMode("custom")}
                                className={`flex-1 rounded-md py-1 text-[12px] font-medium transition ${mode === "custom"
                                  ? "bg-blue-600 text-white shadow-sm"
                                  : "text-zinc-500 hover:text-zinc-800"
                                  }`}
                              >
                                Custom
                              </button>
                            </div>
                            {mode === "custom" && (
                              <div className="flex flex-col gap-1 pt-1 animate-in fade-in">
                                <div className="flex items-center justify-between text-[12px] text-zinc-500">
                                  <span>Token limit</span>
                                  <span className="font-medium text-zinc-700">
                                    {maxTokens}
                                  </span>
                                </div>
                                <input
                                  type="range"
                                  min={0}
                                  max={TOKEN_OPTIONS.length - 1}
                                  step={1}
                                  value={TOKEN_OPTIONS.indexOf(maxTokens)}
                                  onChange={(e) => {
                                    const idx = Number(e.target.value);
                                    setMaxTokens(TOKEN_OPTIONS[idx]);
                                  }}
                                  className="
                                    h-1.5 w-full
                                    cursor-pointer
                                    appearance-none
                                    rounded-full
                                    bg-zinc-200
                                    accent-blue-500
                                    outline-none
                                  "
                                />
                              </div>
                            )}
                          </div>
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
                    className="inline-flex items-center justify-center h-9 w-9 rounded-xl text-blue-600 hover:bg-blue-50 disabled:opacity-50">
                    <SendIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SystemPromptModal
        open={promptOpen}
        onClose={() => setPromptOpen(false)}
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
      />
    </>
  );
}

interface SystemPromptModalProps {
  open: boolean;
  onClose: () => void;
  systemPrompt: string;
  setSystemPrompt: (v: string) => void;
}

function SystemPromptModal({
  open,
  onClose,
  systemPrompt,
  setSystemPrompt,
}: SystemPromptModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        className="
          relative w-[560px] max-w-[90%]
          rounded-2xl
          bg-white
          shadow-[0_20px_60px_rgba(0,0,0,0.15)]
          border border-zinc-200/80
          p-5
          animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-[15px] font-semibold text-zinc-800">
            🧠 <span>System Prompt</span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 text-sm transition"
          >
            ✕
          </button>
        </div>
        <div className="text-[13px] text-zinc-500 mb-4 leading-relaxed">
          Define how the model should behave. Leave empty to use default behavior.
        </div>
        <textarea
          ref={textareaRef}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              onClose();
            }
          }}
          placeholder="e.g. You are sarcastic but helpful. Roast me a little."
          className="
            w-full h-40 resize-none
            rounded-xl
            border border-zinc-200
            bg-zinc-50
            px-3 py-2
            text-sm
            outline-none
            transition
            focus:bg-white
            focus:ring-2 focus:ring-blue-500/60
            focus:border-blue-400
          "
        />

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-200">
          <button
            onClick={() => setSystemPrompt("")}
            className="text-sm text-zinc-500 hover:text-zinc-700 transition"
          >
            Clear
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-zinc-600 hover:text-zinc-900 transition"
            >
              Cancel
            </button>

            <button
              onClick={onClose}
              className="
                px-4 py-1.5 text-sm
                bg-blue-600 text-white
                rounded-lg
                shadow-sm
                hover:bg-blue-700
                transition
              "
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(reader.result!.toString().split(",")[1]);
    reader.readAsDataURL(file);
  });
}

const TOKEN_OPTIONS = [
  256,
  512,
  1024,
  2048,
  4096,
  8192,
  16384,
  32768,
  65536,
];
