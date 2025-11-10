import React, { memo, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkEmoji from "remark-emoji";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import { ChatMessage } from "../../utils/types/types";
import { X, RefreshCw, Clipboard, Check, Loader2 } from "lucide-react";

interface MessageBubbleProps {
  chatMessage: ChatMessage;
  onDelete: (id: string) => void;
  resubmitMessage: (id: string) => void;
  isPending?: boolean;
}

interface MarkdownCodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const markdownComponents: Components = {
  // --- Headings ---
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mt-4 mb-2 border-b border-zinc-200 dark:border-zinc-700 pb-1">
      {children}
    </h1>
  ),
  h2: ({ children }) => <h2 className="text-xl font-semibold mt-3 mb-1">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold mt-2 mb-1">{children}</h3>,

  // --- Paragraphs ---
  p: ({ children }) => <p className="my-2 leading-relaxed text-[15px]">{children}</p>,

  // --- Lists ---
  ul: ({ children }) => <ul className="list-disc ml-5 my-2 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal ml-5 my-2 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="leading-snug">{children}</li>,

  // --- Links ---
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300"
    >
      {children}
    </a>
  ),

  // --- Blockquote ---
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 italic text-zinc-600 dark:text-zinc-400 my-2">
      {children}
    </blockquote>
  ),

  // --- Horizontal Rule ---
  hr: () => <hr className="my-4 border-zinc-200 dark:border-zinc-700 opacity-60" />,

  // --- Tables ---
  table: ({ children }) => (
    <table className="border border-zinc-300 dark:border-zinc-700 text-sm my-3 w-full border-collapse">
      {children}
    </table>
  ),
  th: ({ children }) => (
    <th className="border border-zinc-300 dark:border-zinc-700 px-3 py-1 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-zinc-300 dark:border-zinc-700 px-3 py-1 align-top">
      {children}
    </td>
  ),

  // --- Images ---
  img: ({ src, alt }) => (
    <img
      src={src ?? ""}
      alt={alt ?? ""}
      className="rounded-lg max-w-full my-2 border border-zinc-200 dark:border-zinc-700"
    />
  ),

  // --- Mark / Highlight (from ==text==) ---
  mark: ({ children }) => (
    <mark className="px-1 rounded bg-yellow-200/60 dark:bg-yellow-500/30">{children}</mark>
  ),

  code: ({ inline, className, children, ...props }: MarkdownCodeProps) => {
    const lang = /language-(\w+)/.exec(className || "");
    const [copied, setCopied] = useState(false);

    const extractText = (nodes: React.ReactNode): string => {
      if (typeof nodes === "string") return nodes;
      if (Array.isArray(nodes)) return nodes.map(extractText).join("");
      if (typeof nodes === "object" && nodes && "props" in (nodes as any)) {
        return extractText((nodes as any).props.children);
      }
      return "";
    };

    const codeContent = extractText(children).trim();

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(codeContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        console.error("Copy failed");
      }
    };

    if (inline) {
      return (
        <code
          className="bg-zinc-100 dark:bg-zinc-800 text-red-600 dark:text-red-400 rounded px-1 py-0.5 break-words"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <div className="relative group my-2">
        <pre className="bg-zinc-950 dark:bg-zinc-900 text-zinc-100 p-3 rounded-lg text-sm overflow-x-auto max-w-full">
          <code className={lang ? `language-${lang[1]}` : ""}>{children}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md 
                     bg-zinc-800/80 text-zinc-200 text-xs opacity-0 group-hover:opacity-100
                     transition-opacity duration-200 hover:bg-zinc-700 active:scale-95"
        >
          {copied ? (
            <>
              <Check size={12} className="text-green-400" />
              Copied
            </>
          ) : (
            <>
              <Clipboard size={12} />
              Copy
            </>
          )}
        </button>
      </div>
    );
  },
};

function MessageBubble({
  chatMessage,
  onDelete,
  resubmitMessage,
  isPending = false,
}: MessageBubbleProps) {
  const isUser = chatMessage.role === "user";
  const isAssistantPending = !isUser && isPending;

  const bubbleBase =
    "relative group px-4 py-0.5 leading-relaxed border rounded-2xl shadow-sm transition-all " +
    "prose prose-zinc dark:prose-invert text-[16px] break-words " +
    "max-w-[min(95vw,44rem)] inline-block " +
    "[&_pre]:!max-w-full [&_pre]:!w-full [&_pre]:!whitespace-pre-wrap [&_pre]:!break-words " +
    "[&_pre]:!overflow-x-auto [&_code]:!break-words [&_code]:!whitespace-pre-wrap";

  const assistantStyle =
    "bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100";
  const userStyle =
    "bg-blue-50 border-blue-100 text-zinc-900 dark:bg-blue-900 dark:border-blue-800 dark:text-zinc-100";

  const showHeader =
    !isUser && !isAssistantPending && (chatMessage.text?.trim().length ?? 0) > 0;
  const modelHeaderClass = showHeader
    ? "text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400 ml-2 mb-0.5 select-none"
    : "h-4 w-0 overflow-hidden mb-1 ml-1 select-none";

  return (
    <div data-message-id={chatMessage.id} className={`w-full flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="text-[11px] text-zinc-500/90 dark:text-zinc-400/90">
        {!isUser && (
          <div className={modelHeaderClass}>{showHeader ? chatMessage.model_name ?? "" : ""}</div>
        )}


        <div className={`${bubbleBase} ${isUser ? userStyle : assistantStyle}`}>
          {/* corner spinner while pending */}
          {isPending && (
            <div
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 
                 text-zinc-500 flex items-center justify-center shadow-sm"
              aria-label="Loading"
              role="status"
            >
              <Loader2 size={12} className="animate-spin" />
            </div>
          )}

          {isUser && (
            <button
              onClick={() => !isPending && resubmitMessage(chatMessage.id)}
              aria-label="Resubmit message"
              title="Resubmit"
              disabled={isPending}
              className={[
                "absolute -top-2 -left-2 flex items-center justify-center w-5 h-5 rounded-full",
                "bg-zinc-100 dark:bg-zinc-800 text-zinc-400",
                "hover:text-blue-600 hover:bg-zinc-200 dark:hover:bg-zinc-700",
                "shadow-sm opacity-0 group-hover:opacity-100",
                "transition-all duration-200 hover:scale-105",
                isPending ? "opacity-40 pointer-events-none" : "",
              ].join(" ")}
            >
              <RefreshCw size={10} strokeWidth={1.75} />
            </button>
          )}

          <button
            onClick={() => onDelete(chatMessage.id)}
            aria-label="Delete message"
            title="Delete"
            disabled={isPending}
            className={[
              "absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full",
              "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-red-500 hover:bg-zinc-200",
              "dark:hover:bg-zinc-700 shadow-sm opacity-0 group-hover:opacity-100",
              "transition-all duration-200 hover:scale-105",
              isPending ? "opacity-40 pointer-events-none" : "",
            ].join(" ")}
          >
            <X size={10} strokeWidth={1.75} />
          </button>

          {isPending ? (
            <div
              className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400"
              aria-live="polite"
            >
              <Loader2 className="animate-spin" size={16} />
              <span>Thinking…</span>
            </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]}
              rehypePlugins={[rehypeHighlight, rehypeKatex]}
              components={markdownComponents}
            >
              {chatMessage.text || ""}
            </ReactMarkdown>
          )}
        </div>

      </div>
    </div>
  );
}

export default memo(MessageBubble, (prev, next) => {
  const a = prev.chatMessage;
  const b = next.chatMessage;
  return (
    prev.isPending === next.isPending &&
    a.id === b.id &&
    a.text === b.text &&
    a.model_name === b.model_name &&
    a.role === b.role
  );
});
