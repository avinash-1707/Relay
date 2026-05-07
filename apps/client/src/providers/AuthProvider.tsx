"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, getSessionStatus } from "@/lib/api";

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

      // Check if session is still valid via refresh token (cookie)
      try {
        const session = await getSessionStatus();
        if (!session.active && !tokenFromStorage) {
          // No valid session, redirect away from protected pages
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
