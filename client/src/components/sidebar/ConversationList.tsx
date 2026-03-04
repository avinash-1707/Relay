import { motion, AnimatePresence } from "framer-motion";
import ConversationItem from "./ConversationItem";
import type { Conversation } from "../../types";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
}: Props) {
  const pinned = conversations.filter((c) => c.pinned);
  const rest = conversations.filter((c) => !c.pinned);

  return (
    <div
      style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}
      className="relay-scroll"
    >
      {pinned.length > 0 && (
        <>
          <div
            style={{
              padding: "8px 16px 4px",
              fontSize: 10,
              fontWeight: 700,
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Pinned
          </div>
          <AnimatePresence>
            {pinned.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <ConversationItem
                  conversation={c}
                  isActive={c.id === activeId}
                  onClick={() => onSelect(c.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.04)",
              margin: "4px 16px",
            }}
          />
        </>
      )}

      {rest.length > 0 && (
        <>
          <div
            style={{
              padding: "8px 16px 4px",
              fontSize: 10,
              fontWeight: 700,
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            All Messages
          </div>
          <AnimatePresence>
            {rest.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: (pinned.length + i) * 0.04,
                  duration: 0.3,
                }}
              >
                <ConversationItem
                  conversation={c}
                  isActive={c.id === activeId}
                  onClick={() => onSelect(c.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </>
      )}

      {conversations.length === 0 && (
        <div style={{ padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>
            No conversations found
          </div>
        </div>
      )}
    </div>
  );
}
