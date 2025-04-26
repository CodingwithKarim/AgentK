import React from "react";
import { ChatSelector } from "./ChatSelector";
import { NewChatButton } from "./NewChatButton";
import { DeleteChatButton } from "./DeleteChatButton";
import { useChat } from "../../context/ChatContext";

export const SessionControl: React.FC = () => {
  const {
    sessions,
    selectedSession,
    setSelectedSession,
    handleNewChat,
    handleDeleteSession,
  } = useChat();

  const sessionActive = Boolean(selectedSession);

  const onSelectSession = (sessionId: string) => {
    setSelectedSession(sessionId);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        💬 Chat Session
      </label>
      <div className="flex items-center gap-4">
        <ChatSelector
          sessions={sessions}
          selectedSession={selectedSession}
          onSelectSession={onSelectSession}
        />
        <NewChatButton onNewSession={handleNewChat} />
        <DeleteChatButton
          onDeleteSession={handleDeleteSession}
          disabled={!sessionActive}
        />
      </div>
    </div>
  );
};