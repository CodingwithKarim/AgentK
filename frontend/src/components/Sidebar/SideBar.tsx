import React, { useCallback } from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "../icons/icons";
import { useChat } from "../../context/ChatContext";
import IconButton from "../icons/IconButton";
import SessionItem from "./SessionItem";

function Sidebar() {
  const {
    sidebarOpen,
    sessions,
    selectedSession,
    handleNewChat,
    handlePickSession,
    handleRenameSession,
    handleDeleteSession,
    sideBarRef,
  } = useChat();

  const onKeyItem = useCallback(
    (e: React.KeyboardEvent<HTMLElement>, id: string) => {
      if (e.key === "Enter") handlePickSession(id);
      if (e.key === "Delete") handleDeleteSession?.(id);
    },
    [handlePickSession, handleDeleteSession]
  );

  return (
    <aside
      ref={sideBarRef}
      className={`h-full shrink-0 border-r transition-[width] duration-300 ease-out overflow-hidden
        ${sidebarOpen ? "w-72" : "w-0"}
        bg-white/70 backdrop-blur-lg border-zinc-200 shadow-sm`}
    >
      <div className="h-12 flex items-center justify-between px-3 border-b border-zinc-200/80 bg-white/60 backdrop-blur-sm">
        <div className="font-semibold text-sm text-zinc-800 tracking-tight">
          Your Chats
        </div>
        <IconButton
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50/70 transition"
          title="New chat"
          onClick={handleNewChat}
        >
          <PlusIcon />
        </IconButton>
      </div>

      <div className="h-[calc(100%-3rem)] overflow-y-auto p-3 space-y-2">
        {sessions.length === 0 ? (
          <div className="text-xs text-zinc-500 px-1 py-8 text-center">
            No chats yet. Start a new one.
          </div>
        ) : (
          sessions.map((s) => (
            <SessionItem
              key={s.id}
              session={s}
              active={s.id === selectedSession}
              onPick={handlePickSession}
              onRename={handleRenameSession}
              onDelete={handleDeleteSession}
              onKey={onKeyItem}
            />
          ))
        )}
      </div>
    </aside>
  );
}

export default React.memo(Sidebar);
