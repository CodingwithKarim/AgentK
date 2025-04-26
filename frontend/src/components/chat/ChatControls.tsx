import React from "react";
import { ToggleSwitch } from "../shared/ToggleSwitch";
import { Button } from "../shared/Button";
import { Trash2 } from "react-feather";

type ChatControlsProps = {
  sharedContext: boolean;
  onToggleSharedContext: () => void;
  onClearContext: () => void;
};

export const ChatControls: React.FC<ChatControlsProps> = ({
  sharedContext,
  onToggleSharedContext,
  onClearContext,
}) => {
  return (
    <div className="flex items-center justify-between mb-6 px-4 py-3 bg-gradient-to-r from-white/60 to-gray-50 rounded-2xl shadow-inner">
      <ToggleSwitch 
        isOn={sharedContext} 
        onToggle={onToggleSharedContext} 
        label="Share Context"
      />
      <Button
        onClick={onClearContext}
        variant="danger"
        icon={<Trash2 className="w-4 h-4" />}
      >
        Clear Context
      </Button>
    </div>
  );
};