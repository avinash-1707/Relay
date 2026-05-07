import axios from "axios";
import type { SessionStatus } from "@relay/shared";
export type { SessionStatus };

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const AUTH_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth`;

export interface SignupPayload {
  email: string;
  password: string;
  displayName: string;
}

export interface SignupResponse {
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface VerifyEmailResponse {
  message: string;
}


interface ErrorBody {
  message?: string;
  error?: string;
}

export class AuthApiError extends Error {
  status?: number;
  code: "VALIDATION_ERROR" | "NETWORK_ERROR" | "SERVER_ERROR" | "UNKNOWN_ERROR";

  constructor(message: string, code: AuthApiError["code"], status?: number) {
    super(message);
    this.name = "AuthApiError";
    this.code = code;
    this.status = status;
  }
}

const normalizeAuthError = (
  error: unknown,
  fallbackMessage: string,
): AuthApiError => {
  if (axios.isAxiosError<ErrorBody>(error)) {
    const status = error.response?.status;
    const serverMessage =
      error.response?.data?.message || error.response?.data?.error;

    if (!error.response) {
      return new AuthApiError(
        "Network error. Please check your connection and try again.",
        "NETWORK_ERROR",
      );
    }

    if (status && status >= 400 && status < 500) {
      return new AuthApiError(
        serverMessage || fallbackMessage,
        "VALIDATION_ERROR",
        status,
      );
    }

    if (status && status >= 500) {
      return new AuthApiError(
        serverMessage || "Server error. Please try again shortly.",
        "SERVER_ERROR",
        status,
      );
    }

    return new AuthApiError(
      serverMessage || fallbackMessage,
      "UNKNOWN_ERROR",
      status,
    );
  }

  if (error instanceof Error) {
    return new AuthApiError(error.message || fallbackMessage, "UNKNOWN_ERROR");
  }

  return new AuthApiError(fallbackMessage, "UNKNOWN_ERROR");
};

const postAuth = async <T>(
  path: string,
  body: unknown,
  fallbackMessage: string,
): Promise<T> => {
  try {
    const { data } = await api.post<T>(`${AUTH_BASE}${path}`, body);
    return data;
  } catch (error) {
    throw normalizeAuthError(error, fallbackMessage);
  }
};

const getAuth = async <T>(
  path: string,
  params: Record<string, string>,
  fallbackMessage: string,
): Promise<T> => {
  try {
    const { data } = await api.get<T>(`${AUTH_BASE}${path}`, { params });
    return data;
  } catch (error) {
    throw normalizeAuthError(error, fallbackMessage);
  }
};

export const signup = async (
  payload: SignupPayload,
): Promise<SignupResponse> => {
  if (
    !payload.email?.trim() ||
    !payload.password ||
    !payload.displayName?.trim()
  ) {
    throw new AuthApiError(
      "Email, password, and display name are required.",
      "VALIDATION_ERROR",
    );
  }
  return postAuth<SignupResponse>(
    "/signup",
    payload,
    "Failed to create account. Please verify your details.",
  );
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  if (!payload.email?.trim() || !payload.password) {
    throw new AuthApiError(
      "Email and password are required.",
      "VALIDATION_ERROR",
    );
  }
  return postAuth<LoginResponse>(
    "/login",
    payload,
    "Login failed. Please check your credentials.",
  );
};

export const verifyEmail = async (
  token: string,
): Promise<VerifyEmailResponse> => {
  if (!token?.trim()) {
    throw new AuthApiError(
      "Verification token is required.",
      "VALIDATION_ERROR",
    );
  }
  return getAuth<VerifyEmailResponse>(
    "/verify-email",
    { token },
    "Email verification failed. The link may be invalid or expired.",
  );
};

export const refreshAccessToken = async (): Promise<LoginResponse> => {
  return postAuth<LoginResponse>(
    "/refresh",
    undefined,
    "Session refresh failed. Please log in again.",
  );
};

export const logout = async (): Promise<void> => {
  try {
    await api.post(`${AUTH_BASE}/logout`);
  } catch (error) {
    throw normalizeAuthError(error, "Logout failed. Please try again.");
  }
};

export const getGoogleAuthUrl = (): string => `${AUTH_BASE}/google`;

export const getSessionStatus = async (): Promise<SessionStatus> => {
  return getAuth<SessionStatus>(
    "/session",
    {},
    "Failed to check session status.",
  );
};

// ─── User API ─────────────────────────────────────────────────────────────────

export interface ServerUser {
  _id: string;
  displayName: string;
  email: string;
  avatar: string | null;
  about: string;
  isOnline: boolean;
  lastSeen: string | null;
  createdAt: string;
}

export const getCurrentUser = async (): Promise<ServerUser> => {
  const { data } = await api.get<ServerUser>("/api/v1/users/me");
  return data;
};

export const searchUsersApi = async (q: string): Promise<ServerUser[]> => {
  const { data } = await api.get<ServerUser[]>("/api/v1/users/search", {
    params: { q },
  });
  return data;
};

// ─── Conversation API ─────────────────────────────────────────────────────────

export interface ServerParticipantMeta {
  user: string;
  unreadCount: number;
  isArchived: boolean;
  isMuted: boolean;
}

export interface ServerLastMessage {
  _id: string;
  body: string;
  sender: { _id: string; displayName: string; avatar: string | null };
  createdAt: string;
  deliveryStatus: "sent" | "delivered" | "read";
  isDeleted: boolean;
  messageType: string;
}

export interface ServerConversation {
  _id: string;
  participants: ServerUser[];
  isGroup: boolean;
  lastMessage: ServerLastMessage | null;
  lastMessageAt: string | null;
  participantMeta: ServerParticipantMeta[];
}

export const getConversations = async (): Promise<ServerConversation[]> => {
  const { data } = await api.get<ServerConversation[]>("/api/v1/conversations");
  return data;
};

export const findOrCreateConversation = async (
  targetEmail: string,
): Promise<ServerConversation> => {
  const { data } = await api.post<ServerConversation>("/api/v1/conversations", {
    targetEmail,
  });
  return data;
};

export const markConversationRead = async (
  conversationId: string,
): Promise<void> => {
  await api.patch(`/api/v1/conversations/${conversationId}/read`);
};

// ─── Message API ──────────────────────────────────────────────────────────────

export interface ServerAttachment {
  url: string;
  fileType: string;
  fileName: string | null;
  fileSize: number | null;
}

export interface ServerMessage {
  _id: string;
  conversation: string;
  sender: ServerUser;
  body: string;
  messageType: string;
  deliveryStatus: "sent" | "delivered" | "read";
  readBy: { user: string; readAt: string }[];
  isDeleted: boolean;
  isEdited: boolean;
  replyTo: { _id: string; body: string; isDeleted: boolean } | null;
  attachments: ServerAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface MessagesPage {
  messages: ServerMessage[];
  hasMore: boolean;
  nextCursor: string | null;
}

export const getMessages = async (
  conversationId: string,
  before?: string,
  limit?: number,
): Promise<MessagesPage> => {
  const { data } = await api.get<MessagesPage>(
    `/api/v1/conversations/${conversationId}/messages`,
    { params: { before, limit } },
  );
  return data;
};

export const sendMessageHttp = async (
  conversationId: string,
  body: string,
  messageType?: string,
  attachments?: ServerAttachment[],
): Promise<ServerMessage> => {
  const { data } = await api.post<ServerMessage>(
    `/api/v1/conversations/${conversationId}/messages`,
    { body, messageType, attachments },
  );
  return data;
};

export const uploadFile = async (
  file: File,
): Promise<ServerAttachment> => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<ServerAttachment>("/api/v1/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
