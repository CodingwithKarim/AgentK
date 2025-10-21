import { useEffect, useRef } from "react";
import MessageBubble from "./MessagesBubble";
import { ChatMessage } from "../../utils/types/types";
import { useChat } from "../../context/ChatContext";

export default function MessagesContainer() {
  const { chatMessages } = useChat();

  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (scroller) {
      scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
    }
  }, [chatMessages]);

  return (
    <div className="relative flex-1 min-h-0">
      <div className="absolute inset-x-0 top-0 h-4 top-fade" />
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        <div className="max-w-2xl mx-auto px-4 space-y-8 pt-6">
          {chatMessages.length === 0 && (
            <div className="text-center text-zinc-500 text-sm py-16 opacity-60">
              Send a message to get started…
            </div>
          )}
          {chatMessages.map((message: ChatMessage, index) => (
            <MessageBubble
              key={message.id ?? `tmp-${index}`}
              chatMessage={message}
            />
          ))}
          <div ref={endRef} tabIndex={-1} style={{ outline: "none" }} />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-6 bottom-fade" />
    </div>
  );
}
