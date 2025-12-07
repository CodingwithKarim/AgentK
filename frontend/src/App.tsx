import { useState } from "react";
import Sidebar from "./components/sidebar/SideBar";
import MessagesContainer from "./components/chat/MessagesContainer";
import ChatInput from "./components/chat/ChatInput";
import Header from "./components/header/Header";
import SettingsPage from "./components/settings/Settings";

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="h-screen w-full flex min-h-0 chat-container">
      <Sidebar />
      <div className="flex-1 min-w-0 min-h-0 flex flex-col">
        <Header onOpenSettings={() => setSettingsOpen(true)} />
        <MessagesContainer />
        <ChatInput />
      </div>
      {settingsOpen && <SettingsPage onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
