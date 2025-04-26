import React from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { SessionControl } from "./components/session/SessionControl";
import { ModelControl } from "./components/model/ModelControl";
import { ChatArea } from "./components/chat/ChatArea";
import { ChatProvider, useChat } from "./context/ChatContext";

const AppContent: React.FC = () => {
  const { selectedSession, selectedModel } = useChat();
  const sessionActive = Boolean(selectedSession);

  return (
    <>
      <SessionControl />
      
      {sessionActive && <ModelControl />}
      
      {sessionActive && selectedModel && <ChatArea />}
    </>
  );
};

export default function App() {
  return (
    <ChatProvider>
      <AppLayout>
        <AppContent />
      </AppLayout>
    </ChatProvider>
  );
}