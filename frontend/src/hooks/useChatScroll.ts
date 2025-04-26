import { useEffect, RefObject } from "react";
import { ChatMessage } from "../types/types";

export const useChatScroll = (
  chatHistoryRef: RefObject<HTMLDivElement | null>,
  chatMessages: ChatMessage[]
): void => {
  useEffect(() => {
    const c = chatHistoryRef.current;
    if (!c) return;
    const last = c.children[c.children.length - 1] as HTMLElement;
    last?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [chatMessages, chatHistoryRef]);
};