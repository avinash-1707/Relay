"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { useIsMobile } from "@/hooks/useIsMobile";
import Sidebar from "@/components/sidebar/Sidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import BlankCanvas from "@/components/chat/BlankCanvas";
import { logout, api } from "@/lib/api";

const ACCESS_TOKEN_KEY = "relay_access_token";

export default function App() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<"sidebar" | "chat">("sidebar");

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

  const handleSelect = useCallback((id: string) => {
    selectConversation(id);
    if (isMobile) setMobileView("chat");
  }, [selectConversation, isMobile]);

  const handleBack = useCallback(() => setMobileView("sidebar"), []);

  const showSidebar = !isMobile || mobileView === "sidebar";
  const showChat    = !isMobile || mobileView === "chat";

  return (
    <div
      style={{
        display:    "flex",
        height:     "100dvh",
        overflow:   "hidden",
        background: "var(--void)",
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Sidebar panel */}
      <div
        style={{
          display:       showSidebar ? "flex" : "none",
          flexDirection: "column",
          width:         isMobile ? "100%" : undefined,
          flexShrink:    isMobile ? 0 : undefined,
        }}
      >
        <Sidebar
          conversations={conversations}
          activeId={state.activeConversationId}
          searchQuery={state.searchQuery}
          tab={state.sidebarTab}
          currentUser={currentUser}
          onSelect={handleSelect}
          onSearch={setSearchQuery}
          onTabChange={setSidebarTab}
          onLogout={handleLogout}
          mobile={isMobile}
        />
      </div>

      {/* Chat panel */}
      <div
        style={{
          display:       showChat ? "flex" : "none",
          flex:          1,
          overflow:      "hidden",
          flexDirection: "column",
          minWidth:      0,
        }}
      >
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            currentUserId={state.currentUserId}
            currentUserDisplayName={currentUser?.name ?? ""}
            onSend={sendMessage}
            onBack={isMobile ? handleBack : undefined}
          />
        ) : (
          <BlankCanvas onNewMessage={startConversationByEmail} />
        )}
      </div>
    </div>
  );
}
