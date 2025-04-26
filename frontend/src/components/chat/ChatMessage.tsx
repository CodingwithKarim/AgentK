import React from "react";
import { ChatMessage as ChatMessageType } from "../../types/types";

type ChatMessageProps = {
  message: ChatMessageType;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex flex-col items-${isUser ? "end" : "start"} space-y-1`}>
      <span className="text-gray-400 text-xs">
        {message.name} • {message.time}
      </span>
      <div
        className={`${
          isUser
            ? "bg-gradient-to-tr from-indigo-100 to-indigo-50 text-indigo-800 rounded-tr-none rounded-l-2xl rounded-bl-2xl"
            : "bg-gradient-to-tr from-gray-50 to-gray-100 text-gray-800 rounded-tl-none rounded-r-2xl rounded-br-2xl"
        } px-5 py-3 shadow max-w-[75%]`}
      >
        {message.text}
      </div>
    </div>
  );
};