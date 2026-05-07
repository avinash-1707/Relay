import { useState, useCallback } from "react";
import { Conversation, Message, AppState } from "@/types";
import { CONVERSATIONS } from "@/mock/data";

export function useChat() {
  const [conversations, setConversations] =
    useState<Conversation[]>(CONVERSATIONS);
  const [state, setState] = useState<AppState>({
    currentUserId: "me",
    activeConversationId: null,
    searchQuery: "",
    sidebarTab: "chats",
  });

  const activeConversation =
    conversations.find((c) => c.id === state.activeConversationId) ?? null;

  const selectConversation = useCallback((id: string) => {
    setState((s) => ({ ...s, activeConversationId: id }));
    // Clear unread on open
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    );
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (!state.activeConversationId || !text.trim()) return;
      const newMsg: Message = {
        id: `m${Date.now()}`,
        senderId: "me",
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === state.activeConversationId
            ? { ...c, messages: [...c.messages, newMsg] }
            : c,
        ),
      );
      // Simulate status upgrade: sent → delivered
      setTimeout(() => {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === state.activeConversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === newMsg.id ? { ...m, status: "delivered" } : m,
                  ),
                }
              : c,
          ),
        );
      }, 800);
    },
    [state.activeConversationId],
  );

  const setSearchQuery = useCallback((q: string) => {
    setState((s) => ({ ...s, searchQuery: q }));
  }, []);

  const setSidebarTab = useCallback((tab: AppState["sidebarTab"]) => {
    setState((s) => ({ ...s, sidebarTab: tab }));
  }, []);

  const filteredConversations = conversations.filter((c) =>
    c.participant.name.toLowerCase().includes(state.searchQuery.toLowerCase()),
  );

  return {
    conversations: filteredConversations,
    activeConversation,
    state,
    selectConversation,
    sendMessage,
    setSearchQuery,
    setSidebarTab,
  };
}
