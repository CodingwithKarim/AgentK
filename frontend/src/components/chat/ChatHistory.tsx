import React, { useRef } from "react";
import { ChatMessage as ChatMessageType } from "../../types/types";
import { ChatMessage } from "./ChatMessage";
import { LoadingIndicator } from "./LoadingIndicator";
import { useChatScroll } from "../../hooks/useChatScroll";

type ChatHistoryProps = {
  messages: ChatMessageType[];
  isLoading: boolean;
};

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  messages,
  isLoading,
}) => {
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useChatScroll(chatHistoryRef, messages);

  return (
    <div>
      <div className="text-sm text-gray-500 mb-1">Chat History</div>
      <div
        ref={chatHistoryRef}
        className="mb-6 p-6 h-64 overflow-y-auto bg-white/50 backdrop-blur-sm rounded-2xl shadow-inner space-y-4"
      >
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {isLoading && <LoadingIndicator />}
      </div>
    </div>
  );
};