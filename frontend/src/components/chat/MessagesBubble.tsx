import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage } from "../../utils/types/types";
import { useChat } from "../../context/ChatContext";

interface MessageBubbleProps {
  chatMessage: ChatMessage;
}

interface MarkdownCodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function MessageBubble({ chatMessage }: MessageBubbleProps) {
  const { isLoading } = useChat();
  const isUser = chatMessage.role === "user";

  const markdownComponents: Components = {
    strong: ({ children }) => (
      <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
        {children}
      </strong>
    ),
    // keep inline code readable
    code: ({ inline, children, ...props }: MarkdownCodeProps) =>
      inline ? (
        <code
          className="bg-zinc-100 dark:bg-zinc-800 text-red-600 dark:text-red-400 rounded px-1 py-0.5 break-words"
          {...props}
        >
          {children}
        </code>
      ) : (
        // fallback; we'll also enforce via scoped selectors on the wrapper
        <pre
          className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg text-sm"
          {...props}
        >
          <code className="block">{children}</code>
        </pre>
      ),
    li: ({ children }) => <li className="my-0.5 leading-snug">{children}</li>,
    p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
  };

  // NOTE:
  // - max-w-[min(95vw,44rem)] keeps bubbles within viewport on phones
  // - [&_pre]/[&_code] rules force-wrap and cap width, beating prose defaults
  const bubbleBase =
    "px-5 py-3 leading-relaxed border rounded-2xl shadow-sm transition-all " +
    "prose prose-zinc dark:prose-invert text-[16px] break-words " +
    "max-w-[min(95vw,44rem)] w-fit sm:w-auto " +
    "[&_pre]:!max-w-full [&_pre]:!w-full [&_pre]:!whitespace-pre-wrap [&_pre]:!break-words " +
    "[&_pre]:!overflow-x-auto [&_code]:!break-words [&_code]:!whitespace-pre-wrap";

  const assistantStyle =
    "bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100";
  const userStyle =
    "bg-blue-50 border-blue-100 text-zinc-900 dark:bg-blue-900 dark:border-blue-800 dark:text-zinc-100";

  return (
    <div
      className={`animate-fadeIn w-full flex mb-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className="text-[11px] text-zinc-500/90 dark:text-zinc-400/90">
        {!isUser && chatMessage.model_name && (
          <div className="text-[11px] text-zinc-400 dark:text-zinc-500 mb-1 ml-1 select-none">
            {chatMessage.model_name}
          </div>
        )}

        <div className={`${bubbleBase} ${isUser ? userStyle : assistantStyle}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {chatMessage.text || ""}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
