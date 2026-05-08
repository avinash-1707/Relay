import { motion } from "motion/react";
import Avatar from "../shared/Avatar";
import type { Conversation, Message } from "../../types";

interface Props {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

function getPreviewText(lastMsg: Message | undefined): string {
  if (!lastMsg) return "No messages yet";
  if (lastMsg.text) return lastMsg.text;
  const firstMime = lastMsg.attachments?.[0]?.fileType ?? "";
  const type = firstMime
    ? firstMime.startsWith("image/") ? "image"
    : firstMime.startsWith("audio/") ? "audio"
    : "file"
    : lastMsg.messageType ?? "";
  if (type === "image") return "📷 Photo";
  if (type === "audio") return "🎵 Voice message";
  if (type === "file")  return "📎 File";
  return "";
}

export default function ConversationItem({ conversation, isActive, onClick }: Props) {
  const { participant, messages, unreadCount, pinned, muted } = conversation;
  const lastMsg   = messages[messages.length - 1];
  const isFromMe  = lastMsg?.senderId === "me";

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ backgroundColor: isActive ? undefined : "rgba(var(--border-rgb), 0.022)" }}
      style={{
        display:    "flex",
        alignItems: "center",
        gap:        12,
        cursor:     "pointer",
        position:   "relative",
        transition: "background 0.15s",
        /* Active: amber-tinted panel with glow outline — no side stripe */
        background: isActive ? "rgba(245,166,35,0.065)" : "transparent",
        boxShadow:  isActive
          ? "inset 0 0 0 1px rgba(245,166,35,0.18), 0 2px 16px rgba(245,166,35,0.06)"
          : "none",
        borderRadius: isActive ? 10 : 0,
        margin:     isActive ? "2px 8px" : "0",
        padding:    isActive ? "11px 10px" : "11px 14px",
      }}
    >
      <Avatar initials={participant.avatar} status={participant.status} size={44} />

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                fontSize:     13,
                fontWeight:   isActive ? 700 : 500,
                color:        isActive ? "#F5A623" : "rgba(var(--text-rgb), 0.88)",
                letterSpacing: isActive ? "0.01em" : "-0.01em",
                whiteSpace:   "nowrap",
                overflow:     "hidden",
                textOverflow: "ellipsis",
                maxWidth:     130,
                transition:   "color 0.15s",
              }}
            >
              {participant.name}
            </span>
            {pinned && (
              <svg width="10" height="10" fill="rgba(245,166,35,0.55)" viewBox="0 0 20 20">
                <path d="M9.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414L11.414 8l1.293 1.293a1 1 0 01-1.414 1.414L10 9.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 8 7.293 6.707a1 1 0 010-1.414l3-3z" />
              </svg>
            )}
            {muted && (
              <svg width="10" height="10" fill="rgba(var(--text-rgb), 0.2)" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <span
            style={{
              fontSize:  10,
              color:     unreadCount > 0 ? "rgba(245,166,35,0.65)" : "rgba(var(--text-rgb), 0.2)",
              flexShrink: 0,
              fontFamily: "monospace",
            }}
          >
            {lastMsg?.timestamp}
          </span>
        </div>

        {/* Preview row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span
            style={{
              fontSize:     12,
              color:        unreadCount > 0 ? "rgba(var(--text-rgb), 0.58)" : "rgba(var(--text-rgb), 0.27)",
              whiteSpace:   "nowrap",
              overflow:     "hidden",
              textOverflow: "ellipsis",
              flex:         1,
              fontWeight:   unreadCount > 0 ? 500 : 400,
            }}
          >
            {isFromMe && (
              <span style={{ color: "rgba(245,166,35,0.48)", marginRight: 2 }}>You: </span>
            )}
            {getPreviewText(lastMsg)}
          </span>

          {unreadCount > 0 && (
            <div
              style={{
                minWidth:       18,
                height:         18,
                borderRadius:   9,
                background:     "linear-gradient(135deg,#F5A623,#D97706)",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                fontSize:       10,
                fontWeight:     700,
                color:          "#060912",
                padding:        "0 5px",
                flexShrink:     0,
                boxShadow:      "0 0 9px rgba(245,166,35,0.38)",
              }}
            >
              {unreadCount}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
