import React, { createContext, useContext, useState, useEffect } from "react";
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
  deleteSession 
} from "../api/sessionAPI";
import { 
  fetchModels 
} from "../api/modelApi";
import { 
  fetchChatHistory, 
  sendChatMessage, 
  clearChatContext 
} from "../api/chatApi";
import { preferredOrder } from "../utils/constants";

type ChatContextType = {
  // Data states
  sessions: Session[];
  models: Model[];
  filteredModels: Model[];
  providers: Provider[];
  chatMessages: ChatMessage[];
  
  // Selection states
  selectedSession: string;
  selectedModel: string;
  selectedProvider: Provider;
  sharedContext: boolean;
  inputPrompt: string;
  isLoading: boolean;
  
  // Actions
  setSelectedSession: (id: string) => void;
  setSelectedModel: (id: string) => void;
  setSelectedProvider: (provider: Provider) => void;
  setSharedContext: (shared: boolean) => void;
  setInputPrompt: (prompt: string) => void;
  
  // Operations
  handleNewChat: () => Promise<void>;
  handleDeleteSession: () => Promise<void>;
  handleClearContext: () => Promise<void>;
  handleSubmit: () => Promise<void>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Data states
  const [sessions, setSessions] = useState<Session[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const memoizedModels = React.useMemo(() => models, [models]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Selection states
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<Provider>("");
  const [sharedContext, setSharedContext] = useState<boolean>(false);
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sessionActive = Boolean(selectedSession);

  // Initial data loading
  useEffect(() => {
    fetchSessions()
      .then(setSessions)
      .catch(console.error);

    fetchModels()
      .then((modelList) => {
        setModels(modelList);
        setFilteredModels(modelList);
        
        const providerList = Array.from(
          new Set(modelList.map((m) => m.provider))
        ).sort((a, b) => {
          const indexA = preferredOrder.indexOf(a);
          const indexB = preferredOrder.indexOf(b);
          if (indexA === -1 && indexB === -1) return a.localeCompare(b);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
        
        setProviders(providerList);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedSession) return;
    
    setSelectedProvider("");
    setSharedContext(false);
    setChatMessages([]);

    setSelectedModel("")
    
  }, [selectedSession]);

  // Filter models when provider changes
  useEffect(() => {
    const newList = selectedProvider
      ? models.filter((m) => m.provider === selectedProvider)
      : models;
    setFilteredModels(newList);

    if (!newList.some((m) => m.id === selectedModel)) {
      setSelectedModel(newList.length > 0 ? newList[0].id : "");
    }
  }, [selectedProvider, memoizedModels, selectedModel]);

  // Fetch chat history when session or model changes
  useEffect(() => {
    if (!sessionActive || !selectedModel) return;

    fetchChatHistory(selectedSession, selectedModel, sharedContext)
      .then(setChatMessages)
      .catch(console.error);
  }, [selectedSession, selectedModel, sharedContext, selectedProvider]);

  // Operation handlers
  const handleNewChat = async () => {
    const { value: name } = await Swal.fire<string>({
      title: "Enter Chat Name",
      input: "text",
      inputPlaceholder: "Type a name…",
      showCancelButton: true,
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
      returnFocus: false,
      customClass: {
        popup:    "rounded-2xl p-6 shadow-lg bg-white",
        title:    "text-xl font-semibold text-gray-800",
        input:    "border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500",
        actions: "mt-6 flex justify-end space-x-3",
        confirmButton: "px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white",
        cancelButton:  "px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700",
      },
      width: 400,
      backdrop: 'rgba(31, 41, 55, 0.6)',
      buttonsStyling: false,  // tell SweetAlert2 not to inject its default button styles
      inputValidator(value) {
        if (!value || !value.trim()){
          return "Chat name cannot be empty"
        }
      },
    });

    if (!name?.trim()) return;
    
    try {
      const session = await createSession(name.trim());
      setSessions((prev) => [...prev, session]);
      setSelectedSession(session.id);
      setChatMessages([]);
      setSelectedProvider("");
      setSharedContext(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSession = async () => {
    if (!sessionActive) return;
  
    // 1) fire the warning
    const { isConfirmed } = await Swal.fire<string>({
      title: "<span class='text-red-600'>Are you sure?</span>",
      html: "<p class='text-gray-600'>Deleting this chat is permanent and cannot be undone.</p>",
      text: "This action cannot be undone.",
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
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
      backdrop: 'rgba(31, 41, 55, 0.6)',
    });
  
    // 2) if they clicked “Yes”
    if (!isConfirmed) return;
  
    try {
      const success = await deleteSession(selectedSession);
      if (success) {
        // update your state
        setSessions((prev) => prev.filter((s) => s.id !== selectedSession));
        setSelectedSession("");
        setChatMessages([]);
  
        // optional success toast
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your chat has been removed.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Oops…",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  const handleClearContext = async () => {
    if (!sessionActive || !selectedModel) return;
  
    // Dynamically build the warning message
    const warningMessage = sharedContext
      ? "This will delete all messages associated with this session across all models."
      : "This will delete messages for the selected model only.";
  
    const { isConfirmed } = await Swal.fire({
      title: "Clear Chat Context?",
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
      const messages = await fetchChatHistory(selectedSession, selectedModel, sharedContext);
      setChatMessages(messages);
  
      await Swal.fire({
        icon: "success",
        title: "Context Cleared!",
        text: "Chat history has been reset.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to clear chat context. Please try again.",
      });
    }
  };

  const handleSubmit = async () => {
    if (!inputPrompt.trim() || !sessionActive || !selectedModel || isLoading) return;
    
    setIsLoading(true);
    const txt = inputPrompt.trim();
    
    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        name: "You",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: txt,
      },
    ]);
    
    setInputPrompt("");

    try {
      const response = await sendChatMessage(
        selectedSession,
        selectedModel,
        txt,
        sharedContext
      );
      
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          name: "AgentK",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          text: response,
        },
      ]);
    } catch (error) {
      alert("Something went wrong.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    // Data states
    sessions,
    models,
    filteredModels,
    providers,
    chatMessages,
    
    // Selection states
    selectedSession,
    selectedModel,
    selectedProvider,
    sharedContext,
    inputPrompt,
    isLoading,
    
    // Setters
    setSelectedSession,
    setSelectedModel,
    setSelectedProvider,
    setSharedContext,
    setInputPrompt,
    
    // Operations
    handleNewChat,
    handleDeleteSession,
    handleClearContext,
    handleSubmit,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};