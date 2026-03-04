import SidebarHeader from "./SidebarHeader";
import SearchBar from "./Searchbar";
import ConversationList from "./ConversationList";
import type { Conversation, AppState } from "../../types";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  searchQuery: string;
  tab: AppState["sidebarTab"];
  onSelect: (id: string) => void;
  onSearch: (q: string) => void;
  onTabChange: (t: AppState["sidebarTab"]) => void;
}

export default function Sidebar({
  conversations,
  activeId,
  searchQuery,
  tab,
  onSelect,
  onSearch,
  onTabChange,
}: Props) {
  return (
    <div
      style={{
        width: 320,
        minWidth: 280,
        maxWidth: 340,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0D1117",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        flexShrink: 0,
      }}
    >
      <SidebarHeader tab={tab} onTabChange={onTabChange} />
      <SearchBar value={searchQuery} onChange={onSearch} />
      <ConversationList
        conversations={conversations}
        activeId={activeId}
        onSelect={onSelect}
      />
    </div>
  );
}
