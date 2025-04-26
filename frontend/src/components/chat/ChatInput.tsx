import React from "react";
import { motion } from "framer-motion";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        💬 Your Message
      </label>
      <div className="relative">
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          disabled={isLoading}
          className={`w-full px-5 py-4 pr-14 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${
            isLoading ? "bg-gray-100 text-gray-500" : ""
          }`}
          placeholder={
            isLoading ? "Waiting for response..." : "Type your message…"
          }
        />
        <div className="absolute right-3 bottom-3">
          <motion.button
            onClick={onSubmit}
            disabled={!value.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
              !value.trim() || isLoading
                ? "bg-gray-200 text-gray-400"
                : "bg-gradient-to-r from-indigo-600 to-blue-400 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isLoading ? (
              <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </motion.button>
        </div>
        {isLoading && (
          <div className="absolute left-4 bottom-2 text-xs text-indigo-500 font-medium">
            Processing message...
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-1 text-right">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
};