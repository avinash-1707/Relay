"use client";

import { useChat } from "@/hooks/useChat";
import Sidebar from "@/components/sidebar/Sidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import BlankCanvas from "@/components/chat/BlankCanvas";

export default function App() {
  const {
    conversations,
    activeConversation,
    state,
    selectConversation,
    sendMessage,
    setSearchQuery,
    setSidebarTab,
  } = useChat();

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
        onSelect={selectConversation}
        onSearch={setSearchQuery}
        onTabChange={setSidebarTab}
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
            onSend={sendMessage}
          />
        ) : (
          <BlankCanvas />
        )}
      </div>
    </div>
  );
}
