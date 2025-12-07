import React, { useCallback } from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "../icons/icons";
import { useChat } from "../../context/ChatContext";
import IconButton from "../icons/IconButton";

interface Session {
  id: string;
  name: string;
}

interface SessionItemProps {
  session: Session;
  active: boolean;
  onPick: (id: string) => void;
  onRename?: (id: string, name: string) => void;
  onDelete?: (id: string) => void;
  onKey: (e: React.KeyboardEvent<HTMLElement>, id: string) => void;
}

const SessionItem: React.FC<SessionItemProps> = React.memo(
  ({ session, active, onPick, onRename, onDelete, onKey }) => {
    return (
      <div
        className={`group relative w-full rounded-2xl border transition-all duration-200 ease-out
          ${active
            ? "bg-gradient-to-br from-blue-50/60 to-white border-blue-200 shadow-sm"
            : "bg-white/60 border-zinc-200/70 hover:bg-zinc-50/80 hover:shadow-sm"
          }`}
      >
        {active && (
          <div className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-blue-500/80" />
        )}

        <button
          onClick={() => onPick(session.id)}
          onKeyDown={(e) => onKey(e, session.id)}
          className="w-full text-left px-3.5 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          tabIndex={0}
        >
          <div className="ml-2.5 pr-16">
            <div className="text-[13px] font-medium text-zinc-800 truncate">
              {session.name || "Untitled"}
            </div>
          </div>
        </button>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            title="Rename"
            className="h-7 w-7 rounded-xl hover:bg-blue-50 flex items-center justify-center text-blue-600"
            onClick={() => session.id && onRename?.(session.id, session.name)}
          >
            <PencilIcon />
          </button>
          <button
            title="Delete"
            className="h-7 w-7 rounded-xl hover:bg-red-50 flex items-center justify-center text-red-500"
            onClick={() => onDelete?.(session.id)}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    );
  }
);

export default SessionItem;