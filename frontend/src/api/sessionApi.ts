import { Session } from "../types/types";

export const fetchSessions = async (): Promise<Session[]> => {
    try {
      const response = await fetch("/api/sessions");
      const data = await response.json();
      return Array.isArray(data.sessions) ? data.sessions : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
  export const createSession = async (name: string): Promise<Session> => {
    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    return await response.json();
  };
  
  export const deleteSession = async (sessionId: string): Promise<boolean> => {
    try {
      await fetch(`/api/sessions/${sessionId}`, { method: "DELETE" });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };