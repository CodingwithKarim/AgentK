import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import {
  ChatMessage,
  Session,
  Model,
  Provider
} from "../utils/types/types";
import {
  fetchSessions,
  createSession,
  deleteSession,
  renameSession
} from "../api/sessionAPI";
import {
  fetchModels
} from "../api/modelApi";
import {
  fetchChatHistory,
  sendChatMessage,
  clearChatContext
} from "../api/chatApi";

type ChatContextType = {
  sessions: Session[];
  models: Model[];
  filteredModels: Model[];
  providers: Provider[];
  chatMessages: ChatMessage[];
  menuRef: React.RefObject<HTMLDivElement | null>;
  sideBarRef: React.RefObject<HTMLDivElement | null>;
  sidebarOpen: boolean;

  selectedSession: string;
  selectedModel: string;
  sharedContext: boolean;
  inputPrompt: string;
  isLoading: boolean;
  menuOpen: boolean;

  setSelectedSession: (id: string) => void;
  setSelectedModel: (id: string) => void;
  setSharedContext: (shared: boolean) => void;
  setInputPrompt: (prompt: string) => void;
  setMenuOpen: (open: boolean) => void;
  setSidebarOpen: (isOpen: boolean) => void;

  handleNewChat: () => Promise<void>;
  handlePickSession: (id: string) => void;
  handleRenameSession: (id: string, title: string) => void;
  handleDeleteSession: (id: string) => Promise<void>;
  handleClearContext: () => Promise<void>;
  handleSubmit: () => Promise<void>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels] = useState<Model[]>([]);
  const [providers] = useState<Provider[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [selectedSession, setSelectedSession] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [sharedContext, setSharedContext] = useState<boolean>(false);
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sideBarRef = useRef<HTMLDivElement>(null);

  const sessionActive = Boolean(selectedSession);

  useEffect(() => {
    fetchSessions().then(setSessions).catch(console.error);
    fetchModels()
      .then((modelList) => {
        setModels(modelList);
        setSelectedModel(modelList.length > 0 ? modelList[0].id : "")
      })
      .catch(console.error);

    function onDocClick(e: MouseEvent) { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setMenuOpen(false); }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (!sessionActive || !selectedModel || isLoading) {
      return;
    }

    fetchChatHistory(selectedSession, selectedModel, sharedContext)
      .then(setChatMessages)
      .catch(console.error);
  }, [selectedSession, selectedModel, sharedContext]);

  useEffect(() => {
    if (!sidebarOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (isSwalOpen() || isInsideSwal(target)) return;

      if (sideBarRef.current && !sideBarRef.current.contains(target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  const handleNewChat = async () => {
    setSelectedSession("");
    setChatMessages([]);
    setInputPrompt("");
    setSidebarOpen(false);
  };

  const handlePickSession = (id: string) => {
    setSelectedSession(id);
    setInputPrompt("");
    setSidebarOpen(false);
  };

  const handleRenameSession = async (id: string) => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) setSidebarOpen(false);

    const { value: name } = await Swal.fire<string>({
      title: "Rename Chat Session",
      input: "text",
      inputPlaceholder: "Type a new session name...",
      showCancelButton: true,
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
      returnFocus: false,
      customClass: {
        popup: "rounded-2xl p-6 shadow-lg bg-white",
        title: "text-xl font-semibold text-gray-800",
        input: "border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500",
        actions: "mt-6 flex justify-end space-x-3",
        confirmButton: "px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white",
        cancelButton: "px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700",
      },
      width: 400,
      backdrop: 'rgba(31, 41, 55, 0.6)',
      buttonsStyling: false,
      inputValidator(value) {
        if (!value || !value.trim()) {
          return "Session name cannot be empty"
        }
      },
    });

    if (name == undefined) {
      return;
    }

    const session: Session = {
      id: id,
      name: name
    };

    try {
      await renameSession(session);
    } catch (error) {
      console.error(error);
      return;
    }

    const cleaned = name.trim() || "Untitled";
    setSessions(prev =>
      prev.map(s => (s.id === id ? { ...s, name: cleaned } : s)) // <-- name
    );
  };

  const handleDeleteSession = async (id: string) => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) setSidebarOpen(false);

    const { isConfirmed } = await Swal.fire({
      title: "<span class='text-red-600'>Are you sure?</span>",
      html: "<p class='text-gray-600'>Deleting this chat is permanent and cannot be undone.</p>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      buttonsStyling: false,
      width: 400,
      customClass: {
        popup: "rounded-2xl p-6 shadow-lg bg-white",
        title: "text-lg font-semibold text-gray-800",
        htmlContainer: "text-sm text-gray-600 mt-2",
        confirmButton: "px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium",
        cancelButton: "px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium",
        actions: "mt-6 flex justify-end space-x-4",
      },
      backdrop: 'rgba(31, 41, 55, 0.6)',
    });
    if (!isConfirmed) return;

    try {
      const ok = await deleteSession(id);
      if (ok) {
        setSessions(prev => prev.filter(s => s.id !== id));
        setSelectedSession("");
        setChatMessages([]);
        await Swal.fire({ icon: "success", iconColor: "#ef4444", title: "Deleted!", timer: 1200, showConfirmButton: false });
      }
    } catch (e) {
      console.error(e);
      await Swal.fire({ icon: "error", title: "Oops…", text: "Please try again." });
    }
    finally {
    }
  };

  const handleClearContext = async () => {
    if (!sessionActive || !selectedModel) return;

    const warningMessage = sharedContext
      ? "This will delete all messages for this session across all models."
      : "This will delete messages for the selected model only.";

    const { isConfirmed } = await Swal.fire({
      title: "Clear Conversation History?",
      text: warningMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      buttonsStyling: false,
      customClass: {
        popup: "rounded-2xl p-6 shadow-lg bg-white",
        title: "text-lg font-semibold text-gray-800",
        htmlContainer: "text-sm text-gray-600 mt-2",
        confirmButton: "px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium",
        cancelButton: "px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium",
        actions: "mt-6 flex justify-end space-x-4",
      },
      backdrop: 'rgba(31, 41, 55, 0.6)',
    });
    if (!isConfirmed) return;

    try {
      await clearChatContext(selectedSession, selectedModel, sharedContext);
      const fresh = await fetchChatHistory(selectedSession, selectedModel, sharedContext);
      setChatMessages(fresh);
      await Swal.fire({ icon: "success", iconColor: "#ef4444", title: "Context Cleared", timer: 1200, showConfirmButton: false });
    } catch (e) {
      console.error(e);
      await Swal.fire({ icon: "error", title: "Error", text: "Failed to clear chat." });
    }
  };

  const handleSubmit = async () => {
    const text = inputPrompt.trim();
    if (!text || isLoading || !selectedModel) return;

    setIsLoading(true);
    setInputPrompt("");
    setChatMessages(prev => [
      ...prev,
      {

        role: "user",
        text,
      }
    ]);

    setChatMessages(prev => [
      ...prev,
      {
        role: "assistant",
        text: "",
        model_name: selectedModel,
      }
    ]);

    let workingSessionId = selectedSession;
    if (!workingSessionId) {
      try {
        const autoTitle = generateTitleFromText(text);
        const s = await createSession(autoTitle);

        setSessions(prev => [{ ...s }, ...prev]);
        setSelectedSession(s.id);
        workingSessionId = s.id;
      } catch (e) {
        console.error(e);
        setChatMessages(prev => {
          const arr = [...prev];
          const idx = arr.findIndex(m => m.role === "assistant" && m.text === "");
          if (idx !== -1) arr[idx] = { ...arr[idx], text: "[Error creating session]" };
          return arr;
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      const model_name = models.find(model => model.id === selectedModel)?.name ?? "";

      const resp = await sendChatMessage(workingSessionId, selectedModel, text, sharedContext);

      setChatMessages(prev => {
        const arr = [...prev];
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i].role === "assistant") {
            arr[i] = { ...arr[i], text: resp, model_name: model_name };
            break;
          }
        }
        return arr;
      });

      setSessions(prev => prev.map(s => (s.id === workingSessionId ? { ...s } : s)));

    } catch (e: any) {
      console.error(e);
      setChatMessages(prev => {
        const arr = [...prev];
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i].role === "assistant") {
            arr[i] = { ...arr[i], text: (arr[i].text || "") + `\n[Error: ${e?.message || "send failed"}]` };
            break;
          }
        }
        return arr;
      });
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const value: ChatContextType = {
    sessions,
    models,
    filteredModels,
    providers,
    chatMessages,
    menuRef,
    sideBarRef,

    selectedSession,
    selectedModel,
    sharedContext,
    inputPrompt,
    isLoading,
    menuOpen,
    sidebarOpen,

    setSelectedSession,
    setSelectedModel,
    setSharedContext,
    setInputPrompt,
    setMenuOpen,
    setSidebarOpen,

    handleNewChat,
    handlePickSession,
    handleRenameSession,
    handleDeleteSession,
    handleClearContext,
    handleSubmit,
  };

  const isSwalOpen = () => document.body.classList.contains("swal2-shown");
  const isInsideSwal = (node: Node | null) =>
    node instanceof Element && (node.closest(".swal2-container") || node.closest(".swal2-popup"));

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
};

function generateTitleFromText(text: string) {
  if (!text) return "New chat";
  let t = text
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[`"'<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);

  const STOP = new Set(["the", "a", "an", "and", "or", "but", "to", "of", "in", "for", "on", "with", "about", "is", "are", "am", "be", "as", "at", "by", "from", "into", "that", "this", "it", "i", "you"]);
  const words = t.split(" ").filter(w => !STOP.has(w.toLowerCase()));
  if (!words.length) words.push("Chat");

  const titleRaw = words.slice(0, 8).join(" ");
  const titleCased = titleRaw.replace(/\w\S*/g, s => s[0].toUpperCase() + s.slice(1));
  return titleCased.length <= 36 ? titleCased : titleCased.slice(0, 35).trimEnd() + "…";
}
