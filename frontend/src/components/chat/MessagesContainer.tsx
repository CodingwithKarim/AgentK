import { useCallback, useEffect, useRef } from "react";
import MessageBubble from "./MessagesBubble";
import { ChatMessage } from "../../utils/types/types";
import { useChat } from "../../context/ChatContext";

export default function MessagesContainer() {
  const { chatMessages, handleDeleteMessage, handleResubmitFromMessage } = useChat();

  const scrollRef = useRef<HTMLDivElement>(null);

  const onDelete = useCallback(
    (id: string) => handleDeleteMessage(id),
    [handleDeleteMessage]
  );

  useEffect(() => {
    if (!chatMessages.length) return;

    const scroller = scrollRef.current;
    if (!scroller) return;

    const lastMsg = chatMessages[chatMessages.length - 1];
    const lastId = lastMsg.id;

    requestAnimationFrame(() => {
      const el = scroller.querySelector(
        `[data-message-id="${lastId}"]`
      ) as HTMLElement | null;

      if (!el) return;

      const offset = el.offsetTop - scroller.offsetTop;
      scroller.scrollTo({
        top: offset - 16,
        behavior: chatMessages.length > 1 ? "smooth" : "auto",
      });
    });
  }, [chatMessages]);

  return (
    <div className="relative flex-1 min-h-0">
      <div className="absolute inset-x-0 top-0 h-4 top-fade" />
      <div
        ref={scrollRef}
        className="
          h-full
          overflow-y-auto overflow-x-hidden
           pb-[2rem] md:pb-0
          scroll-smooth pr-2
          scrollbar-thin
          scrollbar-thumb-zinc-400/70
          scrollbar-track-transparent
          hover:scrollbar-thumb-zinc-500
          transition-colors"
      >
        <div className="max-w-2xl mx-auto px-4 space-y-8 py-6">
          {chatMessages.length === 0 && (
            <div className="text-center text-zinc-500 text-sm py-16 opacity-60">
              Send a message to get started…
            </div>
          )}

          {chatMessages.map((message: ChatMessage) => (
            <MessageBubble
              key={message.id}
              chatMessage={message}
              onDelete={onDelete}
              resubmitMessage={handleResubmitFromMessage}
              isPending={message.pending === true}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-6 bottom-fade" />
    </div>
  );
}
