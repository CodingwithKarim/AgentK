import { MenuIcon } from "lucide-react";
import IconButton from "../icons/IconButton";
import { KebabIcon } from "../icons/icons";
import { Menu } from "./Menu"
import { useChat } from "../../context/ChatContext";
import ModelSelectByProvider from "./ModelSelect"

export default function Header({ onOpenSettings }: { onOpenSettings?: () => void }) {
    const {
        setSidebarOpen,
        setSelectedModel,
        setMenuOpen,
        setSharedContext,
        sidebarOpen,
        menuOpen,
        sharedContext,
        selectedModel,
        models,
        menuRef,
        handleClearContext,
    } = useChat();

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur h-12 border-b border-zinc-200 flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
                <IconButton title="Toggle sidebar" className="text-blue-600" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <MenuIcon />
                </IconButton>
                <span className="font-semibold text-sm select-none hidden sm:inline">AgentK</span>
            </div>
            <div className="flex-1 flex justify-center">
                <ModelSelectByProvider selectedModel={selectedModel} models={models} onSelectModel={setSelectedModel} />
            </div>
            <div className="flex items-center gap-1" ref={menuRef}>
                <IconButton title="More" className="text-blue-600" onClick={() => setMenuOpen(!menuOpen)}>
                    <KebabIcon />
                </IconButton>
                {menuOpen && (
                    <Menu
                        onReset={handleClearContext}
                        sharedContext={sharedContext}
                        setSharedContext={setSharedContext}
                        onOpenSettings={onOpenSettings}
                    />
                )}
            </div>
        </header>
    );
}
