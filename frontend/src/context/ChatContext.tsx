import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import {
  ChatMessage,
  Session,
  Model,
  Provider
} from "../utils/types/types";
import {
  fetchModels
} from "../api/modelApi";
import {
  sendChatMessage,
} from "../api/chatApi";
import {
  initializeDB,
} from "../db/index"
import {
  createSession,
  fetchSessions,
  deleteSession,
  renameSession
} from "../db/sessions"
import {
  fetchChatHistory,
  clearChatContext,
  addMessage,
  deleteMessage,
  trimAfterMessage,
} from "../db/messages"


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
  maxTokens: number;
  mode: "auto" | "custom";

  setSelectedSession: (id: string) => void;
  setSelectedModel: (id: string) => void;
  setSharedContext: (shared: boolean) => void;
  setInputPrompt: (prompt: string) => void;
  setMenuOpen: (open: boolean) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setModels: React.Dispatch<React.SetStateAction<Model[]>>
  setMaxTokens: React.Dispatch<React.SetStateAction<number>>
  setMode: React.Dispatch<React.SetStateAction<"auto" | "custom">>

  handleNewChat: () => Promise<void>;
  handlePickSession: (id: string) => void;
  handleRenameSession: (id: string, title: string) => void;
  handleDeleteSession: (id: string) => Promise<void>;
  handleClearContext: () => Promise<void>;
  handleSubmit: () => Promise<void>;
  handleDeleteMessage: (id: string) => Promise<void>;
  handleResubmitFromMessage: (clickedId: string) => Promise<void>;
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
  const [maxTokens, setMaxTokens] = useState(1000);
  const [mode, setMode] = useState<"auto" | "custom">("auto");

  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sideBarRef = useRef<HTMLDivElement>(null);

const modeRef = useRef(mode);
const maxTokensRef = useRef(maxTokens);
useEffect(() => { modeRef.current = mode; }, [mode]);
useEffect(() => { maxTokensRef.current = maxTokens; }, [maxTokens]);

  const sessionActive = Boolean(selectedSession);

  useEffect(() => {
    initializeDB().then(() => console.log("DB ready")).catch(error => console.log("Failed to init DB", error))
    fetchSessions().then(setSessions).catch(err => console.log(err))
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

  const handleDeleteMessage = async (id: string) => {
    setChatMessages((prev) => prev.filter((msg) => msg.id !== id));
    await deleteMessage(id);
  };

  const handleNewChat = async () => {
    setSelectedSession("");
    setChatMessages([]);
    setInputPrompt("");
    setSidebarOpen(false);
  };

  const handlePickSession = async (id: string) => {
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

    try {
      await renameSession(id, name);
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

  async function handleResubmitFromMessage(clickedId: string) {
    const snapshot = [...chatMessages];
    const idx = snapshot.findIndex(m => m.id === clickedId);
    if (idx === -1) return;
    const clicked = snapshot[idx];
    if (clicked.role !== "user") return;

    const uiContext = snapshot.slice(0, idx + 1);
    setChatMessages(uiContext);

    try {
      await trimAfterMessage({
        sessionId: selectedSession,
        clickedId,
        sharedContext,
        modelId: selectedModel,
      });
    } catch (e) {
      console.error("DB trim failed:", e);
    }

    const model = models.find(m => m.id === selectedModel);
    const modelName = model?.name ?? "";
    const modelProvider = model?.provider ?? "";
    const tempId = "temp-" + Date.now();
    const placeholderTs = Date.now();

    setChatMessages(prev => [
      ...prev,
      { id: tempId, role: "assistant", text: "", model_name: modelName || selectedModel, ts: placeholderTs, pending: true }
    ]);

    const tokens = modeRef.current === "custom" ? maxTokensRef.current : 0;

    try {
      const resp = await sendChatMessage(
        selectedSession,
        selectedModel,
        modelProvider,
        clicked.text ?? "",
        sharedContext,
        tokens
      );

      const pk = await addMessage({
        sessionId: selectedSession,
        role: "assistant",
        content: resp,
        modelId: selectedModel,
        modelName,
        ts: Date.now(),
      });

      setChatMessages(prev =>
        prev.map(m => (m.id === tempId ? { ...m, id: String(pk), text: resp, model_name: modelName, pending: false } : m))
      );
    } catch (err) {
      console.error("Resubmit failed:", err);
      setChatMessages(prev => prev.filter(m => m.id !== tempId));
    }
  }

  const handleSubmit = async () => {
    const text = inputPrompt.trim();
    if (!text || isLoading || !selectedModel) return;

    setIsLoading(true);
    setInputPrompt("");

    const ts = Date.now();
    
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
          if (idx !== -1) {
            arr[idx] = { ...arr[idx], text: "[Error creating session]" };
          }
          return arr;
        });
        setIsLoading(false);
        return;
      }
    }

    try {
      const selected = models.find(m => m.id === selectedModel);
      const modelName = selected?.name ?? "";
      const modelProvider = selected?.provider ?? "";

      const userPk = await addMessage({
        sessionId: workingSessionId,
        role: "user",
        content: text,
        modelId: selectedModel,
        modelName,
        ts,
      });

      setChatMessages(prev => [
        ...prev,
        {
          id: String(userPk),
          role: "user",
          text,
          model_name: undefined,
        },
      ]);

      const tempAssistantId = "temp-" + Date.now();
      setChatMessages(prev => [
        ...prev,
        {
          id: tempAssistantId,
          role: "assistant",
          text: "",
          model_name: modelName || selectedModel,
          pending: true
        },
      ]);

      const tokens = modeRef.current === "custom" ? maxTokensRef.current : 0;

      const resp = await sendChatMessage(
        workingSessionId,
        selectedModel,
        modelProvider,
        text,
        sharedContext,
        tokens
      );

      const assistantPk = await addMessage({
        sessionId: workingSessionId,
        role: "assistant",
        content: resp,
        modelId: selectedModel,
        modelName,
        ts: Date.now(),
      });

      setChatMessages(prev => {
        return prev.map(m => {
          if (m.id === tempAssistantId) {
            return {
              id: String(assistantPk),
              role: "assistant",
              text: resp,
              model_name: modelName,
              pending: false
            };
          }
          return m;
        });
      });

      setSessions(prev => prev.map(s => (s.id === workingSessionId ? { ...s } : s)));
    } catch (e: any) {
      console.error(e);
      setChatMessages(prev => {
        const arr = [...prev];
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i].role === "assistant") {
            arr[i] = {
              ...arr[i],
              pending: false,
              text:
                (arr[i].text || "") +
                `\n[Error: ${e?.message || "send failed"}]`,
            };
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
    maxTokens,
    mode,

    setSelectedSession,
    setSelectedModel,
    setSharedContext,
    setInputPrompt,
    setMenuOpen,
    setSidebarOpen,
    setModels,
    setMaxTokens,
    setMode,

    handleNewChat,
    handlePickSession,
    handleRenameSession,
    handleDeleteSession,
    handleClearContext,
    handleSubmit,
    handleDeleteMessage,
    handleResubmitFromMessage,
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