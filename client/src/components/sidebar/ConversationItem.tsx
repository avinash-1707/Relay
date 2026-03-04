import { motion } from "framer-motion";
import Avatar from "../shared/Avatar";
import type { Conversation } from "../../types";

interface Props {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  conversation,
  isActive,
  onClick,
}: Props) {
  const { participant, messages, unreadCount, pinned, muted } = conversation;
  const lastMsg = messages[messages.length - 1];
  const isFromMe = lastMsg?.senderId === "me";

  return (
    <motion.div
      onClick={onClick}
      whileHover={{
        backgroundColor: isActive ? undefined : "rgba(255,255,255,0.04)",
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        cursor: "pointer",
        transition: "background 0.15s",
        position: "relative",
        background: isActive ? "rgba(34,211,238,0.07)" : "transparent",
        borderLeft: isActive ? "2px solid #22d3ee" : "2px solid transparent",
      }}
    >
      {/* Avatar */}
      <Avatar
        initials={participant.avatar}
        status={participant.status}
        size={44}
      />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 3,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#fff" : "rgba(255,255,255,0.88)",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 130,
              }}
            >
              {participant.name}
            </span>
            {pinned && (
              <svg
                width="10"
                height="10"
                fill="rgba(34,211,238,0.6)"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414L11.414 8l1.293 1.293a1 1 0 01-1.414 1.414L10 9.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 8 7.293 6.707a1 1 0 010-1.414l3-3z" />
              </svg>
            )}
            {muted && (
              <svg
                width="10"
                height="10"
                fill="rgba(255,255,255,0.25)"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span
            style={{
              fontSize: 11,
              color:
                unreadCount > 0
                  ? "rgba(34,211,238,0.7)"
                  : "rgba(255,255,255,0.25)",
              flexShrink: 0,
            }}
          >
            {lastMsg?.timestamp}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 13,
              color:
                unreadCount > 0
                  ? "rgba(255,255,255,0.55)"
                  : "rgba(255,255,255,0.3)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
              fontWeight: unreadCount > 0 ? 500 : 400,
            }}
          >
            {isFromMe && (
              <span style={{ color: "rgba(34,211,238,0.5)", marginRight: 2 }}>
                You:{" "}
              </span>
            )}
            {lastMsg?.text ?? "No messages yet"}
          </span>
          {unreadCount > 0 && (
            <div
              style={{
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                background: "linear-gradient(135deg,#22d3ee,#2563eb)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                color: "#fff",
                padding: "0 5px",
                flexShrink: 0,
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
