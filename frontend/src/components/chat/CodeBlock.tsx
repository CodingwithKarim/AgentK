import React, { useState } from "react";
import { Clipboard, Check } from "lucide-react";

interface MarkdownCodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function CodeBlock({
  inline,
  className,
  children,
  ...props
}: MarkdownCodeProps) {
  const [copied, setCopied] = useState(false);
  
  const match = /language-(\w+)/.exec(className || "");
  const lang = match?.[1];

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
        <code className={lang ? `language-${lang}` : ""}>{children}</code>
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
}