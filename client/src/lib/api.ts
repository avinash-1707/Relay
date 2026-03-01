import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const AUTH_BASE = "/api/v1/auth";

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

  constructor(
    message: string,
    code: AuthApiError["code"],
    status?: number,
  ) {
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
  if (!payload.email?.trim() || !payload.password || !payload.displayName?.trim()) {
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
    throw new AuthApiError("Email and password are required.", "VALIDATION_ERROR");
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
    throw new AuthApiError("Verification token is required.", "VALIDATION_ERROR");
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
