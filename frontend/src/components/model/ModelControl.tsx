import React from "react";
import { ProviderSelector } from "./ProviderSelector";
import { ModelSelector } from "./ModelSelector";
import { useChat } from "../../context/ChatContext";

export const ModelControl: React.FC = () => {
  const {
    providers,
    filteredModels,
    selectedProvider,
    selectedModel,
    setSelectedProvider,
    setSelectedModel,
  } = useChat();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-8">
        <ProviderSelector
          providers={providers}
          selectedProvider={selectedProvider}
          onSelectProvider={setSelectedProvider}
        />
        <ModelSelector
          models={filteredModels}
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
        />
      </div>
    </div>
  );
};