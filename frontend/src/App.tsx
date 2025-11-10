import { useState } from "react";
import Sidebar from "./components/Sidebar/SideBar";
import MessagesContainer from "./components/Chat/MessagesContainer";
import ChatInput from "./components/Chat/ChatInput";
import Header from "./components/Header/Header";
import SettingsPage from "./components/Settings/Settings"; // default export

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
