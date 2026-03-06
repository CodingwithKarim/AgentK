import { memo } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkEmoji from "remark-emoji";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import { ChatMessage, MessageContent } from "../../utils/types/types";
import { X, RefreshCw, Loader2 } from "lucide-react";
import CodeBlock from "./CodeBlock";

interface MessageBubbleProps {
  chatMessage: ChatMessage;
  onDelete: (id: string) => void;
  resubmitMessage: (id: string) => void;
  isPending?: boolean;
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mt-4 mb-2 border-b border-zinc-200 dark:border-zinc-700 pb-1">
      {children}
    </h1>
  ),
  h2: ({ children }) => <h2 className="text-xl font-semibold mt-3 mb-1">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold mt-2 mb-1">{children}</h3>,

  p: ({ children }) => <p className="my-2 leading-relaxed text-[15px]">{children}</p>,

  ul: ({ children }) => <ul className="list-disc ml-5 my-2 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal ml-5 my-2 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="leading-snug">{children}</li>,

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

  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 italic text-zinc-600 dark:text-zinc-400 my-2">
      {children}
    </blockquote>
  ),

  hr: () => <hr className="my-4 border-zinc-200 dark:border-zinc-700 opacity-60" />,

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
  img: ({ src, alt }) => (
    <img
      src={src ?? ""}
      alt={alt ?? ""}
      className="rounded-lg max-w-full my-2 border border-zinc-200 dark:border-zinc-700"
    />
  ),
  mark: ({ children }) => (
    <mark className="px-1 rounded bg-yellow-200/60 dark:bg-yellow-500/30">{children}</mark>
  ),

  code: CodeBlock,
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
    !isUser && !isAssistantPending && (typeof chatMessage.content === "string" ? chatMessage.content.trim().length : chatMessage.content?.length ?? 0) > 0;
  const modelHeaderClass = showHeader
    ? "text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400 ml-2 mb-0.5 select-none"
    : "h-4 w-0 overflow-hidden mb-1 ml-1 select-none";

  return (
    <div data-message-id={chatMessage.id} className={`w-full flex mb-4 ${isUser ? "justify-end" : "justify-start"} ml-2`}>
      <div className="text-[11px] text-zinc-500/90 dark:text-zinc-400/90">
        {!isUser && (
          <div className={modelHeaderClass}>{showHeader ? chatMessage.model_name ?? "" : ""}</div>
        )}
        <div className={`${bubbleBase} ${isUser ? userStyle : assistantStyle}`}>
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
            renderMessageContent(chatMessage.content)
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
    prev.resubmitMessage === next.resubmitMessage &&
    a.id === b.id &&
    a.content === b.content &&
    a.model_name === b.model_name &&
    a.role === b.role
  );
});

function renderMessageContent(content: MessageContent) {
  if (typeof content === "string") {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]}
        rehypePlugins={[rehypeHighlight, rehypeKatex]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    );
  }

  return content.map((block, i) => {
    if (block.type === "text") {
      return (
        <ReactMarkdown
          key={i}
          remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]}
          rehypePlugins={[rehypeHighlight, rehypeKatex]}
          components={markdownComponents}
        >
          {block.text}
        </ReactMarkdown>
      );
    }

    if (block.type === "image_url") {
      return (
        <img
          key={i}
          src={block.image_url.url}
          alt="uploaded"
          className="rounded-lg max-w-full my-2 border border-zinc-200 dark:border-zinc-700"
        />
      );
    }

    return null;
  });
}
