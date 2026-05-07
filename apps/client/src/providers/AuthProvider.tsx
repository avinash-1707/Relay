"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, getSessionStatus, refreshAccessToken } from "@/lib/api";

const ACCESS_TOKEN_KEY = "relay_access_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      // Restore access token from storage
      const tokenFromStorage =
        localStorage.getItem(ACCESS_TOKEN_KEY) ||
        sessionStorage.getItem(ACCESS_TOKEN_KEY);

      if (tokenFromStorage) {
        api.defaults.headers.common.Authorization = `Bearer ${tokenFromStorage}`;
      }

      try {
        const session = await getSessionStatus();
        if (session.active) {
          if (!tokenFromStorage) {
            // Session active but no stored access token (e.g., right after Google OAuth).
            // Silently exchange the httpOnly refresh cookie for an access token.
            try {
              const { accessToken } = await refreshAccessToken();
              localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
              api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            } catch {
              router.push("/login");
            }
          }
        } else if (!tokenFromStorage) {
          if (
            window.location.pathname !== "/login" &&
            !window.location.pathname.startsWith("/login")
          ) {
            router.push("/login");
          }
        }
      } catch (err) {
        // Session check failed, allow page to load but protect routes as needed
      }
    };

    initAuth();
  }, [router]);

  return <>{children}</>;
}
