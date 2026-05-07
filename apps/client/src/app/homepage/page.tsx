"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import Sidebar from "@/components/sidebar/Sidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import BlankCanvas from "@/components/chat/BlankCanvas";
import { logout, api } from "@/lib/api";

const ACCESS_TOKEN_KEY = "relay_access_token";

export default function App() {
  const router = useRouter();
  const {
    conversations,
    activeConversation,
    state,
    currentUser,
    selectConversation,
    sendMessage,
    setSearchQuery,
    setSidebarTab,
    startConversationByEmail,
  } = useChat();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch {
      // proceed regardless
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    delete api.defaults.headers.common.Authorization;
    router.push("/login");
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#080B11",
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <Sidebar
        conversations={conversations}
        activeId={state.activeConversationId}
        searchQuery={state.searchQuery}
        tab={state.sidebarTab}
        currentUser={currentUser}
        onSelect={selectConversation}
        onSearch={setSearchQuery}
        onTabChange={setSidebarTab}
        onLogout={handleLogout}
      />

      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            currentUserId={state.currentUserId}
            currentUserDisplayName={currentUser?.name ?? ""}
            onSend={sendMessage}
          />
        ) : (
          <BlankCanvas onNewMessage={startConversationByEmail} />
        )}
      </div>
    </div>
  );
}
