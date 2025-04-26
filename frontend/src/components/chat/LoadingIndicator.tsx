import React from "react";

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-center py-2">
      <div className="flex space-x-2">
        <div
          className="w-2 h-2 bg-indigo-400 animate-bounce rounded-full"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="w-2 h-2 bg-indigo-400 animate-bounce rounded-full"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="w-2 h-2 bg-indigo-400 animate-bounce rounded-full"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    </div>
  );
};