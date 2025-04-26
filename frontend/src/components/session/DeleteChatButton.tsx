import React from "react";
import { Button } from "../shared/Button";

type DeleteChatButtonProps = {
    onDeleteSession: () => void;
    disabled: boolean
}

export const DeleteChatButton: React.FC<DeleteChatButtonProps> = ({
    onDeleteSession,
    disabled,
  }) => {
    return (
      <Button
        onClick={onDeleteSession}
        disabled={disabled}
        variant="secondary"
        className="px-4 py-3"
      >
        🗑️
      </Button>
    );
  };