import { useState } from "react";
import Sidebar from "./components/SideBar";
import MessagesContainer from "./components/Chat/MessagesContainer";
import ChatInput from "./components/Chat/ChatInput";
import Header from "./components/Header/Header";
import ProviderConfig from "./components/ProviderConfig";

export default function App() {
    const [settingsOpen, setSettingsOpen] = useState(false);

    if (settingsOpen) {
        return (
            <ProviderConfigWrapper onClose={() => setSettingsOpen(false)} />
        );
    }

    return (
        <div className="h-screen w-full flex min-h-0 chat-container">
            <Sidebar />
            <div className="flex-1 min-w-0 min-h-0 flex flex-col">
                <Header onOpenSettings={() => setSettingsOpen(true)} />
                <MessagesContainer />
                <ChatInput />
            </div>
        </div>
    );
}

function ProviderConfigWrapper({ onClose }: { onClose: () => void }) {
    return (
        <div className="relative w-full h-full">
            <ProviderConfig />
            <button
                onClick={onClose}
                className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 shadow-sm hover:bg-zinc-50 active:scale-[0.98] transition-all text-sm sm:text-base text-zinc-700"
            >
                <span className="text-lg sm:text-base">←</span>
            </button>
        </div>
    );
}
