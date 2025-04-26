import React from "react"
import { SessionSelectorProps } from "../../utils/types/types"

export const ChatSelector: React.FC<SessionSelectorProps> = ({
    sessions,
    selectedSession,
    onSelectSession
}) => {
    return (
        <select
        value={selectedSession}
        onChange={(e) => onSelectSession(e.target.value)}
        className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-300 transition"
      >
        <option disabled value="">
          Select a chat…
        </option>
        {sessions.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    )
}