import React from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "./icons/icons";
import { useChat } from "../context/ChatContext";
import IconButton from "./icons/IconButton";

export default function Sidebar() {
  const {
    sidebarOpen,
    sessions,
    selectedSession,
    handleNewChat,
    handlePickSession,
    handleRenameSession,
    handleDeleteSession,
    sideBarRef
  } = useChat();

  const onKeyItem = (e: React.KeyboardEvent<HTMLElement>, id: string) => {
    if (e.key === 'Enter') handlePickSession(id);
    if (e.key === 'Delete') handleDeleteSession?.(id);
  };

  return (
    <div ref={sideBarRef}>
      <aside className={`h-full shrink-0 bg-zinc-50 border-r border-zinc-200 transition-[width] duration-300 ease-out overflow-hidden ${sidebarOpen ? 'w-72' : 'w-0'}`}>
        <div className="h-12 flex items-center justify-between px-3 border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
          <div className="font-semibold text-sm text-zinc-800 tracking-tight">
            Your Chats
          </div>
          <IconButton className="text-blue-600" title='New chat' onClick={handleNewChat}>
            <PlusIcon />
          </IconButton>
        </div>
        <div className="h-[calc(100%-3rem)] overflow-y-auto p-3 space-y-2">
          {
            sessions.length === 0 && (
              <div className="text-xs text-zinc-500 px-1 py-8 text-center">
                No chats yet. Start a new one.
              </div>
            )
          }
          {sessions.map(session => {
            const active = session.id === selectedSession;
            return (
              <div key={session.id} className={`group relative w-full rounded-2xl ring-1 transition ${active ? 'bg-white ring-zinc-300 shadow-sm' : 'bg-white/70 ring-zinc-200 hover:bg-white hover:shadow-sm'}`}>
                {
                  active && (
                    <div className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-blue-500/80" />
                  )
                }
                <button onClick={() => handlePickSession(session.id)} onKeyDown={(e) => onKeyItem(e, session.id)} className="w-full text-left px-3.5 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300" tabIndex={0}>
                  <div className="ml-2.5 pr-16">
                    <div className="text-[13px] font-medium text-zinc-800 truncate">
                      {session.name || 'Untitled'}
                    </div>
                  </div>
                </button>

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <button
                    title="Rename"
                    className="h-7 w-7 rounded-xl hover:bg-blue-50 flex items-center justify-center text-blue-600"
                    onClick={() => {
                      if (session.id && session.name)
                        handleRenameSession?.(session.id, session.name);
                    }}
                  >
                    <PencilIcon />
                  </button>

                  <button
                    title="Delete"
                    className="h-7 w-7 rounded-xl hover:bg-blue-50 flex items-center justify-center text-blue-600"
                    onClick={() => {
                      handleDeleteSession?.(session.id);
                    }}
                  >
                    <TrashIcon />
                  </button>
                </div>

              </div>
            )
          })}
        </div>
      </aside>
    </div>
  )
}