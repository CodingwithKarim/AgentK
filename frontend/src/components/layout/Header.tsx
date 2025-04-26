import React from "react"

export const Header: React.FC = () => {
    return (
        <div className="p-8 text-center">
        <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-400">
          AgentK
        </h1>
        <p className="mt-2 text-gray-600 text-lg font-medium">
          Your multi-model AI control center
        </p>
      </div>
    )
}