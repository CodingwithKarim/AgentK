import React, { createContext, useContext, useState, useEffect } from "react";
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
    const name = prompt("New chat name:");
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
    if (!sessionActive || !confirm("Delete this chat?")) return;
    
    try {
      const success = await deleteSession(selectedSession);
      if (success) {
        setSessions((prev) => prev.filter((s) => s.id !== selectedSession));
        setSelectedSession("");
        setChatMessages([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearContext = async () => {
    if (!sessionActive || !selectedModel) return;
    
    try {
      await clearChatContext(selectedSession, selectedModel, sharedContext);
      const messages = await fetchChatHistory(selectedSession, selectedModel, sharedContext);
      setChatMessages(messages);
    } catch (error) {
      console.error(error);
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