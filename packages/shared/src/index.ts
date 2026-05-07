// ── Status types ──────────────────────────────────────────────────────────────

export type MessageStatus = "sent" | "delivered" | "read";
export type UserStatus = "online" | "offline" | "away" | "typing";
export type MessageType = "text" | "image" | "file" | "audio" | "video" | "system";
export type AuthProvider = "local" | "google" | "github";

// ── User DTOs ─────────────────────────────────────────────────────────────────

export interface UserPublicProfile {
  _id: string;
  displayName: string;
  email: string;
  avatar: string | null;
  about: string;
  isOnline: boolean;
  lastSeen: string | null;
  createdAt: string;
}

// ── Auth DTOs ─────────────────────────────────────────────────────────────────

export interface SessionStatus {
  active: boolean;
  userId?: string;
  expiresAt?: string;
}

// ── Socket event payloads ─────────────────────────────────────────────────────

export interface SocketMessagePayload {
  conversationId: string;
  body: string;
  messageType: MessageType;
  replyTo?: string | null;
}

export interface SocketMessageEvent {
  _id: string;
  conversationId: string;
  sender: UserPublicProfile;
  body: string;
  messageType: MessageType;
  deliveryStatus: MessageStatus;
  replyTo: string | null;
  isEdited: boolean;
  createdAt: string;
}

export interface PresenceEvent {
  userId: string;
  isOnline: boolean;
  lastSeen: string | null;
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  displayName: string;
}

export interface MessageStatusEvent {
  messageId: string;
  conversationId: string;
  deliveryStatus: MessageStatus;
  readBy?: { userId: string; readAt: string };
}

// ── Socket event names ────────────────────────────────────────────────────────

export const SOCKET_EVENTS = {
  // Client → Server
  MESSAGE_SEND: "message:send",
  MESSAGE_READ: "message:read",
  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",
  CONVERSATION_JOIN: "conversation:join",
  CONVERSATION_LEAVE: "conversation:leave",
  // Server → Client
  MESSAGE_NEW: "message:new",
  MESSAGE_STATUS: "message:status",
  PRESENCE_UPDATE: "presence:update",
} as const;

export type SocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
