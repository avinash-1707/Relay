import { useState, useCallback, useEffect, useRef } from "react";
import type { Conversation, Message, AppState, User } from "@/types";
import { useSocket } from "@/providers/SocketProvider";
import { useAuthReady } from "@/providers/AuthProvider";
import { SOCKET_EVENTS } from "@relay/shared";
import {
  getCurrentUser,
  getConversations,
  getMessages,
  sendMessageHttp,
  markConversationRead,
  findOrCreateConversation,
  type ServerUser,
  type ServerConversation,
  type ServerMessage,
  type ServerAttachment,
} from "@/lib/api";
import type { Attachment } from "@/types";

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function getInitials(name: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function mapServerUser(u: ServerUser): User {
  return {
    id: u._id,
    name: u.displayName,
    avatar: getInitials(u.displayName),
    status: u.isOnline ? "online" : "offline",
    lastSeen: u.lastSeen
      ? new Date(u.lastSeen).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : undefined,
    email: u.email,
    about: u.about,
  };
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mapServerMessage(msg: ServerMessage, serverUserId: string): Message {
  return {
    id: msg._id,
    senderId: msg.sender._id === serverUserId ? "me" : msg.sender._id,
    text: msg.isDeleted ? "This message was deleted" : msg.body,
    timestamp: formatTime(msg.createdAt),
    status: msg.deliveryStatus,
    messageType: msg.messageType,
    attachments: (msg.attachments ?? []) as Attachment[],
  };
}

function mapServerConversation(
  conv: ServerConversation,
  serverUserId: string,
): Conversation {
  const other =
    conv.participants.find((p) => p._id !== serverUserId) ??
    conv.participants[0];
  const meta = conv.participantMeta.find((m) => m.user === serverUserId);
  const lastMsg = conv.lastMessage;

  const previewMessages: Message[] =
    lastMsg && !lastMsg.isDeleted
      ? [
          {
            id: lastMsg._id,
            senderId:
              lastMsg.sender._id === serverUserId ? "me" : lastMsg.sender._id,
            text: lastMsg.body,
            timestamp: formatTime(lastMsg.createdAt),
            status: lastMsg.deliveryStatus,
            messageType: lastMsg.messageType,
          },
        ]
      : [];

  return {
    id: conv._id,
    participant: mapServerUser(other),
    messages: previewMessages,
    unreadCount: meta?.unreadCount ?? 0,
    muted: meta?.isMuted ?? false,
    pinned: false,
  };
}

// ─── Raw socket message shape (what server actually emits) ────────────────────

interface RawSocketMessage {
  _id: string;
  conversation: string;
  sender: ServerUser;
  body: string;
  messageType: string;
  deliveryStatus: "sent" | "delivered" | "read";
  isDeleted: boolean;
  isEdited: boolean;
  createdAt: string;
  attachments?: ServerAttachment[];
}

interface RawStatusEvent {
  messageId: string;
  conversationId: string;
  deliveryStatus: "sent" | "delivered" | "read";
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useChat() {
  const { socket } = useSocket();
  const authReady = useAuthReady();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadedMessages, setLoadedMessages] = useState<
    Record<string, Message[]>
  >({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<AppState>({
    currentUserId: "me",
    activeConversationId: null,
    searchQuery: "",
    sidebarTab: "chats",
  });

  const serverUserIdRef = useRef<string>("");
  const activeConvIdRef = useRef<string | null>(null);

  useEffect(() => {
    activeConvIdRef.current = state.activeConversationId;
  }, [state.activeConversationId]);

  useEffect(() => {
    if (!authReady) return;
    async function init() {
      try {
        const [user, convs] = await Promise.all([
          getCurrentUser(),
          getConversations(),
        ]);
        serverUserIdRef.current = user._id;
        setCurrentUser(mapServerUser(user));
        setConversations(
          convs.map((c) => mapServerConversation(c, user._id)),
        );
      } catch (err) {
        console.error("[useChat] init failed", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [authReady]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: RawSocketMessage) => {
      const uid = serverUserIdRef.current;
      const clientMsg: Message = {
        id: msg._id,
        senderId: msg.sender._id === uid ? "me" : msg.sender._id,
        text: msg.isDeleted ? "This message was deleted" : msg.body,
        timestamp: formatTime(msg.createdAt),
        status: msg.deliveryStatus,
        messageType: msg.messageType,
        attachments: (msg.attachments ?? []) as Attachment[],
      };
      const convId = msg.conversation;

      setLoadedMessages((prev) => {
        const existing = prev[convId] ?? [];
        if (existing.some((m) => m.id === msg._id)) return prev;
        return { ...prev, [convId]: [...existing, clientMsg] };
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: [clientMsg],
                unreadCount:
                  msg.sender._id !== uid &&
                  activeConvIdRef.current !== convId
                    ? c.unreadCount + 1
                    : c.unreadCount,
              }
            : c,
        ),
      );
    };

    const handleStatus = (event: RawStatusEvent) => {
      const { messageId, conversationId, deliveryStatus } = event;
      setLoadedMessages((prev) => {
        const msgs = prev[conversationId];
        if (!msgs) return prev;
        return {
          ...prev,
          [conversationId]: msgs.map((m) =>
            m.id === messageId ? { ...m, status: deliveryStatus } : m,
          ),
        };
      });
    };

    socket.on(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
    socket.on(SOCKET_EVENTS.MESSAGE_STATUS, handleStatus);

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
      socket.off(SOCKET_EVENTS.MESSAGE_STATUS, handleStatus);
    };
  }, [socket]);

  const activeConversation =
    conversations.find((c) => c.id === state.activeConversationId) ?? null;

  const activeConversationWithMessages = activeConversation
    ? {
        ...activeConversation,
        messages:
          loadedMessages[activeConversation.id] ??
          activeConversation.messages,
      }
    : null;

  const selectConversation = useCallback(async (id: string) => {
    setState((s) => ({ ...s, activeConversationId: id }));
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
    );
    markConversationRead(id).catch(() => {});

    setLoadedMessages((prev) => {
      if (prev[id]) return prev;
      getMessages(id)
        .then((page) => {
          const msgs = page.messages.map((m) =>
            mapServerMessage(m, serverUserIdRef.current),
          );
          setLoadedMessages((p) => ({ ...p, [id]: msgs }));
        })
        .catch((err) =>
          console.error("[useChat] load messages failed", err),
        );
      return prev;
    });
  }, []);

  const sendMessage = useCallback(async (
    text: string,
    messageType?: string,
    attachments?: ServerAttachment[],
  ) => {
    const convId = activeConvIdRef.current;
    if (!convId || (!text.trim() && (!attachments || attachments.length === 0))) return;
    try {
      const msg = await sendMessageHttp(convId, text.trim(), messageType, attachments);
      const clientMsg = mapServerMessage(msg, serverUserIdRef.current);

      setLoadedMessages((prev) => {
        const existing = prev[convId] ?? [];
        if (existing.some((m) => m.id === clientMsg.id)) return prev;
        return { ...prev, [convId]: [...existing, clientMsg] };
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, messages: [clientMsg] } : c,
        ),
      );
    } catch (err) {
      console.error("[useChat] sendMessage failed", err);
    }
  }, []);

  const setSearchQuery = useCallback((q: string) => {
    setState((s) => ({ ...s, searchQuery: q }));
  }, []);

  const setSidebarTab = useCallback((tab: AppState["sidebarTab"]) => {
    setState((s) => ({ ...s, sidebarTab: tab }));
  }, []);

  const startConversationByEmail = useCallback(async (email: string): Promise<void> => {
    const serverConv = await findOrCreateConversation(email.trim());
    const uid = serverUserIdRef.current;
    const mapped = mapServerConversation(serverConv, uid);
    setConversations((prev) => {
      if (prev.some((c) => c.id === mapped.id)) return prev;
      return [mapped, ...prev];
    });
    setState((s) => ({ ...s, activeConversationId: mapped.id }));
  }, []);

  const filteredConversations = conversations.filter((c) =>
    c.participant.name
      .toLowerCase()
      .includes(state.searchQuery.toLowerCase()),
  );

  return {
    conversations: filteredConversations,
    activeConversation: activeConversationWithMessages,
    state,
    currentUser,
    loading,
    selectConversation,
    sendMessage,
    setSearchQuery,
    setSidebarTab,
    startConversationByEmail,
  };
}
