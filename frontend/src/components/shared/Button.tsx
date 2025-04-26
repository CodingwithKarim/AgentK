import React from "react";
import { motion } from "framer-motion";

type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
  icon?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
  icon,
}) => {
  const baseClasses = "px-4 py-2 rounded-xl font-medium transition";

  const variantClasses = {
    primary: "bg-gradient-to-r from-indigo-600 to-blue-400 text-white shadow-sm hover:shadow-md",
    secondary: "bg-white border border-gray-200 shadow-sm hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={classes}
    >
      <div className="flex items-center space-x-2">
        {icon && <span>{icon}</span>}
        <span>{children}</span>
      </div>
    </motion.button>
  );
};