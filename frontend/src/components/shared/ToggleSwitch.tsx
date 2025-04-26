import React from "react";
import { motion } from "framer-motion";

type ToggleSwitchProps = {
  isOn: boolean;
  onToggle: () => void;
  label?: string;
};

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isOn,
  onToggle,
  label,
}) => {
  return (
    <div className="flex items-center space-x-3">
      <motion.div
        onClick={onToggle}
        initial={true}
        animate={{
          backgroundColor: isOn ? "#6366F1" : "#E5E7EB",
        }}
        whileTap={{ scale: 0.9 }}
        className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors ${
          isOn ? "shadow-lg" : ""
        }`}
      >
        <motion.div
          className="absolute top-0 left-0 w-6 h-6 bg-white rounded-full shadow-md"
          animate={{ x: isOn ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
        />
      </motion.div>
      {label && (
        <span
          className={`text-sm font-medium select-none ${
            isOn ? "text-indigo-700" : "text-gray-700"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
};