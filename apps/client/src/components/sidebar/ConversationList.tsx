import { motion, AnimatePresence } from "motion/react";
import ConversationItem from "./ConversationItem";
import type { Conversation } from "../../types";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({ conversations, activeId, onSelect }: Props) {
  const pinned = conversations.filter((c) => c.pinned);
  const rest   = conversations.filter((c) => !c.pinned);

  return (
    <div
      style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: 8 }}
      className="relay-scroll"
    >
      {pinned.length > 0 && (
        <>
          <SectionLabel>PINNED</SectionLabel>
          <AnimatePresence>
            {pinned.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <ConversationItem
                  conversation={c}
                  isActive={c.id === activeId}
                  onClick={() => onSelect(c.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Gradient separator */}
          <div style={{ padding: "6px 14px 2px" }}>
            <div
              style={{
                height:     1,
                background: "linear-gradient(90deg,transparent,rgba(245,166,35,0.08),transparent)",
              }}
            />
          </div>
        </>
      )}

      {rest.length > 0 && (
        <>
          <SectionLabel>ALL COMMS</SectionLabel>
          <AnimatePresence>
            {rest.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay:    (pinned.length + i) * 0.04,
                  duration: 0.28,
                  ease:     [0.22, 1, 0.36, 1],
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
        <div style={{ padding: "52px 24px", textAlign: "center" }}>
          <div
            style={{
              width:          48,
              height:         48,
              borderRadius:   14,
              background:     "rgba(245,166,35,0.05)",
              border:         "1px solid rgba(245,166,35,0.1)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              margin:         "0 auto 14px",
            }}
          >
            <svg width="20" height="20" fill="none" stroke="rgba(245,166,35,0.38)" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <div
            style={{
              fontSize:     10,
              color:        "rgba(var(--text-rgb), 0.22)",
              letterSpacing: "0.1em",
              fontFamily:   "monospace",
            }}
          >
            NO COMMS FOUND
          </div>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "10px 16px 4px", display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          fontSize:     8,
          fontWeight:   700,
          color:        "rgba(245,166,35,0.38)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily:   "monospace",
          flexShrink:   0,
        }}
      >
        {children}
      </span>
      <div
        style={{
          flex:       1,
          height:     1,
          background: "rgba(245,166,35,0.055)",
        }}
      />
    </div>
  );
}
