import React from "react";
import { motion } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

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
    <div className="relative w-full max-w-2xl mx-auto">
      {/* 1) Textarea is the "peer" */}
      <TextareaAutosize
    id="chat-input"
    placeholder=" "           
    value={value}
    onChange={e => onChange(e.target.value)}
    disabled={isLoading}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    }}
    minRows={1}
    className="peer w-full px-4 pt-6 pb-12 
      bg-white border border-gray-300 rounded-2xl shadow-inner
      focus:outline-none focus:ring-2 focus:ring-indigo-300
      hover:shadow-md transition-all
      resize-none overflow-hidden
      text-gray-800
      disabled:bg-gray-50 disabled:text-gray-400"/>

  <label
    htmlFor="chat-input"
    className="
      absolute border-none left-4 px-1 bg-white  /* white bg to cover border */
      -top-2                     /* default: floated above */
      text-sm text-indigo-600    /* default: small + indigo */
      transition-all

      /* when empty, drop down & enlarge+gray */
      peer-placeholder-shown:top-6
      peer-placeholder-shown:text-base
      peer-placeholder-shown:text-gray-400
      peer-placeholder-shown:bg-transparent
    "
  >
    Your Message
  </label>

      {/* Send Button */}
      <motion.button
        onClick={onSubmit}
        disabled={!value.trim() || isLoading}
        whileHover={{ scale: !value.trim() || isLoading ? 1 : 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`
          absolute right-3 bottom-3 p-3 rounded-full flex items-center justify-center
          transition-all
          ${!value.trim() || isLoading
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl"}
        `}
      >
        {isLoading ? (
          <motion.div animate={{ rotate: 360 }} transition={{ loop: Infinity, duration: 1 }}>
            <PaperAirplaneIcon className="w-6 h-6" />
          </motion.div>
        ) : (
          <PaperAirplaneIcon className="w-6 h-6 transform rotate-45" />
        )}
      </motion.button>

      {/* Helper Text */}
      <div className="mt-1 text-xs text-gray-500 text-right">
        Press Enter to send, Shift+Enter for new line
      </div>

      {isLoading && (
        <div className="absolute left-4 bottom-10 text-xs text-indigo-600 font-medium">
          Processing…
        </div>
      )}
    </div>
  );
};
