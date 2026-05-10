import SidebarHeader from "./SidebarHeader";
import SearchBar from "./Searchbar";
import ConversationList from "./ConversationList";
import type { Conversation, AppState, User } from "../../types";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  searchQuery: string;
  tab: AppState["sidebarTab"];
  currentUser: User | null;
  onSelect: (id: string) => void;
  onSearch: (q: string) => void;
  onTabChange: (t: AppState["sidebarTab"]) => void;
  onLogout: () => void;
  onCompose: (email: string) => void | Promise<void>;
  mobile?: boolean;
}

export default function Sidebar({
  conversations,
  activeId,
  searchQuery,
  tab,
  currentUser,
  onSelect,
  onSearch,
  onTabChange,
  onLogout,
  onCompose,
  mobile,
}: Props) {
  return (
    <div
      style={{
        width:       mobile ? "100%" : 320,
        minWidth:    mobile ? undefined : 280,
        maxWidth:    mobile ? undefined : 340,
        height:      "100dvh",
        display:     "flex",
        flexDirection: "column",
        background:  "var(--space)",
        borderRight: "1px solid rgba(245,166,35,0.1)",
        boxShadow:   "4px 0 40px rgba(0,0,0,0.55), 1px 0 0 rgba(245,166,35,0.04)",
        flexShrink:  0,
        position:    "relative",
        overflow:    "hidden",
      }}
    >
      {/* Top ambient amber glow */}
      <div
        style={{
          position:   "absolute",
          top:        0,
          left:       0,
          right:      0,
          height:     220,
          background: "radial-gradient(ellipse at 50% -20%, rgba(245,166,35,0.055) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex:     0,
        }}
      />

      {/* Bottom blue ambient */}
      <div
        style={{
          position:   "absolute",
          bottom:     0,
          left:       0,
          right:      0,
          height:     160,
          background: "radial-gradient(ellipse at 50% 130%, rgba(43,127,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex:     0,
        }}
      />

      {/* CRT scanlines */}
      <div className="crt-overlay" style={{ zIndex: 0 }} />

      {/* Content layer */}
      <div
        style={{
          position:      "relative",
          zIndex:        1,
          display:       "flex",
          flexDirection: "column",
          height:        "100%",
        }}
      >
        <SidebarHeader
          tab={tab}
          onTabChange={onTabChange}
          currentUser={currentUser}
          onLogout={onLogout}
          onCompose={onCompose}
        />
        <SearchBar value={searchQuery} onChange={onSearch} />
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}
