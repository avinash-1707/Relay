export type { MessageStatus, UserStatus } from "@relay/shared";
import type { UserStatus, MessageStatus } from "@relay/shared";

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: UserStatus;
  lastSeen?: string;
  region?: string;
  email?: string;
  about?: string;
}

export interface Attachment {
  url: string;
  fileType: string;
  fileName: string | null;
  fileSize: number | null;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
  reaction?: string;
  replyTo?: string;
  messageType?: string;
  attachments?: Attachment[];
}

export interface Conversation {
  id: string;
  participant: User;
  messages: Message[];
  unreadCount: number;
  pinned?: boolean;
  muted?: boolean;
}

export interface AppState {
  currentUserId: string;
  activeConversationId: string | null;
  searchQuery: string;
  sidebarTab: "chats" | "calls" | "contacts";
}
