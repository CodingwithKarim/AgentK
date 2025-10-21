import React from "react";

interface IconButtonProps {
    className?: string;
    title?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    children?: React.ReactNode;
}

export default function IconButton({
    title,
    className = "",
    children = "",
    type = "button",
    ...rest
}: IconButtonProps) {
    return (
        <button
            type={type}
            title={title}
            className={`inline-flex items-center justify-center h-9 w-9 rounded-2xl transition disabled:opacity-50 hover:bg-blue-50 ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
}