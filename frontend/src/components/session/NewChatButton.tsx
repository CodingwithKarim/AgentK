import React from "react";

type NewChatButtonProps = {
  onNewSession: () => void
}

export const NewChatButton: React.FC<NewChatButtonProps> = ({
  onNewSession
}) =>{
    return (
        <button
        onClick={onNewSession}
        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-400 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition"
      >
        ➕ New Chat
      </button>
    )
}